import Link from "next/link";
import { SignalLow, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GYM_NAME } from "@/lib/constants";

export const metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <Card className="w-full max-w-lg border-border/70 bg-card/92 surface-shadow">
        <CardHeader className="space-y-5 p-6 sm:p-8">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <WifiOff className="size-7" />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              {GYM_NAME}
            </p>
            <CardTitle className="text-3xl leading-tight">You are offline</CardTitle>
            <p className="text-base leading-7 text-muted-foreground">
              The dashboard needs an internet connection to load live member data from
              Supabase. Reconnect and open the app again.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6 pt-0 sm:p-8 sm:pt-0">
          <div className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-9 items-center justify-center rounded-xl bg-background/80 text-muted-foreground">
                <SignalLow className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">Connection required</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Login, member search, renewals, and dashboard numbers refresh when the
                  device is back online.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="flex-1">
              <Link href="/">Try again</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1">
              <Link href="/login">Open login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
