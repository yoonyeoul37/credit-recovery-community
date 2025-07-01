import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import PostList from '@/components/PostList'
import Advertisement from '@/components/Advertisement'
import { categoryAds } from '@/lib/ads'

export const metadata: Metadata = {
  title: '대출이야기',
  description: '대출 경험과 정보를 나누는 공간입니다.'
}

const loanTips = [
  '금리 비교는 필수',
  '대출 조건 꼼꼼히 확인',
  '중도상환 수수료 체크',
  '신용점수별 맞춤 상품',
  '대출 서류 미리 준비'
]

export default function LoanStoryPage() {
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
              💰 대출이야기
            </h1>
            <p className="text-gray-600 mt-2">
              대출 경험과 정보를 나누며 현명한 선택을 도와요
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            <PostList category="loan-story" />
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 대출 맞춤 광고 */}
            <div className="space-y-4">
              {categoryAds.loanStory.slice(0, 2).map((ad, index) => (
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

            {/* 대출 꿀팁 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                대출 꿀팁
              </h3>
              <ul className="space-y-3 text-sm">
                {loanTips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-orange-600 mt-0.5">💡</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 대출 정보 */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🏦 대출 정보</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 한국은행 기준금리 정보</li>
                <li>• 금융상품통합비교공시</li>
                <li>• 서민금융진흥원 지원</li>
                <li>• 신용보증기금 보증</li>
                <li>• 대출상담 콜센터</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 