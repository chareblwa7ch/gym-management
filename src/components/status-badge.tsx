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
    <Badge variant={variants[status]} className="px-3.5 py-1.5 text-sm">
      <span className="size-2 rounded-full bg-current" aria-hidden="true" />
      {labels[status]}
    </Badge>
  );
}
