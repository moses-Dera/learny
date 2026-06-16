import { Resend } from "resend";
import { env } from "@/lib/env";
import nodemailer from "nodemailer";

const resend = new Resend(env.RESEND_API_KEY);
export const FROM_EMAIL = env.RESEND_FROM_EMAIL;

export type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    if (process.env.NODE_ENV !== "production") {
      // Use Mailpit in development via Nodemailer
      const transporter = nodemailer.createTransport({
        host: "localhost",
        port: 1025, // Default Mailpit SMTP port
        secure: false,
      });

      console.log(`[Mailpit] Sending email to ${to} | Subject: ${subject}`);
      
      const info = await transporter.sendMail({
        from: FROM_EMAIL,
        to,
        subject,
        html,
        text,
      });
      
      console.log(`[Mailpit] Email sent! View it at http://localhost:8025`);
      return { success: true, messageId: info.messageId };
    }

    // Use Resend in production
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text: text || "", // Resend sometimes expects text as fallback
    });

    if (error) {
      console.error("[Resend Error]", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("[Email Exception]", error);
    return { success: false, error };
  }
}
