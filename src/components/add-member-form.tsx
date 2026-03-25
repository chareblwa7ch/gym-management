"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowRight, CalendarClock, Phone, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useLanguage } from "@/components/providers/language-provider";
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
  const { dictionary } = useLanguage();
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
      nextErrors.fullName = dictionary.addMemberPage.fullNameError;
    }

    if (!phone.trim()) {
      nextErrors.phone = dictionary.addMemberPage.phoneErrorMissing;
    } else if (normalizedPhone.length < 8) {
      nextErrors.phone = dictionary.addMemberPage.phoneErrorShort;
    }

    if (!paymentDate) {
      nextErrors.paymentDate = dictionary.addMemberPage.paymentDateError;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      toast.error(dictionary.addMemberPage.fixHighlightedFields);
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

      toast.success(dictionary.addMemberPage.memberAdded);
      router.push(`/members/${data}`);
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          {dictionary.addMemberPage.fastRegistration}
        </p>
        <CardTitle className="text-2xl">{dictionary.addMemberPage.formTitle}</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          {dictionary.addMemberPage.formDescription}
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-[calc(var(--radius)+0.05rem)] border border-border/70 bg-muted/25 p-4">
            <p className="text-sm font-semibold text-foreground">
              {dictionary.common.monthlyPlan}: {GYM_PLAN_AMOUNT} DH
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {dictionary.addMemberPage.monthlyPlanDescription}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {dictionary.common.memberInformation}
            </p>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="full-name">{dictionary.common.fullName}</Label>
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
                placeholder={dictionary.addMemberPage.fullNamePlaceholder}
                className="pl-11"
                required
                autoComplete="name"
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? "full-name-error" : "full-name-help"}
              />
            </div>
            <p id="full-name-help" className="text-sm text-muted-foreground">
              {dictionary.addMemberPage.fullNameHelp}
            </p>
            {errors.fullName ? (
              <p id="full-name-error" className="text-sm font-medium text-destructive">
                {errors.fullName}
              </p>
            ) : null}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="phone-number">{dictionary.common.phone}</Label>
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
              {dictionary.addMemberPage.phoneHelp}
            </p>
            {errors.phone ? (
              <p id="phone-error" className="text-sm font-medium text-destructive">
                {errors.phone}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {dictionary.addMemberPage.firstPayment}
            </p>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="payment-date">{dictionary.common.paymentDate}</Label>
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
              {dictionary.common.monthlyPlan}: {GYM_PLAN_AMOUNT} DH
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
            <Label htmlFor="notes">{dictionary.common.notes}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={dictionary.addMemberPage.notesPlaceholder}
              aria-describedby="notes-help"
            />
            <p id="notes-help" className="text-sm text-muted-foreground">
              {dictionary.addMemberPage.notesHelp}
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
            {isPending ? dictionary.common.savingMember : dictionary.common.saveMember}
          </Button>

          <p className="text-sm text-muted-foreground">
            {dictionary.addMemberPage.successHint}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
