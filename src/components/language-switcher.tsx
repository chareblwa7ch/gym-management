"use client";

import { ChevronDown, Languages } from "lucide-react";
import { languageOptions } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";

export function LanguageSwitcher() {
  const { language, setLanguage, dictionary, isChangingLanguage } = useLanguage();

  return (
    <div className="relative min-w-[10rem]">
      <div className="pointer-events-none absolute start-1 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground">
        <Languages className="size-4" />
      </div>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as typeof language)}
        disabled={isChangingLanguage}
        aria-label={dictionary.common.language}
        className="h-11 w-full cursor-pointer appearance-none rounded-full border border-border/70 bg-card/90 ps-10 pe-10 text-sm font-semibold text-foreground shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.flag} {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute end-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
