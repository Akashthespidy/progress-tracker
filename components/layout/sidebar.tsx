"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  BarChart3,
  Brain,
  ChevronLeft,
  ChevronRight,
  Zap,
  Settings,
  LogOut,
} from "lucide-react";
import { sidebarCollapsedAtom } from "@/lib/store/atoms";
import { cn } from "@/lib/utils";
import { CommandPaletteTrigger } from "@/components/ui/command-palette";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    label: "Goals",
    href: "/dashboard/goals",
    icon: Target,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "AI Mentor",
    href: "/dashboard/mentor",
    icon: Brain,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" });
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] flex flex-col transition-all duration-300 z-40",
        collapsed ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-base font-semibold tracking-tight whitespace-nowrap animate-fade-in">
              Zero<span className="text-indigo-400">Hero</span>
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-ghost p-1.5 rounded-lg shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Command palette trigger */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <CommandPaletteTrigger />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-r-full" />
              )}
              <item.icon
                className={cn(
                  "w-[18px] h-[18px] shrink-0 transition-transform",
                  isActive && "text-indigo-400",
                  "group-hover:scale-105"
                )}
              />
              {!collapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
              {item.label === "AI Mentor" && !collapsed && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] font-semibold rounded bg-violet-500/15 text-violet-400 border border-violet-500/20">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-[var(--border-primary)] space-y-1">
        {/* Settings */}
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
            pathname === "/dashboard/settings"
              ? "bg-indigo-500/10 text-indigo-400"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
          )}
        >
          <Settings className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-rose-400 hover:bg-rose-500/8 transition-all"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        {/* Profile */}
        {user && (
          <div
            className={cn(
              "mt-2 pt-2 border-t border-[var(--border-primary)]",
              collapsed ? "flex justify-center" : ""
            )}
          >
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg transition-all group",
                collapsed
                  ? "p-1.5 hover:bg-[var(--bg-hover)] rounded-lg"
                  : "px-3 py-2.5 hover:bg-[var(--bg-hover)] w-full"
              )}
            >
              {user.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.imageUrl}
                  alt={user.fullName ?? "Profile"}
                  className="w-8 h-8 rounded-lg object-cover shrink-0 ring-1 ring-[var(--border-primary)] group-hover:ring-indigo-500/40 transition-all"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 text-sm font-bold text-white">
                  {user.fullName?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
              {!collapsed && (
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate text-[var(--text-primary)]">
                    {user.fullName ?? "User"}
                  </div>
                  <div className="text-[10px] text-[var(--text-tertiary)] truncate">
                    {user.primaryEmailAddress?.emailAddress ?? ""}
                  </div>
                </div>
              )}
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
