import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SetupRequired } from "@/components/setup-required";
import { getSupabaseSchemaStatus } from "@/lib/supabase/schema-status";
import { createClient } from "@/lib/supabase/server";
import { toTitleCase } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  if (!user) {
    redirect("/login");
  }

  const role =
    typeof user.user_metadata?.role === "string"
      ? toTitleCase(user.user_metadata.role)
      : "Staff";

  let schemaStatus:
    | Awaited<ReturnType<typeof getSupabaseSchemaStatus>>
    | {
        ready: false;
        reason: "schema-missing";
        message: string;
      };

  try {
    schemaStatus = await getSupabaseSchemaStatus();
  } catch (error) {
    schemaStatus = {
      ready: false,
      reason: "schema-missing",
      message: error instanceof Error ? error.message : "Unknown server error",
    };
  }

  return (
    <AppShell userEmail={user.email ?? "staff@elamidy.local"} userRole={role}>
      {schemaStatus.ready ? (
        children
      ) : (
        <div className="py-4">
          <SetupRequired
            mode="database"
            message={schemaStatus.reason === "schema-missing" ? schemaStatus.message : undefined}
          />
        </div>
      )}
    </AppShell>
  );
}
