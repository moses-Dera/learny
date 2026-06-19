"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useActionState } from "react";
import { forgotPasswordAction } from "@/lib/actions/auth";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null);

  if (state?.success) {
    return (
      <div className="grid gap-6 text-center">
        <div className="text-sm font-medium text-primary bg-primary/10 p-4 rounded-md">
          Check your email for a reset link. If an account exists, we've sent instructions to reset your password.
        </div>
        <Link href="/login" className="text-sm font-medium text-primary hover:underline underline-offset-4">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <form action={formAction}>
        <div className="grid gap-4">
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
              disabled={isPending}
              required
              className="bg-transparent"
            />
            {state?.fields?.email && <p className="text-xs text-destructive">{state.fields.email[0]}</p>}
          </div>
          
          {state?.error && (
            <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
              {state.error}
            </div>
          )}

          <Button disabled={isPending} type="submit" className="w-full mt-2">
            {isPending ? "Sending link..." : "Send Reset Link"}
          </Button>

          <div className="text-center mt-4">
            <Link href="/login" className="text-xs font-medium text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">
              Remember your password? Sign in
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
