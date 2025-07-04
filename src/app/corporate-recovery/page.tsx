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
  Building,
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

export default function CorporateRecoveryPage() {
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

  // 법인회생 관련 네이티브 광고
  const nativeAds: Ad[] = [
    {
      id: 1,
      title: "법인회생 전문 법무법인 상담",
      description: "기업회생 전문 변호사가 무료로 상담해드립니다. 성공률 90% 이상 검증된 전문가",
      cta: "무료 상담 신청하기",
      category: ["법인회생", "기업회생", "사업재개"],
      url: "https://example.com/corporate-recovery-consultation",
      clicks: 980,
      impressions: 11200
    },
    {
      id: 2,
      title: "법인회생 후 사업 재기 지원",
      description: "법인회생 인가 후 사업 재개를 위한 자금 지원 및 컨설팅을 제공합니다.",
      cta: "재기 지원 신청하기",
      category: ["법인회생", "사업재개", "자금지원"],
      url: "https://example.com/business-recovery-support",
      clicks: 750,
      impressions: 9800
    }
  ]

  // 사이드바 랜덤 광고 (10개)
  const sidebarRandomAds: SidebarAd[] = [
    {
      id: 1,
      title: "법인회생 전문 변호사",
      description: "기업회생 전문 법무법인, 성공률 90% 이상",
      cta: "무료 상담받기",
      url: "https://example.com/corporate-lawyer",
      bgColor: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-200",
      badgeColor: "bg-purple-100 text-purple-800",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      buttonHoverColor: "hover:bg-purple-700",
      category: ["법인회생", "기업회생"]
    },
    {
      id: 2,
      title: "기업 구조조정 컨설팅",
      description: "법인회생 전후 기업 구조조정 전문 컨설팅",
      cta: "컨설팅 신청하기",
      url: "https://example.com/restructuring-consulting",
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      badgeColor: "bg-blue-100 text-blue-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      buttonHoverColor: "hover:bg-blue-700",
      category: ["구조조정", "법인회생"]
    },
    {
      id: 3,
      title: "법인회생 회계 서비스",
      description: "법인회생 절차 중 회계 및 재무 관리 전문 서비스",
      cta: "회계 상담받기",
      url: "https://example.com/recovery-accounting",
      bgColor: "from-green-50 to-teal-50",
      borderColor: "border-green-200",
      badgeColor: "bg-green-100 text-green-800",
      buttonColor: "bg-green-600 hover:bg-green-700",
      buttonHoverColor: "hover:bg-green-700",
      category: ["법인회생", "회계서비스"]
    },
    {
      id: 4,
      title: "법인회생 자금 지원",
      description: "법인회생 인가 후 운영자금 지원 프로그램",
      cta: "자금지원 신청하기",
      url: "https://example.com/corporate-funding",
      bgColor: "from-orange-50 to-yellow-50",
      borderColor: "border-orange-200",
      badgeColor: "bg-orange-100 text-orange-800",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      buttonHoverColor: "hover:bg-orange-700",
      category: ["법인회생", "자금지원"]
    },
    {
      id: 5,
      title: "기업회생 성공 사례",
      description: "실제 기업회생 성공 사례를 통해 노하우 획득",
      cta: "성공사례 보기",
      url: "https://example.com/success-cases",
      bgColor: "from-pink-50 to-rose-50",
      borderColor: "border-pink-200",
      badgeColor: "bg-pink-100 text-pink-800",
      buttonColor: "bg-pink-600 hover:bg-pink-700",
      buttonHoverColor: "hover:bg-pink-700",
      category: ["법인회생", "성공사례"]
    },
    {
      id: 6,
      title: "법인회생 서류 대행",
      description: "복잡한 법인회생 서류 작성을 전문가가 대행",
      cta: "서류대행 신청하기",
      url: "https://example.com/document-service",
      bgColor: "from-indigo-50 to-purple-50",
      borderColor: "border-indigo-200",
      badgeColor: "bg-indigo-100 text-indigo-800",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
      buttonHoverColor: "hover:bg-indigo-700",
      category: ["법인회생", "서류대행"]
    },
    {
      id: 7,
      title: "기업 부채 정리 서비스",
      description: "법인회생 전 부채 정리 및 협상 지원",
      cta: "부채정리 상담받기",
      url: "https://example.com/debt-restructuring",
      bgColor: "from-slate-50 to-gray-50",
      borderColor: "border-slate-200",
      badgeColor: "bg-slate-100 text-slate-800",
      buttonColor: "bg-slate-600 hover:bg-slate-700",
      buttonHoverColor: "hover:bg-slate-700",
      category: ["부채정리", "법인회생"]
    },
    {
      id: 8,
      title: "법인회생 비용 지원",
      description: "법인회생 절차 비용 지원 프로그램 안내",
      cta: "비용지원 신청하기",
      url: "https://example.com/cost-support",
      bgColor: "from-teal-50 to-green-50",
      borderColor: "border-teal-200",
      badgeColor: "bg-teal-100 text-teal-800",
      buttonColor: "bg-teal-600 hover:bg-teal-700",
      buttonHoverColor: "hover:bg-teal-700",
      category: ["법인회생", "비용지원"]
    },
    {
      id: 9,
      title: "기업 재기 컨설팅",
      description: "법인회생 후 성공적인 사업 재기를 위한 컨설팅",
      cta: "재기 컨설팅 신청하기",
      url: "https://example.com/recovery-consulting",
      bgColor: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      badgeColor: "bg-amber-100 text-amber-800",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
      buttonHoverColor: "hover:bg-amber-700",
      category: ["법인회생", "재기컨설팅"]
    },
    {
      id: 10,
      title: "법인회생 법률 상담",
      description: "법인회생 관련 법률 문제 전문 상담",
      cta: "법률상담 신청하기",
      url: "https://example.com/legal-consultation",
      bgColor: "from-violet-50 to-purple-50",
      borderColor: "border-violet-200",
      badgeColor: "bg-violet-100 text-violet-800",
      buttonColor: "bg-violet-600 hover:bg-violet-700",
      buttonHoverColor: "hover:bg-violet-700",
      category: ["법인회생", "법률상담"]
    }
  ]

  // 샘플 게시글 데이터
  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: 1,
        title: "법인회생 신청 후 2개월 진행 상황",
        content: "법인회생 신청하고 2개월이 지났는데 절차가 생각보다 복잡하네요. 회생계획안 작성이 가장 어려웠던 것 같아요...",
        author: "재기를꿈꾸는사장",
        category: "corporate-recovery",
        tags: ["법인회생", "진행상황", "회생계획안"],
        created_at: "2025-01-03T16:45:00Z",
        view_count: 428,
        like_count: 35,
        comment_count: 18,
        prefix: "경험담"
      },
      {
        id: 2,
        title: "법인회생 vs 파산 선택 기준이 궁금해요",
        content: "현재 회사 상황이 어려워서 법인회생과 파산 중 어떤 것을 선택해야 할지 고민이에요. 각각의 장단점을 알고 싶습니다...",
        author: "고민중인대표",
        category: "corporate-recovery",
        tags: ["법인회생", "파산", "선택기준"],
        created_at: "2025-01-03T11:30:00Z",
        view_count: 623,
        like_count: 52,
        comment_count: 27,
        prefix: "질문"
      },
      {
        id: 3,
        title: "법인회생 인가 후 성공적인 사업 재개",
        content: "법인회생 인가 받은 지 1년이 지났는데 드디어 사업이 정상화되었어요. 어려운 시기를 견뎌내고 다시 일어설 수 있었던 비결을 공유해드릴게요...",
        author: "재기성공사장",
        category: "corporate-recovery",
        tags: ["법인회생", "사업재개", "성공사례"],
        created_at: "2025-01-02T14:20:00Z",
        view_count: 891,
        like_count: 78,
        comment_count: 41,
        prefix: "성공담"
      },
      {
        id: 4,
        title: "법인회생 절차 중 직원 관리는 어떻게 하시나요?",
        content: "법인회생 절차를 진행하면서 직원들에게 어떻게 설명해야 할지, 급여는 어떻게 지급해야 할지 궁금합니다...",
        author: "직원생각하는사장",
        category: "corporate-recovery",
        tags: ["법인회생", "직원관리", "급여"],
        created_at: "2025-01-02T09:15:00Z",
        view_count: 345,
        like_count: 28,
        comment_count: 15,
        prefix: "질문"
      },
      {
        id: 5,
        title: "법인회생 신청 서류 준비하는 팁",
        content: "법인회생 신청 서류를 준비하면서 알게 된 팁들을 공유해요. 미리 알았으면 더 수월했을 것 같아서 다른 분들께 도움이 되었으면 좋겠어요...",
        author: "경험자가알려주는팁",
        category: "corporate-recovery",
        tags: ["법인회생", "서류준비", "팁"],
        created_at: "2025-01-01T13:40:00Z",
        view_count: 567,
        like_count: 45,
        comment_count: 22,
        prefix: "정보"
      }
    ]

    // 로컬 스토리지에서 사용자가 작성한 게시글 가져오기
    const savedPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
    
    // 기존 샘플 데이터 확인 (로컬 스토리지에 샘플 데이터가 없으면 추가)
    const existingSamplePosts = JSON.parse(localStorage.getItem('corporate-recovery-sample-posts') || '[]')
    
    if (existingSamplePosts.length === 0) {
      // 처음 방문 시 샘플 데이터를 로컬 스토리지에 저장
      localStorage.setItem('corporate-recovery-sample-posts', JSON.stringify(samplePosts))
      localStorage.setItem('community-posts', JSON.stringify([...savedPosts, ...samplePosts]))
    }
    
    // 로컬 스토리지에서 모든 게시글 가져오기
    const allPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
    
    // 법인회생 카테고리만 필터링
    const corporateRecoveryPosts = allPosts.filter((post: Post) => 
      post.category === 'corporate-recovery'
    )
    
    // 중복 제거 (ID 기준)
    const uniquePosts = corporateRecoveryPosts.filter((post: Post, index: number, self: Post[]) => 
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
        '법인회생': ['법인회생', '기업회생', '사업재개'],
        '기업회생': ['기업회생', '법인회생', '구조조정'],
        '파산': ['파산', '법인회생', '부채정리'],
        '질문': ['법인회생', '법률상담'],
        '정보': ['법인회생', '서류대행'],
        '경험담': ['법인회생', '성공사례'],
        '성공담': ['법인회생', '성공사례', '재기컨설팅']
      }

      const relevantCategories = prefixAdMapping[selectedPrefix] || ['법인회생']
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <Building className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">법인회생</h1>
          </div>
          <p className="text-purple-100 text-lg">
            기업의 재기를 위한 법인회생 정보와 경험을 나누는 전문 공간입니다.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-purple-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Scale className="w-4 h-4 mr-1" />
                법인회생
              </div>
              <div>기업회생 절차 안내</div>
            </div>
            <div className="bg-purple-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                구조조정
              </div>
              <div>기업 구조조정 전략</div>
            </div>
            <div className="bg-purple-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                경험 공유
              </div>
              <div>실제 기업 사례 공유</div>
            </div>
            <div className="bg-purple-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Star className="w-4 h-4 mr-1" />
                재기 성공
              </div>
              <div>성공적인 사업 재개</div>
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
              placeholder="법인회생 이야기 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPrefix}
              onChange={(e) => setSelectedPrefix(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">전체 말머리</option>
              {prefixes.filter(p => p !== 'all').map(prefix => (
                <option key={prefix} value={prefix}>[{prefix}]</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="latest">최신순</option>
              <option value="views">조회순</option>
              <option value="likes">추천순</option>
              <option value="comments">댓글순</option>
            </select>
            <button
              onClick={() => setShowWriteModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
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
                  <Link href={`/corporate-recovery/${post.id}`}>
                    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-2">
                              {post.prefix}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 hover:text-purple-600">
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
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border-2 border-purple-300 hover:shadow-xl transition-all cursor-pointer mt-4 mb-4"
                         onClick={() => {
                           console.log('🎯 법인회생 네이티브 광고 클릭:', index);
                           window.open('/ad-landing/corporate-recovery', '_blank');
                         }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-purple-400 text-purple-900 text-xs px-3 py-1 rounded-full mr-2 font-bold">
                              🎯 법인회생 광고 #{Math.floor(index / 5) + 1} (게시글 {index + 1}번째 후)
                            </span>
                            <span className="text-xs text-gray-500">
                              Sponsored
                            </span>
                          </div>
                          <h3 className="font-bold text-xl mb-2 text-gray-900">
                            🏢 법인회생 전문 법무법인 상담
                          </h3>
                          <p className="text-gray-700 mb-3 leading-relaxed">
                            기업회생 전문 변호사가 무료로 상담해드립니다. 성공률 90% 이상 검증된 전문가!
                          </p>
                          <div className="flex items-center justify-between">
                            <button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                              무료 상담 신청
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </button>
                            <div className="text-xs text-gray-400">
                              법인회생 전문 변호사
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 디버깅용 로그 */}
                  {console.log(`🔍 법인회생 게시글 렌더링: ${post.id} (${post.title}), 인덱스: ${index}, 광고표시: ${(index + 1) % 5 === 0 ? 'YES' : 'NO'}`)}


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
                        ? 'bg-purple-600 text-white border-purple-600'
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
                <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {['법인회생', '기업회생', '구조조정', '사업재개', '회생계획안', '재기성공', '부채정리', '경영정상화'].map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 법인회생 팁 */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-purple-500" />
                법인회생 핵심 팁
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>사업 계속 가능성을 객관적으로 평가하세요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>회생계획안 작성 시 현실적인 계획을 세우세요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>전문가와 상담하여 성공률을 높이세요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>직원과 이해관계자들과의 소통이 중요해요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>회생 후 경영 혁신을 통해 재기를 도모하세요</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <PostWriteModal
          category="corporate-recovery"
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