"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  Subscription,
  SubscriptionSummary,
  CategorySpending,
  MonthlyTrend,
  SpendingRank,
  SavingsSimulation,
  ServiceReview,
} from "@management-subscribe/shared";
import type { CreateSubscriptionInput } from "@management-subscribe/shared";

const KEYS = {
  all: ["subscriptions"] as const,
  list: (filters?: Record<string, string>) =>
    [...KEYS.all, "list", filters] as const,
  detail: (id: string) => [...KEYS.all, "detail", id] as const,
  summary: () => [...KEYS.all, "summary"] as const,
  byCategory: () => ["analytics", "by-category"] as const,
  monthlyTrend: () => ["analytics", "monthly-trend"] as const,
  ranking: () => ["analytics", "ranking"] as const,
  savingsSimulation: () => ["analytics", "savings-simulation"] as const,
  review: () => ["analytics", "review"] as const,
};

export function useSubscriptions(filters?: Record<string, string>) {
  const params = filters
    ? "?" + new URLSearchParams(filters).toString()
    : "";
  return useQuery({
    queryKey: KEYS.list(filters),
    queryFn: () => api.get<Subscription[]>(`/api/subscriptions${params}`),
  });
}

export function useSubscription(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => api.get<Subscription>(`/api/subscriptions/${id}`),
    enabled: !!id,
  });
}

export function useSubscriptionSummary() {
  return useQuery({
    queryKey: KEYS.summary(),
    queryFn: () => api.get<SubscriptionSummary>("/api/subscriptions/summary"),
  });
}

export function useCategorySpending() {
  return useQuery({
    queryKey: KEYS.byCategory(),
    queryFn: () => api.get<CategorySpending[]>("/api/analytics/by-category"),
  });
}

export function useMonthlyTrend() {
  return useQuery({
    queryKey: KEYS.monthlyTrend(),
    queryFn: () => api.get<MonthlyTrend[]>("/api/analytics/monthly-trend"),
  });
}

export function useSpendingRanking() {
  return useQuery({
    queryKey: KEYS.ranking(),
    queryFn: () => api.get<SpendingRank[]>("/api/analytics/ranking"),
  });
}

export function useSavingsSimulation() {
  return useQuery({
    queryKey: KEYS.savingsSimulation(),
    queryFn: () =>
      api.get<SavingsSimulation[]>("/api/analytics/savings-simulation"),
  });
}

export function useServiceReview() {
  return useQuery({
    queryKey: KEYS.review(),
    queryFn: () => api.get<ServiceReview[]>("/api/analytics/review"),
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubscriptionInput) =>
      api.post<Subscription>("/api/subscriptions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
    },
  });
}

export function useUpdateSubscription(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateSubscriptionInput>) =>
      api.put<Subscription>(`/api/subscriptions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/subscriptions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
    },
  });
}

export function useToggleSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch<Subscription>(`/api/subscriptions/${id}/toggle`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
    },
  });
}
