"use client";

import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function RevenueChart({ data }: { data: { month: string; value: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed rounded-xl">
        No revenue data yet
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '3 3', fill: 'transparent' }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--popover))', 
              color: 'hsl(var(--popover-foreground))',
              borderRadius: '8px', 
              border: '1px solid hsl(var(--border))', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
            formatter={(value: any) => [`$${value}`, 'Revenue']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="var(--primary)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EnrollmentsChart({ data }: { data: { title: string; students: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed rounded-xl">
        No enrollment data yet
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
          <XAxis 
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            dataKey="title" 
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            width={120}
          />
          <Tooltip 
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--popover))', 
              color: 'hsl(var(--popover-foreground))',
              borderRadius: '8px', 
              border: '1px solid hsl(var(--border))', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
            formatter={(value: any) => [value, 'Enrollments']}
          />
          <Bar dataKey="students" fill="var(--primary)" radius={[0, 4, 4, 0]} maxBarSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
