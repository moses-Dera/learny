"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function createCategoryAction(name: string) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Unauthorized. Only admins can manage categories." };
  }

  if (!name || name.trim().length < 2) {
    return { error: "Category name must be at least 2 characters." };
  }

  const slug = slugify(name);

  try {
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: name.trim() }, { slug }],
      },
    });

    if (existing) {
      return { error: "A category with this name or slug already exists." };
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/courses");
    return { success: true, category };
  } catch (error) {
    console.error("[CREATE_CATEGORY_ERROR]", error);
    return { error: "Failed to create category." };
  }
}

export async function updateCategoryAction(id: string, name: string) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Unauthorized." };
  }

  if (!name || name.trim().length < 2) {
    return { error: "Category name must be at least 2 characters." };
  }

  const slug = slugify(name);

  try {
    const existing = await prisma.category.findFirst({
      where: {
        AND: [
          { OR: [{ name: name.trim() }, { slug }] },
          { id: { not: id } }
        ]
      },
    });

    if (existing) {
      return { error: "Another category with this name or slug already exists." };
    }

    await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        slug,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_CATEGORY_ERROR]", error);
    return { error: "Failed to update category." };
  }
}

export async function deleteCategoryAction(id: string) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Unauthorized." };
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { courses: true }
        }
      }
    });

    if (!category) {
      return { error: "Category not found." };
    }

    if (category._count.courses > 0) {
      return { error: "Cannot delete category because it has courses attached." };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("[DELETE_CATEGORY_ERROR]", error);
    return { error: "Failed to delete category." };
  }
}
