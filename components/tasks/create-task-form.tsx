"use client";

import { useState, useTransition } from "react";
import { createTask } from "@/lib/actions/tasks";
import { Plus, Loader2 } from "lucide-react";
import type { Goal } from "@/lib/db/schema";

function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface CreateTaskFormProps {
  goals?: Goal[];
  onClose?: () => void;
  compact?: boolean;
  defaultGoalId?: string;
}

export function CreateTaskForm({
  goals,
  onClose,
  compact = false,
  defaultGoalId,
}: CreateTaskFormProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<
    "low" | "medium" | "high" | "urgent"
  >("medium");
  const [goalId, setGoalId] = useState<string>(defaultGoalId ?? "");
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await createTask({
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          goalId: goalId || null,
          dueDate: dueDate || undefined,
        });
        setTitle("");
        setDescription("");
        setPriority("medium");
        setGoalId("");
        onClose?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create task");
      }
    });
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add a task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field flex-1"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending || !title.trim()}
          className="btn btn-primary px-3 py-2.5"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          Task Title *
        </label>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          disabled={isPending}
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          Description
        </label>
        <textarea
          placeholder="Add details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field min-h-[80px] resize-none"
          disabled={isPending}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as typeof priority)}
            className="input-field"
            disabled={isPending}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-field"
            disabled={isPending}
          />
        </div>
      </div>

      {goals && goals.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Link to Goal
          </label>
          <select
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
            className="input-field"
            disabled={isPending}
          >
            <option value="">No goal</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        {onClose && (
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending || !title.trim()}
          className="btn btn-primary"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Create Task
            </>
          )}
        </button>
      </div>
    </form>
  );
}
