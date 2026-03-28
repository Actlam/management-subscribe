"use client";

import { useRouter } from "next/navigation";
import { useCreateSubscription } from "@/lib/hooks/use-subscriptions";
import { SubscriptionForm } from "@/components/subscription-form";
import type { CreateSubscriptionInput } from "@management-subscribe/shared";

export default function NewSubscriptionPage() {
  const router = useRouter();
  const createMutation = useCreateSubscription();

  const handleSubmit = async (data: CreateSubscriptionInput) => {
    await createMutation.mutateAsync(data);
    router.push("/subscriptions");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">サブスク新規登録</h1>
      <SubscriptionForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        title="新しいサブスクリプション"
      />
    </div>
  );
}
