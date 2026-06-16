// GET /api/cron/keepalive
// Keeps Neon serverless DB warm during peak hours (6am–11pm).
// Neon pauses compute after 5 minutes idle — cold start adds ~800ms.
// Scheduled in vercel.json: "*/30 * 6-23 * *"

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<NextResponse> {
  // Verify this is a legitimate Vercel Cron request
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Minimal query — just keeps the connection warm
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Keepalive failed", {
      error: error instanceof Error ? error.message : error,
    });
    return NextResponse.json({ error: "DB unreachable" }, { status: 500 });
  }
}
