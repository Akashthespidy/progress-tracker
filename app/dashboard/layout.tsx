import { Sidebar } from "@/components/layout/sidebar";
import { CommandPalette } from "@/components/ui/command-palette";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <CommandPalette />
      {children}
    </>
  );
}
