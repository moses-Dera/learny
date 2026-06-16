"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createSection(courseId: string, title: string) {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return { error: "Unauthorized" };
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId, instructorId: session.user.id },
    });

    if (!course) {
      return { error: "Course not found or unauthorized" };
    }

    const lastSection = await prisma.section.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
    });

    const newOrder = lastSection ? lastSection.order + 1 : 1;

    await prisma.section.create({
      data: {
        title,
        courseId,
        order: newOrder,
      },
    });

    revalidatePath(`/instructor/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[CREATE_SECTION]", error);
    return { error: "Failed to create section" };
  }
}

export async function createLesson(sectionId: string, title: string) {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return { error: "Unauthorized" };
  }

  try {
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true },
    });

    if (!section || section.course.instructorId !== session.user.id) {
      return { error: "Section not found or unauthorized" };
    }

    const lastLesson = await prisma.lesson.findFirst({
      where: { sectionId },
      orderBy: { order: "desc" },
    });

    const newOrder = lastLesson ? lastLesson.order + 1 : 1;

    await prisma.lesson.create({
      data: {
        title,
        sectionId,
        order: newOrder,
      },
    });

    revalidatePath(`/instructor/courses/${section.courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[CREATE_LESSON]", error);
    return { error: "Failed to create lesson" };
  }
}
