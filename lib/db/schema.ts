import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  date,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  imageUrl: text("image_url"),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastActiveDate: date("last_active_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Goals ───────────────────────────────────────────────────────────────────
export const goals = pgTable(
  "goals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    description: text("description"),
    deadline: timestamp("deadline", { withTimezone: true }),
    progress: integer("progress").default(0).notNull(),
    status: text("status", { enum: ["active", "completed", "paused", "abandoned"] })
      .default("active")
      .notNull(),
    color: text("color").default("#6366f1").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("goals_user_id_idx").on(table.userId),
    index("goals_status_idx").on(table.userId, table.status),
  ]
);

// ─── Tasks ───────────────────────────────────────────────────────────────────
export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    goalId: uuid("goal_id").references(() => goals.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description"),
    completed: boolean("completed").default(false).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    priority: text("priority", { enum: ["low", "medium", "high", "urgent"] })
      .default("medium")
      .notNull(),
    dueDate: date("due_date"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("tasks_user_id_idx").on(table.userId),
    index("tasks_due_date_idx").on(table.userId, table.dueDate),
    index("tasks_goal_id_idx").on(table.goalId),
  ]
);

// ─── Progress Logs ───────────────────────────────────────────────────────────
export const progressLogs = pgTable(
  "progress_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    date: date("date").notNull(),
    tasksCompleted: integer("tasks_completed").default(0).notNull(),
    totalTasks: integer("total_tasks").default(0).notNull(),
    completionRate: integer("completion_rate").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("progress_logs_user_date_idx").on(table.userId, table.date),
  ]
);

// ─── AI Logs (General Mentor) ────────────────────────────────────────────────
export const aiLogs = pgTable(
  "ai_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    prompt: text("prompt").notNull(),
    response: text("response").notNull(),
    type: text("type", { enum: ["daily_feedback", "suggestion", "motivation", "goal_review"] })
      .default("daily_feedback")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("ai_logs_user_id_idx").on(table.userId),
  ]
);

// ─── Goal Coaching Logs (Per-Goal AI Coach) ──────────────────────────────────
export const goalCoachingLogs = pgTable(
  "goal_coaching_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    goalId: uuid("goal_id")
      .references(() => goals.id, { onDelete: "cascade" })
      .notNull(),
    userMessage: text("user_message").notNull(),
    coachResponse: text("coach_response").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("goal_coaching_goal_id_idx").on(table.goalId),
    index("goal_coaching_user_id_idx").on(table.userId),
  ]
);

// ─── Relations ───────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  goals: many(goals),
  progressLogs: many(progressLogs),
  aiLogs: many(aiLogs),
  goalCoachingLogs: many(goalCoachingLogs),
}));

export const goalsRelations = relations(goals, ({ one, many }) => ({
  user: one(users, { fields: [goals.userId], references: [users.id] }),
  tasks: many(tasks),
  coachingLogs: many(goalCoachingLogs),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  goal: one(goals, { fields: [tasks.goalId], references: [goals.id] }),
}));

export const progressLogsRelations = relations(progressLogs, ({ one }) => ({
  user: one(users, { fields: [progressLogs.userId], references: [users.id] }),
}));

export const aiLogsRelations = relations(aiLogs, ({ one }) => ({
  user: one(users, { fields: [aiLogs.userId], references: [users.id] }),
}));

export const goalCoachingLogsRelations = relations(goalCoachingLogs, ({ one }) => ({
  user: one(users, { fields: [goalCoachingLogs.userId], references: [users.id] }),
  goal: one(goals, { fields: [goalCoachingLogs.goalId], references: [goals.id] }),
}));

// ─── Types ───────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type ProgressLog = typeof progressLogs.$inferSelect;
export type NewProgressLog = typeof progressLogs.$inferInsert;
export type AILog = typeof aiLogs.$inferSelect;
export type NewAILog = typeof aiLogs.$inferInsert;
export type GoalCoachingLog = typeof goalCoachingLogs.$inferSelect;
export type NewGoalCoachingLog = typeof goalCoachingLogs.$inferInsert;
