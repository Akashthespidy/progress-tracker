"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  color = "indigo",
  showLabel = true,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const sizeMap = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorMap: Record<string, string> = {
    indigo: "from-indigo-500 to-violet-500",
    emerald: "from-emerald-500 to-teal-500",
    blue: "from-blue-500 to-cyan-500",
    amber: "from-amber-500 to-orange-500",
    rose: "from-rose-500 to-pink-500",
  };

  const gradientColor = colorMap[color] ?? colorMap.indigo;

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[var(--text-tertiary)]">Progress</span>
          <span className="text-xs font-medium text-[var(--text-secondary)]">
            {percentage}%
          </span>
        </div>
      )}
      <div
        className={`w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden ${sizeMap[size]}`}
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradientColor} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
