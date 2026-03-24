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
        "flex flex-col items-center justify-center rounded-[calc(var(--radius)+0.2rem)] border border-dashed border-border/80 bg-muted/35 px-6 py-10 text-center",
        className,
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-full border border-border/70 bg-card text-primary">
        <Icon className="size-6" />
      </div>
      <h3 className="text-lg font-semibold sm:text-xl">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
