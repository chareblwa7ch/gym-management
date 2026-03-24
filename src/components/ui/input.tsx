import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-13 w-full rounded-2xl border border-input bg-background/96 px-4 text-base shadow-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/60 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-destructive/15 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
