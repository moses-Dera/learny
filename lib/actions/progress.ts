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
        section: {
          include: {
            course: {
              include: {
                enrollments: {
                  where: { userId: session.user.id },
                  take: 1,
                },
                sections: {
                  include: {
                    lessons: {
                      select: { id: true },
                    },
                  },
                },
              },
            },
          },
        },
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

    const enrollment = lesson.section.course.enrollments[0];
    if (enrollment) {
      const allLessonIds = lesson.section.course.sections.flatMap((s) =>
        s.lessons.map((l) => l.id),
      );

      const completedCount = await prisma.lessonProgress.count({
        where: {
          userId: session.user.id,
          lessonId: { in: allLessonIds },
          completed: true,
        },
      });

      const progressPercent = Math.round(
        (completedCount / allLessonIds.length) * 100,
      );

      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progressPercent,
          completedAt: progressPercent === 100 ? new Date() : null,
        },
      });
    }

    // Revalidate the course layout so the sidebar checkboxes and progress bar update
    revalidatePath(`/courses/${lesson.section.courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[COMPLETE_LESSON]", error);
    return { error: "Failed to mark lesson as complete" };
  }
}
