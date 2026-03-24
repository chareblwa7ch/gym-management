"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

type AppShellProps = {
  children: React.ReactNode;
  userEmail: string;
  userRole: string;
};

export function AppShell({ children, userEmail, userRole }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[6.25rem_1fr] xl:grid-cols-[18.5rem_1fr]">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        userEmail={userEmail}
        userRole={userRole}
      />
      <div className="flex min-h-screen min-w-0 flex-col">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
