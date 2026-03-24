import type { Metadata } from "next";
import { Users } from "lucide-react";
import { MembersPageClient } from "@/components/members-page-client";
import { PageHero } from "@/components/page-hero";
import { getMembersPageData } from "@/lib/members";

export const metadata: Metadata = {
  title: "Members",
};

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const { members, counts, filters } = await getMembersPageData({
    query: params.q,
    status: params.status,
  });

  return (
    <div className="page-section">
      <PageHero
        eyebrow="Member management"
        title="All members"
        description="Search quickly, filter by status, and manage renewals from one place."
        icon={Users}
      />

      <MembersPageClient
        key={`${filters.query}-${filters.status}`}
        members={members}
        counts={counts}
        initialQuery={filters.query}
        initialStatus={filters.status}
      />
    </div>
  );
}
