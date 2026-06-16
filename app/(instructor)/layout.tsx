import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Video, BarChart, Settings, ArrowLeft } from "lucide-react";
import { SignOutButton } from "@/components/forms/signout-button";

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Strict structural authorization gate
  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Instructor Studio Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/instructor" className="flex items-center gap-2 font-bold text-lg text-foreground hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="text-[#15110F] text-[10px] font-black tracking-widest">STUDIO</span>
            </div>
            Instructor
          </Link>
        </div>
        
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <nav className="space-y-1">
            <Link href="/instructor" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </Link>
            <Link href="/instructor/courses" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Video className="w-4 h-4" />
              Course Management
            </Link>
            <Link href="/instructor/analytics" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <BarChart className="w-4 h-4" />
              Revenue & Analytics
            </Link>
            <Link href="/instructor/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Settings className="w-4 h-4" />
              Studio Settings
            </Link>
          </nav>

          <div className="mt-8 pt-8 border-t border-border">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Student View
            </Link>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Studio Workspace */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-foreground truncate">Studio Workspace</h1>
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-foreground leading-none">{session.user.name}</span>
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">Creator</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                {session.user.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>
        {/* Studio canvas uses a slightly different background to differentiate from student dashboard */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#1A1614]/30">
          {children}
        </div>
      </main>
    </div>
  );
}
