"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  CalendarDays,
  Edit3,
  MessageCircle,
  NotebookText,
  Phone,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { EditMemberModal } from "@/components/edit-member-modal";
import { useLanguage } from "@/components/providers/language-provider";
import { RenewModal } from "@/components/renew-modal";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDisplayDate, getLocalizedRelativeExpiryLabel } from "@/lib/date";
import { deleteMember } from "@/lib/member-mutations";
import { getWhatsAppActionLabel, getWhatsAppLink } from "@/lib/phone";
import type { MemberWithSubscription } from "@/lib/types";

function DetailItem({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-border/70 bg-muted/35 p-4 ${className}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <p className="text-sm font-medium">{label}</p>
      </div>
      <div className="mt-3 text-lg font-semibold">{value}</div>
    </div>
  );
}

export function MemberProfileCard({ member }: { member: MemberWithSubscription }) {
  const { dictionary } = useLanguage();
  const router = useRouter();
  const [renewOpen, setRenewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const { error } = await deleteMember(member.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(dictionary.memberProfilePage.deleted(member.full_name));
      router.push("/members");
      router.refresh();
    });
  };

  return (
    <>
      <Card className="overflow-hidden border-border/70 bg-card/85">
        <CardHeader className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="space-y-3">
              <Badge variant="muted" className="w-fit">
                {dictionary.common.memberOverview}
              </Badge>
              <CardTitle className="text-3xl break-words">{member.full_name}</CardTitle>
              <CardDescription className="max-w-2xl">
                {dictionary.memberProfilePage.overviewDescription}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={member.status} />
              <div className="rounded-full border border-border/70 bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">
                {getLocalizedRelativeExpiryLabel(member.daysRemaining, dictionary)}
              </div>
            </div>
          </div>

          <div className="grid w-full gap-2 sm:grid-cols-2 lg:w-auto">
            <Button type="button" size="lg" onClick={() => setRenewOpen(true)}>
              <RefreshCw className="size-4" />
              {dictionary.common.renewMembership}
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link
                href={getWhatsAppLink(member.phone, {
                  memberName: member.full_name,
                  template: "membership-status",
                  status: member.status,
                  daysRemaining: member.daysRemaining,
                })}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="size-4" />
                {getWhatsAppActionLabel(member.status, {
                  sendReminder: dictionary.common.sendReminder,
                  whatsApp: dictionary.common.whatsApp,
                })}
              </Link>
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditOpen(true)}>
              <Edit3 className="size-4" />
              {dictionary.common.edit}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="size-4 text-rose-500" />
              {dictionary.common.delete}
            </Button>
          </div>
        </CardHeader>
        <Separator />

        <CardContent className="space-y-4 p-4 pt-4 sm:p-6 sm:pt-6">
          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[calc(var(--radius)+0.1rem)] border border-border/70 bg-muted/30 p-4 sm:p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                {dictionary.common.memberInformation}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DetailItem
                  icon={Phone}
                  label={dictionary.common.phone}
                  value={<p className="break-all">{member.phone}</p>}
                />
                <DetailItem
                  icon={RefreshCw}
                  label={dictionary.memberProfilePage.currentStatus}
                  value={
                    <div className="space-y-3">
                      <StatusBadge status={member.status} />
                      <p className="text-base font-semibold text-foreground">
                        {getLocalizedRelativeExpiryLabel(member.daysRemaining, dictionary)}
                      </p>
                    </div>
                  }
                />
              </div>
            </div>

            <div className="rounded-[calc(var(--radius)+0.1rem)] border border-border/70 bg-muted/30 p-4 sm:p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                {dictionary.common.currentMembership}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DetailItem
                  icon={CalendarClock}
                  label={dictionary.common.lastPayment}
                  value={formatDisplayDate(member.latestSubscription?.payment_date ?? null)}
                />
                <DetailItem
                  icon={CalendarDays}
                  label={dictionary.common.expiryDate}
                  value={formatDisplayDate(member.latestSubscription?.expiry_date ?? null)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[calc(var(--radius)+0.1rem)] border border-border/70 bg-muted/30 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <NotebookText className="size-4" />
              <p className="text-sm font-medium">{dictionary.common.notes}</p>
            </div>
            <p className="mt-3 text-base leading-7 text-foreground">
              {member.notes?.trim() ? member.notes : dictionary.common.noNotes}
            </p>
          </div>
        </CardContent>
      </Card>

      <RenewModal member={member} open={renewOpen} onOpenChange={setRenewOpen} />
      <EditMemberModal member={member} open={editOpen} onOpenChange={setEditOpen} />
      <DeleteConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`${dictionary.common.delete} ${member.full_name}?`}
        description={dictionary.memberProfilePage.deleteDescription}
        cancelLabel={dictionary.common.cancel}
        confirmLabel={dictionary.deleteModal.confirmDelete}
        onConfirm={handleDelete}
        pending={isDeleting}
      />
    </>
  );
}
