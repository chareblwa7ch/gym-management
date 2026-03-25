"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, Plus } from "lucide-react";
import { MemberTable } from "@/components/member-table";
import { SearchBar } from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { MemberWithSubscription } from "@/lib/types";
import type { MembersStatusFilter } from "@/lib/members";

type MembersPageClientProps = {
  members: MemberWithSubscription[];
  counts: Record<MembersStatusFilter, number>;
  initialQuery: string;
  initialStatus: MembersStatusFilter;
};

const filters: Array<{ value: MembersStatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "expiring-soon", label: "Expiring Soon" },
  { value: "expired", label: "Expired" },
];

export function MembersPageClient({
  members,
  counts,
  initialQuery,
  initialStatus,
}: MembersPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const currentQuery = searchParams.get("q") ?? "";

    if (query === currentQuery) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }

      startTransition(() => {
        router.replace(
          params.toString() ? `${pathname}?${params.toString()}` : pathname,
          { scroll: false },
        );
      });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, query, router, searchParams]);

  const handleStatusChange = (status: MembersStatusFilter) => {
    const params = new URLSearchParams(searchParams.toString());

    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }

    startTransition(() => {
      router.replace(
        params.toString() ? `${pathname}?${params.toString()}` : pathname,
        { scroll: false },
      );
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card/82">
        <CardContent className="space-y-5 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full max-w-2xl">
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder="Search members by name or phone"
              />
            </div>
            <Button asChild size="lg" className="w-full sm:w-fit">
              <Link href="/members/new">
                <Plus className="size-5" />
                Add member
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Filter className="size-4" />
                Filter members
              </div>
              <Badge variant="muted">{counts.all} total</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter.value}
                  type="button"
                  onClick={() => handleStatusChange(filter.value)}
                  aria-pressed={initialStatus === filter.value}
                  variant={initialStatus === filter.value ? "default" : "outline"}
                  size="default"
                >
                  {filter.label} ({counts[filter.value]})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <MemberTable
        members={members}
        totalMembers={counts.all}
        filteredCount={members.length}
      />

      {isPending ? (
        <p aria-live="polite" className="text-sm text-muted-foreground">
          Updating members list...
        </p>
      ) : null}
    </div>
  );
}
