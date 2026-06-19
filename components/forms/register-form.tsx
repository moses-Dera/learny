"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { useState, useActionState } from "react";
import { signIn } from "next-auth/react";
import { registerAction } from "@/lib/actions/auth";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">(
    searchParams.get("role") === "instructor" ? "INSTRUCTOR" : "STUDENT"
  );
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [state, formAction, isPending] = useActionState(registerAction, null);

  React.useEffect(() => {
    if (state?.success) {
      window.location.href = "/dashboard";
    }
  }, [state]);

  const isLoading = isPending || isGoogleLoading || state?.success;

  async function onGoogleSignIn() {
    setIsGoogleLoading(true);
    document.cookie = `intendedRole=${role}; path=/; max-age=3600`;
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  const displayError = state?.error || (urlError === "EmailAlreadyInUse" ? "An account with this email already exists." : urlError ? decodeURIComponent(urlError) : null);

  return (
    <div className="grid gap-6">
      <form action={formAction}>
        <input type="hidden" name="role" value={role} />
        <div className="grid gap-4">
          
          <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              className={`text-sm font-medium py-1.5 rounded-md transition-colors ${role === "STUDENT" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("INSTRUCTOR")}
              className={`text-sm font-medium py-1.5 rounded-md transition-colors ${role === "INSTRUCTOR" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Instructor
            </button>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              type="text"
              autoCapitalize="words"
              autoComplete="name"
              disabled={isLoading}
              required
              className="bg-transparent"
            />
            {state?.fields?.name && <p className="text-xs text-destructive">{state.fields.name[0]}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
              className="bg-transparent"
            />
            {state?.fields?.email && <p className="text-xs text-destructive">{state.fields.email[0]}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              required
              minLength={8}
              className="bg-transparent"
            />
            {state?.fields?.password ? (
              <p className="text-xs text-destructive">{state.fields.password[0]}</p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters long.</p>
            )}
          </div>
          
          {displayError && (
            <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
              {displayError}
            </div>
          )}

          <Button disabled={isLoading} type="submit" className="w-full mt-2">
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </div>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-medium">
            Or sign up with
          </span>
        </div>
      </div>
      
      <Button variant="outline" type="button" disabled={isLoading} onClick={onGoogleSignIn} className="w-full bg-transparent">
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        Google
      </Button>
    </div>
  );
}
