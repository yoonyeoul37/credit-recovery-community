import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PremiumAd from "@/components/PremiumAd";
import EnvInjector from "@/components/EnvInjector";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "새출발 커뮤니티 - 함께하는 희망의 공간",
    template: "%s | 새출발 커뮤니티"
  },
  description: "신용회복과 새로운 시작을 함께하는 따뜻한 커뮤니티입니다. 익명성을 보장하며 안전하게 정보를 나눌 수 있는 공간입니다.",
  keywords: ["신용회복", "개인회생", "법인회생", "대출", "신용점수", "새출발", "커뮤니티", "익명"],
  authors: [{ name: "새출발 커뮤니티" }],
  creator: "새출발 커뮤니티",
  publisher: "새출발 커뮤니티",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000",
    siteName: "새출발 커뮤니티",
    title: "새출발 커뮤니티 - 함께하는 희망의 공간",
    description: "신용회복과 새로운 시작을 함께하는 따뜻한 커뮤니티",
  },
  twitter: {
    card: "summary_large_image",
    title: "새출발 커뮤니티",
    description: "신용회복과 새로운 시작을 함께하는 따뜻한 커뮤니티",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <EnvInjector />
        <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
          <Header />
          
          {/* 헤더 바로 아래 프리미엄 광고 */}
          <div className="mt-4 pt-2">
            <div className="max-w-2xl mx-auto px-4">
              <PremiumAd position="top" className="w-full" />
            </div>
          </div>
          
          <main className="flex-1">
            {children}
          </main>
          
          <Footer />
        </div>
        
        {/* 하단 스티키 광고 - 모든 페이지에서 표시 */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <PremiumAd position="bottom" className="w-full" />
        </div>
      </body>
    </html>
  );
}
