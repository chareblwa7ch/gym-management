import type { Metadata } from "next";
import { ClipboardPenLine, WalletCards } from "lucide-react";
import { AddMemberForm } from "@/components/add-member-form";
import { PageHero } from "@/components/page-hero";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GYM_PLAN_AMOUNT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Add Member",
};

export default function NewMemberPage() {
  return (
    <div className="page-section xl:grid xl:grid-cols-[1.1fr_0.9fr] xl:gap-6">
      <div className="space-y-6">
        <PageHero
          eyebrow="New registration"
          title="Add a member"
          description="This flow saves the member profile and the first payment together."
          icon={ClipboardPenLine}
        />

        <AddMemberForm />
      </div>

      <Card className="h-fit overflow-hidden border-border/70 bg-card/85">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <WalletCards className="size-5" />
          </div>
          <div>
            <CardTitle className="text-2xl">Quick guide</CardTitle>
            <CardDescription>
              A simple checklist for saving a new membership correctly.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>1. Enter the member name and phone number.</p>
          <p>2. Pick the payment date.</p>
          <p>3. Save the member. The expiry date is calculated automatically.</p>
          <div className="rounded-3xl border border-border/70 bg-muted/40 p-4 text-foreground">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Current gym plan
            </p>
            <p className="mt-2 text-3xl font-semibold">{GYM_PLAN_AMOUNT} DH</p>
            <p className="mt-2 text-sm text-muted-foreground">
              One monthly plan for all members, valid for 30 days.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
