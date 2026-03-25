"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  LANGUAGE_COOKIE,
  getDictionary,
  getLanguageDirection,
  normalizeLanguage,
  type AppDictionary,
  type AppLanguage,
} from "@/lib/i18n";

type LanguageContextValue = {
  language: AppLanguage;
  dictionary: AppDictionary;
  direction: "ltr" | "rtl";
  setLanguage: (language: AppLanguage) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: AppLanguage;
  children: ReactNode;
}) {
  const router = useRouter();
  const [language, setLanguageState] = useState<AppLanguage>(initialLanguage);

  useEffect(() => {
    const normalized = normalizeLanguage(language);
    document.documentElement.lang = normalized;
    document.documentElement.dir = getLanguageDirection(normalized);
    document.cookie = `${LANGUAGE_COOKIE}=${normalized}; path=/; max-age=31536000; samesite=lax`;
    window.localStorage.setItem(LANGUAGE_COOKIE, normalized);
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      dictionary: getDictionary(language),
      direction: getLanguageDirection(language),
      setLanguage: (nextLanguage) => {
        const normalized = normalizeLanguage(nextLanguage);

        if (normalized === language) {
          return;
        }

        setLanguageState(normalized);
        router.refresh();
      },
    }),
    [language, router],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
