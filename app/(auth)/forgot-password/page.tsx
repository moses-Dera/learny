import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export const metadata = {
  title: "Forgot Password | LearnFlow",
  description: "Reset your LearnFlow password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
