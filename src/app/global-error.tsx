"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, House } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
        <div className="w-full max-w-xl rounded-[calc(var(--radius)+0.2rem)] border border-border/80 bg-card/95 p-8 text-center shadow-2xl">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-border/70 bg-muted/40 text-primary">
            <AlertTriangle className="size-6" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold">The app could not load</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            A critical error happened while loading the page. Try again, or go back to the dashboard.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button type="button" onClick={reset}>
              Try again
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">
                <House className="size-4" />
                Back to dashboard
              </Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
