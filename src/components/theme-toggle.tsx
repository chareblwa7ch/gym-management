"use client";

import dynamic from "next/dynamic";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

function ThemeToggleInner() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Light mode" : "Dark mode";

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
      <span className="hidden text-sm sm:inline">{label}</span>
    </Button>
  );
}

export const ThemeToggle = dynamic(async () => ThemeToggleInner, {
  ssr: false,
});
