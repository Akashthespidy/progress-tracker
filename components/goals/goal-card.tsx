"use client";

import { cn, getStatusColor, getDaysUntil } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Target, Clock, MoreHorizontal, Trash2, Edit3 } from "lucide-react";
import type { Goal } from "@/lib/db/schema";
import { useState, useTransition } from "react";
import { deleteGoal, updateGoal } from "@/lib/actions/goals";

interface GoalCardProps {
  goal: Goal;
  taskCount?: number;
}

export function GoalCard({ goal, taskCount = 0 }: GoalCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isPending, startTransition] = useTransition();

  const daysLeft = goal.deadline ? getDaysUntil(goal.deadline) : null;

  const handleDelete = () => {
    startTransition(async () => {
      await deleteGoal({ id: goal.id });
    });
    setShowMenu(false);
  };

  const handleStatusChange = (status: "active" | "completed" | "paused" | "abandoned") => {
    startTransition(async () => {
      await updateGoal({ id: goal.id, status, progress: status === "completed" ? 100 : undefined });
    });
    setShowMenu(false);
  };

  return (
    <div
      className={cn(
        "card p-5 relative overflow-hidden group",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      {/* Color accent */}
      <div
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${goal.color}, ${goal.color}88, transparent)`,
        }}
      />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${goal.color}15` }}
          >
            <Target className="w-4 h-4" style={{ color: goal.color }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">{goal.title}</h3>
            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", getStatusColor(goal.status))}>
              {goal.status}
            </span>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="btn btn-ghost p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-8 z-20 w-44 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-secondary)] rounded-xl shadow-xl animate-scale-in">
                <button
                  onClick={() => handleStatusChange("completed")}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--bg-hover)] text-emerald-400"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => handleStatusChange("paused")}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--bg-hover)] text-amber-400"
                >
                  Pause
                </button>
                <hr className="my-1 border-[var(--border-primary)]" />
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--bg-hover)] text-rose-400 flex items-center gap-2"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {goal.description && (
        <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2">
          {goal.description}
        </p>
      )}

      <ProgressBar value={goal.progress} color="indigo" size="sm" />

      <div className="flex items-center justify-between mt-3 text-[10px] text-[var(--text-tertiary)]">
        {daysLeft !== null && (
          <span className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? "Due today" : "Overdue"}
          </span>
        )}
        <span>{taskCount} tasks</span>
      </div>
    </div>
  );
}
