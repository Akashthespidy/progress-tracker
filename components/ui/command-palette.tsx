"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  BarChart3,
  Brain,
  Settings,
  Search,
  Command,
} from "lucide-react";

const commands = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Navigate" },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare, group: "Navigate" },
  { label: "Goals", href: "/dashboard/goals", icon: Target, group: "Navigate" },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3, group: "Navigate" },
  { label: "AI Mentor", href: "/dashboard/mentor", icon: Brain, group: "Navigate" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, group: "Navigate" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }

      if (!open) return;

      if (e.key === "Escape") {
        setOpen(false);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter" && filtered[selectedIndex]) {
        router.push(filtered[selectedIndex].href);
        setOpen(false);
      }
    },
    [open, filtered, selectedIndex, router]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open && query) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIndex(0);
    }
  }, [query, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-primary)]">
          <Search className="w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
            autoFocus
          />
          <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] text-[var(--text-tertiary)] border border-[var(--border-primary)] rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length > 0 ? (
            filtered.map((cmd, index) => (
              <button
                key={cmd.href}
                onClick={() => {
                  router.push(cmd.href);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  selectedIndex === index
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                )}
              >
                <cmd.icon className="w-4 h-4 shrink-0" />
                <span>{cmd.label}</span>
                <span className="ml-auto text-[10px] text-[var(--text-tertiary)]">{cmd.group}</span>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-[var(--text-tertiary)]">
              No results found
            </div>
          )}
        </div>

        <div className="border-t border-[var(--border-primary)] px-4 py-2 flex items-center gap-4 text-[10px] text-[var(--text-tertiary)]">
          <span className="flex items-center gap-1">
            <kbd className="border border-[var(--border-primary)] rounded px-1 py-0.5">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-[var(--border-primary)] rounded px-1 py-0.5">↵</kbd>
            Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-[var(--border-primary)] rounded px-1 py-0.5">esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}

export function CommandPaletteTrigger() {
  return (
    <button
      onClick={() => {
        const event = new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:border-[var(--border-secondary)] transition-all cursor-pointer"
    >
      <Command className="w-3 h-3" />
      <span className="hidden lg:inline">Search...</span>
      <kbd className="hidden md:inline-flex text-[10px] border border-[var(--border-primary)] rounded px-1 py-0.5 ml-2">
        ⌘K
      </kbd>
    </button>
  );
}
