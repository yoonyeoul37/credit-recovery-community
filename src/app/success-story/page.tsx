import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import PostList from '@/components/PostList'
import Advertisement from '@/components/Advertisement'
import { categoryAds } from '@/lib/ads'

export const metadata: Metadata = {
  title: '성공사례',
  description: '신용회복 성공 사례와 희망의 이야기를 나누는 공간입니다.'
}

const successTips = [
  '작은 목표부터 차근차근',
  '꾸준함이 가장 중요',
  '포기하지 않는 마음',
  '전문가 도움 받기',
  '경험 나누고 격려하기'
]

export default function SuccessStoryPage() {
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
              ⭐ 성공사례
            </h1>
            <p className="text-gray-600 mt-2">
              신용회복의 성공 사례와 희망의 이야기를 함께 나눠요
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            <PostList category="success-story" />
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 성공사례 맞춤 광고 */}
            <div className="space-y-4">
              {categoryAds.successStory.slice(0, 2).map((ad, index) => (
                <Advertisement
                  key={index}
                  position="sidebar"
                  title={ad.title}
                  description={ad.description}
                  link={ad.link}
                  image={ad.image}
                  size="medium"
                  closeable={true}
                />
              ))}
            </div>

            {/* 성공 비법 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-yellow-500" />
                성공 비법
              </h3>
              <ul className="space-y-3 text-sm">
                {successTips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-0.5">🌟</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 격려 메시지 */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💪 힘내세요!</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-3">
                여기 있는 모든 성공사례는 실제 경험입니다. 
                포기하지 않으면 반드시 길이 있어요!
              </p>
              <p className="text-xs text-gray-600 italic">
                "가장 어두운 밤이 지나면 새벽이 옵니다."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 