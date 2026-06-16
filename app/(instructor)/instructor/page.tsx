import { auth } from "@/lib/auth";
import { PlusCircle, Users, DollarSign, PlayCircle, Video } from "lucide-react";
import Link from "next/link";

export default async function InstructorOverviewPage() {
  const session = await auth();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Studio Overview</h2>
          <p className="text-muted-foreground mt-1 text-lg">Monitor your revenue and manage your course catalog.</p>
        </div>
        <Link 
          href="/instructor/courses/new" 
          className="flex items-center gap-2 bg-primary text-[#15110F] px-5 py-2.5 rounded-md font-bold text-sm hover:opacity-90 transition-opacity shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Course
        </Link>
      </div>

      {/* High-Level Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-widest">Total Revenue</h3>
            <div className="p-2 bg-green-500/10 text-green-500 rounded-md">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">$0.00</p>
          <p className="text-xs text-muted-foreground mt-2">Lifetime earnings</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-widest">Total Students</h3>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-md">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">0</p>
          <p className="text-xs text-muted-foreground mt-2">Across all courses</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-widest">Active Courses</h3>
            <div className="p-2 bg-primary/10 text-primary rounded-md">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">0</p>
          <p className="text-xs text-muted-foreground mt-2">Published & Live</p>
        </div>
      </div>

      {/* Empty State / Activity Feed */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20">
          <h3 className="text-lg font-semibold text-foreground">Your Courses</h3>
        </div>
        <div className="p-16 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h4 className="text-xl font-bold text-foreground mb-2">No courses created yet</h4>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
            Get started by creating your first course. You can securely upload videos via Mux, set pricing, and build your entire curriculum here.
          </p>
          <Link 
            href="/instructor/courses/new" 
            className="inline-flex items-center gap-2 bg-primary text-[#15110F] px-8 py-3 rounded-md font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Create Your First Course
          </Link>
        </div>
      </div>
    </div>
  );
}
