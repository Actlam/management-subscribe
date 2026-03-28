"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { ServiceReview } from "@management-subscribe/shared";
import { CATEGORY_LABELS } from "@management-subscribe/shared";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: ServiceReview[];
}

const VERDICT_STYLES: Record<string, string> = {
  維持: "bg-green-100 text-green-800",
  要検討: "bg-yellow-100 text-yellow-800",
  ダウングレード検討: "bg-red-100 text-red-800",
};

export function ServiceReviewTable({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>サービス別 見直し判定</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            データがありません
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>サービス名</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead>月額</TableHead>
                <TableHead>次回更新</TableHead>
                <TableHead>判定</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {CATEGORY_LABELS[item.category]}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(item.monthlyAmount)}</TableCell>
                  <TableCell>
                    {format(new Date(item.nextBillingDate), "M/d", {
                      locale: ja,
                    })}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VERDICT_STYLES[item.verdict] ?? ""}`}
                    >
                      {item.verdict}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
