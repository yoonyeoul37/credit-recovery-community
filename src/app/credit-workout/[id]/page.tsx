'use client'

import { Suspense, use } from 'react'
import PostDetail from '@/components/PostDetail'
import { 
  TrendingUp, 
  ExternalLink, 
  Star, 
  HandHeart 
} from 'lucide-react'

// 워크아웃 관련 사이드바 광고 데이터
const sidebarAds = [
  {
    id: 1,
    title: "워크아웃 전문 상담",
    description: "워크아웃 전문 변호사 무료 상담",
    cta: "상담 신청하기",
    url: "https://example.com/workout-counsel",
    bgColor: "from-green-50 to-emerald-50",
    borderColor: "border-green-200",
    badgeColor: "bg-green-100 text-green-800",
    buttonColor: "bg-green-600 hover:bg-green-700",
    buttonHoverColor: "hover:bg-green-700",
    category: ["워크아웃", "상담"]
  },
  {
    id: 2,
    title: "자율협약 컨설팅",
    description: "자율협약 절차 및 협상 컨설팅",
    cta: "컨설팅 받기",
    url: "https://example.com/voluntary-agreement",
    bgColor: "from-emerald-50 to-teal-50",
    borderColor: "border-emerald-200",
    badgeColor: "bg-emerald-100 text-emerald-800",
    buttonColor: "bg-emerald-600 hover:bg-emerald-700",
    buttonHoverColor: "hover:bg-emerald-700",
    category: ["자율협약", "컨설팅"]
  },
  {
    id: 3,
    title: "사업정리 지원",
    description: "사업정리 절차 및 청산 지원",
    cta: "지원 신청하기",
    url: "https://example.com/business-liquidation",
    bgColor: "from-teal-50 to-cyan-50",
    borderColor: "border-teal-200",
    badgeColor: "bg-teal-100 text-teal-800",
    buttonColor: "bg-teal-600 hover:bg-teal-700",
    buttonHoverColor: "hover:bg-teal-700",
    category: ["사업정리", "지원"]
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

export default function CreditWorkoutPostPage({ params }: { params: Promise<{ id: string }> }) {
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
                category="credit-workout" 
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
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {['워크아웃', '자율협약', '사업정리', '채무조정', '구조조정', '협상', '금융기관', '컨설팅'].map((tag) => (
                  <button
                    key={tag}
                    className="bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 text-sm px-3 py-1 rounded-full transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 워크아웃 성공 팁 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <h3 className="font-bold text-lg mb-3 flex items-center">
                <Star className="w-5 h-5 mr-2 text-green-500" />
                워크아웃 성공 팁
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 정확한 재무상태 진단과 개선계획 수립</li>
                <li>• 채권금융기관과의 적극적 협상</li>
                <li>• 자율협약 조건 성실 이행</li>
                <li>• 전문가의 조언 적극 활용</li>
                <li>• 구조조정 후 경영정상화 노력</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 