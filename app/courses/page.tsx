import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { CatalogFilters } from "@/components/course/catalog-filters";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q, category } = await searchParams;
  const titleSearch = typeof q === 'string' ? q : undefined;
  const categoryFilter = typeof category === 'string' ? category : undefined;

  // Fetch all categories for the filter bar
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  // Fetch courses with filters applied
  const courses = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
      ...(titleSearch ? { title: { contains: titleSearch, mode: 'insensitive' } } : {}),
      ...(categoryFilter ? { category: { slug: categoryFilter } } : {})
    },
    include: {
      instructor: true,
      category: true,
      sections: {
        include: { lessons: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Course Catalog</h1>
          <p className="text-xl text-muted-foreground">Discover new skills and elevate your career.</p>
        </div>

        <CatalogFilters categories={categories} />

        {courses.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-border">
            <h3 className="text-xl font-bold text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
