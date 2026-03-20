"use server";

import { db } from "@/lib/db";
import { goals, tasks } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/services/user";
import {
  createGoalSchema,
  updateGoalSchema,
  deleteGoalSchema,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

// ─── Get Goals ───────────────────────────────────────────────────────────────
export async function getGoals() {
  const user = await getOrCreateUser();

  return db
    .select()
    .from(goals)
    .where(eq(goals.userId, user.id))
    .orderBy(desc(goals.createdAt));
}

export async function getGoalWithTasks(goalId: string) {
  const user = await getOrCreateUser();

  const goal = await db
    .select()
    .from(goals)
    .where(and(eq(goals.id, goalId), eq(goals.userId, user.id)))
    .limit(1);

  if (goal.length === 0) {
    throw new Error("Goal not found");
  }

  const goalTasks = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.goalId, goalId), eq(tasks.userId, user.id)))
    .orderBy(desc(tasks.createdAt));

  return { goal: goal[0], tasks: goalTasks };
}

// ─── Create Goal ─────────────────────────────────────────────────────────────
export async function createGoal(input: unknown) {
  const user = await getOrCreateUser();
  const parsed = createGoalSchema.parse(input);

  const result = await db
    .insert(goals)
    .values({
      userId: user.id,
      title: parsed.title,
      description: parsed.description ?? null,
      deadline: parsed.deadline ? new Date(parsed.deadline) : null,
      color: parsed.color,
    })
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/goals");

  return result[0];
}

// ─── Update Goal ─────────────────────────────────────────────────────────────
export async function updateGoal(input: unknown) {
  const user = await getOrCreateUser();
  const parsed = updateGoalSchema.parse(input);

  const existing = await db
    .select()
    .from(goals)
    .where(and(eq(goals.id, parsed.id), eq(goals.userId, user.id)))
    .limit(1);

  if (existing.length === 0) {
    throw new Error("Goal not found");
  }

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (parsed.title !== undefined) updateData.title = parsed.title;
  if (parsed.description !== undefined) updateData.description = parsed.description;
  if (parsed.deadline !== undefined) {
    updateData.deadline = parsed.deadline ? new Date(parsed.deadline) : null;
  }
  if (parsed.progress !== undefined) updateData.progress = parsed.progress;
  if (parsed.status !== undefined) updateData.status = parsed.status;
  if (parsed.color !== undefined) updateData.color = parsed.color;

  const result = await db
    .update(goals)
    .set(updateData)
    .where(eq(goals.id, parsed.id))
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/goals");

  return result[0];
}

// ─── Delete Goal ─────────────────────────────────────────────────────────────
export async function deleteGoal(input: unknown) {
  const user = await getOrCreateUser();
  const parsed = deleteGoalSchema.parse(input);

  // Set tasks goalId to null first
  await db
    .update(tasks)
    .set({ goalId: null })
    .where(
      and(eq(tasks.goalId, parsed.id), eq(tasks.userId, user.id))
    );

  await db
    .delete(goals)
    .where(and(eq(goals.id, parsed.id), eq(goals.userId, user.id)));

  revalidatePath("/dashboard");
  revalidatePath("/goals");

  return { success: true };
}
