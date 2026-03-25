import type { Metadata } from "next";
import {
  Clock3,
  KeyRound,
  ShieldCheck,
  Smartphone,
  UserRoundCheck,
} from "lucide-react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { LogoPlaceholder } from "@/components/logo-placeholder";
import { SetupRequired } from "@/components/setup-required";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GYM_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage() {
  const supabase = await createClient();

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <SetupRequired />
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.18),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(245,158,11,0.1),_transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 subtle-grid opacity-[0.22] [mask-image:linear-gradient(to_bottom,white,transparent_72%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="order-2 overflow-hidden border-border/70 bg-card/82 surface-shadow lg:order-1">
            <CardHeader className="space-y-6 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <LogoPlaceholder size="lg" />
                <Badge variant="muted">Private staff access</Badge>
              </div>

              <div className="space-y-4">
                <CardTitle className="max-w-2xl text-3xl leading-tight sm:text-4xl">
                  Clean, simple member management for {GYM_NAME}
                </CardTitle>
                <CardDescription className="max-w-2xl text-base leading-8">
                  Built for fast daily work. Open the dashboard, see who needs
                  renewal, update a member, and keep the front desk moving.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 p-6 pt-0 sm:grid-cols-3 sm:p-8 sm:pt-0">
              <div className="rounded-[calc(var(--radius)+0.05rem)] border border-border/70 bg-background/60 p-5">
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Clock3 className="size-5" />
                </div>
                <h3 className="text-lg font-semibold">Quick daily checks</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  See active, expiring, and expired members without extra clicks.
                </p>
              </div>

              <div className="rounded-[calc(var(--radius)+0.05rem)] border border-border/70 bg-background/60 p-5">
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-800 dark:text-amber-300">
                  <Smartphone className="size-5" />
                </div>
                <h3 className="text-lg font-semibold">Comfortable on mobile</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Designed to stay clear and easy to use on phones, tablets, and desktops.
                </p>
              </div>

              <div className="rounded-[calc(var(--radius)+0.05rem)] border border-border/70 bg-background/60 p-5">
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-700 dark:text-sky-300">
                  <ShieldCheck className="size-5" />
                </div>
                <h3 className="text-lg font-semibold">Staff only</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Only owner and staff accounts can sign in and manage member data.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="order-1 mx-auto w-full max-w-xl overflow-hidden border-border/70 bg-card/92 surface-shadow lg:order-2">
            <CardHeader className="space-y-6 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <LogoPlaceholder />
                <ThemeToggle />
              </div>

              <div className="space-y-4">
                <Badge variant="muted" className="w-fit">
                  <KeyRound className="size-3.5" />
                  Staff Login
                </Badge>
                <div className="space-y-3">
                  <CardTitle className="text-3xl sm:text-4xl">
                    Sign in to continue
                  </CardTitle>
                  <CardDescription className="text-base leading-7">
                    Use your staff email and password to open the dashboard and manage memberships.
                  </CardDescription>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <UserRoundCheck className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Owner and staff</p>
                      <p className="text-xs text-muted-foreground">Internal access only</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300">
                      <Smartphone className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Mobile ready</p>
                      <p className="text-xs text-muted-foreground">Smooth on any screen</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-6 sm:p-8">
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
