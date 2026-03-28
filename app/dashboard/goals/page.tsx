import type { Metadata } from "next";
import GoalsClient from "@/components/goals/goals-client";
import { getGoals } from "@/lib/actions/goals";
import { getTasks } from "@/lib/actions/tasks";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = { title: "Goals" };

function GoalsSkeleton() {
  return (
    <PageContainer title="Goals" subtitle="Loading...">
      <div className="space-y-6 animate-pulse">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-20 skeleton rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

async function GoalsLoader() {
  const [goals, tasks] = await Promise.all([getGoals(), getTasks()]);
  return <GoalsClient goals={goals} tasks={tasks} />;
}

export default function GoalsPage() {
  return (
    <Suspense fallback={<GoalsSkeleton />}>
      <GoalsLoader />
    </Suspense>
  );
}
