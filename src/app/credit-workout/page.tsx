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
  Zap,
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

export default function CreditWorkoutPage() {
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

  // 워크아웃 관련 네이티브 광고
  const nativeAds: Ad[] = [
    {
      id: 1,
      title: "워크아웃 전문 컨설팅 상담",
      description: "채무조정 전문가가 무료로 워크아웃 가능성을 진단해드립니다. 성공률 85% 이상 검증",
      cta: "무료 진단 신청하기",
      category: ["워크아웃", "채무조정", "부채정리"],
      url: "https://example.com/workout-consultation",
      clicks: 850,
      impressions: 10500
    },
    {
      id: 2,
      title: "워크아웃 후 신용회복 프로그램",
      description: "워크아웃 완료 후 빠른 신용회복을 위한 맞춤형 솔루션을 제공합니다.",
      cta: "신용회복 시작하기",
      category: ["워크아웃", "신용회복", "채무조정"],
      url: "https://example.com/post-workout-recovery",
      clicks: 620,
      impressions: 8900
    }
  ]

  // 사이드바 랜덤 광고 (10개)
  const sidebarRandomAds: SidebarAd[] = [
    {
      id: 1,
      title: "워크아웃 전문 컨설팅",
      description: "채무조정 전문가의 워크아웃 성공 가이드",
      cta: "무료 상담받기",
      url: "https://example.com/workout-consulting",
      bgColor: "from-orange-50 to-yellow-50",
      borderColor: "border-orange-200",
      badgeColor: "bg-orange-100 text-orange-800",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      buttonHoverColor: "hover:bg-orange-700",
      category: ["워크아웃", "채무조정"]
    },
    {
      id: 2,
      title: "채무조정 무료 진단",
      description: "워크아웃 vs 개인회생, 최적의 방법 찾기",
      cta: "진단 시작하기",
      url: "https://example.com/debt-diagnosis",
      bgColor: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      badgeColor: "bg-amber-100 text-amber-800",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
      buttonHoverColor: "hover:bg-amber-700",
      category: ["채무조정", "워크아웃"]
    },
    {
      id: 3,
      title: "워크아웃 신청 대행",
      description: "복잡한 워크아웃 신청 절차를 전문가가 대행",
      cta: "신청 대행받기",
      url: "https://example.com/workout-application",
      bgColor: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-200",
      badgeColor: "bg-yellow-100 text-yellow-800",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      buttonHoverColor: "hover:bg-yellow-700",
      category: ["워크아웃", "신청대행"]
    },
    {
      id: 4,
      title: "워크아웃 성공 사례",
      description: "실제 워크아웃 성공 사례로 희망 얻기",
      cta: "성공사례 보기",
      url: "https://example.com/workout-success",
      bgColor: "from-lime-50 to-green-50",
      borderColor: "border-lime-200",
      badgeColor: "bg-lime-100 text-lime-800",
      buttonColor: "bg-lime-600 hover:bg-lime-700",
      buttonHoverColor: "hover:bg-lime-700",
      category: ["워크아웃", "성공사례"]
    },
    {
      id: 5,
      title: "워크아웃 부채 계산기",
      description: "내 상황에 맞는 워크아웃 조건 계산",
      cta: "계산해보기",
      url: "https://example.com/workout-calculator",
      bgColor: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
      badgeColor: "bg-emerald-100 text-emerald-800",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      buttonHoverColor: "hover:bg-emerald-700",
      category: ["워크아웃", "계산기"]
    },
    {
      id: 6,
      title: "워크아웃 vs 개인회생 비교",
      description: "나에게 맞는 채무조정 방법 비교 분석",
      cta: "비교 분석보기",
      url: "https://example.com/workout-vs-recovery",
      bgColor: "from-cyan-50 to-blue-50",
      borderColor: "border-cyan-200",
      badgeColor: "bg-cyan-100 text-cyan-800",
      buttonColor: "bg-cyan-600 hover:bg-cyan-700",
      buttonHoverColor: "hover:bg-cyan-700",
      category: ["워크아웃", "개인회생", "비교"]
    },
    {
      id: 7,
      title: "워크아웃 신용회복 가이드",
      description: "워크아웃 후 신용회복을 위한 단계별 가이드",
      cta: "가이드 보기",
      url: "https://example.com/workout-recovery-guide",
      bgColor: "from-rose-50 to-pink-50",
      borderColor: "border-rose-200",
      badgeColor: "bg-rose-100 text-rose-800",
      buttonColor: "bg-rose-600 hover:bg-rose-700",
      buttonHoverColor: "hover:bg-rose-700",
      category: ["워크아웃", "신용회복"]
    },
    {
      id: 8,
      title: "워크아웃 비용 지원",
      description: "워크아웃 절차 비용 지원 프로그램 안내",
      cta: "지원 신청하기",
      url: "https://example.com/workout-cost-support",
      bgColor: "from-violet-50 to-purple-50",
      borderColor: "border-violet-200",
      badgeColor: "bg-violet-100 text-violet-800",
      buttonColor: "bg-violet-600 hover:bg-violet-700",
      buttonHoverColor: "hover:bg-violet-700",
      category: ["워크아웃", "비용지원"]
    },
    {
      id: 9,
      title: "사업자 워크아웃 전문",
      description: "사업자를 위한 기업 워크아웃 전문 상담",
      cta: "사업자 상담받기",
      url: "https://example.com/business-workout",
      bgColor: "from-slate-50 to-gray-50",
      borderColor: "border-slate-200",
      badgeColor: "bg-slate-100 text-slate-800",
      buttonColor: "bg-slate-600 hover:bg-slate-700",
      buttonHoverColor: "hover:bg-slate-700",
      category: ["워크아웃", "사업자"]
    },
    {
      id: 10,
      title: "워크아웃 법률 상담",
      description: "워크아웃 관련 법률 문제 전문 상담",
      cta: "법률상담 신청하기",
      url: "https://example.com/workout-legal",
      bgColor: "from-indigo-50 to-blue-50",
      borderColor: "border-indigo-200",
      badgeColor: "bg-indigo-100 text-indigo-800",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
      buttonHoverColor: "hover:bg-indigo-700",
      category: ["워크아웃", "법률상담"]
    }
  ]

  // 샘플 게시글 데이터
  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: 1,
        title: "워크아웃 신청 후 6개월 진행 상황",
        content: "워크아웃 신청하고 반년이 지났네요. 처음엔 막막했는데 생각보다 절차가 체계적이더라고요. 월 상환액도 많이 줄어들어서 숨통이 트였어요...",
        author: "재기준비중",
        category: "credit-workout",
        tags: ["워크아웃", "진행상황", "상환"],
        created_at: "2025-01-03T17:20:00Z",
        view_count: 389,
        like_count: 31,
        comment_count: 16,
        prefix: "경험담"
      },
      {
        id: 2,
        title: "워크아웃 vs 개인회생 선택 기준 문의",
        content: "현재 부채가 많아서 워크아웃과 개인회생 중에 고민하고 있어요. 어떤 기준으로 선택해야 할까요? 각각의 장단점을 알고 싶습니다...",
        author: "선택고민중",
        category: "credit-workout",
        tags: ["워크아웃", "개인회생", "선택기준"],
        created_at: "2025-01-03T12:45:00Z",
        view_count: 567,
        like_count: 48,
        comment_count: 24,
        prefix: "질문"
      },
      {
        id: 3,
        title: "워크아웃 완료 후 신용회복 성공기",
        content: "워크아웃 완료한지 2년이 지났는데 드디어 신용등급이 6등급까지 올라왔어요! 처음엔 9등급이었는데 꾸준히 관리한 결과입니다...",
        author: "신용회복성공",
        category: "credit-workout",
        tags: ["워크아웃", "신용회복", "성공"],
        created_at: "2025-01-02T15:30:00Z",
        view_count: 723,
        like_count: 65,
        comment_count: 32,
        prefix: "성공담"
      },
      {
        id: 4,
        title: "워크아웃 신청 시 필요한 서류 정리",
        content: "워크아웃 신청할 때 필요한 서류들을 정리해봤어요. 미리 준비해두시면 절차가 훨씬 빨라집니다. 특히 소득증명과 부채증명이 중요해요...",
        author: "도움주는사람",
        category: "credit-workout",
        tags: ["워크아웃", "서류", "신청"],
        created_at: "2025-01-02T10:15:00Z",
        view_count: 445,
        like_count: 38,
        comment_count: 19,
        prefix: "정보"
      },
      {
        id: 5,
        title: "워크아웃 상환 중 추가 대출 가능할까요?",
        content: "워크아웃으로 상환 중인데 갑작스러운 자금이 필요해서 추가 대출이 가능한지 궁금해요. 혹시 경험 있으신 분 계신가요?",
        author: "급한상황",
        category: "credit-workout",
        tags: ["워크아웃", "추가대출", "상환중"],
        created_at: "2025-01-01T14:50:00Z",
        view_count: 298,
        like_count: 22,
        comment_count: 13,
        prefix: "질문"
      }
    ]

    // 로컬 스토리지에서 사용자가 작성한 게시글 가져오기
    const savedPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
    
    // 기존 샘플 데이터 확인 (로컬 스토리지에 샘플 데이터가 없으면 추가)
    const existingSamplePosts = JSON.parse(localStorage.getItem('credit-workout-sample-posts') || '[]')
    
    if (existingSamplePosts.length === 0) {
      // 처음 방문 시 샘플 데이터를 로컬 스토리지에 저장
      localStorage.setItem('credit-workout-sample-posts', JSON.stringify(samplePosts))
      localStorage.setItem('community-posts', JSON.stringify([...savedPosts, ...samplePosts]))
    }
    
    // 로컬 스토리지에서 모든 게시글 가져오기
    const allPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
    
    // 워크아웃 카테고리만 필터링
    const workoutPosts = allPosts.filter((post: Post) => 
      post.category === 'credit-workout'
    )
    
    // 중복 제거 (ID 기준)
    const uniquePosts = workoutPosts.filter((post: Post, index: number, self: Post[]) => 
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
        '워크아웃': ['워크아웃', '채무조정', '부채정리'],
        '채무조정': ['채무조정', '워크아웃', '부채정리'],
        '질문': ['워크아웃', '상담'],
        '정보': ['워크아웃', '신청대행'],
        '경험담': ['워크아웃', '성공사례'],
        '성공담': ['워크아웃', '성공사례', '신용회복']
      }

      const relevantCategories = prefixAdMapping[selectedPrefix] || ['워크아웃']
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
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <Zap className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">워크아웃</h1>
          </div>
          <p className="text-orange-100 text-lg">
            채무조정을 통한 새로운 시작, 워크아웃 경험과 정보를 나누는 공간입니다.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-orange-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Scale className="w-4 h-4 mr-1" />
                워크아웃
              </div>
              <div>채무조정 절차 안내</div>
            </div>
            <div className="bg-orange-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                부채 정리
              </div>
              <div>효과적인 부채 관리</div>
            </div>
            <div className="bg-orange-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                경험 공유
              </div>
              <div>실제 워크아웃 경험담</div>
            </div>
            <div className="bg-orange-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Star className="w-4 h-4 mr-1" />
                재기 성공
              </div>
              <div>워크아웃 후 재기 사례</div>
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
              placeholder="워크아웃 이야기 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPrefix}
              onChange={(e) => setSelectedPrefix(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">전체 말머리</option>
              {prefixes.filter(p => p !== 'all').map(prefix => (
                <option key={prefix} value={prefix}>[{prefix}]</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="latest">최신순</option>
              <option value="views">조회순</option>
              <option value="likes">추천순</option>
              <option value="comments">댓글순</option>
            </select>
            <button
              onClick={() => setShowWriteModal(true)}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
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
                  <Link href={`/credit-workout/${post.id}`}>
                    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mr-2">
                              {post.prefix}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 hover:text-orange-600">
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

                  {/* 5번째 게시글 후에 네이티브 광고 표시 */}
                  {(index + 1) === 5 && selectedAd && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-dashed border-yellow-200 hover:shadow-lg transition-all cursor-pointer mt-4"
                         onClick={() => handleAdClick(selectedAd)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mr-2">
                              [광고]
                            </span>
                            <span className="text-xs text-gray-500">
                              Sponsored
                            </span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-gray-900">
                            {selectedAd.title}
                          </h3>
                          <p className="text-gray-700 mb-3">
                            {selectedAd.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center text-sm font-medium">
                              {selectedAd.cta}
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </button>
                            <div className="text-xs text-gray-400">
                              클릭: {selectedAd.clicks} | 노출: {selectedAd.impressions}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                        ? 'bg-orange-600 text-white border-orange-600'
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
                <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {['워크아웃', '채무조정', '부채정리', '신용회복', '상환', '재기', '성공사례', '신청방법'].map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm hover:bg-orange-100 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 워크아웃 팁 */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-orange-500" />
                워크아웃 핵심 팁
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>정확한 부채 현황을 먼저 파악하세요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>상환 가능한 금액을 현실적으로 계산하세요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>전문가 상담을 통해 최적의 방법을 찾으세요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>워크아웃 후에도 꾸준한 신용관리가 중요해요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>포기하지 말고 끝까지 완주하세요</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <PostWriteModal
          category="credit-workout"
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