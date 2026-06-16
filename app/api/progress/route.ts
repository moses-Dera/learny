// PATCH /api/progress
// Upserts lesson watch progress. Debounced to every 30s on the client.
// Marks complete when >= 90% of duration has been watched.
// Updates materialized progressPercent on Enrollment.

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateProgressSchema } from "@/lib/validations";
import { LESSON_COMPLETION_THRESHOLD } from "@/lib/mux";
import { NextResponse } from "next/server";

export async function PATCH(req: Request): Promise<NextResponse> {
  const start = Date.now();

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateProgressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const { lessonId, watchedSeconds } = parsed.data;
    const userId = session.user.id!;

    // Fetch lesson with duration and course enrollment context
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        durationSeconds: true,
        section: {
          select: {
            courseId: true,
            course: {
              select: {
                enrollments: {
                  where: { userId },
                  select: { id: true },
                  take: 1,
                },
                sections: {
                  select: {
                    lessons: {
                      select: { id: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const enrollment = lesson.section.course.enrollments[0];
    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
    }

    const isComplete =
      lesson.durationSeconds != null &&
      watchedSeconds >= lesson.durationSeconds * LESSON_COMPLETION_THRESHOLD;

    // Upsert — safe to call multiple times, updates in place
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { watchedSeconds, completed: isComplete },
      create: { userId, lessonId, watchedSeconds, completed: isComplete },
    });

    // Recalculate and materialize course progress percent on enrollment
    if (isComplete) {
      const allLessonIds = lesson.section.course.sections.flatMap((s) =>
        s.lessons.map((l) => l.id),
      );
      const completedCount = await prisma.lessonProgress.count({
        where: {
          userId,
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
          completedAt:
            progressPercent === 100 ? new Date() : null,
        },
      });
    }

    console.log(
      JSON.stringify({
        method: "PATCH",
        path: "/api/progress",
        userId,
        lessonId,
        durationMs: Date.now() - start,
        status: 200,
      }),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      JSON.stringify({
        method: "PATCH",
        path: "/api/progress",
        durationMs: Date.now() - start,
        status: 500,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
