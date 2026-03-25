import { enrichMemberRecord } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import type {
  DashboardCounts,
  MemberOverviewRow,
  MemberWithSubscription,
  RecentActivityItem,
} from "@/lib/types";

export type MembersStatusFilter = "all" | "active" | "expiring-soon" | "expired";

export type MembersListFilters = {
  query?: string;
  status?: MembersStatusFilter | string;
  page?: number | string;
};

const MEMBERS_PAGE_SIZE = 50;

function sanitizeSearchTerm(value: string) {
  return value.trim().replace(/[,%()]/g, " ");
}

function mapOverviewRowToMember(row: MemberOverviewRow): MemberWithSubscription {
  return enrichMemberRecord(row, row.latest_subscription_id
    ? {
        id: row.latest_subscription_id,
        member_id: row.id,
        amount: row.latest_amount ?? 200,
        payment_date: row.latest_payment_date ?? "",
        expiry_date: row.latest_expiry_date ?? "",
        created_at: row.latest_subscription_created_at ?? row.updated_at,
      }
    : null);
}

async function getMemberOverviewBaseQuery() {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  return supabase.from("member_overview");
}

async function getMemberOverviewRows({
  query,
  status,
  limit,
  page = 1,
}: {
  query?: string;
  status?: MembersStatusFilter;
  limit?: number;
  page?: number;
}) {
  const baseQuery = await getMemberOverviewBaseQuery();

  if (!baseQuery) {
    return [];
  }

  let queryBuilder = baseQuery.select("*").order("full_name");

  if (query?.trim()) {
    const safeQuery = sanitizeSearchTerm(query);
    queryBuilder = queryBuilder.or(
      `full_name.ilike.%${safeQuery}%,phone.ilike.%${safeQuery}%`,
    );
  }

  if (status && status !== "all") {
    queryBuilder = queryBuilder.eq("membership_status", status);
  }

  if (limit) {
    const from = Math.max(0, (page - 1) * limit);
    const to = from + limit - 1;
    queryBuilder = queryBuilder.range(from, to);
  }

  const result = await queryBuilder;

  if (result.error) {
    throw result.error;
  }

  return (result.data ?? []).map(mapOverviewRowToMember);
}

async function getMemberOverviewCount({
  query,
  status,
}: {
  query?: string;
  status?: MembersStatusFilter;
}) {
  const baseQuery = await getMemberOverviewBaseQuery();

  if (!baseQuery) {
    return 0;
  }

  let countQuery = baseQuery.select("*", { count: "exact", head: true });

  if (query?.trim()) {
    const safeQuery = sanitizeSearchTerm(query);
    countQuery = countQuery.or(`full_name.ilike.%${safeQuery}%,phone.ilike.%${safeQuery}%`);
  }

  if (status && status !== "all") {
    countQuery = countQuery.eq("membership_status", status);
  }

  const result = await countQuery;

  if (result.error) {
    throw result.error;
  }

  return result.count ?? 0;
}

async function getDashboardStatusCounts(): Promise<DashboardCounts> {
  const [totalMembers, activeMembers, expiringSoonMembers, expiredMembers] =
    await Promise.all([
      getMemberOverviewCount({}),
      getMemberOverviewCount({ status: "active" }),
      getMemberOverviewCount({ status: "expiring-soon" }),
      getMemberOverviewCount({ status: "expired" }),
    ]);

  return {
    totalMembers,
    activeMembers,
    expiringSoonMembers,
    expiredMembers,
  };
}

export async function getDashboardPageData() {
  const [counts, expiringMembers, expiredMembers, recentActivity] = await Promise.all([
    getDashboardStatusCounts(),
    getMemberOverviewRows({ status: "expiring-soon", limit: 6 }),
    getMemberOverviewRows({ status: "expired", limit: 6 }),
    getRecentActivity(),
  ]);

  return {
    counts,
    expiringMembers,
    expiredMembers,
    recentActivity,
  };
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

export function normalizeMembersStatusFilter(value?: string): MembersStatusFilter {
  if (value === "active" || value === "expiring-soon" || value === "expired") {
    return value;
  }

  return "all";
}

function normalizePageNumber(value?: number | string) {
  const page = Number(value);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}

export async function getMembersPageData(filters: MembersListFilters = {}) {
  const status = normalizeMembersStatusFilter(filters.status);
  const trimmedQuery = filters.query?.trim() ?? "";
  const requestedPage = normalizePageNumber(filters.page);

  const [counts, totalMatching] = await Promise.all([
    getDashboardStatusCounts(),
    getMemberOverviewCount({ query: trimmedQuery, status }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalMatching / MEMBERS_PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const members = await getMemberOverviewRows({
    query: trimmedQuery,
    status,
    limit: MEMBERS_PAGE_SIZE,
    page,
  });

  const start = totalMatching ? (page - 1) * MEMBERS_PAGE_SIZE + 1 : 0;
  const end = totalMatching ? start + members.length - 1 : 0;

  return {
    members,
    counts: {
      all: counts.totalMembers,
      active: counts.activeMembers,
      "expiring-soon": counts.expiringSoonMembers,
      expired: counts.expiredMembers,
    },
    filters: {
      query: trimmedQuery,
      status,
      page,
    },
    pagination: {
      page,
      pageSize: MEMBERS_PAGE_SIZE,
      totalMatching,
      totalPages,
      start,
      end,
    },
  };
}

export async function getRecentActivity(): Promise<RecentActivityItem[]> {
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
