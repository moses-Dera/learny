import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { updateCourseAction } from "@/lib/actions/courses";

export const metadata: Metadata = {
  title: "Edit Course | Instructor Studio",
};

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { 
      id: courseId,
      instructorId: session.user.id
    }
  });

  if (!course) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <Link href={`/instructor/courses/${course.id}`} className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Course Dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Course Details</h1>
        <p className="text-muted-foreground mt-1">Update your course metadata, pricing, and description.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <form action={async (formData: FormData) => {
          "use server";
          await updateCourseAction(course.id, formData);
          redirect(`/instructor/courses/${course.id}`);
        }} className="space-y-6">
          
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Course Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              defaultValue={course.title}
              required 
              className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Course Description</label>
            <textarea 
              id="description" 
              name="description" 
              defaultValue={course.description || ""}
              rows={4}
              className="w-full flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">Price (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">$</span>
                <input 
                  type="number" 
                  id="price" 
                  name="price" 
                  step="0.01"
                  min="0"
                  defaultValue={course.price.toString()}
                  className="w-full flex h-10 w-full rounded-md border border-input bg-background pl-7 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="level" className="text-sm font-medium">Difficulty Level</label>
              <select 
                id="level" 
                name="level" 
                defaultValue={course.level}
                className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="categoryId" className="text-sm font-medium">Category</label>
              <select 
                id="categoryId" 
                name="categoryId" 
                defaultValue={course.categoryId || ""}
                className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Uncategorized</option>
                {categories.map((category: { id: string, name: string }) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <Link href={`/instructor/courses/${course.id}`} className={buttonVariants({ variant: "outline" })}>
              Cancel
            </Link>
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
