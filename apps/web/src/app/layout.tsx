import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Providers } from "@/components/providers";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "サブスク管理",
  description: "サブスクリプションを一元管理するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="h-full font-[family-name:var(--font-noto-sans-jp)]">
        <Providers>
          <div className="flex h-full">
            <Sidebar />
            <main className="flex-1 overflow-auto px-10 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
