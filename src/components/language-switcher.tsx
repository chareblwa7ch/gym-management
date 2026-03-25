"use client";

import { ChevronDown, Languages } from "lucide-react";
import { languageOptions } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";

export function LanguageSwitcher() {
  const { language, setLanguage, dictionary, isChangingLanguage } = useLanguage();
  const activeLanguage =
    languageOptions.find((option) => option.value === language) ?? languageOptions[0];

  return (
    <div
      className="relative flex min-w-[10rem] items-center rounded-full border border-border/70 bg-card/90 ps-1 pe-10 shadow-sm"
      aria-label={dictionary.common.language}
    >
      <div className="pointer-events-none flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground">
        <Languages className="size-4" />
      </div>
      <div className="pointer-events-none flex min-w-0 flex-1 items-center">
        <span className="truncate text-sm font-semibold text-foreground">
          {activeLanguage.flag} {activeLanguage.label}
        </span>
      </div>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as typeof language)}
        disabled={isChangingLanguage}
        aria-label={dictionary.common.language}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full bg-transparent text-sm text-foreground opacity-0 outline-none"
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.flag} {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
