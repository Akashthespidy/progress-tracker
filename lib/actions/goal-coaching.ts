"use server";

import { db } from "@/lib/db";
import { goals, tasks, goalCoachingLogs } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/services/user";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─── Ask Goal Coach ──────────────────────────────────────────────────────────
export async function askGoalCoach(goalId: string, userMessage: string) {
  const user = await getOrCreateUser();

  // Get goal details
  const goalResult = await db
    .select()
    .from(goals)
    .where(and(eq(goals.id, goalId), eq(goals.userId, user.id)))
    .limit(1);

  if (goalResult.length === 0) {
    throw new Error("Goal not found");
  }

  const goal = goalResult[0];

  // Get goal's tasks
  const goalTasks = await db
    .select({
      title: tasks.title,
      completed: tasks.completed,
      priority: tasks.priority,
      dueDate: tasks.dueDate,
    })
    .from(tasks)
    .where(and(eq(tasks.goalId, goalId), eq(tasks.userId, user.id)))
    .orderBy(desc(tasks.createdAt));

  // Get recent coaching history for context
  const recentCoaching = await db
    .select({
      userMessage: goalCoachingLogs.userMessage,
      coachResponse: goalCoachingLogs.coachResponse,
    })
    .from(goalCoachingLogs)
    .where(and(eq(goalCoachingLogs.goalId, goalId), eq(goalCoachingLogs.userId, user.id)))
    .orderBy(desc(goalCoachingLogs.createdAt))
    .limit(5);

  // Build context
  const completedCount = goalTasks.filter((t) => t.completed).length;
  const totalCount = goalTasks.length;
  const pendingTasks = goalTasks.filter((t) => !t.completed);
  const completedTasks = goalTasks.filter((t) => t.completed);

  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const systemPrompt = `You are "Zero", a focused AI goal coach. You are coaching the user on ONE specific goal.

GOAL CONTEXT:
• Goal: "${goal.title}"
• Description: ${goal.description || "No description provided"}
• Progress: ${goal.progress}%
• Status: ${goal.status}
• Deadline: ${goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "No deadline set"}${daysLeft !== null ? ` (${daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? "Due today" : `${Math.abs(daysLeft)} days overdue`})` : ""}
• Tasks: ${completedCount}/${totalCount} completed

PENDING TASKS:
${pendingTasks.length > 0 ? pendingTasks.map((t) => `• ${t.title} [${t.priority}]${t.dueDate ? ` — due ${t.dueDate}` : ""}`).join("\n") : "• No pending tasks"}

COMPLETED TASKS:
${completedTasks.length > 0 ? completedTasks.slice(0, 10).map((t) => `• ${t.title} [${t.priority}]`).join("\n") : "• None yet"}

RULES:
1. Focus ONLY on this specific goal. Do not give general productivity advice.
2. Be direct, specific, and actionable. Reference the goal's tasks, progress, and deadline.
3. Keep responses between 100-200 words.
4. Format your response:
   - Start with a one-line headline (with one emoji)
   - Then 1-2 short paragraphs or bullet points using "•"
   - End with one actionable next step starting with "→"
   - Do NOT use markdown (no **, #, numbered lists)
5. If the user asks what to do next, suggest specific tasks or actions based on their current progress.
6. If the user asks for a plan, break it into 3-5 concrete steps they can take this week.
7. Address the user warmly but stay focused and professional.`;

  // Build messages with conversation history
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  // Add recent conversation history (oldest first)
  const reversedHistory = [...recentCoaching].reverse();
  for (const entry of reversedHistory) {
    messages.push({ role: "user", content: entry.userMessage });
    messages.push({ role: "assistant", content: entry.coachResponse });
  }

  // Add current user message
  messages.push({ role: "user", content: userMessage });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response =
      completion.choices[0]?.message?.content ??
      "I couldn't generate a response right now. Please try again.";

    // Save to coaching logs
    await db.insert(goalCoachingLogs).values({
      userId: user.id,
      goalId,
      userMessage: userMessage.slice(0, 500),
      coachResponse: response,
    });

    revalidatePath(`/dashboard/goals/${goalId}`);

    return { response };
  } catch (error) {
    console.error("Goal Coach error:", error);
    return {
      response:
        "⚠️ Connection Issue\n\nI'm having trouble connecting right now. Try again in a moment — your goal progress is still being tracked! 💪",
    };
  }
}

// ─── Get Goal Coaching History ───────────────────────────────────────────────
export async function getGoalCoachingHistory(goalId: string, limit: number = 20) {
  const user = await getOrCreateUser();

  return db
    .select()
    .from(goalCoachingLogs)
    .where(and(eq(goalCoachingLogs.goalId, goalId), eq(goalCoachingLogs.userId, user.id)))
    .orderBy(desc(goalCoachingLogs.createdAt))
    .limit(limit);
}
