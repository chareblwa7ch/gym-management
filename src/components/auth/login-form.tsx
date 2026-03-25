"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Lock, Mail } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setErrorMessage("Enter both your staff email and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        setErrorMessage("The email or password is incorrect. Please try again.");
        return;
      }

      window.location.assign("/dashboard");
    } catch {
      setErrorMessage("Sign in could not be completed right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2.5">
        <Label htmlFor="email" className="text-sm font-semibold">
          Staff email
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="pl-11"
            required
            autoComplete="current-password"
          />
        </div>
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-[calc(var(--radius)-0.1rem)] border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-foreground"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p>{errorMessage}</p>
        </div>
      ) : null}

      <Button type="submit" size="xl" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <LoadingSpinner className="size-5" />
        ) : (
          <ArrowRight className="size-5" />
        )}
        Sign in
      </Button>

      <p className="text-center text-sm leading-6 text-muted-foreground">
        Internal access only. Members do not use this system.
      </p>
    </form>
  );
}
