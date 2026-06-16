import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function NotFound() {
  const session = await auth();
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4 py-16">
      <h1 className="text-7xl lg:text-9xl font-bold tracking-tighter text-primary mb-4 drop-shadow-sm">
        404
      </h1>
      <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-6">
        Page Not Found
      </h2>
      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
        The course or page you are looking for doesn't exist, has been moved, or you don't have access to it.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {session?.user ? (
          <>
            {session.user.role === "ADMIN" && (
              <Link href="/admin" className={`${buttonVariants({ size: "lg" })} h-11 px-8`}>
                Return to Admin Console
              </Link>
            )}
            {session.user.role === "INSTRUCTOR" && (
              <Link href="/instructor" className={`${buttonVariants({ size: "lg" })} h-11 px-8`}>
                Return to Instructor Studio
              </Link>
            )}
            {session.user.role === "STUDENT" && (
              <Link href="/dashboard" className={`${buttonVariants({ size: "lg" })} h-11 px-8`}>
                Return to Dashboard
              </Link>
            )}
          </>
        ) : (
          <Link href="/" className={`${buttonVariants({ size: "lg" })} h-11 px-8`}>
            Return to Homepage
          </Link>
        )}
        <Link href="/courses" className={`${buttonVariants({ size: "lg", variant: "outline" })} h-11 px-8`}>
          Browse Courses
        </Link>
      </div>
    </div>
  );
}
