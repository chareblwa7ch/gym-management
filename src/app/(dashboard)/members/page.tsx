import type { Metadata } from "next";
import { Users } from "lucide-react";
import { MembersPageClient } from "@/components/members-page-client";
import { PageHero } from "@/components/page-hero";
import { getRequestDictionary } from "@/lib/i18n-server";
import { getMembersPageData } from "@/lib/members";

export const metadata: Metadata = {
  title: "Members",
};

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { dictionary } = await getRequestDictionary();
  const params = await searchParams;
  const { members, counts, filters, pagination } = await getMembersPageData({
    query: params.q,
    status: params.status,
    page: params.page,
  });

  return (
    <div className="page-section">
      <PageHero
        eyebrow={dictionary.membersPage.eyebrow}
        title={dictionary.membersPage.title}
        description={dictionary.membersPage.description}
        icon={Users}
      />

      <MembersPageClient
        key={`${filters.query}-${filters.status}-${filters.page}`}
        members={members}
        counts={counts}
        initialQuery={filters.query}
        initialStatus={filters.status}
        initialPage={filters.page}
        pagination={pagination}
      />
    </div>
  );
}
