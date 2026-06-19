import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";

export default async function CatalogPage() {
  // Normally we would only show PUBLISHED courses, but we'll show all for now
  const courses = await prisma.course.findMany({
    include: {
      instructor: true,
      sections: {
        include: { lessons: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Course Catalog</h1>
          <p className="text-xl text-muted-foreground">Discover new skills and elevate your career.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course: any) => {
            const totalLessons = course.sections?.flatMap((s: any) => s.lessons || [])?.length || 0;
            
            return (
              <Link key={course.id} href={`/courses/${course.id}`} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors shadow-sm flex flex-col">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {course.thumbnailUrl ? (
                    <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-muted-foreground/30 text-2xl uppercase">
                      {course.title.substring(0,2)}
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{course.instructor?.name || "Unknown Instructor"}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      <BookOpen className="w-3.5 h-3.5" />
                      {totalLessons} lessons
                    </div>
                    <div className="font-bold text-foreground">
                      {Number(course.price) === 0 || !course.price ? "Free" : `$${course.price.toString()}`}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
