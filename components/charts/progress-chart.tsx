"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { DailyProgress } from "@/lib/actions/analytics";

interface ProgressChartProps {
  data: DailyProgress[];
  type?: "area" | "bar";
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="text-[var(--text-secondary)] mb-1">{label}</div>
      <div className="font-semibold">{payload[0].value}% completion</div>
    </div>
  );
}

export function ProgressChart({ data, type = "area" }: ProgressChartProps) {
  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    rate: d.completionRate,
    completed: d.tasksCompleted,
    total: d.totalTasks,
  }));

  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "var(--text-tertiary)" }}
            axisLine={{ stroke: "var(--border-primary)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--text-tertiary)" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="rate"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "var(--text-tertiary)" }}
          axisLine={{ stroke: "var(--border-primary)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--text-tertiary)" }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="rate"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#areaGradient)"
          dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 2, stroke: "white" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
