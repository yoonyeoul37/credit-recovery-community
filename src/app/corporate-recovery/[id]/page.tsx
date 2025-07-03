'use client'

import { Suspense, use } from 'react'
import PostDetail from '@/components/PostDetail'
import { 
  TrendingUp, 
  ExternalLink, 
  Star, 
  Building2 
} from 'lucide-react'

// 법인회생 관련 사이드바 광고 데이터
const sidebarAds = [
  {
    id: 1,
    title: "법인회생 전문 상담",
    description: "법인회생 전문 변호사 무료 상담",
    cta: "상담 신청하기",
    url: "https://example.com/corp-recovery-counsel",
    bgColor: "from-indigo-50 to-purple-50",
    borderColor: "border-indigo-200",
    badgeColor: "bg-indigo-100 text-indigo-800",
    buttonColor: "bg-indigo-600 hover:bg-indigo-700",
    buttonHoverColor: "hover:bg-indigo-700",
    category: ["법인회생", "상담"]
  },
  {
    id: 2,
    title: "기업회생 컨설팅",
    description: "기업회생 전문 컨설팅 및 재무 구조조정",
    cta: "컨설팅 받기",
    url: "https://example.com/corp-consulting",
    bgColor: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
    badgeColor: "bg-purple-100 text-purple-800",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    buttonHoverColor: "hover:bg-purple-700",
    category: ["기업회생", "컨설팅"]
  },
  {
    id: 3,
    title: "법인 사업재개 지원",
    description: "법인회생 후 사업재개 지원 프로그램",
    cta: "지원 신청하기",
    url: "https://example.com/business-restart",
    bgColor: "from-blue-50 to-indigo-50",
    borderColor: "border-blue-200",
    badgeColor: "bg-blue-100 text-blue-800",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    buttonHoverColor: "hover:bg-blue-700",
    category: ["사업재개", "지원"]
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

export default function CorporateRecoveryPostPage({ params }: { params: Promise<{ id: string }> }) {
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
                category="corporate-recovery" 
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
                  <button 
                    className={`${ad.buttonColor} text-white px-4 py-2 rounded-lg transition-colors text-sm w-full`}
                    onClick={() => window.open(ad.url, '_blank')}
                  >
                    {ad.cta}
                  </button>
                </div>
              </div>
            ))}

            {/* 인기 태그 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {['법인회생', '기업회생', '사업재개', '구조조정', '채무조정', '회생계획', '변호사', '컨설팅'].map((tag) => (
                  <button
                    key={tag}
                    className="bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 text-sm px-3 py-1 rounded-full transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 법인회생 성공 팁 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
              <h3 className="font-bold text-lg mb-3 flex items-center">
                <Star className="w-5 h-5 mr-2 text-indigo-500" />
                법인회생 성공 팁
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 정확한 재무상태 파악과 회생계획 수립</li>
                <li>• 채권자와의 원만한 협의 진행</li>
                <li>• 사업 지속 가능성 입증</li>
                <li>• 전문가의 도움 적극 활용</li>
                <li>• 회생 후 사업 재기 전략 준비</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 