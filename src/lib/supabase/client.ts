"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/types";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  const env = getSupabaseEnv();

  if (!env) {
    throw new Error("Supabase environment variables are missing.");
  }

  if (!browserClient) {
    browserClient = createBrowserClient<Database>(env.url, env.anonKey);
  }

  return browserClient;
}
