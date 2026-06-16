"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, this would log to Sentry or Datadog
    console.error("Application Error Caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4 py-16">
      <div className="rounded-full bg-destructive/10 p-4 mb-6">
        <svg
          className="w-12 h-12 text-destructive"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h1 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
        Something went wrong
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
        An unexpected error occurred while processing your request. We've been automatically notified.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => reset()} size="lg" className="h-11 px-8">
          Try Again
        </Button>
        <Link href="/" className={`${buttonVariants({ size: "lg", variant: "outline" })} h-11 px-8`}>
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
