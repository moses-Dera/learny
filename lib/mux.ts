// Mux client singleton.
// MUX_TOKEN_ID and MUX_TOKEN_SECRET are server-only.
// Never store Mux access tokens in the DB — store only muxPlaybackId
// and muxAssetId. Tokens are generated on-demand per request.

import Mux from "@mux/mux-node";
import { env } from "@/lib/env";

export const mux = new Mux({
  tokenId: env.MUX_TOKEN_ID,
  tokenSecret: env.MUX_TOKEN_SECRET,
});

// Token lifetime — signed playback tokens expire in 12 hours.
// Short enough that sharing the URL is useless the next day.
export const VIDEO_TOKEN_EXPIRY = "12h" as const;

// Lesson completion threshold — 90% watched = complete
export const LESSON_COMPLETION_THRESHOLD = 0.9;
