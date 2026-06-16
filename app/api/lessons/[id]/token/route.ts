// GET /api/lessons/[id]/token
// Returns a signed Mux playback token for a paid lesson.
// Checks enrollment before issuing any token — client never receives
// a token for content they haven't paid for.

import { auth } from "@/lib/auth";
import { mux, VIDEO_TOKEN_EXPIRY } from "@/lib/mux";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams): Promise<NextResponse> {
  const start = Date.now();

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: lessonId } = await params;
    const userId = session.user.id!;

    // Fetch lesson with course enrollment context
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        isFree: true,
        muxPlaybackId: true,
        videoStatus: true,
        section: {
          select: {
            course: {
              select: {
                id: true,
                enrollments: {
                  where: { userId },
                  select: { id: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 },
      );
    }

    if (lesson.videoStatus !== "READY" || !lesson.muxPlaybackId) {
      return NextResponse.json(
        { error: "Video not ready", code: "VIDEO_NOT_READY" },
        { status: 409 },
      );
    }

    const isEnrolled =
      lesson.section.course.enrollments.length > 0;
    const isInstructor = session.user.role === "INSTRUCTOR" || session.user.role === "ADMIN";

    // Free preview lessons return unsigned playback — no auth needed
    if (lesson.isFree) {
      return NextResponse.json({
        playbackId: lesson.muxPlaybackId,
        token: null, // unsigned — player uses playbackId directly
      });
    }

    // Paid lesson — requires active enrollment
    if (!isEnrolled && !isInstructor) {
      return NextResponse.json(
        { error: "Not enrolled", code: "NOT_ENROLLED" },
        { status: 403 },
      );
    }

    // Sign the playback token with userId for audit trail
    const token = await mux.jwt.signPlaybackId(lesson.muxPlaybackId, {
      type: "video",
      expiration: VIDEO_TOKEN_EXPIRY, // 12 hours
      params: {
        sub: userId, // auditable: which user requested this token
      },
    });

    console.log(
      JSON.stringify({
        method: "GET",
        path: `/api/lessons/${lessonId}/token`,
        userId,
        lessonId,
        durationMs: Date.now() - start,
        status: 200,
      }),
    );

    return NextResponse.json({
      playbackId: lesson.muxPlaybackId,
      token,
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        method: "GET",
        path: "/api/lessons/[id]/token",
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
