'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PostWriteModal from '@/components/PostWriteModal'
import { 
  MessageCircle, 
  Search, 
  Plus, 
  ExternalLink,
  CreditCard,
  TrendingUp,
  Star,
  Scale
} from 'lucide-react'

interface Post {
  id: number
  title: string
  content: string
  author: string
  category: string
  tags: string[]
  created_at: string
  view_count: number
  like_count: number
  comment_count: number
  prefix?: string // 말머리
  images?: string[] // 이미지 URL 배열
  imageCount?: number // 이미지 개수
}

interface Ad {
  id: number
  title: string
  description: string
  cta: string
  category: string[] // 어떤 말머리에 표시할지
  url: string
  clicks: number
  impressions: number
}

interface SidebarAd {
  id: number
  title: string
  description: string
  cta: string
  url: string
  bgColor: string
  borderColor: string
  badgeColor: string
  buttonColor: string
  buttonHoverColor: string
  category: string[]
}

export default function PersonalRecoveryPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPrefix, setSelectedPrefix] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [currentPage, setCurrentPage] = useState(1)
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)
  const [randomSidebarAds, setRandomSidebarAds] = useState<SidebarAd[]>([])

  const postsPerPage = 8 // 페이지당 8개 게시글

  // 개인회생 관련 네이티브 광고 (신용이야기와 동일한 구조)
  const nativeAds: Ad[] = [
    {
      id: 1,
      title: "개인회생 신청 전 무료 상담받기",
      description: "전문 변호사가 개인회생 가능성을 무료로 진단해드립니다. 성공률 95% 이상!",
      cta: "무료 상담 신청하기",
      category: ["개인회생", "파산", "채무조정"],
      url: "https://example.com/personal-recovery-consultation",
      clicks: 1250,
      impressions: 15430
    },
    {
      id: 2,
      title: "개인회생 후 신용회복 전문 서비스",
      description: "개인회생 인가 후 빠른 신용회복을 위한 맞춤형 솔루션을 제공합니다.",
      cta: "신용회복 시작하기",
      category: ["개인회생", "신용회복"],
      url: "https://example.com/credit-recovery-service",
      clicks: 980,
      impressions: 12200
    }
  ]

  // 사이드바 랜덤 광고 (10개)
  const sidebarRandomAds: SidebarAd[] = [
    {
      id: 1,
      title: "개인회생 전문 변호사",
      description: "성공률 95% 이상, 개인회생 전문 법무법인",
      cta: "무료 상담받기",
      url: "https://example.com/personal-recovery-lawyer",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      badgeColor: "bg-blue-100 text-blue-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      buttonHoverColor: "hover:bg-blue-700",
      category: ["개인회생", "파산"]
    },
    {
      id: 2,
      title: "채무조정 무료 진단",
      description: "개인회생 vs 워크아웃 vs 파산, 최적의 방법 찾기",
      cta: "진단 시작하기",
      url: "https://example.com/debt-adjustment-diagnosis",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      badgeColor: "bg-green-100 text-green-800",
      buttonColor: "bg-green-600 hover:bg-green-700",
      buttonHoverColor: "hover:bg-green-700",
      category: ["채무조정", "개인회생"]
    },
    {
      id: 3,
      title: "개인회생 후 카드발급",
      description: "개인회생 인가 후 6개월부터 카드 발급 가능",
      cta: "발급 신청하기",
      url: "https://example.com/post-recovery-card",
      bgColor: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      badgeColor: "bg-purple-100 text-purple-800",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      buttonHoverColor: "hover:bg-purple-700",
      category: ["개인회생", "카드발급"]
    },
    {
      id: 4,
      title: "개인회생 변제금 계산기",
      description: "정확한 변제금 계산으로 미리 준비하세요",
      cta: "계산해보기",
      url: "https://example.com/recovery-calculator",
      bgColor: "from-orange-50 to-red-50",
      borderColor: "border-orange-200",
      badgeColor: "bg-orange-100 text-orange-800",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      buttonHoverColor: "hover:bg-orange-700",
      category: ["개인회생", "계산기"]
    },
    {
      id: 5,
      title: "법원 개인회생 신청 가이드",
      description: "서류 작성부터 신청까지 단계별 안내",
      cta: "가이드 보기",
      url: "https://example.com/court-application-guide",
      bgColor: "from-teal-50 to-cyan-50",
      borderColor: "border-teal-200",
      badgeColor: "bg-teal-100 text-teal-800",
      buttonColor: "bg-teal-600 hover:bg-teal-700",
      buttonHoverColor: "hover:bg-teal-700",
      category: ["개인회생", "신청가이드"]
    },
    {
      id: 6,
      title: "개인회생 성공 후기",
      description: "실제 성공 사례를 통해 희망을 얻어보세요",
      cta: "후기 보러가기",
      url: "https://example.com/success-stories",
      bgColor: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-200",
      badgeColor: "bg-yellow-100 text-yellow-800",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      buttonHoverColor: "hover:bg-yellow-700",
      category: ["개인회생", "성공후기"]
    },
    {
      id: 7,
      title: "신용회복위원회 연계 서비스",
      description: "공적 기관과 연계한 안전한 채무조정",
      cta: "신청하기",
      url: "https://example.com/credit-recovery-committee",
      bgColor: "from-slate-50 to-gray-50",
      borderColor: "border-slate-200",
      badgeColor: "bg-slate-100 text-slate-800",
      buttonColor: "bg-slate-600 hover:bg-slate-700",
      buttonHoverColor: "hover:bg-slate-700",
      category: ["신용회복위원회", "채무조정"]
    },
    {
      id: 8,
      title: "개인회생 비용 지원 프로그램",
      description: "어려운 상황에서도 부담 없이 시작하세요",
      cta: "지원 신청하기",
      url: "https://example.com/cost-support-program",
      bgColor: "from-rose-50 to-pink-50",
      borderColor: "border-rose-200",
      badgeColor: "bg-rose-100 text-rose-800",
      buttonColor: "bg-rose-600 hover:bg-rose-700",
      buttonHoverColor: "hover:bg-rose-700",
      category: ["개인회생", "비용지원"]
    },
    {
      id: 9,
      title: "개인회생 vs 워크아웃 비교",
      description: "나에게 맞는 채무조정 방법을 찾아보세요",
      cta: "비교해보기",
      url: "https://example.com/recovery-vs-workout",
      bgColor: "from-indigo-50 to-blue-50",
      borderColor: "border-indigo-200",
      badgeColor: "bg-indigo-100 text-indigo-800",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
      buttonHoverColor: "hover:bg-indigo-700",
      category: ["개인회생", "워크아웃", "비교"]
    },
    {
      id: 10,
      title: "개인회생 신청 서류 대행",
      description: "복잡한 서류 작성을 전문가가 대신해드립니다",
      cta: "대행 신청하기",
      url: "https://example.com/document-service",
      bgColor: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      badgeColor: "bg-emerald-100 text-emerald-800",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      buttonHoverColor: "hover:bg-emerald-700",
      category: ["개인회생", "서류대행"]
    }
  ]

  // 샘플 게시글 데이터
  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: 1,
        title: "개인회생 신청 후 3개월째 후기",
        content: "개인회생 신청하고 3개월이 지났는데 생각보다 절차가 순조롭게 진행되고 있어요. 변호사님이 잘 도와주셔서 서류 준비도 수월했고...",
        author: "새출발하는중",
        category: "personal-recovery",
        tags: ["개인회생", "신청후기", "진행과정"],
        created_at: "2025-01-03T14:30:00Z",
        view_count: 342,
        like_count: 28,
        comment_count: 15,
        prefix: "경험담"
      },
      {
        id: 2,
        title: "개인회생 변제계획안 작성 팁 공유해요",
        content: "개인회생 변제계획안 작성할 때 중요한 포인트들을 공유해드리려고 해요. 특히 소득과 지출 부분에서 주의할 점들이 많더라고요...",
        author: "회생완료자",
        category: "personal-recovery", 
        tags: ["변제계획안", "작성팁", "노하우"],
        created_at: "2025-01-03T10:15:00Z",
        view_count: 567,
        like_count: 45,
        comment_count: 23,
        prefix: "정보"
      },
      {
        id: 3,
        title: "개인회생 신청 자격 관련 질문드려요",
        content: "안녕하세요. 개인회생 신청을 고려하고 있는데 제 상황에서 신청이 가능한지 궁금해서 질문드려요. 현재 연봉은 3000만원 정도이고...",
        author: "고민중인사람",
        category: "personal-recovery",
        tags: ["신청자격", "질문", "상담"],
        created_at: "2025-01-02T16:45:00Z",
        view_count: 234,
        like_count: 12,
        comment_count: 8,
        prefix: "질문"
      },
      {
        id: 4,
        title: "개인회생 인가 받고 1년 후 근황",
        content: "개인회생 인가 받은지 벌써 1년이 지났네요. 변제금도 꾸준히 납부하고 있고, 무엇보다 마음이 편해졌어요. 처음엔 막막했는데...",
        author: "희망찾기",
        category: "personal-recovery",
        tags: ["인가후", "변제", "후기"],
        created_at: "2025-01-02T11:20:00Z",
        view_count: 456,
        like_count: 38,
        comment_count: 19,
        prefix: "경험담"
      },
      {
        id: 5,
        title: "개인회생 신청 서류 준비 체크리스트",
        content: "개인회생 신청하실 분들을 위해 필요한 서류들을 정리해봤어요. 미리 준비해두시면 신청 과정이 훨씬 수월해질 거예요...",
        author: "도움드리고싶어요",
        category: "personal-recovery",
        tags: ["서류준비", "체크리스트", "신청준비"],
        created_at: "2025-01-01T09:30:00Z",
        view_count: 789,
        like_count: 67,
        comment_count: 31,
        prefix: "정보"
      }
    ]

    // 로컬 스토리지에서 사용자가 작성한 게시글 가져오기
    const savedPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
    
    // 기존 샘플 데이터 확인 (로컬 스토리지에 샘플 데이터가 없으면 추가)
    const existingSamplePosts = JSON.parse(localStorage.getItem('personal-recovery-sample-posts') || '[]')
    
    if (existingSamplePosts.length === 0) {
      // 처음 방문 시 샘플 데이터를 로컬 스토리지에 저장
      localStorage.setItem('personal-recovery-sample-posts', JSON.stringify(samplePosts))
      localStorage.setItem('community-posts', JSON.stringify([...savedPosts, ...samplePosts]))
    }
    
    // 로컬 스토리지에서 모든 게시글 가져오기
    const allPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
    
    // 개인회생 카테고리만 필터링
    const personalRecoveryPosts = allPosts.filter((post: Post) => 
      post.category === 'personal-recovery'
    )
    
    // 중복 제거 (ID 기준)
    const uniquePosts = personalRecoveryPosts.filter((post: Post, index: number, self: Post[]) => 
      index === self.findIndex((p: Post) => p.id === post.id)
    )
    
    // 최신순으로 정렬
    const sortedPosts = uniquePosts.sort((a: Post, b: Post) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    
    setPosts(sortedPosts)
  }, [])

  // 네이티브 광고 랜덤 선택
  useEffect(() => {
    const getRandomAd = () => {
      if (nativeAds.length === 0) {
        setSelectedAd(null)
        return
      }

      // 말머리별 맞춤 광고 필터링
      const prefixAdMapping: { [key: string]: string[] } = {
        '개인회생': ['개인회생', '파산', '채무조정'],
        '파산': ['파산', '개인회생', '채무조정'],
        '채무조정': ['채무조정', '개인회생', '워크아웃'],
        '질문': ['개인회생', '상담'],
        '정보': ['개인회생', '신청가이드'],
        '경험담': ['개인회생', '성공후기']
      }

      const relevantCategories = prefixAdMapping[selectedPrefix] || ['개인회생']
      const matchingAds = nativeAds.filter(ad => 
        ad.category.some(cat => relevantCategories.includes(cat))
      )

      const adsToChooseFrom = matchingAds.length > 0 ? matchingAds : nativeAds
      const randomAd = adsToChooseFrom[Math.floor(Math.random() * adsToChooseFrom.length)]
      
      setSelectedAd(randomAd)
    }

    getRandomAd()
  }, [selectedPrefix])

  const handleAdClick = (ad: Ad) => {
    // 클릭 수 증가 로직 (실제로는 API 호출)
    console.log(`광고 클릭: ${ad.title}`)
    
    // 광고 랜딩 페이지로 이동
    window.open(ad.url, '_blank')
  }

  const prefixes = ['all', ...Array.from(new Set(posts.map(post => post.prefix).filter(Boolean)))]

  // 검색 및 필터링된 게시글
  const filteredPosts = posts.filter(post => {
    const matchesSearch = (post.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.content || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrefix = selectedPrefix === 'all' || post.prefix === selectedPrefix
    return matchesSearch && matchesPrefix
  })

  // 정렬된 게시글
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.view_count - a.view_count
      case 'likes':
        return b.like_count - a.like_count
      case 'comments':
        return b.comment_count - a.comment_count
      case 'latest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  // 페이징 처리
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = sortedPosts.slice(startIndex, endIndex)

  // 페이지 변경 함수
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 검색어나 필터, 정렬 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedPrefix, sortBy])

  // 사이드바 광고 랜덤화 (2-3개 선택)
  useEffect(() => {
    const getRandomSidebarAds = () => {
      if (sidebarRandomAds.length === 0) {
        setRandomSidebarAds([])
        return
      }

      // 2-3개 랜덤 선택 (중복 없이)
      const shuffled = [...sidebarRandomAds].sort(() => Math.random() - 0.5)
      const selectedCount = Math.min(3, Math.max(2, Math.floor(Math.random() * 2) + 2)) // 2-3개 랜덤
      const selectedAds = shuffled.slice(0, selectedCount)
      
      setRandomSidebarAds(selectedAds)
    }

    getRandomSidebarAds()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <Scale className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">개인회생</h1>
          </div>
          <p className="text-green-100 text-lg">
            개인회생으로 새로운 시작을 함께 만들어가는 공간입니다.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-green-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Scale className="w-4 h-4 mr-1" />
                신청 절차
              </div>
              <div>개인회생 신청 방법</div>
            </div>
            <div className="bg-green-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                변제 계획
              </div>
              <div>변제금 계산과 계획</div>
            </div>
            <div className="bg-green-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                경험 공유
              </div>
              <div>실제 경험담과 팁</div>
            </div>
            <div className="bg-green-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Star className="w-4 h-4 mr-1" />
                성공 사례
              </div>
              <div>개인회생 성공 후기</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 검색 및 필터 */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="개인회생 이야기 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPrefix}
              onChange={(e) => setSelectedPrefix(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">전체 말머리</option>
              {prefixes.filter(p => p !== 'all').map(prefix => (
                <option key={prefix} value={prefix}>[{prefix}]</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="latest">최신순</option>
              <option value="views">조회순</option>
              <option value="likes">추천순</option>
              <option value="comments">댓글순</option>
            </select>
            <button
              onClick={() => setShowWriteModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              글쓰기
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 + 사이드바 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            {/* 게시글 목록 with 네이티브 광고 - 5번째 후 1개 (페이지당 8개) */}
            <div className="space-y-4">
              {currentPosts.map((post, index) => (
                <div key={`post-${post.id}`}>
                  {/* 게시글 */}
                  <Link href={`/personal-recovery/${post.id}`}>
                    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                              {post.prefix}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 hover:text-green-600">
                            <span className="inline-block w-8 text-center text-base font-medium text-gray-500 mr-2">
                              {(currentPage - 1) * postsPerPage + index + 1}.
                            </span>
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {(post.content || '').length > 40 ? (post.content || '').substring(0, 40) + '...' : (post.content || '')}
                          </p>
                          
                          {/* 태그 표시 */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {post.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="text-gray-400 text-xs">
                                  +{post.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>by {post.author}</span>
                            <div className="flex space-x-4">
                              <span>👀 {post.view_count}</span>
                              <span>❤️ {post.like_count}</span>
                              <span>💬 {post.comment_count}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* 네이티브 광고 - 5개 게시글마다 1개씩 표시 */}
                  {(index + 1) % 5 === 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-300 hover:shadow-xl transition-all cursor-pointer mt-4 mb-4"
                         onClick={() => {
                           console.log('🎯 개인회생 네이티브 광고 클릭:', index);
                           window.open('/ad-landing/personal-recovery', '_blank');
                         }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-green-400 text-green-900 text-xs px-3 py-1 rounded-full mr-2 font-bold">
                              🎯 개인회생 광고 #{Math.floor(index / 5) + 1} (게시글 {index + 1}번째 후)
                            </span>
                            <span className="text-xs text-gray-500">
                              Sponsored
                            </span>
                          </div>
                          <h3 className="font-bold text-xl mb-2 text-gray-900">
                            ⚖️ 개인회생 신청 전 무료 상담
                          </h3>
                          <p className="text-gray-700 mb-3 leading-relaxed">
                            개인회생 가능성을 무료로 진단해드립니다. 성공률 95% 이상, 전문 변호사 직접 상담!
                          </p>
                          <div className="flex items-center justify-between">
                            <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-blue-600 transition-all flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                              무료 상담 신청
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </button>
                            <div className="text-xs text-gray-400">
                              전문 변호사 상담
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 디버깅용 로그 */}
                  {console.log(`🔍 개인회생 게시글 렌더링: ${post.id} (${post.title}), 인덱스: ${index}, 광고표시: ${(index + 1) % 5 === 0 ? 'YES' : 'NO'}`)}


                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg border ${
                      currentPage === page
                        ? 'bg-green-600 text-white border-green-600'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6 sticky top-6 self-start">
            {/* 랜덤 광고 */}
            <div className="space-y-4">
              {randomSidebarAds.map((ad, index) => (
                <div 
                  key={ad.id} 
                  className={`bg-gradient-to-br ${ad.bgColor} rounded-xl p-4 ${ad.borderColor} border hover:shadow-lg transition-all cursor-pointer`}
                  onClick={() => window.open(ad.url, '_blank')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`${ad.badgeColor} text-xs px-2 py-1 rounded-full font-medium`}>
                      광고
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                    {ad.title}
                  </h4>
                  <p className="text-gray-600 text-xs mb-3 leading-relaxed">
                    {ad.description}
                  </p>
                  
                  <button className={`w-full ${ad.buttonColor} text-white text-xs py-2 px-3 rounded-lg ${ad.buttonHoverColor} transition-colors font-medium`}>
                    {ad.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* 인기 태그 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {['개인회생', '변제계획안', '신청후기', '채무조정', '파산', '신용회복', '성공후기', '서류준비'].map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-100 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 개인회생 팁 */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-green-500" />
                개인회생 핵심 팁
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>신청 전 정확한 채무 현황 파악이 필수예요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>변제 가능한 금액을 현실적으로 계산해보세요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>전문가 상담을 통해 성공률을 높이세요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>신청 후에도 꾸준한 변제가 중요해요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>개인회생 후 신용회복 계획을 세우세요</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <PostWriteModal
          category="personal-recovery"
          onClose={() => setShowWriteModal(false)}
          onSubmit={(newPost) => {
            setPosts([newPost, ...posts])
            setShowWriteModal(false)
          }}
        />
      )}
    </div>
  )
} 