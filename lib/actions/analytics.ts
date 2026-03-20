"use server";

import { db } from "@/lib/db";
import { progressLogs, tasks } from "@/lib/db/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/services/user";

export interface DailyProgress {
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  completionRate: number;
}

export interface WeeklyStats {
  totalTasks: number;
  completedTasks: number;
  avgCompletionRate: number;
  bestDay: string | null;
  bestRate: number;
}

// ─── Get Progress for Last N Days ────────────────────────────────────────────
export async function getProgressHistory(days: number = 7): Promise<DailyProgress[]> {
  const user = await getOrCreateUser();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split("T")[0];

  const logs = await db
    .select()
    .from(progressLogs)
    .where(
      and(
        eq(progressLogs.userId, user.id),
        gte(progressLogs.date, startDateStr)
      )
    )
    .orderBy(progressLogs.date);

  // Fill in missing dates with zeroes
  const result: DailyProgress[] = [];
  const logMap = new Map(logs.map((l) => [l.date, l]));

  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const log = logMap.get(dateStr);

    result.push({
      date: dateStr,
      tasksCompleted: log?.tasksCompleted ?? 0,
      totalTasks: log?.totalTasks ?? 0,
      completionRate: log?.completionRate ?? 0,
    });
  }

  return result;
}

// ─── Get Weekly Stats ────────────────────────────────────────────────────────
export async function getWeeklyStats(): Promise<WeeklyStats> {
  const user = await getOrCreateUser();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const startDateStr = startDate.toISOString().split("T")[0];

  const logs = await db
    .select()
    .from(progressLogs)
    .where(
      and(
        eq(progressLogs.userId, user.id),
        gte(progressLogs.date, startDateStr)
      )
    )
    .orderBy(desc(progressLogs.completionRate));

  const totalTasks = logs.reduce((sum, l) => sum + l.totalTasks, 0);
  const completedTasks = logs.reduce((sum, l) => sum + l.tasksCompleted, 0);
  const avgCompletionRate =
    logs.length > 0
      ? Math.round(logs.reduce((sum, l) => sum + l.completionRate, 0) / logs.length)
      : 0;

  return {
    totalTasks,
    completedTasks,
    avgCompletionRate,
    bestDay: logs[0]?.date ?? null,
    bestRate: logs[0]?.completionRate ?? 0,
  };
}

// ─── Get Heatmap Data ────────────────────────────────────────────────────────
export async function getHeatmapData(days: number = 90) {
  const user = await getOrCreateUser();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split("T")[0];
  const endDateStr = new Date().toISOString().split("T")[0];

  const logs = await db
    .select({
      date: progressLogs.date,
      completionRate: progressLogs.completionRate,
      tasksCompleted: progressLogs.tasksCompleted,
    })
    .from(progressLogs)
    .where(
      and(
        eq(progressLogs.userId, user.id),
        gte(progressLogs.date, startDateStr),
        lte(progressLogs.date, endDateStr)
      )
    )
    .orderBy(progressLogs.date);

  return logs;
}

// ─── Get Activity for AI Context ─────────────────────────────────────────────
export async function getRecentActivity(days: number = 10) {
  const user = await getOrCreateUser();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split("T")[0];

  // Get progress logs
  const logs = await db
    .select()
    .from(progressLogs)
    .where(
      and(
        eq(progressLogs.userId, user.id),
        gte(progressLogs.date, startDateStr)
      )
    )
    .orderBy(desc(progressLogs.date));

  // Get recent tasks
  const recentTasks = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, user.id),
        gte(tasks.createdAt, startDate)
      )
    )
    .orderBy(desc(tasks.createdAt));

  return {
    progressLogs: logs,
    recentTasks,
    currentStreak: user.currentStreak,
  };
}
