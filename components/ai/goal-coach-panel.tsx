"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { askGoalCoach } from "@/lib/actions/goal-coaching";
import {
  Brain,
  Send,
  Loader2,
  Sparkles,
  MessageCircle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GoalCoachingLog } from "@/lib/db/schema";

interface GoalCoachPanelProps {
  goalId: string;
  goalTitle: string;
  goalColor: string;
  initialHistory: GoalCoachingLog[];
}

interface ChatMessage {
  id: string;
  role: "user" | "coach";
  content: string;
  timestamp: Date;
}

/**
 * Renders coach response with visual formatting
 */
function FormattedCoachResponse({ text }: { text: string }) {
  const lines = text.split("\n");
  
  // Find first non-empty line for headline
  const firstNonEmptyIndex = lines.findIndex(line => line.trim());

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        if (i === firstNonEmptyIndex) {
          return (
            <div
              key={i}
              className="text-sm font-semibold text-[var(--text-primary)] pb-1.5 border-b border-[var(--border-primary)]"
            >
              {trimmed}
            </div>
          );
        }

        if (trimmed.startsWith("→")) {
          return (
            <div
              key={i}
              className="flex items-start gap-2 mt-1.5 px-3 py-2 rounded-lg bg-indigo-500/8 border border-indigo-500/15 text-indigo-300 text-xs"
            >
              <span className="shrink-0 mt-0.5">→</span>
              <span>{trimmed.slice(1).trim()}</span>
            </div>
          );
        }

        if (trimmed.startsWith("•")) {
          return (
            <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] pl-1">
              <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
              <span>{trimmed.slice(1).trim()}</span>
            </div>
          );
        }

        return (
          <p key={i} className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

const quickPrompts = [
  "What should I work on next?",
  "How can I speed up my progress?",
  "Create a plan for this week",
  "Am I on track to hit my deadline?",
];

export function GoalCoachPanel({
  goalId,
  goalTitle,
  goalColor,
  initialHistory,
}: GoalCoachPanelProps) {
  // Convert initial history into chat messages (reversed so oldest first)
  const initialMessages: ChatMessage[] = [];
  const reversed = [...initialHistory].reverse();
  for (const log of reversed) {
    initialMessages.push({
      id: `u-${log.id}`,
      role: "user",
      content: log.userMessage,
      timestamp: new Date(log.createdAt),
    });
    initialMessages.push({
      id: `c-${log.id}`,
      role: "coach",
      content: log.coachResponse,
      timestamp: new Date(log.createdAt),
    });
  }

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounterRef = useRef(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (message: string) => {
    if (!message.trim() || isPending) return;

    const userMsg: ChatMessage = {
      id: `u-${++idCounterRef.current}`,
      role: "user",
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    startTransition(async () => {
      const result = await askGoalCoach(goalId, message.trim());

      const coachMsg: ChatMessage = {
        id: `c-${++idCounterRef.current}`,
        role: "coach",
        content: result.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, coachMsg]);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="card overflow-hidden flex flex-col" style={{ minHeight: 480 }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-primary)] flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${goalColor}20` }}
        >
          <Brain className="w-4.5 h-4.5" style={{ color: goalColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            Goal Coach
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-400 border border-violet-500/20">
              AI
            </span>
          </h3>
          <p className="text-[10px] text-[var(--text-tertiary)] truncate">
            Coaching you on &ldquo;{goalTitle}&rdquo;
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
        style={{ maxHeight: 400 }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-violet-400" />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
              Ask your Goal Coach
            </p>
            <p className="text-xs text-[var(--text-tertiary)] text-center max-w-[250px] mb-5">
              Get AI-powered advice specific to this goal&apos;s tasks, progress, and deadline
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={isPending}
                  className="text-left px-3 py-2.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-xs text-[var(--text-secondary)] hover:border-indigo-500/30 hover:bg-indigo-500/5 hover:text-indigo-400 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "coach" && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${goalColor}20` }}
                  >
                    <Brain className="w-3.5 h-3.5" style={{ color: goalColor }} />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-4 py-3",
                    msg.role === "user"
                      ? "bg-indigo-500/15 border border-indigo-500/20 text-[var(--text-primary)]"
                      : "bg-[var(--bg-tertiary)] border border-[var(--border-primary)]"
                  )}
                >
                  {msg.role === "user" ? (
                    <p className="text-xs leading-relaxed">{msg.content}</p>
                  ) : (
                    <FormattedCoachResponse text={msg.content} />
                  )}
                  <div className="text-[9px] text-[var(--text-muted)] mt-2">
                    {msg.timestamp.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isPending && (
              <div className="flex gap-3 items-start">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${goalColor}20` }}
                >
                  <Brain className="w-3.5 h-3.5 animate-pulse" style={{ color: goalColor }} />
                </div>
                <div className="bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick prompts when there are messages */}
      {messages.length > 0 && (
        <div className="px-5 py-2 flex gap-1.5 overflow-x-auto border-t border-[var(--border-primary)]">
          {quickPrompts.slice(0, 3).map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              disabled={isPending}
              className="shrink-0 text-[10px] px-2.5 py-1.5 rounded-lg border border-[var(--border-primary)] text-[var(--text-tertiary)] hover:text-indigo-400 hover:border-indigo-500/30 transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-5 py-3 border-t border-[var(--border-primary)] flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your goal coach..."
          disabled={isPending}
          className="flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
        />
        <button
          type="submit"
          disabled={!input.trim() || isPending}
          className={cn(
            "p-2 rounded-lg transition-all",
            input.trim()
              ? "bg-indigo-500 text-white hover:bg-indigo-400"
              : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
          )}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
