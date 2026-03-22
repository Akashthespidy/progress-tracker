"use server";

import { db } from "@/lib/db";
import { progressLogs, tasks } from "@/lib/db/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/services/user";
import { cache } from "react";

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

// ─── Cached raw progress log fetch (deduplicates within a single request) ────
const fetchProgressLogs = cache(async (userId: string, days: number) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split("T")[0];

  return db
    .select()
    .from(progressLogs)
    .where(
      and(
        eq(progressLogs.userId, userId),
        gte(progressLogs.date, startDateStr)
      )
    )
    .orderBy(progressLogs.date);
});

// ─── Get Progress for Last N Days ────────────────────────────────────────────
export async function getProgressHistory(days: number = 7): Promise<DailyProgress[]> {
  const user = await getOrCreateUser();
  const logs = await fetchProgressLogs(user.id, days);

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

// ─── Get Weekly Stats (reuses cached progress logs) ──────────────────────────
export async function getWeeklyStats(): Promise<WeeklyStats> {
  const user = await getOrCreateUser();
  const logs = await fetchProgressLogs(user.id, 7);

  // Sort by completionRate desc to find best day
  const sorted = [...logs].sort((a, b) => b.completionRate - a.completionRate);

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
    bestDay: sorted[0]?.date ?? null,
    bestRate: sorted[0]?.completionRate ?? 0,
  };
}

// ─── Get Heatmap Data ────────────────────────────────────────────────────────
export async function getHeatmapData(days: number = 90) {
  const user = await getOrCreateUser();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split("T")[0];
  const endDateStr = new Date().toISOString().split("T")[0];

  return db
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
}

// ─── Get Activity for AI Context ─────────────────────────────────────────────
export async function getRecentActivity(days: number = 10) {
  const user = await getOrCreateUser();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Run both queries in parallel
  const [logs, recentTasks] = await Promise.all([
    fetchProgressLogs(user.id, days),
    db
      .select({
        title: tasks.title,
        completed: tasks.completed,
        priority: tasks.priority,
        dueDate: tasks.dueDate,
      })
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, user.id),
          gte(tasks.createdAt, startDate)
        )
      )
      .orderBy(desc(tasks.createdAt)),
  ]);

  return {
    progressLogs: logs,
    recentTasks,
    currentStreak: user.currentStreak,
  };
}
