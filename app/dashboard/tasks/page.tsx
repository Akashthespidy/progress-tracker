import TasksClient from "@/components/tasks/tasks-client";
import { getTasks } from "@/lib/actions/tasks";
import { getGoals } from "@/lib/actions/goals";

export default async function TasksPage() {
  const [tasks, goals] = await Promise.all([getTasks(), getGoals()]);

  return <TasksClient tasks={tasks} goals={goals} />;
}
