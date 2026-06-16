"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function approveCourseAction(courseId: string) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Unauthorized." };
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: true },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    if (course.status !== "REVIEW") {
      return { error: "Course is not pending review." };
    }

    await prisma.$transaction(async (tx) => {
      // Approve course
      await tx.course.update({
        where: { id: courseId },
        data: { status: "PUBLISHED" },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "approve_course",
          targetId: courseId,
          targetType: "course",
        }
      });

      // Notify the instructor
      await tx.notification.create({
        data: {
          userId: course.instructorId,
          title: "Course Approved! 🎉",
          message: `Your course "${course.title}" has been approved and is now live!`,
          link: `/dashboard/instructor/courses/${courseId}`
        }
      });
    });

    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("[APPROVE_COURSE_ERROR]", error);
    return { error: "Failed to approve course." };
  }
}

export async function rejectCourseAction(courseId: string, reason: string) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Unauthorized." };
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    if (course.status !== "REVIEW") {
      return { error: "Course is not pending review." };
    }

    await prisma.$transaction(async (tx) => {
      // Reject course back to DRAFT
      await tx.course.update({
        where: { id: courseId },
        data: { status: "DRAFT" },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "reject_course",
          targetId: courseId,
          targetType: "course",
          metadata: { reason },
        }
      });

      // Notify the instructor
      await tx.notification.create({
        data: {
          userId: course.instructorId,
          title: "Course Update Required",
          message: `Your course "${course.title}" requires updates before publishing. Reason: ${reason}`,
          link: `/dashboard/instructor/courses/${courseId}`
        }
      });
    });

    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    console.error("[REJECT_COURSE_ERROR]", error);
    return { error: "Failed to reject course." };
  }
}
