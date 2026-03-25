"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { GYM_INITIALS, GYM_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type LogoPlaceholderProps = {
  showName?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-10 text-sm",
  md: "size-12 text-sm",
  lg: "size-16 text-base",
};

export function LogoPlaceholder({
  showName = true,
  size = "md",
  className,
}: LogoPlaceholderProps) {
  const [hasRealLogo, setHasRealLogo] = useState(false);

  useEffect(() => {
    let isActive = true;
    const image = new window.Image();

    image.onload = () => {
      if (isActive) {
        setHasRealLogo(true);
      }
    };

    image.onerror = () => {
      if (isActive) {
        setHasRealLogo(false);
      }
    };

    image.src = "/logo.png";

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-red-500 to-amber-400 text-white shadow-lg shadow-red-950/15 ring-1 ring-white/10",
          sizeClasses[size],
        )}
      >
        {hasRealLogo ? (
          <Image
            src="/logo.png"
            alt={GYM_NAME}
            fill
            sizes={size === "lg" ? "64px" : size === "md" ? "48px" : "40px"}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-bold tracking-[0.24em]">
            {GYM_INITIALS}
          </div>
        )}
      </div>

      {showName ? (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Staff App
          </p>
          <p className="truncate text-base font-semibold leading-tight text-foreground">
            {GYM_NAME}
          </p>
        </div>
      ) : null}
    </div>
  );
}
