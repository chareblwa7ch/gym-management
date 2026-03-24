"use client";

import { useState, useTransition } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { updateMemberProfile } from "@/lib/member-mutations";

type EditMemberModalProps = {
  member: {
    id: string;
    full_name: string;
    phone: string;
    notes: string | null;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormErrors = {
  fullName?: string;
  phone?: string;
};

export function EditMemberModal({
  member,
  open,
  onOpenChange,
}: EditMemberModalProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setErrors({});
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!member) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const notes = String(formData.get("notes") ?? "");
    const phoneDigits = phone.replace(/\D/g, "");
    const nextErrors: FormErrors = {};

    if (!fullName) {
      nextErrors.fullName = "Please enter the member's full name.";
    }

    if (!phone) {
      nextErrors.phone = "Please enter a phone number.";
    } else if (phoneDigits.length < 8) {
      nextErrors.phone = "Phone number looks too short.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    startTransition(async () => {
      const { error } = await updateMemberProfile({
        memberId: member.id,
        fullName,
        phone,
        notes,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Member details updated.");
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit member</DialogTitle>
          <DialogDescription>
            Update the member&apos;s basic contact details and notes.
          </DialogDescription>
        </DialogHeader>
        <form
          key={`${member?.id ?? "member"}-${open ? "open" : "closed"}`}
          className="space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="edit-member-name">Full name</Label>
            <Input
              id="edit-member-name"
              name="fullName"
              defaultValue={member?.full_name ?? ""}
              required
              autoComplete="name"
              aria-invalid={Boolean(errors.fullName)}
            />
            {errors.fullName ? (
              <p className="text-sm font-medium text-destructive">{errors.fullName}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-member-phone">Phone number</Label>
            <Input
              id="edit-member-phone"
              name="phone"
              defaultValue={member?.phone ?? ""}
              required
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone ? (
              <p className="text-sm font-medium text-destructive">{errors.phone}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-member-notes">Notes</Label>
            <Textarea
              id="edit-member-notes"
              name="notes"
              defaultValue={member?.notes ?? ""}
              placeholder="Optional staff notes"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <LoadingSpinner /> : null}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
