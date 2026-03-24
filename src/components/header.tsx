"use client";

import Link from "next/link";
import { Menu, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { LogoPlaceholder } from "@/components/logo-placeholder";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { GYM_NAME } from "@/lib/constants";

const pageCopy = [
  {
    matcher: (pathname: string) => pathname === "/dashboard",
    title: "Dashboard",
    description: "See expiring memberships first and keep renewals moving.",
  },
  {
    matcher: (pathname: string) => pathname === "/members",
    title: "Members",
    description: "Search quickly, update details, and renew in one tap.",
  },
  {
    matcher: (pathname: string) => pathname === "/members/new",
    title: "Add Member",
    description: "Register a new member and save the first payment in seconds.",
  },
  {
    matcher: (pathname: string) => pathname.startsWith("/members/"),
    title: "Member Profile",
    description: "Review status, notes, and payment history.",
  },
];

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const currentPage =
    pageCopy.find((item) => item.matcher(pathname)) ?? pageCopy[0];

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onMenuClick}
            className="px-3 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          <div className="md:hidden">
            <LogoPlaceholder showName={false} size="sm" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              {GYM_NAME}
            </p>
            <h1 className="truncate text-xl font-semibold sm:text-2xl">{currentPage.title}</h1>
            <p className="hidden max-w-2xl text-sm text-muted-foreground sm:block">
              {currentPage.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/members/new">
              <Plus className="size-4" />
              New Member
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
