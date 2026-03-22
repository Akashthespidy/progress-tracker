import TasksClient from "@/components/tasks/tasks-client";
import { getTasks } from "@/lib/actions/tasks";
import { getGoals } from "@/lib/actions/goals";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";

function TasksSkeleton() {
  return (
    <PageContainer title="Tasks" subtitle="Loading...">
      <div className="space-y-4 animate-pulse">
        <div className="flex gap-3">
          <div className="h-10 flex-1 max-w-md skeleton rounded-lg" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-16 skeleton rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

async function TasksLoader() {
  const [tasks, goals] = await Promise.all([getTasks(), getGoals()]);
  return <TasksClient tasks={tasks} goals={goals} />;
}

export default function TasksPage() {
  return (
    <Suspense fallback={<TasksSkeleton />}>
      <TasksLoader />
    </Suspense>
  );
}
