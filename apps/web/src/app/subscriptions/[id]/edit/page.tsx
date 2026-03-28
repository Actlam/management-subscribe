"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useSubscription,
  useUpdateSubscription,
} from "@/lib/hooks/use-subscriptions";
import { SubscriptionForm } from "@/components/subscription-form";
import type { CreateSubscriptionInput } from "@management-subscribe/shared";

export default function EditSubscriptionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: subscription, isLoading } = useSubscription(id);
  const updateMutation = useUpdateSubscription(id);

  const handleSubmit = async (data: CreateSubscriptionInput) => {
    await updateMutation.mutateAsync(data);
    router.push("/subscriptions");
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        読み込み中...
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        サブスクリプションが見つかりません
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">サブスク編集</h1>
      <SubscriptionForm
        defaultValues={{
          name: subscription.name,
          amount: subscription.amount,
          billingCycle: subscription.billingCycle,
          category: subscription.category,
          nextBillingDate: subscription.nextBillingDate.split("T")[0],
          url: subscription.url ?? "",
          note: subscription.note ?? "",
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        title={`${subscription.name} の編集`}
      />
    </div>
  );
}
