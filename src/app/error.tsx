"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, House } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function AppError({
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
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <EmptyState
        icon={AlertTriangle}
        title="Something went wrong"
        description="The page hit an unexpected error. Try reloading it. If the problem continues, go back to the dashboard and try again."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
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
        }
        className="w-full max-w-xl"
      />
    </div>
  );
}
