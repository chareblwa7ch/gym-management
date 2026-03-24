import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-2xl border border-input bg-background/96 px-4 py-3 text-base shadow-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/60 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-destructive/15 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
