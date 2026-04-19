"use client";

import { useAtom } from "jotai";
import { PageContainer } from "@/components/layout/page-container";
import { TaskItem } from "@/components/tasks/task-item";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import {
  createTaskModalAtom,
  taskFilterAtom,
  priorityFilterAtom,
  taskSearchAtom,
} from "@/lib/store/atoms";
import { cn } from "@/lib/utils";
import { Plus, CheckSquare, Search } from "lucide-react";
import type { Task, Goal } from "@/lib/db/schema";

interface TasksClientProps {
  tasks: Task[];
  goals: Goal[];
}

export default function TasksClient({ tasks, goals }: TasksClientProps) {
  const [showModal, setShowModal] = useAtom(createTaskModalAtom);
  const [filter, setFilter] = useAtom(taskFilterAtom);
  const [priorityFilter, setPriorityFilter] = useAtom(priorityFilterAtom);
  const [search, setSearch] = useAtom(taskSearchAtom);

  const today = new Date().toISOString().split("T")[0];

  // Apply filters
  let filtered = tasks;

  if (search) {
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filter === "today") {
    filtered = filtered.filter((t) => t.dueDate === today);
  } else if (filter === "completed") {
    filtered = filtered.filter((t) => t.completed);
  } else if (filter === "pending") {
    filtered = filtered.filter((t) => !t.completed);
  }

  if (priorityFilter !== "all") {
    filtered = filtered.filter((t) => t.priority === priorityFilter);
  }

  const completedCount = filtered.filter((t) => t.completed).length;
  const pendingCount = filtered.filter((t) => !t.completed).length;

  return (
    <PageContainer
      title="Tasks"
      subtitle={`${completedCount} completed • ${pendingCount} pending`}
      action={
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      }
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "today", "completed", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "btn text-xs px-3 py-1.5 capitalize",
                filter === f ? "btn-primary" : "btn-ghost"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)}
          className="input-field w-auto text-xs"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((task) => {
            const linkedGoal = goals.find((g) => g.id === task.goalId);
            return (
              <TaskItem
                key={task.id}
                task={task}
                goalTitle={linkedGoal?.title}
              />
            );
          })
        ) : (
          <EmptyState
            icon={<CheckSquare className="w-6 h-6" />}
            title="No tasks found"
            description="Create your first task to start tracking your progress."
            action={
              <button onClick={() => setShowModal(true)} className="btn btn-primary">
                <Plus className="w-4 h-4" />
                Create Task
              </button>
            }
          />
        )}
      </div>

      {/* Create Task Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Task"
      >
        <CreateTaskForm
          goals={goals}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </PageContainer>
  );
}
