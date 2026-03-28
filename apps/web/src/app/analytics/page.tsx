"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { Subscription } from "@management-subscribe/shared";
import {
  useSubscriptions,
  useSubscriptionSummary,
  useSpendingRanking,
  useSavingsSimulation,
  useServiceReview,
} from "@/lib/hooks/use-subscriptions";
import { CostSummaryCard } from "@/components/cost-summary-card";
import { SpendingRanking } from "@/components/spending-ranking";
import { SavingsSimulation } from "@/components/savings-simulation";
import { ServiceReviewTable } from "@/components/service-review-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const { data: summary, isLoading: summaryLoading } =
    useSubscriptionSummary();
  const { data: subscriptions } = useSubscriptions();
  const { data: rankingData, isLoading: rankingLoading } =
    useSpendingRanking();
  const { data: simulationData, isLoading: simulationLoading } =
    useSavingsSimulation();
  const { data: reviewData, isLoading: reviewLoading } = useServiceReview();

  // 次の更新サービスを取得
  const nextRenewal = subscriptions
    ?.filter((s: Subscription) => s.isActive)
    .sort(
      (a: Subscription, b: Subscription) =>
        new Date(a.nextBillingDate).getTime() -
        new Date(b.nextBillingDate).getTime()
    )[0];

  // 次の見直しポイント（要検討以上のサービスの直近更新日）
  const nextReviewPoint = reviewData?.find(
    (r) => r.verdict !== "維持"
  );

  const LoadingCard = ({ height = "h-20" }: { height?: string }) => (
    <Card className="animate-pulse">
      <CardContent className={height} />
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">節約レポート</h1>
        {nextReviewPoint && (
          <p className="text-sm text-muted-foreground">
            次の見直しポイント:{" "}
            <span className="font-medium text-foreground">
              {nextReviewPoint.name}（
              {format(new Date(nextReviewPoint.nextBillingDate), "M/d", {
                locale: ja,
              })}
              ）
            </span>
          </p>
        )}
      </div>

      {/* サマリーカード */}
      {summaryLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CostSummaryCard
            title="月額合計"
            amount={summary?.monthlyTotal ?? 0}
          />
          <CostSummaryCard
            title="年間合計"
            amount={summary?.yearlyTotal ?? 0}
          />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                次の更新
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextRenewal ? (
                <>
                  <div className="text-2xl font-bold">{nextRenewal.name}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(
                      new Date(nextRenewal.nextBillingDate),
                      "yyyy/M/d",
                      { locale: ja }
                    )}
                  </p>
                </>
              ) : (
                <div className="text-muted-foreground">なし</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ランキング + シミュレーション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rankingLoading ? (
          <LoadingCard height="h-80" />
        ) : (
          <SpendingRanking data={rankingData ?? []} />
        )}

        {simulationLoading ? (
          <LoadingCard height="h-80" />
        ) : (
          <SavingsSimulation
            data={simulationData ?? []}
            monthlyTotal={summary?.monthlyTotal ?? 0}
          />
        )}
      </div>

      {/* 見直し判定テーブル */}
      {reviewLoading ? (
        <LoadingCard height="h-60" />
      ) : (
        <ServiceReviewTable data={reviewData ?? []} />
      )}
    </div>
  );
}
