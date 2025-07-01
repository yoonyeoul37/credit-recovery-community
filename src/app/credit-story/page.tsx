import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import PostList from '@/components/PostList'
import Advertisement from '@/components/Advertisement'
import { categoryAds } from '@/lib/ads'

export const metadata: Metadata = {
  title: '신용이야기',
  description: '신용점수 관리와 신용카드 관련 정보를 나누는 공간입니다.'
}

const popularTags = [
  '신용점수', '신용카드', '신용회복', '연체기록', '체크카드', 
  '발급거절', '신용등급', '신용조회', '무직자', '대학생'
]

export default function CreditStoryPage() {
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
              💳 신용이야기
            </h1>
            <p className="text-gray-600 mt-2">
              신용점수 관리와 신용카드 관련 정보를 나누는 따뜻한 공간입니다
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            <PostList category="credit-story" />
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 신용카드 맞춤 광고 */}
            <div className="space-y-4">
              {categoryAds.creditStory.slice(0, 2).map((ad, index) => (
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

            {/* 인기 태그 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 text-sm px-3 py-1 rounded-full transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 도움말 */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 신용 관리 팁</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 연체는 절대 금물! 자동이체 설정하기</li>
                <li>• 신용카드 사용 후 바로바로 결제하기</li>
                <li>• 무분별한 카드 발급 신청 피하기</li>
                <li>• 정기적으로 신용점수 확인하기</li>
                <li>• 장기 미사용 카드는 해지 고려하기</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 