import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error: any) {
      console.error("[STRIPE_WEBHOOK_ERROR]", error.message);
      return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const courseId = session.metadata?.courseId;
      const userId = session.metadata?.userId;

      if (!courseId || !userId) {
        return new NextResponse("Webhook Error: Missing metadata", { status: 400 });
      }

      try {
        await prisma.$transaction(async (tx) => {
          const existingEnrollment = await tx.enrollment.findUnique({
            where: {
              userId_courseId: {
                userId,
                courseId,
              }
            }
          });

          // Upsert enrollment (idempotent)
          const enrollment = await tx.enrollment.upsert({
            where: {
              userId_courseId: {
                userId,
                courseId,
              }
            },
            update: {
              stripePaymentIntentId: session.payment_intent as string,
            },
            create: {
              userId,
              courseId,
              stripePaymentIntentId: session.payment_intent as string,
            }
          });

          // Upsert payment (idempotent)
          if (session.payment_intent) {
            await tx.payment.upsert({
              where: {
                stripePaymentIntentId: session.payment_intent as string,
              },
              update: {
                status: "SUCCEEDED",
              },
              create: {
                amount: session.amount_total ? session.amount_total / 100 : 0, // Convert back from cents
                stripeSessionId: session.id,
                stripePaymentIntentId: session.payment_intent as string,
                userId,
                courseId,
                enrollmentId: enrollment.id,
                status: "SUCCEEDED",
              }
            });
          }

          // If this was a new enrollment, send notifications
          if (!existingEnrollment) {
            const course = await tx.course.findUnique({
              where: { id: courseId },
              select: { title: true, instructorId: true }
            });

            if (course) {
              // Notify Instructor
              await tx.notification.create({
                data: {
                  userId: course.instructorId,
                  title: "New Enrollment!",
                  message: `A student just enrolled in your course "${course.title}".`,
                  link: `/dashboard/instructor/courses/${courseId}`
                }
              });

              // Notify Student
              await tx.notification.create({
                data: {
                  userId,
                  title: "Enrollment Successful",
                  message: `You are now enrolled in "${course.title}". Start learning!`,
                  link: `/courses/${courseId}`
                }
              });
            }
          }
        });
      } catch (error: any) {
        if (error.code === "P2002") {
          // Unique constraint violation means it was processed simultaneously
          console.log("[STRIPE_WEBHOOK] Idempotency catch: payment already processed");
        } else {
          console.error("[STRIPE_WEBHOOK_TRANSACTION_ERROR]", error);
          return new NextResponse("Internal Error", { status: 500 });
        }
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("[STRIPE_WEBHOOK_HANDLER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
