import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyDh(amount: number | string) {
  const numericAmount =
    typeof amount === "number" ? amount : Number.parseFloat(amount);

  return `${numericAmount.toFixed(0)} DH`;
}

export function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
