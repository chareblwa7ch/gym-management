import { createClient } from "@/lib/supabase/server";

function isMissingSchemaError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as { code?: string; message?: string };

  return (
    candidate.code === "PGRST205" ||
    candidate.code === "42P01" ||
    candidate.message?.toLowerCase().includes("schema cache") === true ||
    candidate.message?.toLowerCase().includes("does not exist") === true
  );
}

export async function getSupabaseSchemaStatus() {
  const supabase = await createClient();

  if (!supabase) {
    return {
      ready: false,
      reason: "env-missing" as const,
      message: "Supabase environment variables are missing.",
    };
  }

  const [membersResult, subscriptionsResult] = await Promise.all([
    supabase.from("members").select("id").limit(1),
    supabase.from("subscriptions").select("id").limit(1),
  ]);

  if (!membersResult.error && !subscriptionsResult.error) {
    return {
      ready: true as const,
      reason: null,
      message: null,
    };
  }

  const blockingError = membersResult.error ?? subscriptionsResult.error;

  if (blockingError && isMissingSchemaError(blockingError)) {
    return {
      ready: false as const,
      reason: "schema-missing" as const,
      message: blockingError.message,
    };
  }

  throw blockingError;
}
