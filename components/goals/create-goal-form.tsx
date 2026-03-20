"use client";

import { useState, useTransition } from "react";
import { createGoal } from "@/lib/actions/goals";
import { Plus, Loader2 } from "lucide-react";

const COLORS = [
  "#6366f1", "#8b5cf6", "#3b82f6", "#10b981",
  "#f59e0b", "#f43f5e", "#ec4899", "#06b6d4",
];

interface CreateGoalFormProps {
  onClose?: () => void;
}

export function CreateGoalForm({ onClose }: CreateGoalFormProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Goal title is required");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await createGoal({
          title: title.trim(),
          description: description.trim() || undefined,
          deadline: deadline || undefined,
          color,
        });
        setTitle("");
        setDescription("");
        setDeadline("");
        setColor(COLORS[0]);
        onClose?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create goal");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          Goal Title *
        </label>
        <input
          type="text"
          placeholder="What do you want to achieve?"
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
          placeholder="Describe your goal..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field min-h-[80px] resize-none"
          disabled={isPending}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          Deadline
        </label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="input-field"
          disabled={isPending}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          Color
        </label>
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-7 h-7 rounded-full transition-all border-2"
              style={{
                backgroundColor: c,
                borderColor: color === c ? "white" : "transparent",
                transform: color === c ? "scale(1.15)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>

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
              Create Goal
            </>
          )}
        </button>
      </div>
    </form>
  );
}
