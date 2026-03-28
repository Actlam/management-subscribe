export const BILLING_CYCLE = {
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

export type BillingCycle = (typeof BILLING_CYCLE)[keyof typeof BILLING_CYCLE];

export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  MONTHLY: "月額",
  YEARLY: "年額",
};

export const CATEGORY = {
  ENTERTAINMENT: "ENTERTAINMENT",
  MUSIC: "MUSIC",
  VIDEO: "VIDEO",
  PRODUCTIVITY: "PRODUCTIVITY",
  CLOUD_STORAGE: "CLOUD_STORAGE",
  DEVELOPMENT: "DEVELOPMENT",
  EDUCATION: "EDUCATION",
  NEWS: "NEWS",
  HEALTH: "HEALTH",
  GAMING: "GAMING",
  OTHER: "OTHER",
} as const;

export type Category = (typeof CATEGORY)[keyof typeof CATEGORY];

export const CATEGORY_LABELS: Record<Category, string> = {
  ENTERTAINMENT: "エンタメ",
  MUSIC: "音楽",
  VIDEO: "動画",
  PRODUCTIVITY: "仕事効率化",
  CLOUD_STORAGE: "クラウドストレージ",
  DEVELOPMENT: "開発ツール",
  EDUCATION: "学習",
  NEWS: "ニュース",
  HEALTH: "健康",
  GAMING: "ゲーム",
  OTHER: "その他",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  ENTERTAINMENT: "#f97316",
  MUSIC: "#a855f7",
  VIDEO: "#ef4444",
  PRODUCTIVITY: "#3b82f6",
  CLOUD_STORAGE: "#06b6d4",
  DEVELOPMENT: "#10b981",
  EDUCATION: "#f59e0b",
  NEWS: "#6366f1",
  HEALTH: "#ec4899",
  GAMING: "#84cc16",
  OTHER: "#6b7280",
};
