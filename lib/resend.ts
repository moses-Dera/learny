// Resend email client singleton.
// Fire-and-forget — email sends are non-critical.
// Always wrap send calls in try/catch. Never let email errors propagate
// to the user response.

import { Resend } from "resend";
import { env } from "@/lib/env";

const globalForResend = globalThis as unknown as {
  resend: Resend | undefined;
};

export const resend =
  globalForResend.resend ?? new Resend(env.RESEND_API_KEY);

if (process.env.NODE_ENV !== "production") {
  globalForResend.resend = resend;
}

export const FROM_EMAIL = env.RESEND_FROM_EMAIL;
