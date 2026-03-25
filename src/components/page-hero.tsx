import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
  className,
}: PageHeroProps) {
  return (
    <Card className={cn("overflow-hidden border-border/70 bg-card/80", className)}>
      <CardContent className="relative flex flex-col gap-4 p-4 sm:gap-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="pointer-events-none absolute inset-0 subtle-grid opacity-[0.18] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

        <div className="relative flex items-start gap-3 sm:gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15 sm:size-14 sm:rounded-3xl">
            <Icon className="size-5 sm:size-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              {eyebrow}
            </p>
            <CardTitle className="mt-2 break-words text-[2rem] font-semibold sm:text-4xl">
              {title}
            </CardTitle>
            <CardDescription className="mt-3 max-w-3xl text-sm sm:text-base">
              {description}
            </CardDescription>
          </div>
        </div>

        {action ? <div className="relative">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
