import { PageContainer } from "@/components/layout/page-container";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressChart } from "@/components/charts/progress-chart";
import { AIMentorPanel } from "@/components/ai/ai-mentor-panel";
import { TaskItem } from "@/components/tasks/task-item";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { GoalCard } from "@/components/goals/goal-card";
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
  Flame,
  CheckCircle2,
  Target,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
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

  const greeting = getGreeting();
  const streakEmoji = getStreakEmoji(user.currentStreak);

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          {greeting},{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            {user.name?.split(" ")[0] ?? "Hero"}
          </span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {streakEmoji} {user.currentStreak} day streak • Let&apos;s keep the momentum going
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Current Streak"
          value={`${user.currentStreak} days`}
          subtitle={`Best: ${user.longestStreak} days`}
          icon={Flame}
          color="amber"
        />
        <StatCard
          label="Today's Progress"
          value={`${todayRate}%`}
          subtitle={`${todayCompleted}/${todayTotal} tasks`}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          label="Active Goals"
          value={goals.filter((g) => g.status === "active").length}
          subtitle={`${goals.length} total`}
          icon={Target}
          color="blue"
        />
        <StatCard
          label="Weekly Avg"
          value={`${weeklyStats.avgCompletionRate}%`}
          subtitle={`${weeklyStats.completedTasks} tasks done`}
          icon={TrendingUp}
          color="violet"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — Tasks + Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Chart */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Weekly Progress</h2>
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

            <div className="mb-4">
              <CreateTaskForm compact />
            </div>

            <div className="space-y-2">
              {todayTasks.length > 0 ? (
                todayTasks.slice(0, 5).map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))
              ) : (
                <div className="text-center py-8 text-sm text-[var(--text-tertiary)]">
                  No tasks for today. Add one above! ✨
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
              <h2 className="text-sm font-semibold">Active Goals</h2>
              <Link
                href="/dashboard/goals"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                All goals <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {goals
                .filter((g) => g.status === "active")
                .slice(0, 3)
                .map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              {goals.filter((g) => g.status === "active").length === 0 && (
                <div className="text-center py-6 text-sm text-[var(--text-tertiary)]">
                  No active goals yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
