// Cloudflare R2 client (S3-compatible).
// R2 credentials are server-only — never expose to the client.
// R2 advantages over S3: zero egress fees, 10 GB permanent free tier.
// Presigned URLs expire in 1 hour — never issue long-lived upload URLs.

import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

export const R2_BUCKET = env.R2_BUCKET_NAME;

// Presigned PUT URL expires in 1 hour — never issue long-lived upload URLs
export const PRESIGNED_URL_EXPIRY_SECONDS = 3600;
