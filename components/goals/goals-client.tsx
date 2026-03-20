"use client";

import { useAtom } from "jotai";
import { PageContainer } from "@/components/layout/page-container";
import { GoalCard } from "@/components/goals/goal-card";
import { CreateGoalForm } from "@/components/goals/create-goal-form";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import {
  createGoalModalAtom,
  goalStatusFilterAtom,
} from "@/lib/store/atoms";
import { cn } from "@/lib/utils";
import { Plus, Target } from "lucide-react";
import type { Goal, Task } from "@/lib/db/schema";

interface GoalsClientProps {
  goals: Goal[];
  tasks: Task[];
}

export default function GoalsClient({ goals, tasks }: GoalsClientProps) {
  const [showModal, setShowModal] = useAtom(createGoalModalAtom);
  const [statusFilter, setStatusFilter] = useAtom(goalStatusFilterAtom);

  const filtered =
    statusFilter === "all"
      ? goals
      : goals.filter((g) => g.status === statusFilter);

  return (
    <PageContainer
      title="Goals"
      subtitle={`${goals.filter((g) => g.status === "active").length} active goals`}
      action={
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      }
    >
      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {(["all", "active", "completed", "paused", "abandoned"] as const).map(
          (s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "btn text-xs px-3 py-1.5 capitalize",
                statusFilter === s ? "btn-primary" : "btn-ghost"
              )}
            >
              {s}
            </button>
          )
        )}
      </div>

      {/* Goals Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((goal) => {
            const taskCount = tasks.filter(
              (t) => t.goalId === goal.id
            ).length;
            return (
              <GoalCard key={goal.id} goal={goal} taskCount={taskCount} />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Target className="w-6 h-6" />}
          title="No goals found"
          description="Set ambitious goals and track your progress towards achieving them."
          action={
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Create Goal
            </button>
          }
        />
      )}

      {/* Create Goal Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Goal"
      >
        <CreateGoalForm onClose={() => setShowModal(false)} />
      </Modal>
    </PageContainer>
  );
}
