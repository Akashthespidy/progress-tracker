import { PageContainer } from "@/components/layout/page-container";
import { AIMentorPanel } from "@/components/ai/ai-mentor-panel";
import { getLatestAILog, getAIHistory } from "@/lib/actions/ai";
import { Brain, Clock, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function MentorPage() {
  const [latestLog, history] = await Promise.all([
    getLatestAILog(),
    getAIHistory(10),
  ]);

  return (
    <PageContainer
      title="AI Mentor — Zero"
      subtitle="Your personal AI coach powered by your real data"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main AI Panel */}
        <div className="lg:col-span-2">
          <AIMentorPanel initialResponse={latestLog?.response} />
        </div>

        {/* History */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
              Recent Insights
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {history.length > 0 ? (
                history.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-xs"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-medium capitalize",
                          log.type === "daily_feedback" && "bg-blue-500/10 text-blue-400",
                          log.type === "suggestion" && "bg-amber-500/10 text-amber-400",
                          log.type === "motivation" && "bg-rose-500/10 text-rose-400",
                          log.type === "goal_review" && "bg-emerald-500/10 text-emerald-400"
                        )}
                      >
                        {log.type.replace("_", " ")}
                      </span>
                      <span className="text-[var(--text-tertiary)]">
                        {new Date(log.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-[var(--text-secondary)] line-clamp-3 whitespace-pre-wrap">
                      {log.response}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-[var(--text-tertiary)]">
                  <MessageSquare className="w-6 h-6 mx-auto mb-2" />
                  No insights yet. Request one!
                </div>
              )}
            </div>
          </div>

          {/* How it works */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-400" />
              How Zero Works
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                Analyzes your last 10 days of activity data
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                Reviews all your tasks, completions & streaks
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                Considers your active goals and deadlines
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                Gives honest, data-driven feedback — never generic
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
