"use server";

import { db } from "@/lib/db";
import { aiLogs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
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
      response: "⚠️ Connection Issue\n\nI am having trouble connecting right now. Your progress is being tracked — keep going! 💪",
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
  const basePersonality = `You are "Zero", a strict but supportive AI productivity mentor. You help users go from Zero to Hero.

RULES YOU MUST FOLLOW:
1. Every response MUST be based entirely on the user's real data provided below. NEVER give generic advice.
2. Be direct, concise, and data-driven. Reference specific numbers, dates, tasks, and goals.
3. Keep responses between 150-250 words.
4. Use emojis sparingly (max 3-4 per response).

FORMATTING — you MUST structure EVERY response with this EXACT format:
- Start with a short, punchy headline (one line, no markdown, with one emoji)
- Then a blank line
- Then 2-3 short paragraphs OR a short intro paragraph followed by bullet points
- Use "•" for bullet points, NOT dashes or asterisks
- End with one actionable takeaway sentence on its own line, starting with "→"
- Do NOT use markdown bold (**), headers (#), or any other markdown syntax
- Do NOT use numbered lists`;

  switch (type) {
    case "daily_feedback":
      return `${basePersonality}

YOUR TASK: Give daily feedback on today's performance. Be honest — praise wins, call out missed tasks. Compare to their recent average. End with one specific suggestion for tomorrow.`;

    case "suggestion":
      return `${basePersonality}

YOUR TASK: Analyze patterns in their recent data and suggest 3-4 concrete, actionable improvements. Focus on what they can change today or this week. Reference their weakest days or lowest completion rates.`;

    case "motivation":
      return `${basePersonality}

YOUR TASK: Motivate the user based on their real progress. Reference their streak, specific completed tasks, and goal progress. Make them feel the momentum. Be energetic but genuine — not cheesy.`;

    case "goal_review":
      return `${basePersonality}

YOUR TASK: Review each of the user's goals. For each goal, state whether they are on track, behind, or ahead based on progress % and deadline. Suggest specific next steps or milestones for each goal.`;

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
  const userName = user.name?.split(" ")[0] ?? "User";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  // Calculate averages
  const logsWithData = activity.progressLogs.filter((l) => l.totalTasks > 0);
  const avgRate = logsWithData.length > 0
    ? Math.round(logsWithData.reduce((sum, l) => sum + l.completionRate, 0) / logsWithData.length)
    : 0;
  const totalCompleted = activity.progressLogs.reduce((sum, l) => sum + l.tasksCompleted, 0);
  const totalTasks = activity.progressLogs.reduce((sum, l) => sum + l.totalTasks, 0);

  const progressSummary = activity.progressLogs
    .map((log) => `  ${log.date}: ${log.tasksCompleted}/${log.totalTasks} tasks (${log.completionRate}%)`)
    .join("\n");

  const pendingTasks = activity.recentTasks.filter((t) => !t.completed);
  const completedTasks = activity.recentTasks.filter((t) => t.completed);

  const pendingSummary = pendingTasks
    .slice(0, 8)
    .map((t) => `  • ${t.title} [${t.priority}]${t.dueDate ? ` — due ${t.dueDate}` : ""}`)
    .join("\n");

  const completedSummary = completedTasks
    .slice(0, 8)
    .map((t) => `  • ${t.title} [${t.priority}]`)
    .join("\n");

  const goalSummary = userGoals
    .map(
      (g) =>
        `  • "${g.title}" — ${g.status} — ${g.progress}% done${
          g.deadline ? ` — deadline: ${new Date(g.deadline).toLocaleDateString()}` : ""
        }`
    )
    .join("\n");

  return `User: ${userName}
Date: ${today}
Current Streak: ${user.currentStreak} days (Best: ${user.longestStreak} days)
10-Day Average Completion: ${avgRate}%
Total: ${totalCompleted}/${totalTasks} tasks completed in last 10 days

DAILY PROGRESS (Last 10 Days):
${progressSummary || "  No data yet."}

PENDING TASKS (${pendingTasks.length}):
${pendingSummary || "  None pending."}

COMPLETED TASKS (${completedTasks.length}):
${completedSummary || "  None completed recently."}

GOALS (${userGoals.length}):
${goalSummary || "  No goals set yet."}

Now give me ${type.replace(/_/g, " ")} based on this data. Address me as "${userName}".`;
}
