
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { ShieldCheck, BookOpen, Users, Settings, Tags, ArrowLeft } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NotificationBell } from "@/components/layout/notification-bell";
import { getNotifications } from "@/lib/actions/notifications";
import { prisma } from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Strict role check
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, role: true }
  });

  if (!dbUser) redirect("/");

  const notifications = await getNotifications();

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row bg-background md:overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-muted/20 shrink-0">
        <div className="flex h-14 items-center border-b px-4">
          <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
          <span className="font-semibold tracking-tight">Admin Console</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ShieldCheck className="h-4 w-4" />
            Overview
          </Link>
          <Link
            href="/admin/courses"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Course Reviews
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Users className="h-4 w-4" />
            Users
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Tags className="h-4 w-4" />
            Categories
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Student View
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center">
            <MobileNav isAdmin={true} context="admin" />
            <h1 className="text-xl font-semibold text-foreground truncate hidden sm:block">Admin Console</h1>
            <Link href="/" className="md:hidden flex items-center gap-2 font-bold text-lg text-foreground">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Learny
            </Link>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <NotificationBell initialNotifications={notifications} />
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-foreground leading-none">{dbUser.name}</span>
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">Admin</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                {dbUser.name?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
