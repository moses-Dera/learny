import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
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
        <Button asChild size="lg" className="h-11 px-8">
          <Link href="/">Return to Homepage</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-11 px-8">
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    </div>
  );
}
