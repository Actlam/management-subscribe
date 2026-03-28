import { Hono } from "hono";
import { prisma } from "../lib/prisma";

export const analyticsRoute = new Hono();

// GET /api/analytics/by-category — カテゴリ別支出集計
analyticsRoute.get("/by-category", async (c) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { isActive: true },
    select: { amount: true, billingCycle: true, category: true },
  });

  const categoryMap = new Map<string, number>();

  for (const sub of subscriptions) {
    const monthlyAmount =
      sub.billingCycle === "YEARLY"
        ? Math.round(sub.amount / 12)
        : sub.amount;

    const current = categoryMap.get(sub.category) ?? 0;
    categoryMap.set(sub.category, current + monthlyAmount);
  }

  const result = Array.from(categoryMap.entries()).map(
    ([category, amount]) => ({ category, amount })
  );

  return c.json(result);
});

// GET /api/analytics/monthly-trend — 月別推移（過去12ヶ月）
analyticsRoute.get("/monthly-trend", async (c) => {
  const subscriptions = await prisma.subscription.findMany({
    select: {
      amount: true,
      billingCycle: true,
      isActive: true,
      createdAt: true,
    },
  });

  const now = new Date();
  const months: { month: string; amount: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    let total = 0;
    for (const sub of subscriptions) {
      // サブスクが作成された月以降のみカウント
      if (new Date(sub.createdAt) <= endOfMonth) {
        const monthlyAmount =
          sub.billingCycle === "YEARLY"
            ? Math.round(sub.amount / 12)
            : sub.amount;
        total += monthlyAmount;
      }
    }

    months.push({ month: monthStr, amount: total });
  }

  return c.json(months);
});

// GET /api/analytics/ranking — 使用金額ランキング（月額換算、降順）
analyticsRoute.get("/ranking", async (c) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      amount: true,
      billingCycle: true,
      category: true,
    },
    orderBy: { amount: "desc" },
  });

  const ranked = subscriptions
    .map((sub) => ({
      id: sub.id,
      name: sub.name,
      monthlyAmount:
        sub.billingCycle === "YEARLY"
          ? Math.round(sub.amount / 12)
          : sub.amount,
      category: sub.category,
    }))
    .sort((a, b) => b.monthlyAmount - a.monthlyAmount);

  return c.json(ranked);
});

// GET /api/analytics/savings-simulation — 節約シミュレーション
analyticsRoute.get("/savings-simulation", async (c) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      amount: true,
      billingCycle: true,
    },
  });

  const simulations = subscriptions
    .map((sub) => {
      const monthly =
        sub.billingCycle === "YEARLY"
          ? Math.round(sub.amount / 12)
          : sub.amount;
      return {
        id: sub.id,
        name: sub.name,
        monthlySaving: monthly,
        yearlySaving: monthly * 12,
      };
    })
    .sort((a, b) => b.monthlySaving - a.monthlySaving);

  return c.json(simulations);
});

// GET /api/analytics/review — サービス別 見直し判定
analyticsRoute.get("/review", async (c) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      amount: true,
      billingCycle: true,
      category: true,
      nextBillingDate: true,
    },
    orderBy: { nextBillingDate: "asc" },
  });

  const totalMonthly = subscriptions.reduce((sum, sub) => {
    const monthly =
      sub.billingCycle === "YEARLY"
        ? Math.round(sub.amount / 12)
        : sub.amount;
    return sum + monthly;
  }, 0);

  const avgMonthly = totalMonthly / (subscriptions.length || 1);

  const reviews = subscriptions.map((sub) => {
    const monthly =
      sub.billingCycle === "YEARLY"
        ? Math.round(sub.amount / 12)
        : sub.amount;

    // 平均の1.5倍以上 → 要検討、平均の2倍以上 → ダウングレード推奨
    let verdict: "維持" | "要検討" | "ダウングレード検討" = "維持";
    if (monthly >= avgMonthly * 2) {
      verdict = "ダウングレード検討";
    } else if (monthly >= avgMonthly * 1.5) {
      verdict = "要検討";
    }

    return {
      id: sub.id,
      name: sub.name,
      category: sub.category,
      monthlyAmount: monthly,
      nextBillingDate: sub.nextBillingDate,
      verdict,
    };
  });

  return c.json(reviews);
});
