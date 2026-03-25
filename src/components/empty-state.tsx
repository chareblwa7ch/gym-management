import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[calc(var(--radius)+0.2rem)] border border-dashed border-border/80 bg-muted/30 px-6 py-10 text-center sm:px-8 sm:py-12",
        className,
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-full border border-border/70 bg-card/95 text-primary shadow-sm">
        <Icon className="size-6" />
      </div>
      <h3 className="text-xl font-semibold sm:text-2xl">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
