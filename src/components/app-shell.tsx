"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { useLanguage } from "@/components/providers/language-provider";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  userEmail: string;
  userRole: string;
};

export function AppShell({ children, userEmail, userRole }: AppShellProps) {
  const { direction } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className={cn(
        "min-h-screen bg-background md:flex",
        direction === "rtl" ? "md:flex-row-reverse" : "md:flex-row",
      )}
    >
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        userEmail={userEmail}
        userRole={userRole}
      />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-7 xl:px-8">
          <div className="mx-auto w-full max-w-[92rem]">{children}</div>
        </main>
      </div>
    </div>
  );
}
