"use client";

import { useState, useTransition } from "react";
import { toggleTask, deleteTask } from "@/lib/actions/tasks";
import { cn, getPriorityColor } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  Flag,
  Loader2,
  Target,
} from "lucide-react";
import type { Task } from "@/lib/db/schema";

interface TaskItemProps {
  task: Task;
  goalTitle?: string;
}

export function TaskItem({ task, goalTitle }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTask(task.id);
    });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    startTransition(async () => {
      await deleteTask({ id: task.id });
      setIsDeleting(false);
    });
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200",
        task.completed
          ? "bg-[var(--bg-tertiary)]/50 border-[var(--border-primary)] opacity-60"
          : "bg-[var(--bg-card)] border-[var(--border-primary)] hover:border-[var(--border-secondary)]",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="shrink-0 transition-transform hover:scale-110"
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 text-[var(--text-tertiary)] animate-spin" />
        ) : task.completed ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : (
          <Circle className="w-5 h-5 text-[var(--text-tertiary)] hover:text-indigo-400" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-sm font-medium truncate",
            task.completed && "line-through text-[var(--text-tertiary)]"
          )}
        >
          {task.title}
        </div>
        {task.description && (
          <div className="text-xs text-[var(--text-tertiary)] mt-0.5 truncate">
            {task.description}
          </div>
        )}
        <div className="flex items-center gap-3 mt-1.5">
          {/* Priority badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border",
              getPriorityColor(task.priority)
            )}
          >
            <Flag className="w-2.5 h-2.5" />
            {task.priority}
          </span>

          {/* Due date */}
          {task.dueDate && (
            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
              <Calendar className="w-2.5 h-2.5" />
              {task.dueDate}
            </span>
          )}

          {/* Goal link */}
          {goalTitle && (
            <span className="inline-flex items-center gap-1 text-[10px] text-violet-400">
              <Target className="w-2.5 h-2.5" />
              {goalTitle}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={isPending || isDeleting}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-rose-500/10 text-[var(--text-tertiary)] hover:text-rose-400"
        aria-label="Delete task"
      >
        {isDeleting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
