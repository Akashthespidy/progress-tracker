"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <button
      onClick={() => signOut({ redirectUrl: "/" })}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 bg-rose-500/8 border border-rose-500/15 hover:bg-rose-500/15 hover:border-rose-500/25 transition-all w-full sm:w-auto"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  );
}
