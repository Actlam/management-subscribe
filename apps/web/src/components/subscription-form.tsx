"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  createSubscriptionSchema,
  type CreateSubscriptionInput,
  BILLING_CYCLE_LABELS,
  CATEGORY_LABELS,
  type BillingCycle,
  type Category,
} from "@management-subscribe/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  defaultValues?: Partial<CreateSubscriptionInput>;
  onSubmit: (data: CreateSubscriptionInput) => Promise<void>;
  isSubmitting: boolean;
  title: string;
}

export function SubscriptionForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  title,
}: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateSubscriptionInput>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: {
      name: "",
      amount: 0,
      billingCycle: "MONTHLY",
      category: "OTHER",
      nextBillingDate: "",
      url: "",
      note: "",
      ...defaultValues,
    },
  });

  const billingCycle = watch("billingCycle");

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">サービス名</Label>
            <Input id="name" placeholder="Netflix" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">金額（円）</Label>
            <Input
              id="amount"
              type="number"
              placeholder="1490"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>請求サイクル</Label>
            <div className="flex gap-4">
              {(
                Object.entries(BILLING_CYCLE_LABELS) as [
                  BillingCycle,
                  string,
                ][]
              ).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    value={value}
                    checked={billingCycle === value}
                    onChange={() => setValue("billingCycle", value)}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>カテゴリ</Label>
            <Select
              value={watch("category")}
              onValueChange={(v) => { if (v) setValue("category", v as Category); }}
            >
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択">
                  {CATEGORY_LABELS[watch("category")] ?? "カテゴリを選択"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.entries(CATEGORY_LABELS) as [Category, string][]
                ).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextBillingDate">次回請求日</Label>
            <Input
              id="nextBillingDate"
              type="date"
              {...register("nextBillingDate")}
            />
            {errors.nextBillingDate && (
              <p className="text-sm text-red-500">
                {errors.nextBillingDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">サービスURL（任意）</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://..."
              {...register("url")}
            />
            {errors.url && (
              <p className="text-sm text-red-500">{errors.url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">メモ（任意）</Label>
            <Input
              id="note"
              placeholder="プランの詳細など"
              {...register("note")}
            />
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/subscriptions")}
          >
            キャンセル
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
