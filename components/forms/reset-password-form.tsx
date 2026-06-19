"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useActionState } from "react";
import { resetPasswordAction } from "@/lib/actions/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [state, formAction, isPending] = useActionState(resetPasswordAction, null);

  if (!token) {
    return (
      <div className="grid gap-6 text-center">
        <div className="text-sm font-medium text-destructive bg-destructive/10 p-4 rounded-md">
          Invalid or missing reset token.
        </div>
        <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline underline-offset-4">
          Request a new link
        </Link>
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="grid gap-6 text-center">
        <div className="text-sm font-medium text-primary bg-primary/10 p-4 rounded-md">
          Your password has been reset successfully.
        </div>
        <Link href="/login" className="text-sm font-medium text-primary hover:underline underline-offset-4">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <form action={formAction}>
        <input type="hidden" name="token" value={token} />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              disabled={isPending}
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
          
          {state?.error && (
            <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
              {state.error}
            </div>
          )}

          <Button disabled={isPending} type="submit" className="w-full mt-2">
            {isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
