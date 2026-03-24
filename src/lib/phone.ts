import { GYM_NAME } from "@/lib/constants";

export function normalizeWhatsAppPhone(phone: string) {
  const trimmed = phone.trim();
  const numbersOnly = trimmed.replace(/\D/g, "");

  if (!numbersOnly) {
    return "";
  }

  if (trimmed.startsWith("+")) {
    return numbersOnly;
  }

  if (numbersOnly.startsWith("00")) {
    return numbersOnly.slice(2);
  }

  if (numbersOnly.startsWith("0")) {
    return `212${numbersOnly.slice(1)}`;
  }

  return numbersOnly;
}

export function getWhatsAppLink(phone: string, memberName?: string) {
  const normalized = normalizeWhatsAppPhone(phone);
  const greeting = memberName
    ? `Hello ${memberName}, this is ${GYM_NAME}.`
    : `Hello from ${GYM_NAME}.`;

  return `https://wa.me/${normalized}?text=${encodeURIComponent(greeting)}`;
}
