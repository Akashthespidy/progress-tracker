"use client";

import { useState, useTransition } from "react";
import { getAIMentorResponse } from "@/lib/actions/ai";
import { Brain, Sparkles, Loader2, RefreshCw, MessageSquare, Lightbulb, Flame, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIMentorPanelProps {
  initialResponse?: string | null;
  compact?: boolean;
}

const mentorTypes = [
  { type: "daily_feedback" as const, label: "Daily Feedback", icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-500/10" },
  { type: "suggestion" as const, label: "Suggestions", icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-500/10" },
  { type: "motivation" as const, label: "Motivation", icon: Flame, color: "text-rose-400", bg: "bg-rose-500/10" },
  { type: "goal_review" as const, label: "Goal Review", icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

/**
 * Renders AI response text with visual formatting:
 * - Lines starting with "→" get an action style
 * - Lines starting with "•" get bullet styling
 * - First non-empty line gets treated as a headline
 * - Everything else renders as paragraphs
 */
function FormattedResponse({ text }: { text: string }) {
  const lines = text.split("\n");
  let headlineRendered = false;

  return (
    <div className="space-y-2.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Skip empty lines (they create spacing naturally via the container)
        if (!trimmed) return null;

        // Headline — first non-empty line
        if (!headlineRendered) {
          headlineRendered = true;
          return (
            <div key={i} className="text-sm font-semibold text-[var(--text-primary)] pb-1 border-b border-[var(--border-primary)]">
              {trimmed}
            </div>
          );
        }

        // Actionable takeaway line (→)
        if (trimmed.startsWith("→")) {
          return (
            <div
              key={i}
              className="flex items-start gap-2 mt-2 px-3 py-2.5 rounded-lg bg-indigo-500/8 border border-indigo-500/15 text-indigo-300 text-sm"
            >
              <span className="shrink-0 mt-0.5">→</span>
              <span>{trimmed.slice(1).trim()}</span>
            </div>
          );
        }

        // Bullet point (•)
        if (trimmed.startsWith("•")) {
          return (
            <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)] pl-1">
              <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
              <span>{trimmed.slice(1).trim()}</span>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={i} className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export function AIMentorPanel({ initialResponse, compact = false }: AIMentorPanelProps) {
  const [response, setResponse] = useState<string | null>(initialResponse ?? null);
  const [activeType, setActiveType] = useState<typeof mentorTypes[number]["type"]>("daily_feedback");
  const [isPending, startTransition] = useTransition();

  const handleGenerate = (type: typeof mentorTypes[number]["type"]) => {
    setActiveType(type);
    startTransition(async () => {
      const result = await getAIMentorResponse(type);
      setResponse(result.response);
    });
  };

  if (compact) {
    return (
      <div className="card p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-indigo-600/5" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">AI Mentor — Zero</h3>
              <p className="text-[10px] text-[var(--text-tertiary)]">Your personal coach</p>
            </div>
            <button
              onClick={() => handleGenerate(activeType)}
              disabled={isPending}
              className="ml-auto btn btn-ghost p-1.5 rounded-lg"
              aria-label="Refresh AI insight"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {response ? (
            <div className="max-h-[280px] overflow-y-auto">
              <FormattedResponse text={response.slice(0, 400) + (response.length > 400 ? "..." : "")} />
            </div>
          ) : (
            <button
              onClick={() => handleGenerate("daily_feedback")}
              disabled={isPending}
              className="btn btn-secondary w-full text-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing your data...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Get AI Insight
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Type selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {mentorTypes.map((mt) => (
          <button
            key={mt.type}
            onClick={() => handleGenerate(mt.type)}
            disabled={isPending}
            className={cn(
              "card card-interactive p-3 flex flex-col items-center gap-2 text-xs font-medium transition-all",
              activeType === mt.type && "border-indigo-500/30 bg-indigo-500/5"
            )}
          >
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", mt.bg)}>
              <mt.icon className={cn("w-4.5 h-4.5", mt.color)} />
            </div>
            {mt.label}
          </button>
        ))}
      </div>

      {/* Response area */}
      <div className="card p-6 relative overflow-hidden min-h-[200px]">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-indigo-600/5" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[var(--border-primary)]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center animate-pulse-glow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold">Zero — AI Mentor</h3>
              <p className="text-xs text-[var(--text-tertiary)]">
                Analyzing your real progress data
              </p>
            </div>
            {response && (
              <button
                onClick={() => handleGenerate(activeType)}
                disabled={isPending}
                className="btn btn-ghost p-2 rounded-lg"
                aria-label="Regenerate response"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {isPending ? (
            <div className="space-y-3 py-6">
              <div className="flex items-center gap-3 justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                <span className="text-sm text-[var(--text-secondary)]">
                  Analyzing your last 10 days of activity...
                </span>
              </div>
              {/* Skeleton to show something is loading */}
              <div className="space-y-2 pt-4">
                <div className="h-5 w-3/4 skeleton rounded" />
                <div className="h-4 w-full skeleton rounded" />
                <div className="h-4 w-5/6 skeleton rounded" />
                <div className="h-4 w-4/5 skeleton rounded" />
                <div className="h-10 w-full skeleton rounded-lg mt-2" />
              </div>
            </div>
          ) : response ? (
            <FormattedResponse text={response} />
          ) : (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-violet-400" />
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-1 font-medium">
                Ready when you are
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mb-4">
                Select a mentoring type above to get personalized insights
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
