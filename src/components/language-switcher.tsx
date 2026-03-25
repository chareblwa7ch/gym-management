"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { languageOptions } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";

export function LanguageSwitcher() {
  const { language, setLanguage, dictionary } = useLanguage();

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-border/70 bg-card/90 p-1 shadow-sm"
      aria-label={dictionary.common.language}
    >
      <div className="hidden sm:flex size-8 items-center justify-center rounded-full text-muted-foreground">
        <Languages className="size-4" />
      </div>
      {languageOptions.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="sm"
          variant={language === option.value ? "default" : "ghost"}
          className="h-9 min-w-11 px-3"
          onClick={() => setLanguage(option.value)}
          aria-pressed={language === option.value}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
