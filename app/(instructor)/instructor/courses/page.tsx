import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlusCircle, FileEdit, Eye, Trash2 } from "lucide-react";

export default async function InstructorCoursesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { enrollments: true, sections: true }
      },
      sections: {
        include: {
          _count: {
            select: { lessons: true }
          }
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Course Management</h2>
          <p className="text-muted-foreground mt-1">Create, edit, and manage your course catalog.</p>
        </div>
        <Link href="/instructor/courses/new" className={buttonVariants({ className: "gap-2" })}>
          <PlusCircle className="w-4 h-4" />
          Create Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-card border border-border border-dashed rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <PlusCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No courses yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            You haven't created any courses. Start building your first course to share your knowledge.
          </p>
          <Link href="/instructor/courses/new" className={buttonVariants()}>Create Your First Course</Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Course Title</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Lessons</th>
                  <th className="px-6 py-4 font-medium">Students</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{course.title}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                        course.status === "REVIEW" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                        "bg-muted text-muted-foreground border border-border"
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">${course.price.toString()}</td>
                    <td className="px-6 py-4">{course.sections.reduce((acc, section) => acc + section._count.lessons, 0)}</td>
                    <td className="px-6 py-4">{course._count.enrollments}</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <Link href={`/instructor/courses/${course.id}`} className="inline-flex items-center justify-center size-8 rounded-md text-foreground hover:bg-muted transition-colors">
                        <FileEdit className="w-4 h-4" />
                      </Link>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
