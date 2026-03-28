import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function toMonthlyCost(
  amount: number,
  billingCycle: "MONTHLY" | "YEARLY"
): number {
  return billingCycle === "YEARLY" ? Math.round(amount / 12) : amount;
}

export function toYearlyCost(
  amount: number,
  billingCycle: "MONTHLY" | "YEARLY"
): number {
  return billingCycle === "MONTHLY" ? amount * 12 : amount;
}
