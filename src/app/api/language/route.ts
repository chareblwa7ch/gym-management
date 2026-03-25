import { NextResponse } from "next/server";
import { LANGUAGE_COOKIE, normalizeLanguage } from "@/lib/i18n";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { language?: string } | null;
  const language = normalizeLanguage(body?.language);

  const response = NextResponse.json({ ok: true, language });
  response.cookies.set(LANGUAGE_COOKIE, language, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}
