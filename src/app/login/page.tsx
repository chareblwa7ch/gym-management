import type { Metadata } from "next";
import { KeyRound, ShieldCheck, Smartphone, Zap } from "lucide-react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { LogoPlaceholder } from "@/components/logo-placeholder";
import { SetupRequired } from "@/components/setup-required";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(245,158,11,0.12),_transparent_40%)]" />
      <div className="relative grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="hidden overflow-hidden lg:block">
          <CardHeader className="relative pb-0">
            <div className="pointer-events-none absolute inset-0 subtle-grid opacity-[0.2] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
            <div className="relative">
              <div className="flex items-center gap-4">
                <LogoPlaceholder size="lg" />
                <Badge variant="muted">Private staff access</Badge>
              </div>
              <CardTitle className="mt-10 text-4xl leading-tight">
                Simple staff dashboard for {GYM_NAME}
              </CardTitle>
              <CardDescription className="mt-4 max-w-2xl text-base leading-8">
                Built for quick daily use. Open the dashboard, spot expiring members,
                search a name, renew, and move on.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 py-8">
            <div className="rounded-3xl bg-muted/40 p-5">
              <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Zap className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">Fast renewals</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Renew a membership in a few taps without losing payment history.
              </p>
            </div>
            <div className="rounded-3xl bg-muted/40 p-5">
              <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-800 dark:text-amber-300">
                <Smartphone className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">Works on every screen</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Designed mobile-first for reception desks, tablets, and desktop use.
              </p>
            </div>
            <div className="rounded-3xl bg-muted/40 p-5">
              <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-700 dark:text-sky-300">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">Private internal access</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Only staff accounts can sign in. Members never use this system.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mx-auto w-full max-w-xl overflow-hidden border-border/70 bg-card/90">
          <CardHeader className="space-y-5">
            <div className="lg:hidden">
              <LogoPlaceholder />
            </div>
            <div className="space-y-3">
              <Badge variant="muted" className="w-fit">
                <KeyRound className="size-3.5" />
                Staff Login
              </Badge>
              <CardTitle className="mt-3 text-3xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in with your staff email and password to manage members.
              </CardDescription>
            </div>
          </CardHeader>
          <Separator />
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
