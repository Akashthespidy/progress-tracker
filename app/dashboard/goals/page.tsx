import GoalsClient from "@/components/goals/goals-client";
import { getGoals } from "@/lib/actions/goals";
import { getTasks } from "@/lib/actions/tasks";

export default async function GoalsPage() {
  const [goals, tasks] = await Promise.all([getGoals(), getTasks()]);

  return <GoalsClient goals={goals} tasks={tasks} />;
}
