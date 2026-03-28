"use client";

import { useRef, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import type { SpendingRank } from "@management-subscribe/shared";
import { CATEGORY_COLORS } from "@management-subscribe/shared";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: SpendingRank[];
}

export function SpendingRanking({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const chartData = data.slice(0, 8).map((item) => ({
    name: item.name,
    amount: item.monthlyAmount,
    color: CATEGORY_COLORS[item.category] ?? "#6b7280",
  }));

  const chartHeight = chartData.length * 48 + 16;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>使用金額ランキング</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            データがありません
          </p>
        ) : (
          <div ref={containerRef} className="w-full">
            {width > 0 && (
              <BarChart
                data={chartData}
                layout="vertical"
                width={width}
                height={chartHeight}
                margin={{ left: 20 }}
              >
                <XAxis
                  type="number"
                  fontSize={12}
                  tickFormatter={(v: number) => `¥${v.toLocaleString()}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  fontSize={12}
                  width={120}
                  tick={{ fill: "var(--foreground)" }}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]} name="月額">
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
