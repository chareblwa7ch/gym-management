import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.78rem] font-semibold tracking-wide shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-secondary/90 text-secondary-foreground ring-1 ring-border/60",
        success: "bg-emerald-500/14 text-emerald-700 ring-1 ring-emerald-500/18 dark:text-emerald-300",
        warning: "bg-amber-500/16 text-amber-800 ring-1 ring-amber-500/18 dark:text-amber-300",
        destructive: "bg-rose-500/14 text-rose-700 ring-1 ring-rose-500/18 dark:text-rose-300",
        muted: "bg-muted/90 text-muted-foreground ring-1 ring-border/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
