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
import {
  getAllMembers,
  getDashboardCounts,
  getExpiredMembers,
  getExpiringSoonMembers,
  getRecentActivity,
} from "@/lib/members";
import type { MemberWithSubscription, RecentActivityItem } from "@/lib/types";
import { formatCurrencyDh } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  let members: MemberWithSubscription[] = [];
  let recentActivity: RecentActivityItem[] = [];
  let dashboardMessage: string | null = null;

  try {
    members = await getAllMembers();
  } catch (error) {
    dashboardMessage =
      error instanceof Error
        ? error.message
        : "Member data could not be loaded from Supabase.";
  }

  try {
    recentActivity = await getRecentActivity();
  } catch (error) {
    dashboardMessage =
      dashboardMessage ??
      (error instanceof Error
        ? error.message
        : "Recent activity could not be loaded from Supabase.");
  }

  const counts = getDashboardCounts(members);
  const expiringMembers = getExpiringSoonMembers(members).slice(0, 6);
  const expiredMembers = getExpiredMembers(members).slice(0, 6);

  return (
    <div className="page-section">
      <PageHero
        eyebrow="Today at a glance"
        title="Membership dashboard"
        description="See who needs attention first, then renew, search, and manage members without extra steps."
        icon={Users}
        action={
          <Button asChild size="lg" className="sm:w-fit">
            <Link href="/members/new">
              <UserPlus className="size-5" />
              Add new member
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
                  Some dashboard data could not load
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  The page is still available, but one Supabase query failed. Check
                  the schema, policies, and environment variables if this keeps
                  happening.
                </p>
                <p className="break-words text-xs text-muted-foreground/90">
                  {dashboardMessage}
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="sm:self-center">
              <Link href="/members">Open members</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Total Members"
          value={counts.totalMembers}
          description="All registered gym members"
          icon={Users}
        />
        <DashboardStatCard
          title="Active"
          value={counts.activeMembers}
          description="Members with a valid subscription today"
          icon={ShieldCheck}
          tone="success"
        />
        <DashboardStatCard
          title="Expiring Soon"
          value={counts.expiringSoonMembers}
          description="Members with 2 days or less remaining"
          icon={Clock3}
          tone="warning"
        />
        <DashboardStatCard
          title="Expired"
          value={counts.expiredMembers}
          description="Members who need a renewal"
          icon={AlertTriangle}
          tone="danger"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <MemberQuickList
          title="Expiring Soon Members"
          description="These members are the most urgent to follow up with today."
          icon="clock"
          members={expiringMembers}
          emptyTitle="No urgent renewals right now"
          emptyDescription="Everyone has more than 2 days left on their current subscription."
        />

        <MemberQuickList
          title="Expired Members"
          description="These members have already passed their membership end date."
          icon="alert"
          members={expiredMembers}
          emptyTitle="No expired memberships"
          emptyDescription="There are no expired members to renew at the moment."
        />
      </section>

      <Card className="overflow-hidden border-border/70 bg-card/85">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <Activity className="size-5" />
            </div>
            <div>
              <CardTitle className="text-2xl">Recent Renewals</CardTitle>
              <CardDescription>
                Latest payments and renewals saved by staff.
              </CardDescription>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/members">Open all members</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentActivity.length ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex flex-col gap-3 rounded-[calc(var(--radius)+0.1rem)] border border-border/70 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-card text-primary ring-1 ring-border/70">
                      <WalletCards className="size-4" />
                    </div>
                    <div>
                      <p className="text-base font-semibold">
                        {activity.member?.full_name ?? "Unknown member"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Paid {formatCurrencyDh(activity.amount)} on{" "}
                        {formatDisplayDate(activity.payment_date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">
                      Expires {formatDisplayDate(activity.expiry_date)}
                    </p>
                    <p className="text-muted-foreground">
                      {activity.member?.phone ?? "No phone saved"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No payments saved yet"
              description="Recent member renewals will appear here as soon as they are recorded."
              icon={WalletCards}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
