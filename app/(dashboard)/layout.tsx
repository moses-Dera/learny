import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { LayoutDashboard, BookOpen, Settings, Video, ShieldCheck } from "lucide-react";
import { SignOutButton } from "@/components/forms/signout-button";

import { NotificationBell } from "@/components/layout/notification-bell";
import { getNotifications } from "@/lib/actions/notifications";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const notifications = await getNotifications();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch the fresh user from the DB so the header always has the up-to-date name
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, role: true }
  });

  if (!dbUser) redirect("/login");

  const isInstructor = dbUser.role === "INSTRUCTOR" || dbUser.role === "ADMIN";
  const isAdmin = dbUser.role === "ADMIN";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border flex flex-col shrink-0 md:sticky md:top-0 md:h-screen">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#15110F]"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            Learny
          </Link>
        </div>
        
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <nav className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/courses" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <BookOpen className="w-4 h-4" />
              Course Catalog
            </Link>
            {isInstructor && (
              <Link href="/instructor" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Video className="w-4 h-4" />
                Instructor Studio
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <ShieldCheck className="w-4 h-4" />
                Admin Console
              </Link>
            )}
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-foreground truncate">Dashboard</h1>
          <div className="flex items-center gap-4 shrink-0">
            <NotificationBell initialNotifications={notifications} />
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-foreground leading-none">{dbUser.name}</span>
                <span className="text-xs text-muted-foreground capitalize mt-1">{dbUser.role?.toLowerCase()}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                {dbUser.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
