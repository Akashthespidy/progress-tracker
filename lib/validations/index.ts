import { z } from "zod/v4";

// ─── Task Schemas ────────────────────────────────────────────────────────────
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Title must be under 200 characters"),
  description: z
    .string()
    .max(1000, "Description must be under 1000 characters")
    .optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  goalId: z.string().uuid().optional().nullable(),
  dueDate: z.string().optional(),
});

export const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  goalId: z.string().uuid().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export const deleteTaskSchema = z.object({
  id: z.string().uuid(),
});

// ─── Goal Schemas ────────────────────────────────────────────────────────────
export const createGoalSchema = z.object({
  title: z
    .string()
    .min(1, "Goal title is required")
    .max(200, "Title must be under 200 characters"),
  description: z
    .string()
    .max(2000, "Description must be under 2000 characters")
    .optional(),
  deadline: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color format").default("#6366f1"),
});

export const updateGoalSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  deadline: z.string().optional().nullable(),
  progress: z.number().min(0).max(100).optional(),
  status: z.enum(["active", "completed", "paused", "abandoned"]).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export const deleteGoalSchema = z.object({
  id: z.string().uuid(),
});

// ─── AI Schemas ──────────────────────────────────────────────────────────────
export const aiMentorRequestSchema = z.object({
  type: z.enum(["daily_feedback", "suggestion", "motivation", "goal_review"]).default("daily_feedback"),
});

// ─── Inferred Types ──────────────────────────────────────────────────────────
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type AIMentorRequest = z.infer<typeof aiMentorRequestSchema>;
