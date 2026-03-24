"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function DashboardError({
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
    <div className="py-6">
      <EmptyState
        icon={AlertTriangle}
        title="This page could not load"
        description="The dashboard hit a server error while loading data. Try reloading the page. If the problem keeps happening, check the Supabase schema and Vercel environment variables."
        action={
          <Button type="button" onClick={reset}>
            Try again
          </Button>
        }
      />
    </div>
  );
}
