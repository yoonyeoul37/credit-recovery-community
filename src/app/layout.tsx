import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Advertisement from "@/components/Advertisement";
import EnvInjector from "@/components/EnvInjector";
import { sampleAds } from "@/lib/ads";

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
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          
          {/* 헤더와 광고 사이의 얇은 구분선 */}
          <div className="border-t border-gray-200"></div>
          
          {/* 헤더 바로 아래 상단 배너 광고 */}
          <div className="mt-4">
            <Advertisement
              position="header"
              title={sampleAds.header.title}
              description={sampleAds.header.description}
              link={sampleAds.header.link}
              size="small"
              closeable={true}
            />
          </div>
          
          <main className="flex-1">
            {children}
          </main>
          
          {/* 푸터 위 하단 배너 광고 */}
          <div className="mt-8">
            <Advertisement
              position="footer"
              title={sampleAds.footer.title}
              description={sampleAds.footer.description}
              link={sampleAds.footer.link}
              size="medium"
            />
          </div>
          
          <Footer />
        </div>
      </body>
    </html>
  );
}
