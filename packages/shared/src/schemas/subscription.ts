import { z } from "zod";
import { BILLING_CYCLE, CATEGORY } from "../constants";

export const createSubscriptionSchema = z.object({
  name: z.string().min(1, "サービス名は必須です"),
  amount: z.number().int().positive("金額は1円以上で入力してください"),
  billingCycle: z.enum([BILLING_CYCLE.MONTHLY, BILLING_CYCLE.YEARLY]),
  category: z.enum([
    CATEGORY.ENTERTAINMENT,
    CATEGORY.MUSIC,
    CATEGORY.VIDEO,
    CATEGORY.PRODUCTIVITY,
    CATEGORY.CLOUD_STORAGE,
    CATEGORY.DEVELOPMENT,
    CATEGORY.EDUCATION,
    CATEGORY.NEWS,
    CATEGORY.HEALTH,
    CATEGORY.GAMING,
    CATEGORY.OTHER,
  ]),
  nextBillingDate: z.string().min(1, "次回請求日は必須です"),
  url: z.string().url("有効なURLを入力してください").optional().or(z.literal("")),
  note: z.string().optional(),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
