import { cn } from "@/lib/utils";
import {
  Flame,
  CheckCircle2,
  Target,
  TrendingUp,
  Trophy,
  Calendar,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  flame: Flame,
  "check-circle": CheckCircle2,
  target: Target,
  "trending-up": TrendingUp,
  trophy: Trophy,
  calendar: Calendar,
  "bar-chart": BarChart3,
};

const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
  indigo: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    glow: "shadow-indigo-500/5",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/5",
  },
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    glow: "shadow-violet-500/5",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    glow: "shadow-amber-500/5",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    glow: "shadow-blue-500/5",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    glow: "shadow-rose-500/5",
  },
};

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  iconName: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  subtitle,
  iconName,
  trend,
  color = "indigo",
  className,
}: StatCardProps) {
  const colors = colorMap[color] ?? colorMap.indigo;
  const Icon = iconMap[iconName] ?? Target;

  return (
    <div
      className={cn(
        "card p-5 relative overflow-hidden group",
        className
      )}
    >
      {/* Subtle glow on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          colors.glow
        )}
        style={{ boxShadow: `inset 0 0 60px var(--glow-indigo)` }}
      />

      <div className="relative flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.bg)}>
          <Icon className={cn("w-5 h-5", colors.text)} />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trend.positive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            )}
          >
            {trend.positive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>

      <div className="relative">
        <div className="text-2xl font-bold tracking-tight mb-0.5">{value}</div>
        <div className="text-sm text-[var(--text-secondary)]">{label}</div>
        {subtitle && (
          <div className="text-xs text-[var(--text-tertiary)] mt-1">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
