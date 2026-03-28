import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.subscription.deleteMany();

  const subscriptions = [
    {
      name: "Netflix",
      amount: 1490,
      billingCycle: "MONTHLY" as const,
      category: "VIDEO" as const,
      nextBillingDate: new Date("2026-04-15"),
      url: "https://www.netflix.com",
      note: "スタンダードプラン",
    },
    {
      name: "Spotify",
      amount: 980,
      billingCycle: "MONTHLY" as const,
      category: "MUSIC" as const,
      nextBillingDate: new Date("2026-04-10"),
      url: "https://www.spotify.com",
    },
    {
      name: "GitHub Copilot",
      amount: 1650,
      billingCycle: "MONTHLY" as const,
      category: "DEVELOPMENT" as const,
      nextBillingDate: new Date("2026-04-01"),
      url: "https://github.com/features/copilot",
    },
    {
      name: "Adobe Creative Cloud",
      amount: 72336,
      billingCycle: "YEARLY" as const,
      category: "PRODUCTIVITY" as const,
      nextBillingDate: new Date("2026-09-01"),
      url: "https://www.adobe.com",
      note: "コンプリートプラン",
    },
    {
      name: "iCloud+ 200GB",
      amount: 400,
      billingCycle: "MONTHLY" as const,
      category: "CLOUD_STORAGE" as const,
      nextBillingDate: new Date("2026-04-05"),
    },
    {
      name: "Nintendo Switch Online",
      amount: 2400,
      billingCycle: "YEARLY" as const,
      category: "GAMING" as const,
      nextBillingDate: new Date("2026-08-20"),
    },
    {
      name: "Udemy Business",
      amount: 21000,
      billingCycle: "YEARLY" as const,
      category: "EDUCATION" as const,
      nextBillingDate: new Date("2026-06-15"),
      url: "https://www.udemy.com",
    },
    {
      name: "日経電子版",
      amount: 4277,
      billingCycle: "MONTHLY" as const,
      category: "NEWS" as const,
      nextBillingDate: new Date("2026-04-01"),
      url: "https://www.nikkei.com",
    },
    {
      name: "Amazon Prime",
      amount: 5900,
      billingCycle: "YEARLY" as const,
      category: "ENTERTAINMENT" as const,
      nextBillingDate: new Date("2026-07-10"),
      url: "https://www.amazon.co.jp/prime",
    },
    {
      name: "Fitbit Premium",
      amount: 640,
      billingCycle: "MONTHLY" as const,
      category: "HEALTH" as const,
      nextBillingDate: new Date("2026-04-20"),
      isActive: false,
      note: "解約済み",
    },
  ];

  for (const sub of subscriptions) {
    await prisma.subscription.create({ data: sub });
  }

  console.log(`シードデータを ${subscriptions.length} 件作成しました`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
