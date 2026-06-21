import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { CategoryManager } from "@/components/admin/category-manager";

export const metadata: Metadata = {
  title: "Manage Categories | Admin",
  description: "Manage course categories for the platform",
};

export default async function CategoriesAdminPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/instructor");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { courses: true }
      }
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Categories</h1>
        <p className="text-muted-foreground mt-1">
          Manage the categories available for instructors to assign to their courses.
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}
