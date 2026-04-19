import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = { title: "Settings" };
import { getOrCreateUser } from "@/lib/services/user";
import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  User,
  Shield,
  Keyboard,
  Zap,
  Mail,
  Calendar,
  Flame,
} from "lucide-react";
import { Suspense } from "react";

async function SettingsContent() {
  const user = await getOrCreateUser();

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile Summary */}
      <div className="card p-6">
        <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" />
          Profile
        </h2>
        <div className="flex items-center gap-4 mb-5">
          {user.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt={user.name ?? "Profile"}
              className="w-14 h-14 rounded-xl object-cover border border-[var(--border-secondary)]"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl font-bold text-white">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <div>
            <div className="font-semibold text-base">{user.name ?? "User"}</div>
            <div className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
              <Mail className="w-3 h-3" />
              {user.email}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--bg-tertiary)] rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4" />
              {user.currentStreak}
            </div>
            <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Current Streak</div>
          </div>
          <div className="bg-[var(--bg-tertiary)] rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-violet-400">{user.longestStreak}</div>
            <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Best Streak</div>
          </div>
          <div className="bg-[var(--bg-tertiary)] rounded-lg p-3 text-center">
            <div className="text-xs font-medium text-[var(--text-secondary)] flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3" />
              {memberSince}
            </div>
            <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Member Since</div>
          </div>
        </div>
      </div>

      {/* Account & Sign Out */}
      <div className="card p-6">
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Account &amp; Security
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Your account is securely managed through Clerk. You can sign out from
          the button below or from the sidebar.
        </p>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20 mb-5">
          <Shield className="w-3 h-3" />
          Account protected with OAuth 2.0
        </div>

        {/* Sign Out */}
        <div className="pt-4 border-t border-[var(--border-primary)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">Sign out of your account</div>
              <div className="text-xs text-[var(--text-tertiary)] mt-0.5">You will be redirected to the landing page</div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="card p-6">
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-blue-400" />
          Keyboard Shortcuts
        </h2>
        <div className="space-y-2">
          {[
            { keys: ["⌘", "K"], description: "Open command palette" },
            { keys: ["Esc"], description: "Close modals & palette" },
          ].map((shortcut) => (
            <div
              key={shortcut.description}
              className="flex items-center justify-between py-2 border-b border-[var(--border-primary)] last:border-0"
            >
              <span className="text-sm text-[var(--text-secondary)]">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="px-2 py-0.5 text-[10px] font-medium bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded text-[var(--text-secondary)]"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="card p-6">
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-violet-400" />
          About Zero to Hero
        </h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
          Zero to Hero is a self-improvement operating system designed to help
          you track daily tasks, set long-term goals, visualize your progress,
          and receive AI-powered mentorship based on your real data.
        </p>
        <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
          <span className="px-2 py-1 bg-[var(--bg-tertiary)] rounded">v1.0.0</span>
          <span>Next.js • Drizzle ORM • OpenAI • Clerk</span>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <PageContainer
      title="Settings"
      subtitle="Manage your account and preferences"
    >
      <Suspense
        fallback={
          <div className="max-w-2xl space-y-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 skeleton rounded-xl" />
            ))}
          </div>
        }
      >
        <SettingsContent />
      </Suspense>
    </PageContainer>
  );
}
