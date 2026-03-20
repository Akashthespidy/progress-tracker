import { PageContainer } from "@/components/layout/page-container";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressChart } from "@/components/charts/progress-chart";
import { CompletionHeatmap } from "@/components/charts/completion-heatmap";
import {
  getProgressHistory,
  getWeeklyStats,
  getHeatmapData,
} from "@/lib/actions/analytics";
import { getOrCreateUser } from "@/lib/services/user";
import {
  Flame,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Trophy,
  BarChart3,
} from "lucide-react";

export default async function AnalyticsPage() {
  const [user, progressHistory, weeklyHistory, weeklyStats, heatmapData] =
    await Promise.all([
      getOrCreateUser(),
      getProgressHistory(7),
      getProgressHistory(30),
      getWeeklyStats(),
      getHeatmapData(90),
    ]);

  return (
    <PageContainer
      title="Analytics"
      subtitle="Track your progress and identify patterns"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Current Streak"
          value={`${user.currentStreak} days`}
          subtitle={`Longest: ${user.longestStreak} days`}
          icon={Flame}
          color="amber"
        />
        <StatCard
          label="Weekly Average"
          value={`${weeklyStats.avgCompletionRate}%`}
          subtitle={`${weeklyStats.completedTasks} of ${weeklyStats.totalTasks} tasks`}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          label="Best Day"
          value={weeklyStats.bestDay
            ? new Date(weeklyStats.bestDay).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })
            : "—"
          }
          subtitle={`${weeklyStats.bestRate}% completion`}
          icon={Trophy}
          color="violet"
        />
        <StatCard
          label="Total Completed"
          value={weeklyStats.completedTasks}
          subtitle="This week"
          icon={CheckCircle2}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Chart */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            Weekly Progress
          </h2>
          <ProgressChart data={progressHistory} type="area" />
        </div>

        {/* Monthly Chart */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-violet-400" />
            30-Day Overview
          </h2>
          <ProgressChart data={weeklyHistory} type="bar" />
        </div>
      </div>

      {/* Heatmap */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          90-Day Activity Heatmap
        </h2>
        <CompletionHeatmap data={heatmapData} />
      </div>
    </PageContainer>
  );
}
