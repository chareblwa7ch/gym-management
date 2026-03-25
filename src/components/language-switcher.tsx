"use client";

import { ChevronDown, Languages } from "lucide-react";
import { languageOptions } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";

export function LanguageSwitcher() {
  const { language, setLanguage, dictionary, isChangingLanguage } = useLanguage();

  return (
    <div
      className="relative flex items-center gap-2 rounded-full border border-border/70 bg-card/90 px-3 py-2 shadow-sm"
      aria-label={dictionary.common.language}
    >
      <div className="flex size-8 items-center justify-center rounded-full text-muted-foreground">
        <Languages className="size-4" />
      </div>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as typeof language)}
        disabled={isChangingLanguage}
        aria-label={dictionary.common.language}
        className="min-w-[7.75rem] appearance-none bg-transparent pe-7 text-sm font-semibold text-foreground outline-none"
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
