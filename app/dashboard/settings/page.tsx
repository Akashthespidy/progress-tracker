import { PageContainer } from "@/components/layout/page-container";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <PageContainer
      title="Settings"
      subtitle="Manage your account and preferences"
    >
      <div className="max-w-2xl space-y-6">
        {/* Account */}
        <div className="card p-6">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[var(--text-tertiary)]" />
            Account
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Your account is managed through Clerk. Click on your profile picture
            in the sidebar to manage your account settings, change your profile
            picture, or sign out.
          </p>
        </div>

        {/* About */}
        <div className="card p-6">
          <h2 className="text-base font-semibold mb-4">About Zero to Hero</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Zero to Hero is a self-improvement operating system designed to help
            you track daily tasks, set long-term goals, visualize your progress,
            and receive AI-powered mentorship based on your real data.
          </p>
          <div className="mt-4 text-xs text-[var(--text-tertiary)]">
            Version 1.0.0 • Built with Next.js, Drizzle ORM, and OpenAI
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
