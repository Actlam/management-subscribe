"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { Subscription } from "@management-subscribe/shared";
import { CATEGORY_LABELS } from "@management-subscribe/shared";
import {
  useSubscriptions,
  useSubscriptionSummary,
} from "@/lib/hooks/use-subscriptions";
import { CostSummaryCard } from "@/components/cost-summary-card";
import { formatCurrency, toMonthlyCost } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } =
    useSubscriptionSummary();
  const { data: subscriptions, isLoading: subsLoading } = useSubscriptions();

  const upcomingBillings = subscriptions
    ?.filter((s: Subscription) => s.isActive)
    .sort(
      (a: Subscription, b: Subscription) =>
        new Date(a.nextBillingDate).getTime() -
        new Date(b.nextBillingDate).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <Link href="/subscriptions/new">
          <Button>新規登録</Button>
        </Link>
      </div>

      {summaryLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-20" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CostSummaryCard
            title="月額合計"
            amount={summary?.monthlyTotal ?? 0}
            description="有効なサブスクの月額換算合計"
          />
          <CostSummaryCard
            title="年額合計"
            amount={summary?.yearlyTotal ?? 0}
            description="有効なサブスクの年額換算合計"
          />
          <CostSummaryCard
            title="登録数"
            amount={summary?.activeCount ?? 0}
            description="有効なサブスクリプション数"
            isCurrency={false}
            suffix="件"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>直近の請求予定</CardTitle>
        </CardHeader>
        <CardContent>
          {subsLoading ? (
            <p className="text-muted-foreground">読み込み中...</p>
          ) : upcomingBillings && upcomingBillings.length > 0 ? (
            <div className="space-y-3">
              {upcomingBillings.map((sub: Subscription) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-sm">{sub.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {CATEGORY_LABELS[sub.category]}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {formatCurrency(
                        toMonthlyCost(sub.amount, sub.billingCycle)
                      )}
                      /月
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        new Date(sub.nextBillingDate),
                        "yyyy年M月d日",
                        { locale: ja }
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              登録されたサブスクリプションがありません
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
