"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  CalendarDays,
  Eye,
  Hourglass,
  MessageCircle,
  Pencil,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { EditMemberModal } from "@/components/edit-member-modal";
import { EmptyState } from "@/components/empty-state";
import { useLanguage } from "@/components/providers/language-provider";
import { RenewModal } from "@/components/renew-modal";
import { StatusBadge } from "@/components/status-badge";
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

type MemberTableProps = {
  members: MemberWithSubscription[];
  totalMembers: number;
  matchingCount: number;
  visibleCount: number;
};

function MemberField({
  label,
  value,
  icon: Icon,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground xl:hidden">
        <Icon className="size-3.5" />
        <p>{label}</p>
      </div>
      <div className="pt-1 xl:pt-0">{value}</div>
    </div>
  );
}

export function MemberTable({
  members,
  totalMembers,
  matchingCount,
  visibleCount,
}: MemberTableProps) {
  const { dictionary } = useLanguage();
  const router = useRouter();
  const [renewingMember, setRenewingMember] = useState<MemberWithSubscription | null>(
    null,
  );
  const [editingMember, setEditingMember] = useState<MemberWithSubscription | null>(
    null,
  );
  const [deletingMember, setDeletingMember] = useState<MemberWithSubscription | null>(
    null,
  );
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleDelete = () => {
    if (!deletingMember) {
      return;
    }

    startDeleteTransition(async () => {
      const { error } = await deleteMember(deletingMember.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(`${deletingMember.full_name} was deleted.`);
      setDeletingMember(null);
      router.refresh();
    });
  };

  if (!members.length) {
    const hasAnyMembers = totalMembers > 0;

    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            title={
              hasAnyMembers
                ? dictionary.membersPage.noMatchTitle
                : dictionary.membersPage.noMembersTitle
            }
            description={
              hasAnyMembers
                ? dictionary.membersPage.noMatchDescription
                : dictionary.membersPage.noMembersDescription
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden border-border/70 bg-card/85">
        <CardHeader className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <Users className="size-5" />
            </div>
            <div>
              <CardTitle className="text-2xl">{dictionary.membersPage.memberList}</CardTitle>
              <CardDescription>
                {matchingCount === totalMembers
                  ? dictionary.membersPage.showingMembers(visibleCount, totalMembers)
                  : dictionary.membersPage.showingMatching(visibleCount, matchingCount)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />

        <CardContent className="space-y-4 p-3 pt-3 sm:p-4 sm:pt-4 xl:p-5 xl:pt-5">
          <div className="hidden rounded-[calc(var(--radius)+0.1rem)] border border-dashed border-border/70 bg-background/72 px-4 py-3 shadow-sm xl:sticky xl:top-[5.5rem] xl:z-10 xl:grid xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto] xl:gap-4 xl:backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {dictionary.common.members}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {dictionary.common.lastPayment}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {dictionary.common.expiryDate}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {dictionary.common.membership}
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {dictionary.common.status}
            </p>
            <p className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {dictionary.membersPage.actions}
            </p>
          </div>

          {members.map((member) => (
            <div
              key={member.id}
              className="rounded-[calc(var(--radius)+0.1rem)] border border-border/70 bg-gradient-to-br from-card/80 to-muted/28 p-3.5 shadow-sm transition-all hover:border-border hover:bg-muted/40 hover:shadow-md sm:p-4"
            >
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto] xl:items-center xl:gap-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="break-words text-lg font-semibold">{member.full_name}</p>
                    <div className="xl:hidden">
                      <StatusBadge status={member.status} />
                    </div>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-muted-foreground">
                    <span className="break-all">{member.phone}</span>
                    <Link
                      href={getWhatsAppLink(member.phone, {
                        memberName: member.full_name,
                        template: "membership-status",
                        status: member.status,
                        daysRemaining: member.daysRemaining,
                      })}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full text-primary underline-offset-4 hover:underline"
                      aria-label={`Open WhatsApp chat for ${member.full_name}`}
                    >
                      <MessageCircle className="size-4" />
                      {getWhatsAppActionLabel(member.status, {
                        sendReminder: dictionary.common.sendReminder,
                        whatsApp: dictionary.common.whatsApp,
                      })}
                    </Link>
                  </div>
                </div>

                <Separator className="xl:hidden" />

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:contents">
                  <MemberField
                    label={dictionary.common.lastPayment}
                    icon={CalendarClock}
                    value={
                      <p className="font-semibold">
                        {formatDisplayDate(member.latestSubscription?.payment_date ?? null)}
                      </p>
                    }
                  />

                  <MemberField
                    label={dictionary.common.expiryDate}
                    icon={CalendarDays}
                    value={
                      <p className="font-semibold">
                        {formatDisplayDate(member.latestSubscription?.expiry_date ?? null)}
                      </p>
                    }
                  />

                  <MemberField
                    label={dictionary.common.membership}
                    icon={Hourglass}
                    className="col-span-2 lg:col-span-1"
                    value={
                      <p className="break-words font-semibold">
                        {getLocalizedRelativeExpiryLabel(member.daysRemaining, dictionary)}
                      </p>
                    }
                  />

                  <MemberField
                    label={dictionary.common.status}
                    icon={Users}
                    value={<div className="hidden xl:block"><StatusBadge status={member.status} /></div>}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 xl:flex xl:flex-wrap xl:justify-end">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="w-full justify-center shadow-sm xl:w-auto"
                    onClick={() => setRenewingMember(member)}
                  >
                    <RefreshCw className="size-4" />
                    {dictionary.common.renew}
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full justify-center xl:w-auto">
                    <Link href={`/members/${member.id}`}>
                      <Eye className="size-4" />
                      {dictionary.common.view}
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center xl:w-auto"
                    onClick={() => setEditingMember(member)}
                    aria-label={`Edit ${member.full_name}`}
                  >
                    <Pencil className="size-4" />
                    {dictionary.common.edit}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center xl:w-auto"
                    onClick={() => setDeletingMember(member)}
                    aria-label={`Delete ${member.full_name}`}
                  >
                    <Trash2 className="size-4 text-rose-500" />
                    {dictionary.common.delete}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <RenewModal
        member={renewingMember}
        open={Boolean(renewingMember)}
        onOpenChange={(open) => {
          if (!open) {
            setRenewingMember(null);
          }
        }}
      />

      <EditMemberModal
        member={editingMember}
        open={Boolean(editingMember)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingMember(null);
          }
        }}
      />

      <DeleteConfirmationModal
        open={Boolean(deletingMember)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingMember(null);
          }
        }}
        title={`${dictionary.common.delete} ${deletingMember?.full_name ?? dictionary.common.memberProfile}?`}
        description={dictionary.memberProfilePage.deleteDescription}
        cancelLabel={dictionary.common.cancel}
        confirmLabel={dictionary.deleteModal.confirmDelete}
        onConfirm={handleDelete}
        pending={isDeleting}
      />
    </>
  );
}
