'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search, Filter, X } from 'lucide-react'
import SearchBar, { SearchFilters } from '@/components/SearchBar'

// 모든 카테고리의 게시글을 포함하는 통합 데이터
const allPosts = [
  // 신용이야기
  {
    id: 1,
    category: 'credit-story',
    categoryName: '신용이야기',
    title: "신용점수 200점 올린 후기 공유합니다",
    content: "6개월 동안 꾸준히 관리해서 드디어 목표 점수에 도달했어요. 정말 힘들었지만 포기하지 않고 노력한 결과입니다.",
    user_nickname: "희망찬시작123",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tags: ['신용점수', '신용회복', '성공사례'],
    likes_count: 24,
    comment_count: 8,
    views_count: 156,
    images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop']
  },
  {
    id: 2,
    category: 'credit-story',
    categoryName: '신용이야기',
    title: "신용카드 발급 거절당했는데 어떻게 해야 할까요?",
    content: "계속 거절당해서 속상해요. 어떤 순서로 접근하면 좋을까요? 신용점수가 낮아서 그런 것 같아요.",
    user_nickname: "새출발하자",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    tags: ['신용카드', '발급거절', '질문'],
    likes_count: 12,
    comment_count: 15,
    views_count: 89,
    images: []
  },
  // 개인회생
  {
    id: 1,
    category: 'personal-recovery',
    categoryName: '개인회생',
    title: "개인회생 신청 과정 상세 후기",
    content: "개인회생을 신청하면서 겪었던 과정들을 상세히 공유드립니다. 같은 상황에 계신 분들께 도움이 되길 바랍니다.",
    user_nickname: "새시작",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    tags: ['개인회생', '법적절차', '후기'],
    likes_count: 34,
    comment_count: 18,
    views_count: 256,
    images: []
  },
  {
    id: 2,
    category: 'personal-recovery',
    categoryName: '개인회생',
    title: "개인회생 인가 결정 받았습니다!",
    content: "드디어 개인회생 인가 결정을 받았어요. 앞으로 3년간 열심히 변제하겠습니다.",
    user_nickname: "희망의빛",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['개인회생', '인가결정', '성공'],
    likes_count: 52,
    comment_count: 31,
    views_count: 423,
    images: ['https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=300&fit=crop']
  },
  // 성공사례
  {
    id: 1,
    category: 'success-story',
    categoryName: '성공사례',
    title: "부채 5천만원에서 완전 탈출까지의 여정",
    content: "5천만원의 부채로 시작해서 5년 만에 완전히 탈출한 이야기를 나누고 싶어요.",
    user_nickname: "탈출성공자",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['부채탈출', '5년여정', '완전해결'],
    likes_count: 89,
    comment_count: 52,
    views_count: 743,
    images: ['https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&h=300&fit=crop', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop']
  },
  // 대출이야기
  {
    id: 1,
    category: 'loan-story',
    categoryName: '대출이야기',
    title: "2금융권 대출 후기 - 솔직한 경험담",
    content: "은행 대출이 안 되어서 2금융권을 알아보며 겪은 경험들을 솔직하게 나누고 싶어요.",
    user_nickname: "다시일어서기",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['2금융권', '대출후기', '경험담'],
    likes_count: 18,
    comment_count: 12,
    views_count: 189,
    images: []
  },
  // 법인회생
  {
    id: 1,
    category: 'corporate-recovery',
    categoryName: '법인회생',
    title: "소상공인 법인회생 신청 경험담",
    content: "작은 카페를 운영하다가 코로나로 어려워져서 법인회생을 신청한 과정을 공유합니다.",
    user_nickname: "카페사장",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['소상공인', '법인회생', '카페경영'],
    likes_count: 28,
    comment_count: 16,
    views_count: 234,
    images: []
  }
]

// 실제 검색 로직을 담당하는 컴포넌트
function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialTag = searchParams.get('tag') || ''
  const initialSort = searchParams.get('sort') || 'latest'
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: initialQuery || initialTag,
    sortBy: initialSort as SearchFilters['sortBy'],
    timeRange: 'all',
    hasImages: null
  })

  // 검색 및 필터링 로직
  const filteredPosts = useMemo(() => {
    let result = [...allPosts]

    // 텍스트 검색 (제목, 내용, 닉네임, 태그)
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase()
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.user_nickname.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 기간 필터
    if (searchFilters.timeRange !== 'all') {
      const now = new Date()
      const filterTime = {
        day: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000
      }[searchFilters.timeRange]

      if (filterTime) {
        result = result.filter(post => 
          now.getTime() - new Date(post.created_at).getTime() <= filterTime
        )
      }
    }

    // 이미지 필터
    if (searchFilters.hasImages !== null) {
      result = result.filter(post => {
        const hasImages = post.images && post.images.length > 0
        return searchFilters.hasImages ? hasImages : !hasImages
      })
    }

    // 정렬
    result.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case 'popular':
          return b.likes_count - a.likes_count
        case 'views':
          return b.views_count - a.views_count
        case 'comments':
          return b.comment_count - a.comment_count
        case 'latest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return result
  }, [searchFilters])

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters)
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) {
      return `${minutes}분 전`
    } else if (hours < 24) {
      return `${hours}시간 전`
    } else {
      return `${days}일 전`
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'credit-story': '💳',
      'personal-recovery': '🔄',
      'corporate-recovery': '🏢',
      'loan-story': '💰',
      'success-story': '⭐'
    }
    return icons[category] || '📝'
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'credit-story': 'bg-blue-100 text-blue-800',
      'personal-recovery': 'bg-green-100 text-green-800',
      'corporate-recovery': 'bg-purple-100 text-purple-800',
      'loan-story': 'bg-orange-100 text-orange-800',
      'success-story': 'bg-yellow-100 text-yellow-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

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
              🔍 전체 검색
            </h1>
            <p className="text-gray-600 mt-2">
              모든 카테고리에서 원하는 정보를 찾아보세요
            </p>
          </div>
        </div>

        {/* 검색바 */}
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="전체 게시글에서 검색..."
          />
        </div>

        {/* 검색 결과 */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-gray-500 mb-4">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">검색 결과가 없어요</p>
                <p className="text-sm mt-1">다른 키워드로 검색해보세요 🔍</p>
              </div>
            </div>
          ) : (
            <>
              {/* 검색 결과 요약 */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-700">
                  총 <span className="font-semibold text-blue-600">{filteredPosts.length}개</span>의 게시글을 찾았습니다
                  {searchFilters.query && (
                    <>
                      {' '}"<span className="font-semibold">{searchFilters.query}</span>" 검색 결과
                    </>
                  )}
                </p>
              </div>

              {/* 게시글 목록 */}
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Link
                    key={`${post.category}-${post.id}`}
                    href={`/${post.category}/${post.id}`}
                    className="block bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all p-6 group"
                  >
                    {/* 카테고리 표시 */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                        {getCategoryIcon(post.category)} {post.categoryName}
                      </span>
                      {post.images && post.images.length > 0 && (
                        <span className="text-blue-600 text-xs">📷 {post.images.length}</span>
                      )}
                    </div>

                    {/* 제목 */}
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    {/* 내용 미리보기 */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.content}
                    </p>

                    {/* 태그 */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* 메타 정보 */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-green-700">💚 {post.user_nickname}</span>
                        <span>{formatTimeAgo(post.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span>👀 {post.views_count}</span>
                        <span>❤️ {post.likes_count}</span>
                        <span>💬 {post.comment_count}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// 메인 페이지 컴포넌트 (Suspense 제공)
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">검색 준비 중...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
} 