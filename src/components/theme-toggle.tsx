"use client";

import dynamic from "next/dynamic";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";

type ThemeToggleInnerProps = {
  showLabel?: boolean;
};

function ThemeToggleInner({ showLabel = true }: ThemeToggleInnerProps) {
  const { dictionary } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const label = isDark ? dictionary.common.lightMode : dictionary.common.darkMode;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${label}`}
      aria-pressed={isDark}
      className="min-w-[2.5rem] gap-2 px-3 sm:px-4"
    >
      {isDark ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
      {showLabel ? <span className="hidden text-sm sm:inline">{label}</span> : null}
    </Button>
  );
}

export const ThemeToggle = dynamic<ThemeToggleInnerProps>(async () => ThemeToggleInner, {
  ssr: false,
});
