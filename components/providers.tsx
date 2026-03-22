"use client";

import { Provider as JotaiProvider } from "jotai";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#6366f1",
          colorBackground: "#0a0a0f",
          colorText: "#e2e8f0",
          colorInputBackground: "#141420",
          borderRadius: "0.75rem",
        },
        elements: {
          formButtonPrimary:
            "bg-indigo-600 hover:bg-indigo-500 transition-all",
          card: "bg-[#0f0f1a] border border-white/5",
        },
      }}
    >
      <JotaiProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </JotaiProvider>
    </ClerkProvider>
  );
}

