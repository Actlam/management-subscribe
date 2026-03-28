"use client";

import { useState } from "react";
import Link from "next/link";
import type { Subscription } from "@management-subscribe/shared";
import { CATEGORY_LABELS, BILLING_CYCLE_LABELS } from "@management-subscribe/shared";
import { formatCurrency, toMonthlyCost } from "@/lib/utils";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeleteSubscription,
  useToggleSubscription,
} from "@/lib/hooks/use-subscriptions";

interface Props {
  subscriptions: Subscription[];
}

export function SubscriptionTable({ subscriptions }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null);
  const deleteMutation = useDeleteSubscription();
  const toggleMutation = useToggleSubscription();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>サブスクリプションがまだ登録されていません</p>
        <Link href="/subscriptions/new">
          <Button className="mt-4">最初のサブスクを登録</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>サービス名</TableHead>
            <TableHead>月額換算</TableHead>
            <TableHead>金額</TableHead>
            <TableHead>カテゴリ</TableHead>
            <TableHead>次回請求日</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow key={sub.id} className={!sub.isActive ? "opacity-50" : ""}>
              <TableCell className="font-medium">
                {sub.url ? (
                  <a
                    href={sub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {sub.name}
                  </a>
                ) : (
                  sub.name
                )}
              </TableCell>
              <TableCell>
                {formatCurrency(toMonthlyCost(sub.amount, sub.billingCycle))}
              </TableCell>
              <TableCell>
                {formatCurrency(sub.amount)}/{BILLING_CYCLE_LABELS[sub.billingCycle] === "月額" ? "月" : "年"}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {CATEGORY_LABELS[sub.category]}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(sub.nextBillingDate), "yyyy/MM/dd", {
                  locale: ja,
                })}
              </TableCell>
              <TableCell>
                <Badge
                  variant={sub.isActive ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleMutation.mutate(sub.id)}
                >
                  {sub.isActive ? "有効" : "無効"}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Link href={`/subscriptions/${sub.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    編集
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setDeleteTarget(sub)}
                >
                  削除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>サブスクリプションの削除</DialogTitle>
            <DialogDescription>
              「{deleteTarget?.name}」を削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "削除中..." : "削除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
