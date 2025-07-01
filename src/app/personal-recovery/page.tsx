import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import PostList from '@/components/PostList'
import Advertisement from '@/components/Advertisement'
import { categoryAds } from '@/lib/ads'

export const metadata: Metadata = {
  title: '개인회생',
  description: '개인회생 절차와 경험을 나누는 공간입니다.'
}

const helpfulInfo = [
  '개인회생 신청 자격 확인하기',
  '필요 서류 미리 준비하기',
  '변제계획안 작성 요령',
  '채권자집회 준비사항',
  '개인회생 후 신용회복 방법'
]

export default function PersonalRecoveryPage() {
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
              🔄 개인회생
            </h1>
            <p className="text-gray-600 mt-2">
              개인회생 절차와 경험을 나누며 함께 새 출발해요
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            <PostList category="personal-recovery" />
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 개인회생 맞춤 광고 */}
            <div className="space-y-4">
              {categoryAds.personalRecovery.slice(0, 2).map((ad, index) => (
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

            {/* 개인회생 도움말 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                개인회생 체크리스트
              </h3>
              <ul className="space-y-3 text-sm">
                {helpfulInfo.map((info, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-gray-700">{info}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 법무부 정보 */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🏛️ 공식 정보</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 법원 개인회생 접수 안내</li>
                <li>• 대한변호사협회 상담</li>
                <li>• 신용회복위원회 프로그램</li>
                <li>• 개인회생 변제 계산기</li>
                <li>• 무료 법률상담 신청</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 