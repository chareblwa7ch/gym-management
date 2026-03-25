"use client";

import { useState, useTransition } from "react";
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
  const { dictionary } = useLanguage();
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
      nextErrors.fullName = dictionary.addMemberPage.fullNameError;
    }

    if (!phone) {
      nextErrors.phone = dictionary.addMemberPage.phoneErrorMissing;
    } else if (phoneDigits.length < 8) {
      nextErrors.phone = dictionary.addMemberPage.phoneErrorShort;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error(dictionary.addMemberPage.fixHighlightedFields);
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

      toast.success(dictionary.memberProfilePage.updated);
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dictionary.editModal.title}</DialogTitle>
          <DialogDescription>
            {dictionary.editModal.description}
          </DialogDescription>
        </DialogHeader>
        <form
          key={`${member?.id ?? "member"}-${open ? "open" : "closed"}`}
          className="space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="edit-member-name">{dictionary.common.fullName}</Label>
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
            <Label htmlFor="edit-member-phone">{dictionary.common.phone}</Label>
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
            <Label htmlFor="edit-member-notes">{dictionary.common.notes}</Label>
            <Textarea
              id="edit-member-notes"
              name="notes"
              defaultValue={member?.notes ?? ""}
              placeholder={dictionary.addMemberPage.notesPlaceholder}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              {dictionary.common.cancel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <LoadingSpinner /> : null}
              {dictionary.common.saveChanges}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
