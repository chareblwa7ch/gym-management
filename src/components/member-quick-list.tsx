"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock3, MessageCircle, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
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
import { formatDisplayDate } from "@/lib/date";
import { getWhatsAppActionLabel, getWhatsAppLink } from "@/lib/phone";
import type { MemberWithSubscription } from "@/lib/types";

const quickListIcons = {
  clock: Clock3,
  alert: AlertTriangle,
} as const;

type MemberQuickListProps = {
  title: string;
  description: string;
  icon: keyof typeof quickListIcons;
  members: MemberWithSubscription[];
  emptyTitle: string;
  emptyDescription: string;
};

export function MemberQuickList({
  title,
  description,
  icon,
  members,
  emptyTitle,
  emptyDescription,
}: MemberQuickListProps) {
  const Icon = quickListIcons[icon];
  const [renewingMember, setRenewingMember] = useState<MemberWithSubscription | null>(
    null,
  );

  return (
    <>
      <Card className="overflow-hidden border-border/70 bg-card/85">
        <CardHeader className="gap-4 p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 sm:size-12">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-[1.9rem] leading-tight sm:text-2xl">
                  {title}
                </CardTitle>
                <CardDescription className="mt-2 text-base leading-7">
                  {description}
                </CardDescription>
              </div>
            </div>
            <Badge variant="muted" className="hidden shrink-0 sm:inline-flex">
              {members.length} member{members.length === 1 ? "" : "s"}
            </Badge>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-3 pt-3 sm:p-6 sm:pt-6">
          {members.length ? (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col gap-4 rounded-[calc(var(--radius)+0.1rem)] border border-border/70 bg-gradient-to-br from-card/80 to-muted/28 p-4 shadow-sm transition-all hover:border-border hover:bg-muted/40 hover:shadow-md sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold break-words">{member.full_name}</p>
                        <div className="sm:hidden">
                          <StatusBadge status={member.status} />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground break-all">{member.phone}</p>
                    </div>
                    <div className="hidden sm:block">
                      <StatusBadge status={member.status} />
                    </div>
                  </div>

                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground">Expiry date</p>
                      <p className="font-semibold">
                        {formatDisplayDate(member.latestSubscription?.expiry_date ?? null)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Membership</p>
                      <p className="font-semibold">{member.relativeExpiry}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
                    <Button
                      type="button"
                      size="sm"
                      className="w-full justify-center shadow-sm sm:w-auto"
                      onClick={() => setRenewingMember(member)}
                    >
                      <RefreshCw className="size-4" />
                      Renew
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full justify-center sm:w-auto"
                    >
                      <Link href={`/members/${member.id}`}>
                        <ArrowRight className="size-4" />
                        Open
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="col-span-2 w-full justify-start sm:col-auto sm:w-auto"
                    >
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
                        {getWhatsAppActionLabel(member.status)}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title={emptyTitle}
              description={emptyDescription}
              className="py-8"
            />
          )}
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
    </>
  );
}
