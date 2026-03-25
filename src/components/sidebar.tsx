"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleDollarSign,
  LayoutDashboard,
  Plus,
  Users,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoPlaceholder } from "@/components/logo-placeholder";
import { useLanguage } from "@/components/providers/language-provider";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { GYM_PLAN_AMOUNT } from "@/lib/constants";
import { cn, toTitleCase } from "@/lib/utils";

type SidebarProps = {
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  userEmail: string;
  userRole: string;
};

function SidebarContent({
  pathname,
  userEmail,
  userRole,
  compact = false,
  onNavigate,
}: {
  pathname: string;
  userEmail: string;
  userRole: string;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const { dictionary } = useLanguage();
  const navigation = [
    { href: "/dashboard", label: dictionary.common.dashboard, icon: LayoutDashboard },
    { href: "/members", label: dictionary.common.members, icon: Users },
    { href: "/members/new", label: dictionary.common.addMember, icon: Plus },
  ];

  return (
    <div className="flex h-full flex-col gap-6">
      {compact ? (
        <>
          <div className="xl:hidden">
            <LogoPlaceholder showName={false} size="md" />
          </div>
          <div className="hidden xl:block">
            <LogoPlaceholder size="md" />
          </div>
        </>
      ) : (
        <LogoPlaceholder size="md" />
      )}

      <nav className="space-y-2" aria-label="Primary navigation">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all",
                compact ? "justify-center xl:justify-start xl:px-4" : "",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/15"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="size-5 shrink-0" />
              <span className={compact ? "hidden xl:inline" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "rounded-[calc(var(--radius)+0.1rem)] border border-border/70 bg-muted/50 p-4",
          compact ? "hidden xl:block" : "",
        )}
      >
        <div className="flex items-center gap-3 text-sm font-semibold">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/12 text-primary">
            <CircleDollarSign className="size-5" />
          </div>
          <div>
            <p>{dictionary.common.monthlyPlan}</p>
            <p className="text-xl text-foreground">{GYM_PLAN_AMOUNT} DH</p>
          </div>
        </div>
      </div>

      <div className="mt-auto rounded-[calc(var(--radius)+0.1rem)] border border-border/70 bg-card/80 p-4">
        <div className="mb-4 space-y-1">
          <p className={cn("text-xs uppercase tracking-[0.2em] text-primary", compact ? "text-center xl:text-left" : "")}>
            {toTitleCase(userRole)}
          </p>
          <p className={cn("break-all text-sm font-semibold", compact ? "hidden xl:block" : "")}>
            {userEmail}
          </p>
          <p className={cn("text-xs text-muted-foreground", compact ? "hidden xl:block" : "")}>
            {dictionary.common.internalAccessOnly}
          </p>
        </div>
        <div className={cn("mb-4", compact ? "hidden xl:block" : "")}>
          <LanguageSwitcher />
        </div>
        <SignOutButton compact={compact} />
      </div>
    </div>
  );
}

export function Sidebar({
  mobileOpen,
  onMobileOpenChange,
  userEmail,
  userRole,
}: SidebarProps) {
  const { direction } = useLanguage();
  const pathname = usePathname();
  const isRtl = direction === "rtl";

  return (
    <>
      <aside
        className={cn(
          "hidden bg-card/88 backdrop-blur md:block md:w-[6.25rem] xl:w-[18.5rem]",
          isRtl ? "border-l border-border/70" : "border-r border-border/70",
        )}
      >
        <div className="sticky top-0 min-h-screen px-4 py-5">
          <SidebarContent
            pathname={pathname}
            userEmail={userEmail}
            userRole={userRole}
            compact
          />
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
      <SheetContent
          side={isRtl ? "right" : "left"}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className={cn(
            "soft-scrollbar overflow-y-auto bg-card/96 p-5 pt-4",
            isRtl ? "border-l border-border/70" : "border-r border-border/70",
          )}
        >
          <SheetHeader />
          <SidebarContent
            pathname={pathname}
            userEmail={userEmail}
            userRole={userRole}
            onNavigate={() => onMobileOpenChange(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
