"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";

type DeleteConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  pending?: boolean;
};

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  pending = false,
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={pending}>
            {pending ? <LoadingSpinner /> : null}
            Delete member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
