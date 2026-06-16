import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Circle, PlayCircle } from "lucide-react";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { courseId } = await params;

  // Check enrollment and fetch course structure
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: courseId,
      },
    },
  });

  const isInstructor = session.user.role === "INSTRUCTOR" || session.user.role === "ADMIN";

  // If not enrolled and not an instructor, deny access
  if (!enrollment && !isInstructor) {
    redirect(`/dashboard/courses`); // In a real app, redirect to the public course sales page
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              progress: {
                where: { userId: session.user.id },
              },
            },
          },
        },
      },
    },
  });

  if (!course) notFound();

  // Calculate progress
  const totalLessons = course.sections.flatMap((s) => s.lessons).length;
  const completedLessons = course.sections
    .flatMap((s) => s.lessons)
    .filter((l) => l.progress[0]?.isCompleted).length;
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Course Navigation Sidebar */}
      <aside className="w-full md:w-80 bg-card border-r border-border flex flex-col shrink-0 h-screen sticky top-0 overflow-hidden">
        <div className="h-16 flex items-center px-4 border-b border-border shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="p-4 border-b border-border shrink-0">
          <h2 className="font-bold text-lg text-foreground line-clamp-2 leading-tight mb-3">
            {course.title}
          </h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{progressPercent}% Complete</span>
              <span>
                {completedLessons}/{totalLessons}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
          {course.sections.map((section) => (
            <div key={section.id} className="space-y-2">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.lessons.map((lesson) => {
                  const isCompleted = lesson.progress[0]?.isCompleted;
                  return (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.id}/lessons/${lesson.id}`}
                      className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors group"
                    >
                      <div className="mt-0.5 shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <PlayCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                          {lesson.title}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Video / Lesson Content Area */}
      <main className="flex-1 min-w-0 flex flex-col bg-muted/10 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
