import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Sign In | Learny",
  description: "Sign in to your Learny account",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to sign in to your account.
        </p>
      </div>
      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading form...</div>}>
        <LoginForm />
      </Suspense>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Don't have an account?{" "}
        <Link href="/register" className="font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity">
          Sign up for free
        </Link>
      </p>
    </div>
  );
}
