"use client";

import { cn, getStatusColor, getDaysUntil } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  Target,
  Clock,
  MoreHorizontal,
  Trash2,
  Brain,
  ArrowRight,
  CheckCircle,
  PauseCircle,
  AlertCircle,
} from "lucide-react";
import type { Goal } from "@/lib/db/schema";
import { useState, useTransition } from "react";
import { deleteGoal, updateGoal } from "@/lib/actions/goals";
import Link from "next/link";

interface GoalCardProps {
  goal: Goal;
  taskCount?: number;
}

export function GoalCard({ goal, taskCount = 0 }: GoalCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const daysLeft = goal.deadline ? getDaysUntil(goal.deadline) : null;

  const handleDelete = () => {
    startTransition(async () => {
      await deleteGoal({ id: goal.id });
    });
    setShowMenu(false);
    setShowDeleteConfirm(false);
  };

  const handleStatusChange = (
    status: "active" | "completed" | "paused" | "abandoned",
  ) => {
    startTransition(async () => {
      await updateGoal({
        id: goal.id,
        status,
        progress: status === "completed" ? 100 : undefined,
      });
    });
    setShowMenu(false);
  };

  return (
    <div
      className={cn(
        "card relative overflow-hidden group",
        isPending && "opacity-50 pointer-events-none",
      )}
    >
      {/* Color accent */}
      <div
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${goal.color}, ${goal.color}88, transparent)`,
        }}
      />

      {/* Clickable area */}
      <Link href={`/dashboard/goals/${goal.id}`} className="block p-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${goal.color}15` }}
            >
              <Target className="w-4 h-4" style={{ color: goal.color }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold group-hover:text-indigo-400 transition-colors">
                {goal.title}
              </h3>
              <span
                className={cn(
                  "text-[10px] font-medium px-1.5 py-0.5 rounded",
                  getStatusColor(goal.status),
                )}
              >
                {goal.status}
              </span>
            </div>
          </div>
        </div>

        {goal.description && (
          <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2">
            {goal.description}
          </p>
        )}

        <ProgressBar value={goal.progress} color="indigo" size="sm" />
      </Link>

      {/* Bottom action bar */}
      <div className="px-5 pb-4 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] text-[var(--text-tertiary)]">
          {daysLeft !== null && (
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {daysLeft > 0
                ? `${daysLeft}d left`
                : daysLeft === 0
                  ? "Due today"
                  : "Overdue"}
            </span>
          )}
          <span>{taskCount} tasks</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Coach shortcut */}
          <Link
            href={`/dashboard/goals/${goal.id}`}
            className="btn btn-ghost p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            title="Ask Goal Coach"
          >
            <Brain className="w-3.5 h-3.5 text-violet-400" />
          </Link>

          {/* Menu Button - Always Visible */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowMenu(!showMenu);
              }}
              className={cn(
                "btn btn-ghost p-1.5 rounded-lg transition-all",
                showMenu
                  ? "bg-[var(--bg-hover)]"
                  : "hover:bg-[var(--bg-hover)]",
              )}
              title="Goal options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 z-20 w-48 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-secondary)] rounded-xl shadow-xl animate-scale-in">
                  <Link
                    href={`/dashboard/goals/${goal.id}`}
                    className="w-full px-3 py-2.5 text-left text-xs hover:bg-[var(--bg-hover)] text-indigo-400 flex items-center gap-2 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleStatusChange("completed");
                    }}
                    className="w-full px-3 py-2.5 text-left text-xs hover:bg-[var(--bg-hover)] text-emerald-400 flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Mark Completed</span>
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange("paused");
                    }}
                    className="w-full px-3 py-2.5 text-left text-xs hover:bg-[var(--bg-hover)] text-amber-400 flex items-center gap-2 transition-colors"
                  >
                    <PauseCircle className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </button>
                  <hr className="my-1 border-[var(--border-primary)]" />
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2.5 text-left text-xs hover:bg-[var(--bg-hover)] text-rose-400 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[var(--bg-elevated)] border border-[var(--border-secondary)] rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-scale-in">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold mb-1">Delete Goal?</h3>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  Are you sure you want to delete "{goal.title}"? This action
                  cannot be undone.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn btn-ghost text-xs px-3 py-1.5 rounded-lg"
                    disabled={isPending}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn bg-rose-500 hover:bg-rose-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                    disabled={isPending}
                  >
                    <Trash2 className="w-3 h-3" />
                    {isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
