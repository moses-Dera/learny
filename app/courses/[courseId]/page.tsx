import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, BarChart, PlayCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: {
        select: { name: true, image: true }
      },
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" }
          }
        }
      }
    }
  });

  if (!course) notFound();

  const isPublished = course.status === "PUBLISHED";
  const isOwner = session?.user?.id === course.instructorId;
  const isAdmin = session?.user?.role === "ADMIN";

  if (!isPublished && !isOwner && !isAdmin) {
    notFound();
  }

  // Check if enrolled
  let isEnrolled = false;
  if (session?.user?.id) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        }
      }
    });
    isEnrolled = !!enrollment;
  }

  // Calculate some stats
  const totalLessons = course.sections.flatMap(s => s.lessons).length;
  const totalDuration = course.sections.flatMap(s => s.lessons).reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-muted/30 border-b relative py-8 md:py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Course Catalog
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description || "No description provided yet."}</p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {totalLessons} lessons
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {hours > 0 ? `${hours}h ` : ""}{minutes}m
              </div>
              <div className="flex items-center gap-1.5">
                <BarChart className="w-4 h-4" />
                Beginner Friendly
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                {course.instructor.name?.charAt(0) || "I"}
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">Taught by {course.instructor.name}</p>
                <p className="text-muted-foreground">Instructor</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl p-6 border border-border shadow-xl space-y-6">
            <div className="aspect-video bg-muted rounded-xl relative overflow-hidden">
               {course.thumbnailUrl ? (
                 <Image src={course.thumbnailUrl} alt={course.title} fill unoptimized className="object-cover" />
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                   No Video Preview
                 </div>
               )}
            </div>

            <div className="text-3xl font-bold text-foreground">
              {course.price && course.price.toNumber() > 0 ? `$${course.price.toNumber()}` : "Free"}
            </div>

            {isEnrolled ? (
              <Link href={`/courses/${course.id}/lessons/${course.sections[0]?.lessons[0]?.id || ''}`} className="block w-full">
                <Button className="w-full h-12 text-lg">Continue Learning</Button>
              </Link>
            ) : session?.user?.id === course.instructorId ? (
              <Link href={`/instructor/courses/${course.id}`} className="block w-full">
                <Button className="w-full h-12 text-lg" variant="outline">Edit Course</Button>
              </Link>
            ) : course.status !== "PUBLISHED" ? (
              <Button className="w-full h-12 text-lg" disabled>Coming Soon</Button>
            ) : (
              (() => {
                const courseId = course.id;
                const courseTitle = course.title;
                const courseDescription = course.description;
                const courseThumbnailUrl = course.thumbnailUrl;
                const priceNumber = course.price ? course.price.toNumber() : 0;
                const firstLessonId = course.sections[0]?.lessons[0]?.id || '';

                return (
                  <form action={async () => {
                    "use server";
                    const userSession = await auth();
                    if (!userSession?.user?.id) redirect("/login");

                    if (priceNumber === 0) {
                      // Free Course -> Enroll Directly
                      await prisma.enrollment.create({
                        data: {
                          userId: userSession.user.id,
                          courseId: courseId,
                        }
                      });
                      revalidatePath(`/courses/${courseId}`);
                      redirect(`/courses/${courseId}/lessons/${firstLessonId}`);
                    } else {
                      // Paid Course -> Stripe Checkout
                      const stripe = (await import("@/lib/stripe")).stripe;
                      const env = (await import("@/lib/env")).env;

                      const checkoutSession = await stripe.checkout.sessions.create({
                        customer_email: userSession.user.email || undefined,
                        line_items: [
                          {
                            quantity: 1,
                            price_data: {
                              currency: "usd",
                              product_data: {
                                name: courseTitle,
                                description: courseDescription || undefined,
                                images: courseThumbnailUrl ? [courseThumbnailUrl] : [],
                              },
                              unit_amount: Math.round(priceNumber * 100),
                            }
                          }
                        ],
                        mode: "payment",
                        success_url: `${env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
                        cancel_url: `${env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=1`,
                        metadata: {
                          courseId: courseId,
                          userId: userSession.user.id,
                        }
                      });

                      if (checkoutSession.url) {
                        redirect(checkoutSession.url);
                      }
                    }
                  }}>
                    <Button type="submit" className="w-full h-12 text-lg">Enroll Now</Button>
                  </form>
                );
              })()
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Curriculum Outline */}
      <div className="max-w-3xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold text-foreground mb-8">Course Curriculum</h2>
        
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {course.sections.map((section) => (
            <div key={section.id} className="p-0">
              <div className="p-4 bg-muted/30">
                <h3 className="font-semibold text-foreground">{section.title}</h3>
              </div>
              <div className="divide-y divide-border/50">
                {section.lessons.map((lesson) => (
                  <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <PlayCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{lesson.title}</span>
                    </div>
                    {lesson.durationSeconds && (
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(lesson.durationSeconds / 60)}:{(lesson.durationSeconds % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
