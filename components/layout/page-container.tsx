"use client";

import { useAtomValue } from "jotai";
import { sidebarCollapsedAtom } from "@/lib/store/atoms";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageContainer({
  children,
  title,
  subtitle,
  action,
}: PageContainerProps) {
  const collapsed = useAtomValue(sidebarCollapsedAtom);

  return (
    <main
      className={cn(
        "min-h-screen transition-all duration-300",
        collapsed
          ? "ml-[var(--sidebar-collapsed-width)]"
          : "ml-[var(--sidebar-width)]"
      )}
    >
      <div className="max-w-[1400px] mx-auto p-6 lg:p-8">
        {(title || action) && (
          <div className="flex items-center justify-between mb-8">
            <div>
              {title && (
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              )}
              {subtitle && (
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
        {children}
      </div>
    </main>
  );
}
