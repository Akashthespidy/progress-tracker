import { atom } from "jotai";

// ─── Sidebar State ───────────────────────────────────────────────────────────
export const sidebarOpenAtom = atom(true);
export const sidebarCollapsedAtom = atom(false);

// ─── Active Navigation ──────────────────────────────────────────────────────
export const activeNavAtom = atom("dashboard");

// ─── Task Filters ────────────────────────────────────────────────────────────
export type TaskFilter = "all" | "today" | "completed" | "pending";
export type PriorityFilter = "all" | "low" | "medium" | "high" | "urgent";

export const taskFilterAtom = atom<TaskFilter>("today");
export const priorityFilterAtom = atom<PriorityFilter>("all");
export const taskSearchAtom = atom("");

// ─── Goal Filters ────────────────────────────────────────────────────────────
export type GoalStatusFilter = "all" | "active" | "completed" | "paused" | "abandoned";
export const goalStatusFilterAtom = atom<GoalStatusFilter>("all");

// ─── Modal States ────────────────────────────────────────────────────────────
export const createTaskModalAtom = atom(false);
export const createGoalModalAtom = atom(false);
export const aiPanelOpenAtom = atom(false);

// ─── AI Mentor State ─────────────────────────────────────────────────────────
export const aiLoadingAtom = atom(false);
export const aiResponseAtom = atom<string | null>(null);

// ─── Theme ───────────────────────────────────────────────────────────────────
export const themeAtom = atom<"dark" | "light">("dark");

// ─── Command Palette ─────────────────────────────────────────────────────────
export const commandPaletteOpenAtom = atom(false);
