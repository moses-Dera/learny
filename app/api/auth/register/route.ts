import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const parsed = registerSchema.safeParse({ name, email, password });

    if (!parsed.success) {
      // Return 400 with first error
      const errorMsg = parsed.error.issues[0]?.message || "Validation failed";
      return NextResponse.redirect(new URL(`/register?error=${encodeURIComponent(errorMsg)}`, req.url));
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existingUser) {
      return NextResponse.redirect(new URL(`/register?error=EmailAlreadyInUse`, req.url));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

    // Create user
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
        // Optional: read from URL params to allow ?role=instructor signups
        role: "STUDENT", 
      },
    });

    // Successfully created, redirect to login with a success message
    return NextResponse.redirect(new URL("/login?success=AccountCreated", req.url));
    
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.redirect(new URL("/register?error=InternalServerError", req.url));
  }
}
