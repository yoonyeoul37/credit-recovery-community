import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import PostList from '@/components/PostList'
import Advertisement from '@/components/Advertisement'
import { categoryAds } from '@/lib/ads'

export const metadata: Metadata = {
  title: '법인회생',
  description: '사업자를 위한 법인회생 정보와 경험을 나누는 공간입니다.'
}

const businessInfo = [
  '법인회생 신청 자격 요건',
  '회생계획안 작성 가이드',
  '채권자협의회 진행 과정',
  '사업 계속 운영 방법',
  '법인회생 후 재기 전략'
]

export default function CorporateRecoveryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              홈으로
            </Link>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              🏢 법인회생
            </h1>
            <p className="text-gray-600 mt-2">
              사업자를 위한 법인회생 정보와 경험을 나누는 전문 공간입니다
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            <PostList category="corporate-recovery" />
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 법인회생 맞춤 광고 */}
            <div className="space-y-4">
              {categoryAds.corporateRecovery.slice(0, 2).map((ad, index) => (
                <Advertisement
                  key={index}
                  position="sidebar"
                  title={ad.title}
                  description={ad.description}
                  link={ad.link}
                  size="medium"
                  closeable={true}
                />
              ))}
            </div>

            {/* 법인회생 가이드 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                법인회생 가이드
              </h3>
              <ul className="space-y-3 text-sm">
                {businessInfo.map((info, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-purple-600 mt-0.5">📋</span>
                    <span className="text-gray-700">{info}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 사업자 지원 정보 */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🏛️ 사업자 지원</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 중소벤처기업부 지원사업</li>
                <li>• 신용보증기금 특례보증</li>
                <li>• 기술보증기금 재기지원</li>
                <li>• 소상공인시장진흥공단 상담</li>
                <li>• 법인회생 전문 법무법인</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 