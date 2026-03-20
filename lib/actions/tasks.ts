"use server";

import { db } from "@/lib/db";
import { tasks, progressLogs, users } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/services/user";
import {
  createTaskSchema,
  updateTaskSchema,
  deleteTaskSchema,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { getTodayDateString } from "@/lib/utils";

// ─── Get Tasks ───────────────────────────────────────────────────────────────
export async function getTasks() {
  const user = await getOrCreateUser();

  return db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, user.id))
    .orderBy(desc(tasks.createdAt));
}

export async function getTodayTasks() {
  const user = await getOrCreateUser();
  const today = getTodayDateString();

  return db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, user.id),
        eq(tasks.dueDate, today)
      )
    )
    .orderBy(desc(tasks.createdAt));
}

// ─── Create Task ─────────────────────────────────────────────────────────────
export async function createTask(input: unknown) {
  const user = await getOrCreateUser();
  const parsed = createTaskSchema.parse(input);

  const result = await db
    .insert(tasks)
    .values({
      userId: user.id,
      title: parsed.title,
      description: parsed.description ?? null,
      priority: parsed.priority,
      goalId: parsed.goalId ?? null,
      dueDate: parsed.dueDate ?? getTodayDateString(),
    })
    .returning();

  await updateProgressLog(user.id);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");

  return result[0];
}

// ─── Update Task ─────────────────────────────────────────────────────────────
export async function updateTask(input: unknown) {
  const user = await getOrCreateUser();
  const parsed = updateTaskSchema.parse(input);

  const existing = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, parsed.id), eq(tasks.userId, user.id)))
    .limit(1);

  if (existing.length === 0) {
    throw new Error("Task not found");
  }

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (parsed.title !== undefined) updateData.title = parsed.title;
  if (parsed.description !== undefined) updateData.description = parsed.description;
  if (parsed.priority !== undefined) updateData.priority = parsed.priority;
  if (parsed.goalId !== undefined) updateData.goalId = parsed.goalId;
  if (parsed.dueDate !== undefined) updateData.dueDate = parsed.dueDate;
  if (parsed.completed !== undefined) {
    updateData.completed = parsed.completed;
    updateData.completedAt = parsed.completed ? new Date() : null;
  }

  const result = await db
    .update(tasks)
    .set(updateData)
    .where(eq(tasks.id, parsed.id))
    .returning();

  // Update streak if task was completed
  if (parsed.completed) {
    await updateStreak(user.id);
  }

  await updateProgressLog(user.id);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");

  return result[0];
}

// ─── Delete Task ─────────────────────────────────────────────────────────────
export async function deleteTask(input: unknown) {
  const user = await getOrCreateUser();
  const parsed = deleteTaskSchema.parse(input);

  await db
    .delete(tasks)
    .where(and(eq(tasks.id, parsed.id), eq(tasks.userId, user.id)));

  await updateProgressLog(user.id);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");

  return { success: true };
}

// ─── Toggle Task ─────────────────────────────────────────────────────────────
export async function toggleTask(taskId: string) {
  const user = await getOrCreateUser();

  const existing = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)))
    .limit(1);

  if (existing.length === 0) {
    throw new Error("Task not found");
  }

  const newCompleted = !existing[0].completed;

  const result = await db
    .update(tasks)
    .set({
      completed: newCompleted,
      completedAt: newCompleted ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId))
    .returning();

  if (newCompleted) {
    await updateStreak(user.id);
  }

  await updateProgressLog(user.id);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");

  return result[0];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function updateProgressLog(userId: string) {
  const today = getTodayDateString();

  const allTodayTasks = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.dueDate, today)
      )
    );

  const totalTasks = allTodayTasks.length;
  const completedTasks = allTodayTasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Upsert progress log
  const existing = await db
    .select()
    .from(progressLogs)
    .where(
      and(eq(progressLogs.userId, userId), eq(progressLogs.date, today))
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(progressLogs)
      .set({
        tasksCompleted: completedTasks,
        totalTasks,
        completionRate,
      })
      .where(eq(progressLogs.id, existing[0].id));
  } else {
    await db.insert(progressLogs).values({
      userId,
      date: today,
      tasksCompleted: completedTasks,
      totalTasks,
      completionRate,
    });
  }
}

async function updateStreak(userId: string) {
  const today = getTodayDateString();

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (user.length === 0) return;

  const currentUser = user[0];
  const lastActive = currentUser.lastActiveDate;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak = currentUser.currentStreak;

  if (lastActive === today) {
    // Already active today, no change
    return;
  } else if (lastActive === yesterdayStr) {
    // Consecutive day
    newStreak += 1;
  } else {
    // Streak broken, start fresh
    newStreak = 1;
  }

  await db
    .update(users)
    .set({
      currentStreak: newStreak,
      longestStreak: sql`GREATEST(${users.longestStreak}, ${newStreak})`,
      lastActiveDate: today,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}
