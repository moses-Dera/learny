// GET /api/cron/keepalive
// Keeps serverless databases (like Neon or Supabase) warm during peak hours (6am–11pm).
// Serverless DBs pause compute after 5 minutes idle — a cold start adds ~800ms of delay.
// Scheduled in vercel.json: "*/30 * 6-23 * *"
// 
// NOTE: If you are using a "normal" provisioned database (like AWS RDS, DigitalOcean, 
// or a standard VPS) that does not auto-pause, YOU DO NOT NEED THIS. 
// You can safely delete this file and remove the cron block from vercel.json.

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
