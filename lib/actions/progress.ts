"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function completeLesson(lessonId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: true,
      }
    });

    if (!lesson) {
      return { error: "Lesson not found" };
    }

    // Upsert the progress to mark it as complete
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lessonId,
        }
      },
      update: {
        completed: true,
      },
      create: {
        userId: session.user.id,
        lessonId: lessonId,
        completed: true,
      }
    });

    // Revalidate the course layout so the sidebar checkboxes and progress bar update
    revalidatePath(`/courses/${lesson.section.courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[COMPLETE_LESSON]", error);
    return { error: "Failed to mark lesson as complete" };
  }
}
