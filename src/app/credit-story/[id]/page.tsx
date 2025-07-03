'use client'

import { Suspense, use } from 'react'
import PostDetail from '@/components/PostDetail'
import { 
  TrendingUp, 
  ExternalLink, 
  Star, 
  CreditCard 
} from 'lucide-react'

// 신용이야기 관련 사이드바 광고 데이터
const sidebarAds = [
  {
    id: 1,
    title: "면책후 체크카드",
    description: "면책 후 바로 발급 가능한 체크카드",
    cta: "카드 신청하기",
    url: "https://example.com/debit-card",
    bgColor: "from-blue-50 to-indigo-50",
    borderColor: "border-blue-200",
    badgeColor: "bg-blue-100 text-blue-800",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    buttonHoverColor: "hover:bg-blue-700",
    category: ["면책후카드", "체크카드"]
  },
  {
    id: 2,
    title: "신용등급 올리기",
    description: "신용등급 향상을 위한 맞춤 관리",
    cta: "신용관리 시작하기",
    url: "https://example.com/credit-management",
    bgColor: "from-indigo-50 to-purple-50",
    borderColor: "border-indigo-200",
    badgeColor: "bg-indigo-100 text-indigo-800",
    buttonColor: "bg-indigo-600 hover:bg-indigo-700",
    buttonHoverColor: "hover:bg-indigo-700",
    category: ["신용등급", "신용관리"]
  },
  {
    id: 3,
    title: "신용회복 컨설팅",
    description: "개인 맞춤 신용회복 전략 수립",
    cta: "무료 상담받기",
    url: "https://example.com/credit-recovery",
    bgColor: "from-green-50 to-emerald-50",
    borderColor: "border-green-200",
    badgeColor: "bg-green-100 text-green-800",
    buttonColor: "bg-green-600 hover:bg-green-700",
    buttonHoverColor: "hover:bg-green-700",
    category: ["신용회복", "상담"]
  }
]

// 로딩 스켈레톤
function PostDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-20 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreditStoryPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  // 랜덤 사이드바 광고 2-3개 선택
  const getRandomSidebarAds = () => {
    const shuffled = [...sidebarAds].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.floor(Math.random() * 2) + 2) // 2-3개
  }
  
  const randomSidebarAds = getRandomSidebarAds()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 메인 컨텐츠 + 사이드바 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            <Suspense fallback={<PostDetailSkeleton />}>
              <PostDetail 
                postId={id} 
                category="credit-story" 
              />
            </Suspense>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6 sticky top-6 self-start">
            {/* 랜덤 사이드바 광고들 (2-3개) */}
            {randomSidebarAds.length > 0 && randomSidebarAds.map((ad, index) => (
              <div key={`sidebar-ad-${ad.id}`} className={`bg-gradient-to-br ${ad.bgColor} rounded-lg p-6 border ${ad.borderColor}`}>
                <div className="text-center">
                  <div className={`${ad.badgeColor} text-xs px-2 py-1 rounded-full inline-block mb-3`}>
                    [광고]
                  </div>
                  <h3 className="font-bold text-lg mb-2">{ad.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {ad.description}
                  </p>
                  <a 
                    href={ad.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${ad.buttonColor} text-white px-4 py-2 rounded-lg transition-colors text-sm w-full inline-block text-center`}
                  >
                    {ad.cta}
                  </a>
                </div>
              </div>
            ))}

            {/* 인기 태그 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {['신용카드', '면책후', '신용등급', '체크카드', '우리카드', '개인회생', '변제', '신용회복'].map((tag) => (
                  <button
                    key={tag}
                    className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 text-sm px-3 py-1 rounded-full transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 신용 관리 팁 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-lg mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
                신용 관리 팁
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 연체는 절대 금물! 자동이체 설정</li>
                <li>• 신용카드 사용 후 바로 결제</li>
                <li>• 무분별한 카드 발급 신청 피하기</li>
                <li>• 정기적으로 신용점수 확인</li>
                <li>• 장기 미사용 카드 해지 고려</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 