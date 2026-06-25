import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { NotificationBell } from "./notification-bell";
import { getNotifications } from "@/lib/actions/notifications";
import { MobileNav } from "@/components/layout/mobile-nav";
import { cn } from "@/lib/utils";

export async function SiteHeader() {
  const session = await auth();
  const notifications = session?.user ? await getNotifications() : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <MobileNav 
              isInstructor={session?.user?.role === "INSTRUCTOR" || session?.user?.role === "ADMIN"} 
              isAdmin={session?.user?.role === "ADMIN"} 
              isAuthenticated={!!session?.user} 
            />
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#15110F]"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <span className="font-semibold text-lg tracking-tight hidden sm:inline-block">Learny</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/80">
          <Link href="/courses" className="hover:text-foreground transition-colors">Course Catalog</Link>
          
          {session?.user ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="hover:text-foreground font-semibold text-primary transition-colors">Admin Dashboard</Link>
              )}
              {(session.user.role === "INSTRUCTOR" || session.user.role === "ADMIN") && (
                <Link href="/instructor" className="hover:text-foreground font-semibold text-primary transition-colors">Instructor Studio</Link>
              )}
            </>
          ) : (
            <>
              <Link href="/register?role=instructor" className="hover:text-foreground transition-colors">Teach on Learny</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-2">
              <NotificationBell initialNotifications={notifications} />
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className={cn(buttonVariants({ variant: "outline" }), "hidden md:inline-flex")}>
                  Admin
                </Link>
              )}
              {(session.user.role === "INSTRUCTOR" || session.user.role === "ADMIN") && (
                <Link href="/instructor" className={cn(buttonVariants({ variant: "outline" }), "hidden md:inline-flex")}>
                  Instructor
                </Link>
              )}
              <Link href="/dashboard" className={cn(buttonVariants({ variant: "default" }), "hidden md:inline-flex")}>
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm font-semibold tracking-tight">
              <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Sign In
              </Link>
              <span className="text-muted-foreground/30 font-light hidden sm:block text-lg font-serif italic">/</span>
              <Link href="/register" className="relative group text-foreground transition-colors">
                <span className="relative z-10 group-hover:text-primary transition-colors">Get Started Free</span>
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary/20 group-hover:bg-primary transition-colors"></span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
