import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { RevenueChart, EnrollmentsChart } from "./charts";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  // Query actual revenue (succeeded payments for instructor's courses)
  const payments = await prisma.payment.findMany({
    where: {
      status: "SUCCEEDED",
      enrollment: {
        course: {
          instructorId: session.user.id,
        },
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
  });

  // Calculate total revenue
  const totalRevenue = payments.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);

  // Group revenue by month for the chart (last 6 months)
  const monthlyRevenueMap: Record<string, number> = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Initialize last 6 months to 0
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    monthlyRevenueMap[`${monthNames[d.getMonth()]} ${d.getFullYear()}`] = 0;
  }

  payments.forEach((payment: any) => {
    const monthYear = `${monthNames[payment.createdAt.getMonth()]} ${payment.createdAt.getFullYear()}`;
    if (monthlyRevenueMap[monthYear] !== undefined) {
      monthlyRevenueMap[monthYear] += Number(payment.amount);
    }
  });

  const revenueChartData = Object.entries(monthlyRevenueMap).map(([month, value]) => ({
    month: month.split(' ')[0], // just the month name
    value,
  }));

  // Query actual enrollments (courses taught by instructor with enrollment counts)
  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    select: {
      title: true,
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: {
      enrollments: {
        _count: "desc",
      },
    },
  });

  const totalEnrollments = courses.reduce((acc: number, curr: { _count: { enrollments: number } }) => acc + curr._count.enrollments, 0);

  const topCoursesData = courses.slice(0, 5).map((course: { title: string, _count: { enrollments: number } }) => ({
    title: course.title.length > 20 ? course.title.substring(0, 20) + "..." : course.title,
    students: course._count.enrollments,
  }));

  // Mock completion rate since we aren't tracking full completion perfectly yet
  const avgCompletionRate = "0%";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Revenue & Analytics</h2>
        <p className="text-muted-foreground mt-1">Track your financial performance and student engagement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, trend: "+0%" },
          { label: "Active Subscriptions", value: totalEnrollments.toString(), icon: Users, trend: "+0" },
          { label: "Avg. Completion Rate", value: avgCompletionRate, icon: TrendingUp, trend: "+0%" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
              <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
              <p className="text-xs text-muted-foreground">Monthly gross volume</p>
            </div>
          </div>
          <RevenueChart data={revenueChartData} />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Top Performing Courses</h3>
            <p className="text-xs text-muted-foreground">Ranked by total enrollments</p>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <EnrollmentsChart data={topCoursesData} />
          </div>
        </div>
      </div>
    </div>
  );
}
