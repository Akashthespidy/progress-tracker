import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GoalNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-xl font-bold mb-2">Goal not found</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          This goal may have been deleted or the link is invalid.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/dashboard/goals" className="btn btn-primary">
            <ArrowLeft className="w-4 h-4" />
            All Goals
          </Link>
          <Link href="/dashboard" className="btn btn-secondary">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
