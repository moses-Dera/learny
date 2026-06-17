import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { PlayCircle, Award, Clock } from "lucide-react";
import Image from "next/image";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) return null;

  // Fetch enrollments with progress calculation
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          sections: {
            include: {
              lessons: {
                include: {
                  progress: {
                    where: { userId: session.user.id }
                  }
                }
              }
            }
          }
        }
      }
    },
    orderBy: { enrolledAt: "desc" }
  });

  const coursesWithProgress = enrollments.map((enrollment: any) => {
    const course = enrollment.course;
    const totalLessons = course.sections.flatMap((s: any) => s.lessons).length;
    const completedLessons = course.sections.flatMap((s: any) => s.lessons).filter((l: any) => l.progress[0]?.completed).length;
    const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
    
    // Find the first lesson to resume from (first uncompleted)
    // Or just the very first lesson if none completed
    let nextLessonId = course.sections[0]?.lessons[0]?.id;
    
    outer: for (const section of course.sections) {
      for (const lesson of section.lessons) {
        if (!lesson.progress[0]?.completed) {
          nextLessonId = lesson.id;
          break outer;
        }
      }
    }

    return {
      ...course,
      progressPercent,
      completedLessons,
      totalLessons,
      nextLessonId
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Welcome back, {session?.user?.name?.split(" ")[0]}!</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Ready to dive back into your learning? Pick up right where you left off.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <PlayCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Enrolled Courses</h3>
            <p className="text-3xl font-bold text-foreground">{enrollments.length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Certificates</h3>
            <p className="text-3xl font-bold text-foreground">0</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Hours Learned</h3>
            <p className="text-3xl font-bold text-foreground">0</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-foreground mb-6">Continue Learning</h3>
        
        {coursesWithProgress.length === 0 ? (
          <div className="bg-card border border-border border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <PlayCircle className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-1">No courses yet</h4>
            <p className="text-muted-foreground mb-6">Browse the catalog to find your first course.</p>
            <Link href="/courses" className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity">
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {coursesWithProgress.map((course: any) => (
              <div key={course.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col group hover:border-primary/30 transition-colors">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {course.thumbnailUrl ? (
                    <Image 
                      src={course.thumbnailUrl} 
                      alt={course.title} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-medium text-xl">
                      {course.title.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  {course.progressPercent === 100 && (
                    <div className="absolute top-2 right-2 bg-green-500/90 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm shadow-sm flex items-center gap-1">
                      <Award className="w-3 h-3" /> Completed
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="font-bold text-lg text-foreground mb-2 line-clamp-1">{course.title}</h4>
                  
                  <div className="mt-auto space-y-4 pt-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>{course.progressPercent}% Complete</span>
                        <span>{course.completedLessons}/{course.totalLessons}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500 ease-out" 
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                    </div>
                    
                    {course.nextLessonId ? (
                      <Link 
                        href={`/courses/${course.id}/lessons/${course.nextLessonId}`}
                        className="w-full inline-flex justify-center items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-secondary/80 transition-colors"
                      >
                        {course.progressPercent === 0 ? "Start Course" : course.progressPercent === 100 ? "Review Course" : "Continue Learning"}
                        <PlayCircle className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button disabled className="w-full inline-flex justify-center items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-md text-sm font-semibold cursor-not-allowed">
                        No lessons available
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {session?.user?.role === "INSTRUCTOR" && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-foreground mb-1">Instructor Studio</h3>
            <p className="text-muted-foreground text-sm max-w-xl">Upload new videos, manage your courses, and track your earnings.</p>
          </div>
          <Link href="/instructor" className="shrink-0 bg-primary text-primary-foreground px-6 py-2 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity">
            Go to Studio
          </Link>
        </div>
      )}
    </div>
  );
}
