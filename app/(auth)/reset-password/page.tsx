import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { Suspense } from "react";

export const metadata = {
  title: "Reset Password | LearnFlow",
  description: "Enter your new LearnFlow password.",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Set New Password</h1>
        <p className="text-sm text-muted-foreground">
          Please enter your new password below.
        </p>
      </div>
      <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
