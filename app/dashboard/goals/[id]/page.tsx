import { PageContainer } from "@/components/layout/page-container";
import { GoalCoachPanel } from "@/components/ai/goal-coach-panel";
import { TaskItem } from "@/components/tasks/task-item";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getGoalWithTasks } from "@/lib/actions/goals";
import { getGoalCoachingHistory } from "@/lib/actions/goal-coaching";
import {
  Target,
  Clock,
  CheckCircle,
  ListTodo,
  ArrowLeft,
  Calendar,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { cn, getStatusColor, getDaysUntil } from "@/lib/utils";
import { Suspense } from "react";
import { notFound } from "next/navigation";

interface GoalDetailPageProps {
  params: Promise<{ id: string }>;
}

function GoalDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 skeleton rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 skeleton rounded-xl" />
          <div className="h-64 skeleton rounded-xl" />
        </div>
        <div className="h-[480px] skeleton rounded-xl" />
      </div>
    </div>
  );
}

async function GoalDetailContent({ goalId }: { goalId: string }) {
  let data;
  try {
    data = await getGoalWithTasks(goalId);
  } catch {
    notFound();
  }

  const { goal, tasks } = data;
  const coachingHistory = await getGoalCoachingHistory(goalId, 20);

  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const daysLeft = goal.deadline ? getDaysUntil(goal.deadline) : null;
  const taskCompletionRate =
    tasks.length > 0
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0;

  return (
    <>
      {/* Back button */}
      <Link
        href="/dashboard/goals"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Goals
      </Link>

      {/* Goal Header */}
      <div className="card p-6 mb-6 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{
            background: `linear-gradient(90deg, ${goal.color}, ${goal.color}88, transparent)`,
          }}
        />
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${goal.color}15` }}
          >
            <Target className="w-6 h-6" style={{ color: goal.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold truncate">{goal.title}</h1>
              <span
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded capitalize shrink-0",
                  getStatusColor(goal.status),
                )}
              >
                {goal.status}
              </span>
            </div>
            {goal.description && (
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                {goal.description}
              </p>
            )}
            <div className="flex items-center gap-5 text-xs text-[var(--text-tertiary)]">
              {daysLeft !== null && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {daysLeft > 0
                    ? `${daysLeft} days left`
                    : daysLeft === 0
                      ? "Due today"
                      : `${Math.abs(daysLeft)} days overdue`}
                </span>
              )}
              {goal.deadline && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(goal.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
              <span className="flex items-center gap-1">
                <ListTodo className="w-3 h-3" />
                {tasks.length} tasks
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[var(--text-secondary)] font-medium">
              Progress
            </span>
            <span className="text-[var(--text-primary)] font-semibold">
              {goal.progress}%
            </span>
          </div>
          <ProgressBar value={goal.progress} color="indigo" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-[var(--bg-tertiary)] rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {completedTasks.length}
            </div>
            <div className="text-[10px] text-[var(--text-tertiary)]">
              Completed
            </div>
          </div>
          <div className="bg-[var(--bg-tertiary)] rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-amber-400 flex items-center justify-center gap-1">
              <ListTodo className="w-4 h-4" />
              {pendingTasks.length}
            </div>
            <div className="text-[10px] text-[var(--text-tertiary)]">
              Pending
            </div>
          </div>
          <div className="bg-[var(--bg-tertiary)] rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-indigo-400 flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {taskCompletionRate}%
            </div>
            <div className="text-[10px] text-[var(--text-tertiary)]">
              Task Rate
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Task */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-indigo-400" />
              Tasks for this Goal
            </h2>
            <div className="mb-4">
              <CreateTaskForm compact defaultGoalId={goalId} />
            </div>

            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div className="space-y-2 mb-4">
                <h3 className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  Pending ({pendingTasks.length})
                </h3>
                {pendingTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                  Completed ({completedTasks.length})
                </h3>
                {completedTasks.slice(0, 5).map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
                {completedTasks.length > 5 && (
                  <p className="text-xs text-[var(--text-muted)] text-center py-2">
                    +{completedTasks.length - 5} more completed
                  </p>
                )}
              </div>
            )}

            {tasks.length === 0 && (
              <div className="text-center py-10">
                <div className="text-3xl mb-2">📋</div>
                <p className="text-sm text-[var(--text-tertiary)]">
                  No tasks yet. Add one above to get started!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right — AI Coach */}
        <div>
          <GoalCoachPanel
            goalId={goalId}
            goalTitle={goal.title}
            goalColor={goal.color}
            initialHistory={coachingHistory}
          />
        </div>
      </div>
    </>
  );
}

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { id } = await params;

  return (
    <PageContainer>
      <Suspense fallback={<GoalDetailSkeleton />}>
        <GoalDetailContent goalId={id} />
      </Suspense>
    </PageContainer>
  );
}
