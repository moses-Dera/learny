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
