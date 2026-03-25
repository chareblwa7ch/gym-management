import { cookies } from "next/headers";
import { getDictionary, normalizeLanguage } from "@/lib/i18n";

export async function getRequestLanguage() {
  const cookieStore = await cookies();
  return normalizeLanguage(cookieStore.get("esf-lang")?.value);
}

export async function getRequestDictionary() {
  const language = await getRequestLanguage();

  return {
    language,
    dictionary: getDictionary(language),
  };
}
