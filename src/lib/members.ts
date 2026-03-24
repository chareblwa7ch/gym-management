import { compareByUrgency, enrichMemberRecord } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import type {
  DashboardCounts,
  MemberWithSubscription,
  SubscriptionRow,
} from "@/lib/types";

export type MembersStatusFilter = "all" | "active" | "expiring-soon" | "expired";

export type MembersListFilters = {
  query?: string;
  status?: MembersStatusFilter | string;
};

function createLatestSubscriptionMap(subscriptions: SubscriptionRow[]) {
  const latestByMember = new Map<string, SubscriptionRow>();

  for (const subscription of subscriptions) {
    if (!latestByMember.has(subscription.member_id)) {
      latestByMember.set(subscription.member_id, subscription);
    }
  }

  return latestByMember;
}

function sanitizeSearchTerm(value: string) {
  return value.trim().replace(/[,%()]/g, " ");
}

async function getMembersWithLatestSubscriptions(memberQuery?: string) {
  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  let membersBuilder = supabase.from("members").select("*").order("full_name");

  if (memberQuery?.trim()) {
    const safeQuery = sanitizeSearchTerm(memberQuery);
    membersBuilder = membersBuilder.or(
      `full_name.ilike.%${safeQuery}%,phone.ilike.%${safeQuery}%`,
    );
  }

  const membersResult = await membersBuilder;

  if (membersResult.error) {
    throw membersResult.error;
  }

  const members = membersResult.data ?? [];

  if (!members.length) {
    return [];
  }

  const subscriptionsResult = await supabase
    .from("subscriptions")
    .select("*")
    .in(
      "member_id",
      members.map((member) => member.id),
    )
    .order("payment_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (subscriptionsResult.error) {
    throw subscriptionsResult.error;
  }

  const latestSubscriptions = createLatestSubscriptionMap(
    subscriptionsResult.data ?? [],
  );

  return members.map((member) =>
    enrichMemberRecord(member, latestSubscriptions.get(member.id) ?? null),
  );
}

export async function getAllMembers() {
  return getMembersWithLatestSubscriptions();
}

export async function getMemberById(memberId: string) {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const [memberResult, subscriptionsResult] = await Promise.all([
    supabase.from("members").select("*").eq("id", memberId).single(),
    supabase
      .from("subscriptions")
      .select("*")
      .eq("member_id", memberId)
      .order("payment_date", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  if (memberResult.error) {
    if (memberResult.error.code === "PGRST116") {
      return null;
    }

    throw memberResult.error;
  }

  if (subscriptionsResult.error) {
    throw subscriptionsResult.error;
  }

  const subscriptions = subscriptionsResult.data ?? [];

  return {
    member: enrichMemberRecord(memberResult.data, subscriptions[0] ?? null),
    subscriptions,
  };
}

export function getDashboardCounts(members: MemberWithSubscription[]): DashboardCounts {
  return members.reduce<DashboardCounts>(
    (counts, member) => {
      counts.totalMembers += 1;

      if (member.status === "active") {
        counts.activeMembers += 1;
      }

      if (member.status === "expiring-soon") {
        counts.expiringSoonMembers += 1;
      }

      if (member.status === "expired") {
        counts.expiredMembers += 1;
      }

      return counts;
    },
    {
      totalMembers: 0,
      activeMembers: 0,
      expiringSoonMembers: 0,
      expiredMembers: 0,
    },
  );
}

export function getExpiringSoonMembers(members: MemberWithSubscription[]) {
  return members
    .filter((member) => member.status === "expiring-soon")
    .sort(compareByUrgency);
}

export function getExpiredMembers(members: MemberWithSubscription[]) {
  return members
    .filter((member) => member.status === "expired")
    .sort(compareByUrgency)
    .reverse();
}

export function normalizeMembersStatusFilter(value?: string): MembersStatusFilter {
  if (
    value === "active" ||
    value === "expiring-soon" ||
    value === "expired"
  ) {
    return value;
  }

  return "all";
}

function filterMembersByStatus(
  members: MemberWithSubscription[],
  status: MembersStatusFilter,
) {
  if (status === "all") {
    return members;
  }

  return members.filter((member) => member.status === status);
}

export async function getMembersPageData(filters: MembersListFilters = {}) {
  const status = normalizeMembersStatusFilter(filters.status);
  const trimmedQuery = filters.query?.trim() ?? "";

  const [allMembers, searchedMembers] = await Promise.all([
    getAllMembers(),
    trimmedQuery ? getMembersWithLatestSubscriptions(trimmedQuery) : Promise.resolve(null),
  ]);

  const membersBase = searchedMembers ?? allMembers;
  const filteredMembers = filterMembersByStatus(membersBase, status);

  return {
    members: filteredMembers,
    counts: {
      all: allMembers.length,
      active: allMembers.filter((member) => member.status === "active").length,
      "expiring-soon": allMembers.filter(
        (member) => member.status === "expiring-soon",
      ).length,
      expired: allMembers.filter((member) => member.status === "expired").length,
    },
    filters: {
      query: trimmedQuery,
      status,
    },
  };
}

export async function getRecentActivity() {
  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  const subscriptionsResult = await supabase
    .from("subscriptions")
    .select("id, member_id, amount, payment_date, expiry_date, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  if (subscriptionsResult.error) {
    throw subscriptionsResult.error;
  }

  const subscriptions = subscriptionsResult.data ?? [];

  if (!subscriptions.length) {
    return [];
  }

  const memberIds = Array.from(new Set(subscriptions.map((item) => item.member_id)));
  const membersResult = await supabase
    .from("members")
    .select("id, full_name, phone")
    .in("id", memberIds);

  if (membersResult.error) {
    throw membersResult.error;
  }

  const memberMap = new Map(
    (membersResult.data ?? []).map((member) => [member.id, member] as const),
  );

  return subscriptions.map((item) => ({
    ...item,
    member: memberMap.get(item.member_id) ?? null,
  }));
}
