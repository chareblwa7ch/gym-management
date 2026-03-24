"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTodayDateString } from "@/lib/date";
import { renewMemberSubscription } from "@/lib/member-mutations";

type RenewModalProps = {
  member: {
    id: string;
    full_name: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RenewModal({ member, open, onOpenChange }: RenewModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!member) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const paymentDate = String(formData.get("paymentDate") ?? "");

    startTransition(async () => {
      const { error } = await renewMemberSubscription(member.id, paymentDate);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(`${member.full_name} has been renewed.`);
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renew membership</DialogTitle>
          <DialogDescription>
            Save a new monthly payment for {member?.full_name ?? "this member"}.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="renew-payment-date">Payment date</Label>
            <Input
              key={`${member?.id ?? "member"}-${open ? "open" : "closed"}`}
              id="renew-payment-date"
              name="paymentDate"
              type="date"
              defaultValue={getTodayDateString()}
              required
              aria-describedby="renew-payment-date-help"
            />
            <p id="renew-payment-date-help" className="text-sm text-muted-foreground">
              The app will automatically set the expiry date 30 days later.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <LoadingSpinner /> : null}
              Confirm renewal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
