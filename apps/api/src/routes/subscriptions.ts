import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from "@management-subscribe/shared";
import { prisma } from "../lib/prisma";

export const subscriptionsRoute = new Hono();

// GET /api/subscriptions/summary — 月額・年額合計
subscriptionsRoute.get("/summary", async (c) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { isActive: true },
    select: { amount: true, billingCycle: true },
  });

  let monthlyTotal = 0;
  let yearlyTotal = 0;

  for (const sub of subscriptions) {
    if (sub.billingCycle === "MONTHLY") {
      monthlyTotal += sub.amount;
      yearlyTotal += sub.amount * 12;
    } else {
      monthlyTotal += Math.round(sub.amount / 12);
      yearlyTotal += sub.amount;
    }
  }

  return c.json({
    monthlyTotal,
    yearlyTotal,
    activeCount: subscriptions.length,
  });
});

// GET /api/subscriptions — 一覧取得
subscriptionsRoute.get("/", async (c) => {
  const category = c.req.query("category");
  const isActive = c.req.query("isActive");

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (isActive !== undefined) where.isActive = isActive === "true";

  const subscriptions = await prisma.subscription.findMany({
    where,
    orderBy: { nextBillingDate: "asc" },
  });

  return c.json(subscriptions);
});

// GET /api/subscriptions/:id — 1件取得
subscriptionsRoute.get("/:id", async (c) => {
  const id = c.req.param("id");
  const subscription = await prisma.subscription.findUnique({ where: { id } });

  if (!subscription) {
    return c.json({ error: "サブスクリプションが見つかりません" }, 404);
  }

  return c.json(subscription);
});

// POST /api/subscriptions — 新規作成
subscriptionsRoute.post(
  "/",
  zValidator("json", createSubscriptionSchema),
  async (c) => {
    const data = c.req.valid("json");

    const subscription = await prisma.subscription.create({
      data: {
        ...data,
        url: data.url || null,
        note: data.note || null,
        nextBillingDate: new Date(data.nextBillingDate),
      },
    });

    return c.json(subscription, 201);
  }
);

// PUT /api/subscriptions/:id — 更新
subscriptionsRoute.put(
  "/:id",
  zValidator("json", updateSubscriptionSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const existing = await prisma.subscription.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ error: "サブスクリプションが見つかりません" }, 404);
    }

    const updateData: Record<string, unknown> = { ...data };
    if (data.nextBillingDate) {
      updateData.nextBillingDate = new Date(data.nextBillingDate);
    }
    if (data.url === "") {
      updateData.url = null;
    }

    const subscription = await prisma.subscription.update({
      where: { id },
      data: updateData,
    });

    return c.json(subscription);
  }
);

// DELETE /api/subscriptions/:id — 削除
subscriptionsRoute.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const existing = await prisma.subscription.findUnique({ where: { id } });
  if (!existing) {
    return c.json({ error: "サブスクリプションが見つかりません" }, 404);
  }

  await prisma.subscription.delete({ where: { id } });

  return c.json({ message: "削除しました" });
});

// PATCH /api/subscriptions/:id/toggle — 有効/無効切替
subscriptionsRoute.patch("/:id/toggle", async (c) => {
  const id = c.req.param("id");

  const existing = await prisma.subscription.findUnique({ where: { id } });
  if (!existing) {
    return c.json({ error: "サブスクリプションが見つかりません" }, 404);
  }

  const subscription = await prisma.subscription.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });

  return c.json(subscription);
});
