import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mux } from "@/lib/mux";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("mux-signature");

    if (!signature) {
      return new NextResponse("Missing Mux signature", { status: 400 });
    }

    try {
      mux.webhooks.verifySignature(payload, req.headers, env.MUX_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error("[MUX_WEBHOOK_SIGNATURE_ERROR]", err.message);
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(payload);

    // Process the video becoming ready
    if (event.type === "video.asset.ready") {
      const data = event.data;
      const uploadId = data.upload_id;
      const assetId = data.id;
      const playbackId = data.playback_ids?.[0]?.id;
      const duration = data.duration ? Math.round(data.duration) : null;

      if (uploadId) {
        // Upsert by muxUploadId (idempotent update)
        // Since muxUploadId is unique, we use updateMany (or findFirst + update)
        await prisma.lesson.updateMany({
          where: { muxUploadId: uploadId },
          data: {
            muxAssetId: assetId,
            muxPlaybackId: playbackId,
            durationSeconds: duration,
            videoStatus: "READY",
          },
        });
      }
    }

    // Process processing errors
    if (event.type === "video.asset.errored") {
      const data = event.data;
      const uploadId = data.upload_id;

      if (uploadId) {
        await prisma.lesson.updateMany({
          where: { muxUploadId: uploadId },
          data: {
            videoStatus: "ERROR",
          },
        });
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("[MUX_WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
