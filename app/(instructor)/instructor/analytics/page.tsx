import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Revenue & Analytics</h2>
        <p className="text-muted-foreground mt-1">Track your financial performance and student engagement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder Stat Cards */}
        {[
          { label: "Total Revenue", value: "$0.00", icon: DollarSign, trend: "+0%" },
          { label: "Active Subscriptions", value: "0", icon: Users, trend: "+0" },
          { label: "Avg. Completion Rate", value: "0%", icon: TrendingUp, trend: "+0%" },
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

      <div className="bg-card border border-border border-dashed rounded-xl p-12 text-center mt-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Not Enough Data</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Analytics require active student enrollments to generate insights. Once your courses start generating revenue, charts will appear here.
        </p>
      </div>
    </div>
  );
}
