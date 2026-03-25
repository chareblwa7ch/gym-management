"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, Plus } from "lucide-react";
import { MemberTable } from "@/components/member-table";
import { useLanguage } from "@/components/providers/language-provider";
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
  initialPage: number;
  pagination: {
    page: number;
    pageSize: number;
    totalMatching: number;
    totalPages: number;
    start: number;
    end: number;
  };
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
  initialPage,
  pagination,
}: MembersPageClientProps) {
  const { dictionary } = useLanguage();
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

      params.delete("page");

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

    params.delete("page");

    startTransition(() => {
      router.replace(
        params.toString() ? `${pathname}?${params.toString()}` : pathname,
        { scroll: false },
      );
    });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
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
                placeholder={dictionary.common.searchMembers}
              />
            </div>
            <Button asChild size="lg" className="w-full sm:w-fit">
              <Link href="/members/new">
                <Plus className="size-5" />
                {dictionary.membersPage.addMember}
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Filter className="size-4" />
                {dictionary.membersPage.filterMembers}
              </div>
              <Badge variant="muted">{counts.all} {dictionary.membersPage.total}</Badge>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {filters.map((filter) => (
                <Button
                  key={filter.value}
                  type="button"
                  onClick={() => handleStatusChange(filter.value)}
                  aria-pressed={initialStatus === filter.value}
                  variant={initialStatus === filter.value ? "default" : "outline"}
                  size="default"
                >
                  {(filter.value === "all"
                    ? dictionary.common.all
                    : filter.value === "active"
                      ? dictionary.common.active
                      : filter.value === "expiring-soon"
                        ? dictionary.common.expiringSoon
                        : dictionary.common.expired)}{" "}
                  ({counts[filter.value]})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <MemberTable
        members={members}
        totalMembers={counts.all}
        matchingCount={pagination.totalMatching}
        visibleCount={members.length}
      />

      {pagination.totalPages > 1 ? (
        <Card className="border-border/70 bg-card/82">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p className="text-sm text-muted-foreground">
              {dictionary.membersPage.showingRange(
                pagination.start,
                pagination.end,
                pagination.totalMatching,
              )}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => handlePageChange(initialPage - 1)}
                disabled={isPending || initialPage <= 1}
              >
                {dictionary.common.previous}
              </Button>
              <div className="flex items-center justify-center rounded-full border border-border/70 bg-muted/40 px-4 py-2 text-sm font-semibold text-muted-foreground">
                {dictionary.membersPage.pageOf(initialPage, pagination.totalPages)}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => handlePageChange(initialPage + 1)}
                disabled={isPending || initialPage >= pagination.totalPages}
              >
                {dictionary.common.next}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {isPending ? (
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {dictionary.membersPage.updating}
        </p>
      ) : null}
    </div>
  );
}
