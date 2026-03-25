import { GYM_NAME } from "@/lib/constants";
import type { MembershipStatus } from "@/lib/types";

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

  if (numbersOnly.startsWith("212")) {
    return numbersOnly;
  }

  return numbersOnly;
}

type WhatsAppMessageOptions = {
  memberName?: string;
  template?: "default" | "membership-status" | "expiring-soon" | "expired";
  status?: MembershipStatus;
  daysRemaining?: number | null;
};

function getMembershipStatusMessage({
  memberName,
  status,
  daysRemaining,
}: Pick<WhatsAppMessageOptions, "memberName" | "status" | "daysRemaining">) {
  const name = memberName ? ` ${memberName}` : "";

  if (status === "expiring-soon") {
    if (daysRemaining === 0) {
      return `Hello${name}, this is ${GYM_NAME}. Your membership expires today. You can renew at the gym whenever you are ready.`;
    }

    const remaining = typeof daysRemaining === "number" ? daysRemaining : 2;
    return `Hello${name}, this is ${GYM_NAME}. Your membership expires in ${remaining} day${remaining === 1 ? "" : "s"}. You can renew at the gym at your convenience.`;
  }

  if (status === "expired") {
    if (typeof daysRemaining === "number") {
      const expiredFor = Math.abs(daysRemaining);

      if (expiredFor === 1) {
        return `Hello${name}, this is ${GYM_NAME}. Your membership expired yesterday. You can renew at the gym whenever you are ready.`;
      }

      return `Hello${name}, this is ${GYM_NAME}. Your membership expired ${expiredFor} days ago. You can come to the gym anytime to renew it.`;
    }

    return `Hello${name}, this is ${GYM_NAME}. Your membership has expired. You can come to the gym anytime to renew it.`;
  }

  return `Hello${name}, this is ${GYM_NAME}. We are sharing a quick update about your gym membership.`;
}

export function getWhatsAppActionLabel(
  status?: MembershipStatus,
  labels?: {
    sendReminder: string;
    whatsApp: string;
  },
) {
  if (status === "expiring-soon" || status === "expired") {
    return labels?.sendReminder ?? "Send reminder";
  }

  return labels?.whatsApp ?? "WhatsApp";
}

export function getWhatsAppLink(
  phone: string,
  options: WhatsAppMessageOptions = {},
) {
  const normalized = normalizeWhatsAppPhone(phone);
  const greeting =
    options.template === "expiring-soon"
      ? getMembershipStatusMessage({
          memberName: options.memberName,
          status: "expiring-soon",
          daysRemaining: options.daysRemaining,
        })
      : options.template === "expired"
        ? getMembershipStatusMessage({
            memberName: options.memberName,
            status: "expired",
            daysRemaining: options.daysRemaining,
          })
        : options.template === "membership-status"
          ? getMembershipStatusMessage({
              memberName: options.memberName,
              status: options.status,
              daysRemaining: options.daysRemaining,
            })
          : options.memberName
            ? `Hello ${options.memberName}, this is ${GYM_NAME}.`
            : `Hello from ${GYM_NAME}.`;

  return `https://wa.me/${normalized}?text=${encodeURIComponent(greeting)}`;
}
