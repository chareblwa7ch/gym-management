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
    <Card className="flex h-full flex-col overflow-hidden border-border/70 bg-card/85">
      <CardHeader className="grid flex-1 grid-cols-[minmax(0,1fr)_auto] items-start gap-4 p-4 pb-5 sm:p-6 sm:pb-5">
        <div className="min-w-0">
          <p className="min-h-10 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:min-h-12 sm:text-sm">
            {title}
          </p>
          <CardTitle className="mt-3 text-[2.8rem] font-semibold leading-none tracking-tight sm:mt-4 sm:text-[3.1rem]">
            {value}
          </CardTitle>
        </div>
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-black/5 dark:ring-white/5",
            toneStyles[tone],
          )}
        >
          <Icon className="size-5" />
        </div>
        <CardDescription className="col-span-2 max-w-none text-sm leading-7">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 bg-muted/12 px-4 py-4 sm:px-6">
        <p className="text-sm font-medium text-muted-foreground">Live status</p>
        <Badge variant="muted" className="shrink-0">
          <Activity className="size-3.5" />
          Overview
        </Badge>
      </CardContent>
    </Card>
  );
}
