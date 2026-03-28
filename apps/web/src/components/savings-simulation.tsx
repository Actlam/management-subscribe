"use client";

import type { SavingsSimulation as SavingsSimulationType } from "@management-subscribe/shared";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: SavingsSimulationType[];
  monthlyTotal: number;
}

export function SavingsSimulation({ data, monthlyTotal }: Props) {
  const top3 = data.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>節約シミュレーション</CardTitle>
      </CardHeader>
      <CardContent>
        {top3.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            データがありません
          </p>
        ) : (
          <div className="space-y-4">
            {top3.map((item) => {
              const newMonthly = monthlyTotal - item.monthlySaving;
              return (
                <div
                  key={item.id}
                  className="rounded-lg border p-4 space-y-2"
                >
                  <p className="text-sm font-medium">
                    もし{" "}
                    <span className="font-bold">{item.name}</span>{" "}
                    を解約したら…
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-muted-foreground">月</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(item.monthlySaving)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      節約 → 月 {formatCurrency(newMonthly)} に
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-muted-foreground">年</span>
                    <span className="text-sm font-semibold text-green-600">
                      {formatCurrency(item.yearlySaving)}
                    </span>
                    <span className="text-xs text-muted-foreground">節約</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
