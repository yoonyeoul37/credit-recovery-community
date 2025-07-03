'use client'

import { Suspense, use } from 'react'
import PostDetail from '@/components/PostDetail'
import { 
  TrendingUp, 
  ExternalLink, 
  Star, 
  RefreshCw 
} from 'lucide-react'

// 개인회생 관련 사이드바 광고 데이터
const sidebarAds = [
  {
    id: 1,
    title: "개인회생 전문 상담",
    description: "개인회생 전문 법무사 무료 상담",
    cta: "상담 신청하기",
    url: "https://example.com/recovery-counsel",
    bgColor: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
    badgeColor: "bg-purple-100 text-purple-800",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    buttonHoverColor: "hover:bg-purple-700",
    category: ["개인회생", "상담"]
  },
  {
    id: 2,
    title: "회생 후 신용회복",
    description: "변제 완료 후 신용회복 프로그램",
    cta: "신용회복 시작하기",
    url: "https://example.com/credit-recovery",
    bgColor: "from-pink-50 to-red-50",
    borderColor: "border-pink-200",
    badgeColor: "bg-pink-100 text-pink-800",
    buttonColor: "bg-pink-600 hover:bg-pink-700",
    buttonHoverColor: "hover:bg-pink-700",
    category: ["신용회복", "변제완료"]
  },
  {
    id: 3,
    title: "개인회생자 대출",
    description: "개인회생 인가 후 대출 가능한 곳",
    cta: "대출 확인하기",
    url: "https://example.com/recovery-loan",
    bgColor: "from-orange-50 to-amber-50",
    borderColor: "border-orange-200",
    badgeColor: "bg-orange-100 text-orange-800",
    buttonColor: "bg-orange-600 hover:bg-orange-700",
    buttonHoverColor: "hover:bg-orange-700",
    category: ["개인회생", "대출"]
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

export default function PersonalRecoveryPostPage({ params }: { params: Promise<{ id: string }> }) {
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
                category="personal-recovery" 
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
                <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {['개인회생', '변제계획', '면책', '신청방법', '변제완료', '신용회복', '법무사', '변호사'].map((tag) => (
                  <button
                    key={tag}
                    className="bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 text-sm px-3 py-1 rounded-full transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 개인회생 성공 팁 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
              <h3 className="font-bold text-lg mb-3 flex items-center">
                <Star className="w-5 h-5 mr-2 text-purple-500" />
                개인회생 성공 팁
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 정확한 재산 목록과 채무 현황 파악</li>
                <li>• 변제 계획안 성실히 이행하기</li>
                <li>• 추가 채무 발생 금지</li>
                <li>• 정기적인 수입 확보 노력</li>
                <li>• 면책 후 신용회복 계획 수립</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 