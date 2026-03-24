import type { LucideIcon } from "lucide-react";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardStatCardProps = {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
};

const toneStyles = {
  default: "bg-slate-500/12 text-slate-700 dark:text-slate-200",
  success: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/14 text-amber-800 dark:text-amber-300",
  danger: "bg-rose-500/12 text-rose-700 dark:text-rose-300",
};

export function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "default",
}: DashboardStatCardProps) {
  return (
    <Card className="overflow-hidden border-border/70 bg-card/85">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {title}
          </p>
          <CardTitle className="mt-4 text-4xl font-semibold tracking-tight sm:text-[2.6rem]">
            {value}
          </CardTitle>
        </div>
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-white/5",
            toneStyles[tone],
          )}
        >
          <Icon className="size-5" />
        </div>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3 border-t border-border/60 bg-muted/15 pt-4">
        <CardDescription className="max-w-[18rem]">{description}</CardDescription>
        <Badge variant="muted" className="shrink-0">
          <Activity className="size-3.5" />
          Overview
        </Badge>
      </CardContent>
    </Card>
  );
}
