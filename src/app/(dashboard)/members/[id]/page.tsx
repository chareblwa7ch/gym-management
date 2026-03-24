import type { Metadata } from "next";
import { UserSquare2 } from "lucide-react";
import { notFound } from "next/navigation";
import { MemberProfileCard } from "@/components/member-profile-card";
import { PageHero } from "@/components/page-hero";
import { SubscriptionHistoryTable } from "@/components/subscription-history-table";
import { getMemberById } from "@/lib/members";

export const metadata: Metadata = {
  title: "Member Profile",
};

export default async function MemberDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getMemberById(id);

  if (!record) {
    notFound();
  }

  return (
    <div className="page-section">
      <PageHero
        eyebrow="Member details"
        title={record.member.full_name}
        description="Review current status, manage renewals, and check the full payment history."
        icon={UserSquare2}
      />

      <MemberProfileCard member={record.member} />
      <SubscriptionHistoryTable subscriptions={record.subscriptions} />
    </div>
  );
}
