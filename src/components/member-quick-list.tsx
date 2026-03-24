"use client";

import { useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, MessageCircle, RefreshCw } from "lucide-react";
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
import { getWhatsAppLink } from "@/lib/phone";
import type { MemberWithSubscription } from "@/lib/types";

type MemberQuickListProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  members: MemberWithSubscription[];
  emptyTitle: string;
  emptyDescription: string;
};

export function MemberQuickList({
  title,
  description,
  icon: Icon,
  members,
  emptyTitle,
  emptyDescription,
}: MemberQuickListProps) {
  const [renewingMember, setRenewingMember] = useState<MemberWithSubscription | null>(
    null,
  );

  return (
    <>
      <Card className="overflow-hidden border-border/70 bg-card/85">
        <CardHeader className="gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription className="mt-2">{description}</CardDescription>
              </div>
            </div>
            <Badge variant="muted" className="hidden shrink-0 sm:inline-flex">
              {members.length} member{members.length === 1 ? "" : "s"}
            </Badge>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          {members.length ? (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col gap-4 rounded-[calc(var(--radius)+0.1rem)] border border-border/70 bg-muted/30 p-4 transition-colors hover:bg-muted/45"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold break-words">{member.full_name}</p>
                      <p className="text-sm text-muted-foreground break-all">{member.phone}</p>
                    </div>
                    <StatusBadge status={member.status} />
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

                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" onClick={() => setRenewingMember(member)}>
                      <RefreshCw className="size-4" />
                      Renew
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/members/${member.id}`}>
                        <ArrowRight className="size-4" />
                        Open
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link
                        href={getWhatsAppLink(member.phone, member.full_name)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle className="size-4" />
                        WhatsApp
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
