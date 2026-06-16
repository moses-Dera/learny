"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be positive").optional(),
});

export async function createCourseAction(state: any, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "INSTRUCTOR") {
    return { error: "Unauthorized. Only instructors can create courses." };
  }

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    price: formData.get("price"),
  };

  const parsed = courseSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: "Invalid fields",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const { title, description, price } = parsed.data;

  // Generate a URL-friendly slug with a random suffix for uniqueness
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const uniqueSuffix = Math.random().toString(36).substring(2, 8);
  const slug = `${baseSlug}-${uniqueSuffix}`;

  try {
    const course = await prisma.course.create({
      data: {
        title,
        description: description || "",
        price: price || 0,
        slug,
        instructorId: session.user.id,
        status: "DRAFT",
      },
    });

    revalidatePath("/instructor");
    return { success: true, courseId: course.id };
  } catch (error: any) {
    console.error("[CREATE_COURSE_ERROR]", error);
    if (error.code === "P2002") {
      return { error: "A course with a similar title already exists. Try another one." };
    }
    return { error: "Failed to create course." };
  }
}

export async function publishCourseAction(courseId: string, isPublished: boolean) {
  const session = await auth();

  if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return { error: "Unauthorized." };
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId, instructorId: session.user.id },
      include: { sections: { include: { lessons: true } } },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    if (isPublished) {
      // Validation: To publish, must have at least 1 section and 1 lesson
      if (course.sections.length === 0) {
        return { error: "Course must have at least one section to publish." };
      }

      const hasLessons = course.sections.some(section => section.lessons.length > 0);
      if (!hasLessons) {
        return { error: "Course must have at least one lesson to publish." };
      }
    }

    // Determine the next status
    let nextStatus: "DRAFT" | "REVIEW" | "PUBLISHED" = "DRAFT";
    if (isPublished) {
      if (session.user.role === "ADMIN") {
        nextStatus = "PUBLISHED";
      } else {
        nextStatus = "REVIEW";
      }
    }

    await prisma.course.update({
      where: { id: courseId },
      data: { status: nextStatus },
    });

    if (nextStatus === "REVIEW") {
      // Notify the instructor
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          title: "Course Submitted for Review",
          message: `Your course "${course.title}" has been submitted and is pending admin approval.`,
          link: `/dashboard/instructor/courses/${courseId}`
        }
      });
      // Also notify admins
      const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: "New Course Review",
            message: `Instructor ${session.user.name || session.user.email} submitted "${course.title}" for review.`,
            link: `/admin/courses`
          }
        });
      }
    } else if (nextStatus === "PUBLISHED") {
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          title: "Course Published!",
          message: `Your course "${course.title}" is now live and visible to students.`,
          link: `/courses/${course.slug}`
        }
      });
    } else {
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          title: "Course Unpublished",
          message: `Your course "${course.title}" is now hidden from the catalog and set to draft.`,
          link: `/dashboard/instructor/courses/${courseId}`
        }
      });
    }

    revalidatePath(`/instructor/courses/${courseId}`);
    revalidatePath(`/courses`);
    return { success: true };
  } catch (error) {
    console.error("[PUBLISH_COURSE_ERROR]", error);
    return { error: "Failed to update course status." };
  }
}

const updateCourseSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional().or(z.literal("")),
  price: z.coerce.number().min(0).optional(),
  categoryId: z.string().optional().nullable(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
});

export async function updateCourseAction(courseId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return { error: "Unauthorized." };
  }

  const data = {
    title: formData.get("title") ? formData.get("title") as string : undefined,
    description: formData.get("description") !== null ? formData.get("description") as string : undefined,
    price: formData.get("price") ? formData.get("price") : undefined,
    level: formData.get("level") ? formData.get("level") as string : undefined,
  };

  const parsed = updateCourseSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: "Invalid fields",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const existing = await prisma.course.findUnique({
      where: { id: courseId, instructorId: session.user.id },
    });

    if (!existing) {
      return { error: "Course not found or unauthorized." };
    }

    await prisma.course.update({
      where: { id: courseId },
      data: parsed.data,
    });

    revalidatePath(`/instructor/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_COURSE_ERROR]", error);
    return { error: "Failed to update course details." };
  }
}
