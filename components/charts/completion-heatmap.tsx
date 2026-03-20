"use client";

import { cn } from "@/lib/utils";

interface HeatmapPoint {
  date: string;
  completionRate: number;
  tasksCompleted: number;
}

interface CompletionHeatmapProps {
  data: HeatmapPoint[];
}

export function CompletionHeatmap({ data }: CompletionHeatmapProps) {
  const getIntensity = (rate: number): string => {
    if (rate === 0) return "bg-[var(--bg-tertiary)]";
    if (rate < 25) return "bg-indigo-900/40";
    if (rate < 50) return "bg-indigo-700/50";
    if (rate < 75) return "bg-indigo-500/60";
    return "bg-indigo-400/80";
  };

  // Build the last 90 days grid
  const cells: Array<{ date: string; rate: number; tasks: number }> = [];
  const dataMap = new Map(data.map((d) => [d.date, d]));

  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const point = dataMap.get(dateStr);

    cells.push({
      date: dateStr,
      rate: point?.completionRate ?? 0,
      tasks: point?.tasksCompleted ?? 0,
    });
  }

  // Split into weeks (rows of 7)
  const weeks: Array<typeof cells> = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {cells.map((cell) => (
          <div
            key={cell.date}
            className={cn(
              "w-3 h-3 rounded-[3px] transition-all hover:ring-1 hover:ring-indigo-400/50 cursor-default",
              getIntensity(cell.rate)
            )}
            title={`${cell.date}: ${cell.rate}% (${cell.tasks} tasks)`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-[10px] text-[var(--text-tertiary)]">
        <span>Less</span>
        <div className="flex gap-0.5">
          <div className="w-3 h-3 rounded-[3px] bg-[var(--bg-tertiary)]" />
          <div className="w-3 h-3 rounded-[3px] bg-indigo-900/40" />
          <div className="w-3 h-3 rounded-[3px] bg-indigo-700/50" />
          <div className="w-3 h-3 rounded-[3px] bg-indigo-500/60" />
          <div className="w-3 h-3 rounded-[3px] bg-indigo-400/80" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
