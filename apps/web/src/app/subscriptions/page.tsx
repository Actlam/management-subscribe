"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CATEGORY_LABELS,
  type Category,
} from "@management-subscribe/shared";
import { useSubscriptions } from "@/lib/hooks/use-subscriptions";
import { SubscriptionTable } from "@/components/subscription-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SubscriptionsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filters: Record<string, string> = {};
  if (categoryFilter !== "all") filters.category = categoryFilter;
  if (activeFilter !== "all") filters.isActive = activeFilter;

  const { data: subscriptions, isLoading } = useSubscriptions(
    Object.keys(filters).length > 0 ? filters : undefined
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">サブスク一覧</h1>
        <Link href="/subscriptions/new">
          <Button>新規登録</Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? "all")}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="カテゴリで絞り込み" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべてのカテゴリ</SelectItem>
            {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Select value={activeFilter} onValueChange={(v) => setActiveFilter(v ?? "all")}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="true">有効のみ</SelectItem>
            <SelectItem value="false">無効のみ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          読み込み中...
        </div>
      ) : (
        <SubscriptionTable subscriptions={subscriptions ?? []} />
      )}
    </div>
  );
}
