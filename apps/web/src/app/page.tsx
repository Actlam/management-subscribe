"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { Subscription } from "@management-subscribe/shared";
import { CATEGORY_LABELS } from "@management-subscribe/shared";
import {
  useSubscriptions,
  useSubscriptionSummary,
  useServiceReview,
  useSavingsSimulation,
} from "@/lib/hooks/use-subscriptions";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const VERDICT_STYLES: Record<string, string> = {
  維持: "bg-green-100 text-green-800",
  要検討: "bg-yellow-100 text-yellow-800",
  ダウングレード検討: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } =
    useSubscriptionSummary();
  const { data: subscriptions } = useSubscriptions();
  const { data: reviewData, isLoading: reviewLoading } = useServiceReview();
  const { data: simulationData, isLoading: simLoading } =
    useSavingsSimulation();

  // 見直し推奨件数
  const reviewCount =
    reviewData?.filter((r) => r.verdict !== "維持").length ?? 0;

  // 節約可能金額
  const savingsTotal =
    reviewData
      ?.filter((r) => r.verdict !== "維持")
      .reduce((sum, r) => sum + r.monthlyAmount, 0) ?? 0;

  // 日額計算
  const dailyCost = Math.round((summary?.monthlyTotal ?? 0) / 30);

  // 次の請求
  const nextBilling = subscriptions
    ?.filter((s: Subscription) => s.isActive)
    .sort(
      (a: Subscription, b: Subscription) =>
        new Date(a.nextBillingDate).getTime() -
        new Date(b.nextBillingDate).getTime()
    )[0];

  // 節約提案トップ3
  const topSavings = simulationData?.slice(0, 3) ?? [];
  const maxSaving = topSavings[0]?.monthlySaving ?? 1;

  const LoadingCard = () => (
    <Card className="animate-pulse">
      <CardContent className="h-24" />
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          今月の無駄遣いを見つけました
        </p>
      </div>

      {/* 4 Summary Cards */}
      {summaryLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-medium text-muted-foreground">
                節約できる金額
              </p>
              <p className="text-2xl font-semibold font-mono text-yellow-500 mt-2">
                {formatCurrency(savingsTotal)}/月
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-medium text-muted-foreground">
                月額合計
              </p>
              <p className="text-2xl font-semibold font-mono mt-2">
                {formatCurrency(summary?.monthlyTotal ?? 0)}/月
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                1日あたり {formatCurrency(dailyCost)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-medium text-muted-foreground">
                見直し推奨
              </p>
              <p className="text-2xl font-semibold font-mono text-red-500 mt-2">
                {reviewCount}件
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-medium text-muted-foreground">
                次の請求
              </p>
              {nextBilling ? (
                <>
                  <p className="text-2xl font-semibold font-mono mt-2">
                    {format(new Date(nextBilling.nextBillingDate), "M/d")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {nextBilling.name} — {formatCurrency(nextBilling.amount)}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-semibold font-mono mt-2">—</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom 2-column: Review Table + Savings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        {/* 見直し推奨サービス */}
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">⚠ 見直し推奨サービス</CardTitle>
          </CardHeader>
          <CardContent>
            {reviewLoading ? (
              <div className="animate-pulse h-40" />
            ) : !reviewData || reviewData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                データがありません
              </p>
            ) : (
              <div>
                {/* Table Header */}
                <div className="flex items-center gap-2 pb-2 border-b text-xs font-medium text-muted-foreground">
                  <span className="flex-1">Service</span>
                  <span className="w-24">Amount</span>
                  <span className="w-20">カテゴリ</span>
                  <span className="w-20 text-right">アクション</span>
                </div>
                {/* Table Body */}
                <div className="divide-y">
                  {reviewData.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 py-2.5 text-sm"
                    >
                      <span className="flex-1 font-medium truncate">
                        {item.name}
                      </span>
                      <span className="w-24 font-mono text-sm">
                        {formatCurrency(item.monthlyAmount)}
                      </span>
                      <span className="w-20">
                        <Badge variant="secondary" className="text-xs">
                          {CATEGORY_LABELS[item.category]}
                        </Badge>
                      </span>
                      <span className="w-20 text-right">
                        {item.verdict !== "維持" && (
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${VERDICT_STYLES[item.verdict] ?? ""}`}
                          >
                            {item.verdict}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 今すぐできる節約 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">今すぐできる節約</CardTitle>
          </CardHeader>
          <CardContent>
            {simLoading ? (
              <div className="animate-pulse h-40" />
            ) : topSavings.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                データがありません
              </p>
            ) : (
              <div className="space-y-5">
                {topSavings.map((item) => {
                  const barWidth = Math.round(
                    (item.monthlySaving / maxSaving) * 100
                  );
                  return (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="whitespace-nowrap">{item.name} を解約</span>
                        <span className="font-mono font-medium text-green-600 whitespace-nowrap">
                          月 {formatCurrency(item.monthlySaving)} 節約
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                <p className="text-sm font-semibold text-yellow-600 pt-2">
                  合計: 月{" "}
                  {formatCurrency(
                    topSavings.reduce((s, i) => s + i.monthlySaving, 0)
                  )}{" "}
                  節約可能
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
