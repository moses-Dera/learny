import { auth } from "@/lib/auth";
import { r2, R2_BUCKET, PRESIGNED_URL_EXPIRY_SECONDS } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

const generatePresignedUrlSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = generatePresignedUrlSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { filename, contentType } = parsed.data;

    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
    }

    const extension = filename.split('.').pop();
    const key = `thumbnails/${session.user.id}/${crypto.randomBytes(16).toString("hex")}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2, command, {
      expiresIn: PRESIGNED_URL_EXPIRY_SECONDS,
    });

    // The read URL depends on how R2 is configured. Typically, there's a public domain for the bucket.
    // If not, we would need a GET presigned URL or a custom domain.
    // Assuming a public R2 bucket domain or workers dev domain based on R2_BUCKET_NAME
    // But since `env.R2_ACCOUNT_ID` is used, normally people use a custom domain or a worker.
    // Let's assume the client needs to construct the read URL or we pass it back.
    // Actually, R2 public buckets usually have a custom domain. Let's return the key and let the frontend handle it or return a proxy URL.
    // We can also serve files from `/api/files/[key]` but a public URL is better for images.
    // Let's assume `NEXT_PUBLIC_APP_URL/api/assets?key=` or something. Wait, is there a public domain?
    // Let's check `lib/env.ts` to see if there is an R2_PUBLIC_URL.
    
    return NextResponse.json({ 
      uploadUrl,
      key
    });

  } catch (error) {
    console.error("[IMAGE_UPLOAD_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
