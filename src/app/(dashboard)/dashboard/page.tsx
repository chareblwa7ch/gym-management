import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Clock3,
  ShieldCheck,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { EmptyState } from "@/components/empty-state";
import { MemberQuickList } from "@/components/member-quick-list";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDisplayDate } from "@/lib/date";
import { getRequestDictionary } from "@/lib/i18n-server";
import { getDashboardPageData } from "@/lib/members";
import type { MemberWithSubscription, RecentActivityItem } from "@/lib/types";
import { formatCurrencyDh } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const { dictionary } = await getRequestDictionary();
  let counts = {
    totalMembers: 0,
    activeMembers: 0,
    expiringSoonMembers: 0,
    expiredMembers: 0,
  };
  let expiringMembers: MemberWithSubscription[] = [];
  let expiredMembers: MemberWithSubscription[] = [];
  let recentActivity: RecentActivityItem[] = [];
  let dashboardMessage: string | null = null;

  try {
    const dashboardData = await getDashboardPageData();
    counts = dashboardData.counts;
    expiringMembers = dashboardData.expiringMembers;
    expiredMembers = dashboardData.expiredMembers;
    recentActivity = dashboardData.recentActivity;
  } catch (error) {
    dashboardMessage =
      error instanceof Error
        ? error.message
        : "Dashboard data could not be loaded from Supabase.";
  }

  return (
    <div className="page-section">
      <PageHero
        eyebrow={dictionary.dashboardPage.eyebrow}
        title={dictionary.dashboardPage.title}
        description={dictionary.dashboardPage.description}
        icon={Users}
        action={
          <Button asChild size="lg" className="w-full sm:w-fit">
            <Link href="/members/new">
              <UserPlus className="size-5" />
              {dictionary.dashboardPage.addNewMember}
            </Link>
          </Button>
        }
      />

      {dashboardMessage ? (
        <Card className="border-amber-500/20 bg-amber-500/8">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/12 text-amber-800 dark:text-amber-300">
                <AlertTriangle className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {dictionary.dashboardPage.dataLoadWarningTitle}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {dictionary.dashboardPage.dataLoadWarningDescription}
                </p>
                <p className="break-words text-xs text-muted-foreground/90">
                  {dashboardMessage}
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="sm:self-center">
              <Link href="/members">{dictionary.dashboardPage.openMembers}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title={dictionary.dashboardPage.totalMembers}
          value={counts.totalMembers}
          description={dictionary.dashboardPage.totalMembersDescription}
          icon={Users}
          footerLabel={dictionary.dashboardPage.liveStatus}
          footerBadgeLabel={dictionary.dashboardPage.overview}
        />
        <DashboardStatCard
          title={dictionary.dashboardPage.activeMembers}
          value={counts.activeMembers}
          description={dictionary.dashboardPage.activeMembersDescription}
          icon={ShieldCheck}
          tone="success"
          footerLabel={dictionary.dashboardPage.liveStatus}
          footerBadgeLabel={dictionary.dashboardPage.overview}
        />
        <DashboardStatCard
          title={dictionary.dashboardPage.expiringSoonMembers}
          value={counts.expiringSoonMembers}
          description={dictionary.dashboardPage.expiringSoonDescription}
          icon={Clock3}
          tone="warning"
          footerLabel={dictionary.dashboardPage.liveStatus}
          footerBadgeLabel={dictionary.dashboardPage.overview}
        />
        <DashboardStatCard
          title={dictionary.dashboardPage.expiredMembers}
          value={counts.expiredMembers}
          description={dictionary.dashboardPage.expiredMembersDescription}
          icon={AlertTriangle}
          tone="danger"
          footerLabel={dictionary.dashboardPage.liveStatus}
          footerBadgeLabel={dictionary.dashboardPage.overview}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <MemberQuickList
          title={dictionary.dashboardPage.expiringListTitle}
          description={dictionary.dashboardPage.expiringListDescription}
          icon="clock"
          members={expiringMembers}
          emptyTitle={dictionary.dashboardPage.expiringEmptyTitle}
          emptyDescription={dictionary.dashboardPage.expiringEmptyDescription}
        />

        <MemberQuickList
          title={dictionary.dashboardPage.expiredListTitle}
          description={dictionary.dashboardPage.expiredListDescription}
          icon="alert"
          members={expiredMembers}
          emptyTitle={dictionary.dashboardPage.expiredEmptyTitle}
          emptyDescription={dictionary.dashboardPage.expiredEmptyDescription}
        />
      </section>

      <Card className="overflow-hidden border-border/70 bg-card/85">
        <CardHeader className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <Activity className="size-5" />
            </div>
            <div>
              <CardTitle className="text-2xl">{dictionary.dashboardPage.recentRenewals}</CardTitle>
              <CardDescription>
                {dictionary.dashboardPage.recentRenewalsDescription}
              </CardDescription>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/members">{dictionary.dashboardPage.openAllMembers}</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-3 pt-3 sm:p-6 sm:pt-6">
          {recentActivity.length ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex flex-col gap-3 rounded-[calc(var(--radius)+0.1rem)] border border-border/70 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-card text-primary ring-1 ring-border/70">
                      <WalletCards className="size-4" />
                    </div>
                    <div>
                      <p className="text-base font-semibold">
                        {activity.member?.full_name ?? dictionary.common.unknownMember}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {dictionary.dashboardPage.paid} {formatCurrencyDh(activity.amount)} {dictionary.dashboardPage.on}{" "}
                        {formatDisplayDate(activity.payment_date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">
                      {dictionary.dashboardPage.expires} {formatDisplayDate(activity.expiry_date)}
                    </p>
                    <p className="text-muted-foreground">
                      {activity.member?.phone ?? dictionary.common.noPhoneSaved}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title={dictionary.dashboardPage.noPaymentsTitle}
              description={dictionary.dashboardPage.noPaymentsDescription}
              icon={WalletCards}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
