"use client";

import Link from "next/link";
import { Menu, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoPlaceholder } from "@/components/logo-placeholder";
import { useLanguage } from "@/components/providers/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { GYM_NAME } from "@/lib/constants";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { dictionary } = useLanguage();
  const pageCopy = [
    {
      matcher: (value: string) => value === "/dashboard",
      title: dictionary.common.dashboard,
      description: dictionary.header.dashboardDescription,
    },
    {
      matcher: (value: string) => value === "/members",
      title: dictionary.common.members,
      description: dictionary.header.membersDescription,
    },
    {
      matcher: (value: string) => value === "/members/new",
      title: dictionary.common.addMember,
      description: dictionary.header.addMemberDescription,
    },
    {
      matcher: (value: string) => value.startsWith("/members/"),
      title: dictionary.common.memberProfile,
      description: dictionary.header.memberProfileDescription,
    },
  ];
  const currentPage =
    pageCopy.find((item) => item.matcher(pathname)) ?? pageCopy[0];

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onMenuClick}
            className="size-12 rounded-2xl px-0 md:hidden"
            aria-label={dictionary.header.openMenu}
          >
            <Menu className="size-5" />
            <span className="sr-only">{dictionary.header.openMenu}</span>
          </Button>
          <div className="min-w-0 md:hidden">
            <LogoPlaceholder size="sm" />
          </div>
          <div className="hidden min-w-0 md:block">
            <p className="truncate text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              {GYM_NAME}
            </p>
            <h1 className="truncate text-2xl font-semibold">{currentPage.title}</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {currentPage.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden lg:inline-flex">
            <Link href="/members/new">
              <Plus className="size-4" />
              {dictionary.common.newMember}
            </Link>
          </Button>
          <div className="hidden xl:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
