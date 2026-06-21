import { r2, R2_BUCKET } from "../lib/r2";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

async function testR2() {
  console.log("Testing Cloudflare R2 connection...");
  console.log("Bucket:", R2_BUCKET);
  
  const testKey = `test-upload-${Date.now()}.txt`;
  
  try {
    console.log(`1. Uploading test file (${testKey})...`);
    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: testKey,
        Body: "Hello from LearnFlow R2 test!",
        ContentType: "text/plain",
      })
    );
    console.log("✅ Upload successful!");

    console.log("2. Verifying object exists...");
    const getRes = await r2.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: testKey,
      })
    );
    console.log("✅ Fetch successful! Object size:", getRes.ContentLength);

    console.log("🎉 R2 IS FULLY CONFIGURED AND WORKING!");
  } catch (error: any) {
    console.error("❌ R2 Test Failed:");
    console.error(error.message || error);
    process.exit(1);
  }
}

testR2();
