"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function updateLessonUploadId(lessonId: string, uploadId: string) {
  const session = await auth();
  
  if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return { error: "Unauthorized" };
  }

  try {
    // Verify ownership of the course through the lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          include: {
            course: true,
          }
        }
      }
    });

    if (!lesson || lesson.section.course.instructorId !== session.user.id) {
      return { error: "Unauthorized to update this lesson" };
    }

    // Update the lesson with the new uploadId and set status to PROCESSING
    // The webhook will later pick this up using the uploadId
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        muxUploadId: uploadId,
        videoStatus: "PROCESSING",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[UPDATE_LESSON_UPLOAD_ID_ERROR]", error);
    return { error: "Failed to update lesson with upload ID." };
  }
}
