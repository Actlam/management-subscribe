import type { BillingCycle, Category } from "../constants";

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  category: Category;
  nextBillingDate: string;
  url: string | null;
  note: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionSummary {
  monthlyTotal: number;
  yearlyTotal: number;
  activeCount: number;
}

export interface CategorySpending {
  category: Category;
  amount: number;
}

export interface MonthlyTrend {
  month: string;
  amount: number;
}

export interface SpendingRank {
  id: string;
  name: string;
  monthlyAmount: number;
  category: Category;
}

export interface SavingsSimulation {
  id: string;
  name: string;
  monthlySaving: number;
  yearlySaving: number;
}

export interface ServiceReview {
  id: string;
  name: string;
  category: Category;
  monthlyAmount: number;
  nextBillingDate: string;
  verdict: "維持" | "要検討" | "ダウングレード検討";
}
