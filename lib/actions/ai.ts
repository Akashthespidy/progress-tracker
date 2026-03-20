"use server";

import { db } from "@/lib/db";
import { aiLogs, users } from "@/lib/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { getOrCreateUser } from "@/lib/services/user";
import { getRecentActivity } from "@/lib/actions/analytics";
import { getGoals } from "@/lib/actions/goals";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type MentorType = "daily_feedback" | "suggestion" | "motivation" | "goal_review";

// ─── Get AI Mentor Response ──────────────────────────────────────────────────
export async function getAIMentorResponse(type: MentorType = "daily_feedback") {
  const user = await getOrCreateUser();

  // Gather context
  const activity = await getRecentActivity(10);
  const userGoals = await getGoals();

  const systemPrompt = buildSystemPrompt(type);
  const userPrompt = buildUserPrompt(user, activity, userGoals, type);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content ?? "I could not generate a response right now. Please try again.";

    // Save to AI logs
    await db.insert(aiLogs).values({
      userId: user.id,
      prompt: userPrompt.slice(0, 500),
      response,
      type,
    });

    revalidatePath("/dashboard");

    return { response, type };
  } catch (error) {
    console.error("AI Mentor error:", error);
    return {
      response: "I am having trouble connecting right now. Your progress is being tracked — keep going! 💪",
      type,
    };
  }
}

// ─── Get Latest AI Log ──────────────────────────────────────────────────────
export async function getLatestAILog() {
  const user = await getOrCreateUser();

  const log = await db
    .select()
    .from(aiLogs)
    .where(eq(aiLogs.userId, user.id))
    .orderBy(desc(aiLogs.createdAt))
    .limit(1);

  return log[0] ?? null;
}

// ─── Get AI History ──────────────────────────────────────────────────────────
export async function getAIHistory(limit: number = 10) {
  const user = await getOrCreateUser();

  return db
    .select()
    .from(aiLogs)
    .where(eq(aiLogs.userId, user.id))
    .orderBy(desc(aiLogs.createdAt))
    .limit(limit);
}

// ─── Prompt Builders ─────────────────────────────────────────────────────────
function buildSystemPrompt(type: MentorType): string {
  const basePersonality = `You are a strict but supportive AI mentor named "Zero" — a productivity coach who helps users go from 0 to Hero. 
You are direct, data-driven, and motivational. You don't give generic advice — every word is based on the user's actual data.
You speak concisely and use formatting:
- Use **bold** for emphasis
- Use bullet points for lists
- Use emojis sparingly but effectively
- Keep responses under 300 words`;

  switch (type) {
    case "daily_feedback":
      return `${basePersonality}
Your job now: Give daily feedback on today's performance. Be honest. Praise wins. Call out laziness. Suggest improvements for tomorrow.`;

    case "suggestion":
      return `${basePersonality}
Your job now: Analyze patterns and suggest concrete, actionable improvements. Focus on what the user can change immediately.`;

    case "motivation":
      return `${basePersonality}
Your job now: Motivate the user based on their real progress. Reference their streak, goals, and recent wins. Make them feel they can conquer anything.`;

    case "goal_review":
      return `${basePersonality}
Your job now: Review the user's goals. Assess if they are on track, behind, or ahead. Suggest goal adjustments or new milestones.`;

    default:
      return basePersonality;
  }
}

interface ActivityData {
  progressLogs: Array<{
    date: string;
    tasksCompleted: number;
    totalTasks: number;
    completionRate: number;
  }>;
  recentTasks: Array<{
    title: string;
    completed: boolean;
    priority: string;
    dueDate: string | null;
  }>;
  currentStreak: number;
}

interface GoalData {
  title: string;
  status: string;
  progress: number;
  deadline: Date | null;
}

function buildUserPrompt(
  user: { name: string | null; currentStreak: number; longestStreak: number },
  activity: ActivityData,
  userGoals: GoalData[],
  type: MentorType
): string {
  const userName = user.name ?? "User";

  const progressSummary = activity.progressLogs
    .map((log) => `  ${log.date}: ${log.tasksCompleted}/${log.totalTasks} tasks (${log.completionRate}%)`)
    .join("\n");

  const taskSummary = activity.recentTasks
    .slice(0, 15)
    .map((t) => `  - [${t.completed ? "✓" : "✗"}] ${t.title} (${t.priority})`)
    .join("\n");

  const goalSummary = userGoals
    .map(
      (g) =>
        `  - "${g.title}" — ${g.status} — ${g.progress}% done${
          g.deadline ? ` — deadline: ${new Date(g.deadline).toLocaleDateString()}` : ""
        }`
    )
    .join("\n");

  return `User: ${userName}
Current Streak: ${user.currentStreak} days
Longest Streak: ${user.longestStreak} days

📊 Progress (Last 10 Days):
${progressSummary || "  No progress data yet."}

📝 Recent Tasks:
${taskSummary || "  No tasks yet."}

🎯 Goals:
${goalSummary || "  No goals set yet."}

Give me ${type.replace("_", " ")} based on this data.`;
}
