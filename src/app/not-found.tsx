import Link from "next/link";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <EmptyState
        icon={SearchX}
        title="Page not found"
        description="The page you tried to open does not exist or may have been removed."
        action={
          <Button asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        }
        className="w-full max-w-xl"
      />
    </div>
  );
}
