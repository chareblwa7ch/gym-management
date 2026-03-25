"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, ArrowRight, Lock, Mail } from "lucide-react";
import {
  initialLoginActionState,
  signInAction,
} from "@/app/login/actions";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="xl" className="w-full" disabled={pending}>
      {pending ? (
        <LoadingSpinner className="size-5" />
      ) : (
        <ArrowRight className="size-5" />
      )}
      Sign in
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(
    signInAction,
    initialLoginActionState,
  );

  return (
    <form className="space-y-6" action={formAction}>
      <div className="space-y-2.5">
        <Label htmlFor="email" className="text-sm font-semibold">
          Staff email
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={state.email}
            placeholder="owner@gym.com"
            className="pl-11"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            className="pl-11"
            required
            autoComplete="current-password"
          />
        </div>
      </div>

      {state.error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-[calc(var(--radius)-0.1rem)] border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-foreground"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p>{state.error}</p>
        </div>
      ) : null}

      <LoginSubmitButton />

      <p className="text-center text-sm leading-6 text-muted-foreground">
        Internal access only. Members do not use this system.
      </p>
    </form>
  );
}
