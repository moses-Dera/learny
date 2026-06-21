import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PlusCircle, Users, DollarSign, PlayCircle, Video, FileEdit } from "lucide-react";
import Link from "next/link";

export default async function InstructorOverviewPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Fetch real metrics
  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      _count: {
        select: { enrollments: true }
      }
    }
  });

  const totalCourses = await prisma.course.count({
    where: { instructorId: session.user.id }
  });

  const publishedCourses = await prisma.course.count({
    where: { instructorId: session.user.id, status: "PUBLISHED" }
  });

  const enrollments = await prisma.enrollment.count({
    where: { course: { instructorId: session.user.id } }
  });

  // Calculate revenue (mocked based on enrollments for now unless there's a payment table)
  // Let's assume we just use payments later, for now we will show $0.00 or fetch from Payment
  const payments = await prisma.payment.aggregate({
    where: { course: { instructorId: session.user.id }, status: "COMPLETED" },
    _sum: { amount: true }
  });
  const totalRevenue = (payments._sum.amount || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });


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
          <p className="text-3xl font-bold text-foreground">{totalRevenue}</p>
          <p className="text-xs text-muted-foreground mt-2">Lifetime earnings</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-widest">Total Students</h3>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-md">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{enrollments}</p>
          <p className="text-xs text-muted-foreground mt-2">Across all courses</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-widest">Active Courses</h3>
            <div className="p-2 bg-primary/10 text-primary rounded-md">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{publishedCourses}</p>
          <p className="text-xs text-muted-foreground mt-2">Published & Live</p>
        </div>
      </div>

      {/* Activity Feed / Courses */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Courses</h3>
          <Link href="/instructor/courses" className="text-sm text-primary hover:underline font-medium">View all</Link>
        </div>
        
        {courses.length === 0 ? (
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
        ) : (
          <div className="divide-y divide-border">
            {courses.map(course => (
              <div key={course.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-24 h-16 object-cover rounded-md border border-border" />
                  ) : (
                    <div className="w-24 h-16 bg-muted rounded-md flex items-center justify-center border border-border">
                      <Video className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-foreground">{course.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className={`px-2 py-0.5 rounded-full font-medium ${
                        course.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-500" :
                        course.status === "REVIEW" ? "bg-amber-500/10 text-amber-500" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {course.status}
                      </span>
                      <span>•</span>
                      <span>{course._count.enrollments} Students</span>
                      <span>•</span>
                      <span>${course.price.toString()}</span>
                    </div>
                  </div>
                </div>
                <Link 
                  href={`/instructor/courses/${course.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-md font-medium text-sm transition-colors border border-border"
                >
                  <FileEdit className="w-4 h-4" />
                  Edit Course
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
