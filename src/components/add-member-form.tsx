"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowRight, CalendarClock, Phone, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GYM_PLAN_AMOUNT } from "@/lib/constants";
import { getTodayDateString } from "@/lib/date";
import { createMemberWithSubscription } from "@/lib/member-mutations";

type FormErrors = {
  fullName?: string;
  phone?: string;
  paymentDate?: string;
};

export function AddMemberForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentDate, setPaymentDate] = useState(getTodayDateString());
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();

  const normalizedPhone = useMemo(() => phone.replace(/\D/g, ""), [phone]);

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Please enter the member's full name.";
    }

    if (!phone.trim()) {
      nextErrors.phone = "Please enter a phone number.";
    } else if (normalizedPhone.length < 8) {
      nextErrors.phone = "Phone number looks too short.";
    }

    if (!paymentDate) {
      nextErrors.paymentDate = "Please choose the payment date.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    startTransition(async () => {
      const { data, error } = await createMemberWithSubscription({
        fullName: fullName.trim(),
        phone: phone.trim(),
        notes,
        paymentDate,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Member added successfully.");
      router.push(`/members/${data}`);
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          Fast registration
        </p>
        <CardTitle className="text-2xl">New member form</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Save the member and the first monthly payment together. The system
          automatically sets the membership expiry date.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-[calc(var(--radius)+0.05rem)] border border-border/70 bg-muted/25 p-4">
            <p className="text-sm font-semibold text-foreground">
              Monthly plan: {GYM_PLAN_AMOUNT} DH
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              The membership expires automatically 30 days after the payment date.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Member information
            </p>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="full-name">Full name</Label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="full-name"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  if (errors.fullName) {
                    setErrors((current) => ({ ...current, fullName: undefined }));
                  }
                }}
                placeholder="Member full name"
                className="pl-11"
                required
                autoComplete="name"
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? "full-name-error" : "full-name-help"}
              />
            </div>
            <p id="full-name-help" className="text-sm text-muted-foreground">
              Use the same full name staff will search later.
            </p>
            {errors.fullName ? (
              <p id="full-name-error" className="text-sm font-medium text-destructive">
                {errors.fullName}
              </p>
            ) : null}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="phone-number">Phone number</Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone-number"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  if (errors.phone) {
                    setErrors((current) => ({ ...current, phone: undefined }));
                  }
                }}
                placeholder="06XXXXXXXX"
                className="pl-11"
                required
                inputMode="tel"
                autoComplete="tel"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : "phone-help"}
              />
            </div>
            <p id="phone-help" className="text-sm text-muted-foreground">
              This number is used for search and quick WhatsApp contact.
            </p>
            {errors.phone ? (
              <p id="phone-error" className="text-sm font-medium text-destructive">
                {errors.phone}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              First payment
            </p>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="payment-date">Payment date</Label>
            <div className="relative">
              <CalendarClock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="payment-date"
                type="date"
                value={paymentDate}
                onChange={(event) => {
                  setPaymentDate(event.target.value);
                  if (errors.paymentDate) {
                    setErrors((current) => ({
                      ...current,
                      paymentDate: undefined,
                    }));
                  }
                }}
                className="pl-11"
                required
                aria-invalid={Boolean(errors.paymentDate)}
                aria-describedby={errors.paymentDate ? "payment-date-error" : "payment-date-help"}
              />
            </div>
            <p id="payment-date-help" className="text-sm text-muted-foreground">
              Monthly plan: {GYM_PLAN_AMOUNT} DH
            </p>
            {errors.paymentDate ? (
              <p
                id="payment-date-error"
                className="text-sm font-medium text-destructive"
              >
                {errors.paymentDate}
              </p>
            ) : null}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional notes for staff"
              aria-describedby="notes-help"
            />
            <p id="notes-help" className="text-sm text-muted-foreground">
              Useful for reminders, injuries, or payment notes.
            </p>
          </div>

          <Button
            type="submit"
            size="xl"
            className="w-full sm:w-auto"
            disabled={isPending}
          >
            {isPending ? (
              <LoadingSpinner className="size-5" />
            ) : (
              <ArrowRight className="size-5" />
            )}
            {isPending ? "Saving member..." : "Save member"}
          </Button>

          <p className="text-sm text-muted-foreground">
            After saving, the member profile opens automatically.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
