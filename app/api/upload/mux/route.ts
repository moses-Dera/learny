import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { mux } from "@/lib/mux";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Instructors never upload to our servers — always use Mux Direct Upload.
    // Our server creates the upload URL; the browser uploads directly to Mux.
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
        mp4_support: "standard", // Useful if you want users to be able to download the video
      },
      cors_origin: "*", // Allow uploads from anywhere (in prod, you can lock this to your domain)
    });

    return NextResponse.json({
      uploadId: upload.id,
      url: upload.url,
    });
  } catch (error) {
    console.error("[MUX_DIRECT_UPLOAD_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
