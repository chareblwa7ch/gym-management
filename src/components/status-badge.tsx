import { Badge } from "@/components/ui/badge";
import type { MembershipStatus } from "@/lib/types";

type StatusBadgeProps = {
  status: MembershipStatus;
};

const labels: Record<MembershipStatus, string> = {
  active: "Active",
  "expiring-soon": "Expiring Soon",
  expired: "Expired",
  "no-subscription": "No Subscription",
};

const variants: Record<
  MembershipStatus,
  "success" | "warning" | "destructive" | "muted"
> = {
  active: "success",
  "expiring-soon": "warning",
  expired: "destructive",
  "no-subscription": "muted",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={variants[status]} className="px-3.5 py-1.5 text-sm font-semibold">
      <span className="size-2.5 rounded-full bg-current/90 shadow-[0_0_0_3px_rgba(255,255,255,0.08)]" aria-hidden="true" />
      {labels[status]}
    </Badge>
  );
}
