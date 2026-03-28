"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyTrend } from "@management-subscribe/shared";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: MonthlyTrend[];
}

export function TrendLineChart({ data }: Props) {
  const chartData = data.map((item) => ({
    month: item.month.replace(/^\d{4}-/, "").replace(/^0/, "") + "月",
    amount: item.amount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>月額推移（過去12ヶ月）</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            データがありません
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis
                fontSize={12}
                tickFormatter={(v: number) => `¥${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 3 }}
                name="月額合計"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
