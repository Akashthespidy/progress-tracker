import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressChart } from "@/components/charts/progress-chart";
import { AIMentorPanel } from "@/components/ai/ai-mentor-panel";
import { TaskItem } from "@/components/tasks/task-item";
import { GoalCard } from "@/components/goals/goal-card";
import { Button } from "@/components/ui/button";
import { getOrCreateUser } from "@/lib/services/user";
import { getTodayTasks } from "@/lib/actions/tasks";
import { getGoals } from "@/lib/actions/goals";
import { getProgressHistory, getWeeklyStats } from "@/lib/actions/analytics";
import { getLatestAILog } from "@/lib/actions/ai";
import {
  getGreeting,
  getStreakEmoji,
  calculateCompletionRate,
} from "@/lib/utils";
import {
  ArrowRight,
  Plus,
  Target,
  Brain,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Dashboard" };

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-12 w-64 skeleton rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 skeleton rounded-xl" />
        ))}
      </div>
    </div>
  );
}

async function DashboardContent() {
  const [user, todayTasks, goals, progressHistory, weeklyStats, latestAI] =
    await Promise.all([
      getOrCreateUser(),
      getTodayTasks(),
      getGoals(),
      getProgressHistory(7),
      getWeeklyStats(),
      getLatestAILog(),
    ]);

  const todayCompleted = todayTasks.filter((t) => t.completed).length;
  const todayTotal = todayTasks.length;
  const todayRate = calculateCompletionRate(todayCompleted, todayTotal);

  const activeGoals = goals.filter((g) => g.status === "active");
  const greeting = getGreeting();
  const streakEmoji = getStreakEmoji(user.currentStreak);

  // Motivational messages based on progress
  const getMotivation = () => {
    if (todayRate === 100 && todayTotal > 0) return "🎯 Perfect day! All tasks done!";
    if (todayRate >= 75) return "Almost there — finish strong!";
    if (todayRate >= 50) return "Solid progress. Keep pushing!";
    if (todayTotal === 0) return "Plan your day — add some tasks!";
    return "Let's get started!";
  };

  return (
    <>
      {/* Header with Greeting */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {greeting},{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                {user.name?.split(" ")[0] ?? "Hero"}
              </span>
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {streakEmoji} {user.currentStreak} day streak • {getMotivation()}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/dashboard/tasks"
              className="btn btn-ghost text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              New Task
            </Link>
            <Link
              href="/dashboard/goals"
              className="btn btn-ghost text-xs gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              New Goal
            </Link>
            <Link
              href="/dashboard/mentor"
              className="btn btn-ghost text-xs gap-1.5"
            >
              <Brain className="w-3.5 h-3.5" />
              Ask Zero
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Current Streak"
          value={`${user.currentStreak} days`}
          subtitle={`Best: ${user.longestStreak} days`}
          iconName="flame"
          color="amber"
        />
        <StatCard
          label="Today's Progress"
          value={`${todayRate}%`}
          subtitle={`${todayCompleted}/${todayTotal} tasks`}
          iconName="check-circle"
          color="emerald"
        />
        <StatCard
          label="Active Goals"
          value={activeGoals.length}
          subtitle={`${goals.length} total`}
          iconName="target"
          color="blue"
        />
        <StatCard
          label="Weekly Avg"
          value={`${weeklyStats.avgCompletionRate}%`}
          subtitle={`${weeklyStats.completedTasks} tasks done`}
          iconName="trending-up"
          color="violet"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — Tasks + Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Chart */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Weekly Progress
              </h2>
              <Link
                href="/dashboard/analytics"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <ProgressChart data={progressHistory} type="area" />
          </div>

          {/* Today's Tasks */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">
                Today&apos;s Tasks{" "}
                <span className="text-[var(--text-tertiary)]">
                  ({todayCompleted}/{todayTotal})
                </span>
              </h2>
              <Link
                href="/dashboard/tasks"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                All tasks <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Today's progress bar */}
            {todayTotal > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] mb-1.5">
                  <span>{todayCompleted} of {todayTotal} completed</span>
                  <span className="font-medium text-[var(--text-secondary)]">{todayRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                    style={{ width: `${todayRate}%` }}
                  />
                </div>
              </div>
            )}

            {/* Create Task CTA */}
            {todayTotal === 0 && (
              <div className="mb-6">
                <Link href="/dashboard/tasks" className="w-full block">
                  <Button
                    className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Task
                  </Button>
                </Link>
              </div>
            )}

            <div className="space-y-2">
              {todayTasks.length > 0 ? (
                <>
                  {todayTasks.slice(0, 6).map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                  {todayTasks.length > 6 && (
                    <Link
                      href="/dashboard/tasks"
                      className="block text-center text-xs text-indigo-400 hover:text-indigo-300 py-2 transition-colors"
                    >
                      +{todayTasks.length - 6} more tasks →
                    </Link>
                  )}
                  <Link href="/dashboard/tasks" className="block mt-3">
                    <Button
                      variant="outline"
                      className="w-full border-indigo-500/50 hover:border-indigo-400 hover:bg-indigo-500/10 text-indigo-400"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add More Tasks
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">✨</div>
                  <p className="text-sm text-[var(--text-tertiary)] mb-4">
                    No tasks for today. Let&apos;s get started!
                  </p>
                  <Link href="/dashboard/tasks" className="inline-block">
                    <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Task
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column — AI + Goals */}
        <div className="space-y-6">
          {/* AI Mentor */}
          <AIMentorPanel initialResponse={latestAI?.response} compact />

          {/* Goals */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                Active Goals
              </h2>
              <Link
                href="/dashboard/goals"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                All goals <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {activeGoals.slice(0, 3).map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
              {activeGoals.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-sm text-[var(--text-tertiary)] mb-3">
                    No active goals yet
                  </p>
                  <Link href="/dashboard/goals" className="btn btn-secondary text-xs">
                    <Plus className="w-3 h-3" />
                    Create Goal
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <PageContainer>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </PageContainer>
  );
}
