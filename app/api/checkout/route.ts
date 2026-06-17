import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || !session.user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = await req.json();

    if (!courseId) {
      return new NextResponse("Missing course ID", { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId, status: "PUBLISHED" },
      include: { instructor: true }
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if already enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        }
      }
    });

    if (enrollment) {
      return new NextResponse("Already enrolled", { status: 400 });
    }

    // Free course -> enroll immediately
    if (Number(course.price) === 0 || !course.price) {
      await prisma.enrollment.create({
        data: {
          userId: session.user.id,
          courseId: course.id,
        }
      });
      return NextResponse.json({ url: `${env.NEXT_PUBLIC_APP_URL}/courses/${course.id}` });
    }

    // Paid course -> Stripe Checkout
    // The application fee is 15% (per rules)
    // Wait, application_fee_amount is for Stripe Connect. 
    // Are we using Connect? The rules say: "Platform fee is application-level — use application_fee_amount on Checkout Session for the 15% cut."
    // This implies Stripe Connect destination charges. But if we haven't configured a Stripe Connect account on the instructor, we'll just omit it for testing or add it if instructor has stripeAccountId.
    // For now, let's just create a standard checkout session. 
    
    let stripeCustomerId = "";
    // If we had a stripeCustomerId on the user, we'd use it here. 
    // We'll let Stripe create one or just use customer_email.

    const unitAmount = Math.round(Number(course.price) * 100);

    const line_items = [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
            description: course.description || undefined,
            images: course.thumbnailUrl ? [course.thumbnailUrl] : [],
          },
          unit_amount: unitAmount, // Convert to cents
        }
      }
    ];

    let payment_intent_data: any = undefined;
    if (course.instructor.stripeAccountId && course.instructor.stripeAccountSetupComplete) {
      const application_fee_amount = Math.round(unitAmount * 0.15); // 15% platform fee
      payment_intent_data = {
        application_fee_amount,
        transfer_data: {
          destination: course.instructor.stripeAccountId,
        },
      };
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items,
      mode: "payment",
      success_url: `${env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      payment_intent_data,
      metadata: {
        courseId: course.id,
        userId: session.user.id,
      }
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[COURSE_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
