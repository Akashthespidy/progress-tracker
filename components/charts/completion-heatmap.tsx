"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface HeatmapPoint {
  date: string;
  completionRate: number;
  tasksCompleted: number;
}

interface CompletionHeatmapProps {
  data: HeatmapPoint[];
}

export function CompletionHeatmap({ data }: CompletionHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    rate: number;
    tasks: number;
    x: number;
    y: number;
  } | null>(null);

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

  // Group into columns of 7 (weeks), starting from Monday
  const weeks: Array<typeof cells> = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const dayLabels = ["Mon", "", "Wed", "", "Fri", "", ""];

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-1">
          {dayLabels.map((label, i) => (
            <div
              key={i}
              className="h-[13px] flex items-center text-[9px] text-[var(--text-tertiary)] leading-none"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-[3px] relative">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-[3px]">
              {week.map((cell) => (
                <div
                  key={cell.date}
                  className={cn(
                    "w-[13px] h-[13px] rounded-[3px] transition-all cursor-default",
                    getIntensity(cell.rate),
                    hoveredCell?.date === cell.date && "ring-1 ring-indigo-400/60 scale-125"
                  )}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredCell({
                      ...cell,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                  onMouseLeave={() => setHoveredCell(null)}
                />
              ))}
            </div>
          ))}

          {/* Tooltip */}
          {hoveredCell && (
            <div
              className="fixed z-50 glass-strong rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none -translate-x-1/2 -translate-y-full"
              style={{
                left: hoveredCell.x,
                top: hoveredCell.y - 8,
              }}
            >
              <div className="font-medium text-[var(--text-primary)]">
                {new Date(hoveredCell.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="text-[var(--text-secondary)]">
                {hoveredCell.rate}% • {hoveredCell.tasks} task{hoveredCell.tasks !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-[10px] text-[var(--text-tertiary)]">
        <span>Less</span>
        <div className="flex gap-[3px]">
          <div className="w-[13px] h-[13px] rounded-[3px] bg-[var(--bg-tertiary)]" />
          <div className="w-[13px] h-[13px] rounded-[3px] bg-indigo-900/40" />
          <div className="w-[13px] h-[13px] rounded-[3px] bg-indigo-700/50" />
          <div className="w-[13px] h-[13px] rounded-[3px] bg-indigo-500/60" />
          <div className="w-[13px] h-[13px] rounded-[3px] bg-indigo-400/80" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
