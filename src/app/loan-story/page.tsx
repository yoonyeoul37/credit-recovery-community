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
  DollarSign,
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

export default function LoanStoryPage() {
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

  // 대출 관련 네이티브 광고
  const nativeAds: Ad[] = [
    {
      id: 1,
      title: "면책자 전용 대출 상품",
      description: "면책 후 신용회복 중인 분들을 위한 특별 대출 상품입니다. 최대 500만원까지 가능",
      cta: "대출 신청하기",
      category: ["면책후대출", "신용회복", "특별대출"],
      url: "https://example.com/special-loan",
      clicks: 1120,
      impressions: 13400
    },
    {
      id: 2,
      title: "신용등급 상관없는 대출",
      description: "신용등급이 낮아도 신청 가능한 대출 상품을 비교해보세요. 실시간 승인율 확인",
      cta: "대출 비교하기",
      category: ["저신용대출", "비교", "실시간승인"],
      url: "https://example.com/loan-comparison",
      clicks: 890,
      impressions: 11200
    }
  ]

  // 사이드바 랜덤 광고 (10개)
  const sidebarRandomAds: SidebarAd[] = [
    {
      id: 1,
      title: "면책자 전용 대출",
      description: "면책 후 신용회복 중인 분을 위한 특별 대출",
      cta: "대출 신청하기",
      url: "https://example.com/discharge-loan",
      bgColor: "from-teal-50 to-cyan-50",
      borderColor: "border-teal-200",
      badgeColor: "bg-teal-100 text-teal-800",
      buttonColor: "bg-teal-600 hover:bg-teal-700",
      buttonHoverColor: "hover:bg-teal-700",
      category: ["면책후대출", "특별대출"]
    },
    {
      id: 2,
      title: "신용등급 무관 대출",
      description: "신용등급이 낮아도 신청 가능한 대출 상품",
      cta: "대출 상담받기",
      url: "https://example.com/no-credit-loan",
      bgColor: "from-cyan-50 to-blue-50",
      borderColor: "border-cyan-200",
      badgeColor: "bg-cyan-100 text-cyan-800",
      buttonColor: "bg-cyan-600 hover:bg-cyan-700",
      buttonHoverColor: "hover:bg-cyan-700",
      category: ["저신용대출", "신용등급무관"]
    },
    {
      id: 3,
      title: "개인회생자 대출",
      description: "개인회생 인가 후 6개월부터 대출 가능",
      cta: "대출 확인하기",
      url: "https://example.com/recovery-loan",
      bgColor: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      badgeColor: "bg-emerald-100 text-emerald-800",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      buttonHoverColor: "hover:bg-emerald-700",
      category: ["개인회생", "대출"]
    },
    {
      id: 4,
      title: "소액 급전 대출",
      description: "긴급자금이 필요할 때 빠른 승인 가능",
      cta: "급전 신청하기",
      url: "https://example.com/emergency-loan",
      bgColor: "from-red-50 to-pink-50",
      borderColor: "border-red-200",
      badgeColor: "bg-red-100 text-red-800",
      buttonColor: "bg-red-600 hover:bg-red-700",
      buttonHoverColor: "hover:bg-red-700",
      category: ["소액대출", "급전"]
    },
    {
      id: 5,
      title: "대출 금리 비교",
      description: "여러 금융기관의 대출 금리를 한번에 비교",
      cta: "금리 비교하기",
      url: "https://example.com/rate-comparison",
      bgColor: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-200",
      badgeColor: "bg-yellow-100 text-yellow-800",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      buttonHoverColor: "hover:bg-yellow-700",
      category: ["금리비교", "대출비교"]
    },
    {
      id: 6,
      title: "직장인 신용대출",
      description: "재직증명서만으로 신용대출 신청 가능",
      cta: "신용대출 신청하기",
      url: "https://example.com/employee-loan",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      badgeColor: "bg-blue-100 text-blue-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      buttonHoverColor: "hover:bg-blue-700",
      category: ["직장인대출", "신용대출"]
    },
    {
      id: 7,
      title: "자영업자 대출",
      description: "사업자등록증 기반 자영업자 전용 대출",
      cta: "사업자대출 신청하기",
      url: "https://example.com/business-loan",
      bgColor: "from-purple-50 to-violet-50",
      borderColor: "border-purple-200",
      badgeColor: "bg-purple-100 text-purple-800",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      buttonHoverColor: "hover:bg-purple-700",
      category: ["자영업자대출", "사업자대출"]
    },
    {
      id: 8,
      title: "담보 대출 상품",
      description: "부동산 담보 기반의 저금리 대출 상품",
      cta: "담보대출 상담받기",
      url: "https://example.com/secured-loan",
      bgColor: "from-orange-50 to-red-50",
      borderColor: "border-orange-200",
      badgeColor: "bg-orange-100 text-orange-800",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      buttonHoverColor: "hover:bg-orange-700",
      category: ["담보대출", "부동산담보"]
    },
    {
      id: 9,
      title: "대출 상환 컨설팅",
      description: "효율적인 대출 상환 계획 수립 도움",
      cta: "상환 컨설팅받기",
      url: "https://example.com/repayment-consulting",
      bgColor: "from-slate-50 to-gray-50",
      borderColor: "border-slate-200",
      badgeColor: "bg-slate-100 text-slate-800",
      buttonColor: "bg-slate-600 hover:bg-slate-700",
      buttonHoverColor: "hover:bg-slate-700",
      category: ["상환컨설팅", "대출관리"]
    },
    {
      id: 10,
      title: "대출 부정보 정정",
      description: "신용정보 오류 정정으로 대출 승인율 높이기",
      cta: "정보정정 신청하기",
      url: "https://example.com/credit-correction",
      bgColor: "from-pink-50 to-rose-50",
      borderColor: "border-pink-200",
      badgeColor: "bg-pink-100 text-pink-800",
      buttonColor: "bg-pink-600 hover:bg-pink-700",
      buttonHoverColor: "hover:bg-pink-700",
      category: ["신용정보정정", "대출승인"]
    }
  ]

  // 샘플 게시글 데이터
  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: 1,
        title: "면책 후 2년, 드디어 대출 승인 받았어요!",
        content: "면책 받고 2년이 지나서 신용등급도 많이 올라왔는데, 드디어 대출 승인을 받았습니다. 금리는 좀 높지만 그래도 희망이 보여요...",
        author: "새출발성공",
        category: "loan-story",
        tags: ["면책후대출", "승인", "2년후"],
        created_at: "2025-01-03T18:15:00Z",
        view_count: 645,
        like_count: 58,
        comment_count: 29,
        prefix: "성공담"
      },
      {
        id: 2,
        title: "개인회생 중인데 대출 가능한 곳 있을까요?",
        content: "현재 개인회생 진행 중인데 급하게 자금이 필요한 상황이에요. 개인회생 중에도 대출 받을 수 있는 곳이 있는지 궁금합니다...",
        author: "급한상황",
        category: "loan-story",
        tags: ["개인회생", "대출문의", "급전"],
        created_at: "2025-01-03T13:30:00Z",
        view_count: 423,
        like_count: 32,
        comment_count: 18,
        prefix: "질문"
      },
      {
        id: 3,
        title: "신용등급 7등급에서 300만원 대출 받은 후기",
        content: "신용등급이 7등급인데 300만원 대출을 받을 수 있었어요. 어떤 곳에서 어떤 조건으로 받았는지 상세하게 공유해드릴게요...",
        author: "대출성공자",
        category: "loan-story",
        tags: ["7등급", "300만원", "대출후기"],
        created_at: "2025-01-02T16:45:00Z",
        view_count: 892,
        like_count: 76,
        comment_count: 41,
        prefix: "후기"
      },
      {
        id: 4,
        title: "대출 거절당했는데 다른 곳에서 승인 받기",
        content: "한 곳에서 대출 거절당해서 실망했는데, 다른 곳에서 신청했더니 승인이 나왔어요. 대출 승인율 높이는 팁을 공유합니다...",
        author: "재도전성공",
        category: "loan-story",
        tags: ["대출거절", "재신청", "승인팁"],
        created_at: "2025-01-02T11:20:00Z",
        view_count: 567,
        like_count: 45,
        comment_count: 23,
        prefix: "팁"
      },
      {
        id: 5,
        title: "대출 받기 전에 꼭 확인해야 할 것들",
        content: "대출 받을 때 실수하지 않으려면 꼭 확인해야 할 체크리스트를 정리해봤어요. 금리, 수수료, 상환 조건 등을 꼼꼼히 따져보세요...",
        author: "경험자조언",
        category: "loan-story",
        tags: ["대출팁", "체크리스트", "주의사항"],
        created_at: "2025-01-01T15:30:00Z",
        view_count: 734,
        like_count: 62,
        comment_count: 34,
        prefix: "정보"
      }
    ]

    // 로컬 스토리지에서 사용자가 작성한 게시글 가져오기
    const savedPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
    
    // 기존 샘플 데이터 확인 (로컬 스토리지에 샘플 데이터가 없으면 추가)
    const existingSamplePosts = JSON.parse(localStorage.getItem('loan-story-sample-posts') || '[]')
    
    if (existingSamplePosts.length === 0) {
      // 처음 방문 시 샘플 데이터를 로컬 스토리지에 저장
      localStorage.setItem('loan-story-sample-posts', JSON.stringify(samplePosts))
      localStorage.setItem('community-posts', JSON.stringify([...savedPosts, ...samplePosts]))
    }
    
    // 로컬 스토리지에서 모든 게시글 가져오기
    const allPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
    
    // 대출이야기 카테고리만 필터링
    const loanStoryPosts = allPosts.filter((post: Post) => 
      post.category === 'loan-story'
    )
    
    // 중복 제거 (ID 기준)
    const uniquePosts = loanStoryPosts.filter((post: Post, index: number, self: Post[]) => 
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
        '대출': ['면책후대출', '신용회복', '저신용대출'],
        '후기': ['대출', '성공사례'],
        '질문': ['대출', '상담'],
        '정보': ['대출', '비교'],
        '성공담': ['특별대출', '성공사례'],
        '팁': ['대출', '승인팁']
      }

      const relevantCategories = prefixAdMapping[selectedPrefix] || ['대출']
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
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <DollarSign className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">대출이야기</h1>
          </div>
          <p className="text-teal-100 text-lg">
            면책후 대출, 신용회복 대출 등 다양한 대출 경험과 정보를 나누는 공간입니다.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-teal-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                대출 정보
              </div>
              <div>다양한 대출 상품 안내</div>
            </div>
            <div className="bg-teal-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                승인 팁
              </div>
              <div>대출 승인율 높이는 방법</div>
            </div>
            <div className="bg-teal-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                경험 공유
              </div>
              <div>실제 대출 경험담</div>
            </div>
            <div className="bg-teal-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Star className="w-4 h-4 mr-1" />
                성공 사례
              </div>
              <div>대출 승인 성공 후기</div>
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
              placeholder="대출 이야기 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPrefix}
              onChange={(e) => setSelectedPrefix(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="all">전체 말머리</option>
              {prefixes.filter(p => p !== 'all').map(prefix => (
                <option key={prefix} value={prefix}>[{prefix}]</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="latest">최신순</option>
              <option value="views">조회순</option>
              <option value="likes">추천순</option>
              <option value="comments">댓글순</option>
            </select>
            <button
              onClick={() => setShowWriteModal(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center"
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
                  <Link href={`/loan-story/${post.id}`}>
                    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full mr-2">
                              {post.prefix}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 hover:text-teal-600">
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
                            <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all flex items-center text-sm font-medium">
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
                        ? 'bg-teal-600 text-white border-teal-600'
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
                <TrendingUp className="w-5 h-5 mr-2 text-teal-500" />
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {['면책후대출', '신용등급', '대출승인', '저신용대출', '급전', '대출후기', '승인팁', '대출비교'].map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm hover:bg-teal-100 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 대출 팁 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-teal-500" />
                대출 성공 팁
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>신용정보를 미리 확인하고 오류가 있다면 정정하세요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>여러 금융기관에 동시 신청보다는 선별적으로 신청하세요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>필요한 서류를 미리 준비해서 승인 확률을 높이세요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>대출 조건을 꼼꼼히 비교하고 선택하세요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  <span>상환 계획을 세우고 연체되지 않도록 관리하세요</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <PostWriteModal
          category="loan-story"
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