import { PageContainer } from "@/components/layout/page-container";
import { AIMentorPanel } from "@/components/ai/ai-mentor-panel";
import { getLatestAILog, getAIHistory } from "@/lib/actions/ai";
import { Brain, Clock, MessageSquare, Zap, Database, Target, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

function MentorSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      <div className="lg:col-span-2 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 skeleton rounded-xl" />
          ))}
        </div>
        <div className="h-72 skeleton rounded-xl" />
      </div>
      <div className="space-y-4">
        <div className="h-64 skeleton rounded-xl" />
        <div className="h-44 skeleton rounded-xl" />
      </div>
    </div>
  );
}

function getFirstLine(text: string): string {
  const first = text.split("\n").find((l) => l.trim().length > 0);
  return first?.trim().slice(0, 80) ?? "AI Insight";
}

async function MentorContent() {
  const [latestLog, history] = await Promise.all([
    getLatestAILog(),
    getAIHistory(10),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main AI Panel */}
      <div className="lg:col-span-2">
        <AIMentorPanel initialResponse={latestLog?.response} />
      </div>

      {/* Right sidebar */}
      <div className="space-y-4">
        {/* History */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
            Recent Insights
            {history.length > 0 && (
              <span className="ml-auto text-[10px] text-[var(--text-tertiary)] font-normal">
                {history.length} total
              </span>
            )}
          </h3>
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {history.length > 0 ? (
              history.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] hover:border-[var(--border-secondary)] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-medium capitalize",
                        log.type === "daily_feedback" && "bg-blue-500/10 text-blue-400",
                        log.type === "suggestion" && "bg-amber-500/10 text-amber-400",
                        log.type === "motivation" && "bg-rose-500/10 text-rose-400",
                        log.type === "goal_review" && "bg-emerald-500/10 text-emerald-400"
                      )}
                    >
                      {log.type.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)] ml-auto">
                      {new Date(log.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-medium truncate">
                    {getFirstLine(log.response)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <MessageSquare className="w-6 h-6 mx-auto mb-2 text-[var(--text-tertiary)]" />
                <p className="text-sm text-[var(--text-tertiary)]">
                  No insights yet
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Select a type and click to generate
                </p>
              </div>
            )}
          </div>
        </div>

        {/* How it works */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-violet-400" />
            How Zero Works
          </h3>
          <div className="space-y-3">
            {[
              { icon: Database, text: "Pulls your last 10 days of progress data", color: "text-blue-400" },
              { icon: Target, text: "Reviews all tasks, goals, and streaks", color: "text-emerald-400" },
              { icon: Zap, text: "Calculates your average completion rate", color: "text-amber-400" },
              { icon: Sparkles, text: "Generates honest, data-driven feedback", color: "text-violet-400" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0">
                  <step.icon className={cn("w-3.5 h-3.5", step.color)} />
                </div>
                <span className="text-xs text-[var(--text-secondary)]">{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MentorPage() {
  return (
    <PageContainer
      title="AI Mentor — Zero"
      subtitle="Your personal AI coach powered by your real data"
    >
      <Suspense fallback={<MentorSkeleton />}>
        <MentorContent />
      </Suspense>
    </PageContainer>
  );
}
