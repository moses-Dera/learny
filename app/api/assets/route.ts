import { r2, R2_BUCKET } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    // Only allow reading from the thumbnails directory or public safe directories
    if (!key.startsWith("thumbnails/")) {
      return NextResponse.json({ error: "Unauthorized access to asset" }, { status: 403 });
    }

    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    });

    // Generate a short-lived presigned URL for reading (1 hour)
    const url = await getSignedUrl(r2, command, { expiresIn: 3600 });

    // Redirect the browser to the actual R2 signed URL
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("[ASSET_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
