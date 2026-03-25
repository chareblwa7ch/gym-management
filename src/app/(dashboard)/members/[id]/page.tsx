import type { Metadata } from "next";
import { UserSquare2 } from "lucide-react";
import { notFound } from "next/navigation";
import { MemberProfileCard } from "@/components/member-profile-card";
import { PageHero } from "@/components/page-hero";
import { SubscriptionHistoryTable } from "@/components/subscription-history-table";
import { getRequestDictionary } from "@/lib/i18n-server";
import { getMemberById } from "@/lib/members";

export const metadata: Metadata = {
  title: "Member Profile",
};

export default async function MemberDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { dictionary } = await getRequestDictionary();
  const { id } = await params;
  const record = await getMemberById(id);

  if (!record) {
    notFound();
  }

  return (
    <div className="page-section">
      <PageHero
        eyebrow={dictionary.memberProfilePage.eyebrow}
        title={record.member.full_name}
        description={dictionary.memberProfilePage.description}
        icon={UserSquare2}
      />

      <MemberProfileCard member={record.member} />
      <SubscriptionHistoryTable
        subscriptions={record.subscriptions}
        title={dictionary.history.title}
        description={dictionary.history.description}
        paymentRecordLabel={dictionary.history.paymentRecord}
        emptyTitle={dictionary.history.noHistoryTitle}
        emptyDescription={dictionary.history.noHistoryDescription}
        paymentsCountLabel={dictionary.history.payments(record.subscriptions.length)}
        paymentDateLabel={dictionary.common.paymentDate}
        expiryDateLabel={dictionary.common.expiryDate}
        amountLabel={dictionary.common.amount}
        savedAtLabel={dictionary.common.savedAt}
      />
    </div>
  );
}
