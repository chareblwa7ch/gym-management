import { Settings2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GYM_NAME } from "@/lib/constants";

type SetupRequiredProps = {
  mode?: "env" | "database";
  message?: string;
};

export function SetupRequired({
  mode = "env",
  message,
}: SetupRequiredProps) {
  const isDatabaseMode = mode === "database";

  return (
    <Card className="mx-auto w-full max-w-2xl border-border/70">
      <CardHeader>
        <div className="mb-4 flex size-14 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/15 text-amber-700 dark:text-amber-300">
          <Settings2 className="size-6" />
        </div>
        <CardTitle>
          {isDatabaseMode
            ? "Run the Supabase database schema to finish setup"
            : `Connect Supabase to start using ${GYM_NAME}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
        {isDatabaseMode ? (
          <>
            <p>
              Your Supabase project is connected, but the required tables do not
              exist yet.
            </p>
            <div className="rounded-3xl bg-muted px-4 py-4 font-mono text-sm text-foreground">
              <p>supabase/schema.sql</p>
            </div>
            <p>
              Open the Supabase SQL Editor, paste the contents of{" "}
              <code>supabase/schema.sql</code>, run it once, then refresh this page.
            </p>
            {message ? (
              <p className="rounded-3xl border border-dashed border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-900 dark:text-amber-200">
                Supabase says: {message}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <p>Create a <code>.env.local</code> file with these values before signing in:</p>
            <div className="rounded-3xl bg-muted px-4 py-4 font-mono text-sm text-foreground">
              <p>NEXT_PUBLIC_SUPABASE_URL</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
            </div>
            <p>
              You can copy them from <code>.env.example</code>. After that, run the SQL
              schema from <code>supabase/schema.sql</code> and create at least one staff
              account in Supabase Auth.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
