import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlusCircle, ArrowLeft, MoreVertical, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { CurriculumBuilder } from "@/components/course/curriculum-builder";

export const metadata: Metadata = {
  title: "Course Management | Instructor Studio",
};

export default async function CourseManagementPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { courseId } = await params;

  // Verify ownership
  const course = await prisma.course.findUnique({
    where: { 
      id: courseId,
      instructorId: session.user.id
    },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <Link href="/instructor" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Studio
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{course.title}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
              course.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
            }`}>
              {course.status}
            </span>
          </div>
          <p className="text-muted-foreground mt-1 line-clamp-1">{course.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/instructor/courses/${course.id}/edit`} className={buttonVariants({ variant: "outline" })}>
            Edit Details
          </Link>
          <form action={async () => {
            "use server";
            const { publishCourseAction } = await import("@/lib/actions/courses");
            await publishCourseAction(course.id, course.status === "DRAFT");
          }}>
            <Button 
              variant={course.status === "PUBLISHED" ? "secondary" : "default"}
              type="submit"
            >
              {course.status === "PUBLISHED" ? "Unpublish Course" : "Publish Course"}
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Curriculum */}
        <div className="lg:col-span-2">
          <CurriculumBuilder courseId={course.id} initialSections={course.sections} />
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Course Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="font-semibold text-foreground">${course.price.toString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Level</span>
                <span className="font-semibold text-foreground">{course.level}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="font-semibold text-foreground">
                  {course.categoryId ? "Selected" : "Uncategorized"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
