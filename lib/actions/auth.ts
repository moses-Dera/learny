"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

// --- Registration Action ---
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "INSTRUCTOR"]).default("STUDENT"),
});

export async function registerAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
      return { 
        error: "Invalid input", 
        fields: parsed.error.flatten().fieldErrors 
      };
    }

    const { name, email, password, role } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    // Hash the password securely (12 rounds)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user in the database
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Automatically log the user in
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      return { error: "Failed to authenticate after registration." };
    }

    return { success: true };

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Failed to authenticate after registration." };
      }
    }
    
    console.error("[REGISTER_ERROR]", error);
    return { error: "Internal server error." };
  }
}


// --- Login Action ---
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
      return { 
        error: "Invalid input", 
        fields: parsed.error.flatten().fieldErrors 
      };
    }

    const { email, password } = parsed.data;

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
       return { error: "Invalid email or password." };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Authentication failed. Please try again." };
      }
    }
    
    console.error("[LOGIN_ERROR]", error);
    return { error: "Internal server error." };
  }
}


// --- Forgot Password Action ---
import crypto from "crypto";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { ResetPasswordEmail } from "@/emails/reset-password";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsed = forgotPasswordSchema.safeParse(data);

    if (!parsed.success) {
      return { 
        error: "Invalid input", 
        fields: parsed.error.flatten().fieldErrors 
      };
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      // Return success even if user doesn't exist to prevent email enumeration
      return { success: true };
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    // Delete existing reset tokens
    await prisma.verificationToken.deleteMany({
      where: { identifier: `PASSWORD_RESET:${email}` },
    });

    // Save token
    await prisma.verificationToken.create({
      data: {
        identifier: `PASSWORD_RESET:${email}`,
        token,
        expires,
      },
    });

    // Send email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${appUrl}/reset-password?token=${token}`;

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Reset your LearnFlow password",
        react: ResetPasswordEmail({ resetLink }),
      });
    } catch (emailError) {
      console.error("[EMAIL_ERROR]", emailError);
      // Fire-and-forget: do not expose email failures
    }

    return { success: true };
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error);
    return { error: "Internal server error." };
  }
}

// --- Reset Password Action ---
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function resetPasswordAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsed = resetPasswordSchema.safeParse(data);

    if (!parsed.success) {
      return { 
        error: "Invalid input", 
        fields: parsed.error.flatten().fieldErrors 
      };
    }

    const { token, password } = parsed.data;

    // Find token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || !verificationToken.identifier.startsWith("PASSWORD_RESET:")) {
      return { error: "Invalid or expired reset token." };
    }

    if (verificationToken.expires < new Date()) {
      return { error: "Token has expired." };
    }

    const email = verificationToken.identifier.replace("PASSWORD_RESET:", "");

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Delete token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return { success: true };
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return { error: "Internal server error." };
  }
}
