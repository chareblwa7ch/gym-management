import { EXPIRING_SOON_DAYS, GYM_TIME_ZONE } from "@/lib/constants";
import type {
  MemberRow,
  MemberWithSubscription,
  MembershipStatus,
  SubscriptionRow,
} from "@/lib/types";

function dateStringToUtcMs(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function dateStringToUtcDate(dateString: string) {
  return new Date(dateStringToUtcMs(dateString));
}

export function getTodayDateString(timeZone = GYM_TIME_ZONE) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addDaysToDateString(dateString: string, days: number) {
  const utcDate = new Date(dateStringToUtcMs(dateString));
  utcDate.setUTCDate(utcDate.getUTCDate() + days);
  return utcDate.toISOString().slice(0, 10);
}

export function getDaysRemaining(
  expiryDate: string | null,
  todayDate = getTodayDateString(),
) {
  if (!expiryDate) {
    return null;
  }

  const diffMs = dateStringToUtcMs(expiryDate) - dateStringToUtcMs(todayDate);
  return Math.round(diffMs / 86_400_000);
}

export function getMembershipStatus(
  expiryDate: string | null,
  todayDate = getTodayDateString(),
): MembershipStatus {
  const daysRemaining = getDaysRemaining(expiryDate, todayDate);

  if (daysRemaining === null) {
    return "no-subscription";
  }

  if (daysRemaining < 0) {
    return "expired";
  }

  if (daysRemaining <= EXPIRING_SOON_DAYS) {
    return "expiring-soon";
  }

  return "active";
}

export function getRelativeExpiryLabel(
  expiryDate: string | null,
  todayDate = getTodayDateString(),
) {
  const daysRemaining = getDaysRemaining(expiryDate, todayDate);

  if (daysRemaining === null) {
    return "No subscription yet";
  }

  if (daysRemaining < 0) {
    const expiredFor = Math.abs(daysRemaining);

    if (expiredFor === 1) {
      return "Expired yesterday";
    }

    return `Expired ${expiredFor} days ago`;
  }

  if (daysRemaining === 0) {
    return "Expires today";
  }

  if (daysRemaining === 1) {
    return "1 day left";
  }

  return `${daysRemaining} days left`;
}

export function formatDisplayDate(dateString: string | null) {
  if (!dateString) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: GYM_TIME_ZONE,
  }).format(dateStringToUtcDate(dateString));
}

export function formatDateTime(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: GYM_TIME_ZONE,
  }).format(new Date(dateString));
}

export function enrichMemberRecord(
  member: MemberRow,
  latestSubscription: SubscriptionRow | null,
): MemberWithSubscription {
  const status = getMembershipStatus(latestSubscription?.expiry_date ?? null);
  const daysRemaining = getDaysRemaining(latestSubscription?.expiry_date ?? null);

  return {
    ...member,
    latestSubscription,
    status,
    daysRemaining,
    relativeExpiry: getRelativeExpiryLabel(
      latestSubscription?.expiry_date ?? null,
    ),
  };
}

export function compareByUrgency(
  first: MemberWithSubscription,
  second: MemberWithSubscription,
) {
  const firstDays =
    first.daysRemaining === null ? Number.POSITIVE_INFINITY : first.daysRemaining;
  const secondDays =
    second.daysRemaining === null ? Number.POSITIVE_INFINITY : second.daysRemaining;

  return firstDays - secondDays;
}
