"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useLanguage } from "@/components/providers/language-provider";
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
  const { dictionary } = useLanguage();
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

      toast.success(dictionary.renewModal.renewed(member.full_name));
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dictionary.renewModal.title}</DialogTitle>
          <DialogDescription>
            {dictionary.renewModal.description(member?.full_name ?? dictionary.common.members)}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="renew-payment-date">{dictionary.common.paymentDate}</Label>
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
              {dictionary.renewModal.paymentHelp}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {dictionary.common.cancel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <LoadingSpinner /> : null}
              {dictionary.renewModal.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
