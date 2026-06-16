import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = {
  title: "Create an Account | Learny",
  description: "Join the Learny platform",
};

export default async function RegisterPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const role = searchParams?.role === "instructor" ? "Instructor" : "Student";

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Join as a <strong>{role}</strong> to {role === "Instructor" ? "start teaching and earning" : "start learning and growing"}.
        </p>
      </div>
      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading form...</div>}>
        <RegisterForm />
      </Suspense>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity">
          Sign in
        </Link>
      </p>
    </div>
  );
}
