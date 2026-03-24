"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Welcome back.");
      router.replace("/dashboard");
      router.refresh();
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
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

      <div className="space-y-2">
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

      <Button type="submit" size="xl" className="w-full" disabled={isPending}>
        {isPending ? <LoadingSpinner className="size-5" /> : <ArrowRight className="size-5" />}
        Sign in
      </Button>
    </form>
  );
}
