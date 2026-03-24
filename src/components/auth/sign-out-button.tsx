"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message);
        return;
      }

      router.replace("/login");
      router.refresh();
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className={compact ? "w-full justify-center xl:justify-start" : "w-full justify-start"}
      onClick={handleSignOut}
      aria-label="Sign out"
    >
      {isPending ? <LoadingSpinner /> : <LogOut className="size-4" />}
      <span className={compact ? "hidden xl:inline" : ""}>Sign out</span>
    </Button>
  );
}
