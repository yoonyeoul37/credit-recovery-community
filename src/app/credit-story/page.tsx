'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PostWriteModal from '@/components/PostWriteModal'
import { MessageCircle, Plus, Search, CreditCard, TrendingUp, Star, ExternalLink } from 'lucide-react'
import { sidebarRandomAds } from '@/lib/ads'

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

export default function CreditStoryPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPrefix, setSelectedPrefix] = useState('all')
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)
  const [randomSidebarAds, setRandomSidebarAds] = useState<SidebarAd[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('latest') // 정렬 기준: latest, views, likes, comments
  const [nativeAds, setNativeAds] = useState<any[]>([]) // Supabase 네이티브 광고
  
  const postsPerPage = 8 // 페이지당 8개 게시글

  // 광고 데이터 (1단계: 고정 광고들)
  const ads: Ad[] = [
    {
      id: 1,
      title: "💳 면책자 전용 신용카드 바로 발급받기",
      description: "면책 완료자도 신용카드 발급 가능! 무료 상담 후 당일 발급",
      cta: "무료 상담받기",
      category: ['면책후카드', 'all'],
      url: "/ad-landing/credit-card",
      clicks: 0,
      impressions: 0
    },
    {
      id: 2, 
      title: "📊 신용등급 관리 전문 서비스",
      description: "AI 기반 맞춤 신용관리로 6개월 내 등급 상승 보장",
      cta: "등급 진단받기",
      category: ['신용등급', 'all'],
      url: "/ad-landing/credit-score",
      clicks: 0,
      impressions: 0
    },
    {
      id: 3,
      title: "⚖️ 개인회생 전문 법무사 무료 상담",
      description: "15년 경력 전문 법무사가 직접 상담. 성공률 95% 보장",
      cta: "무료 상담신청",
      category: ['신용이야기', 'all'],
      url: "/ad-landing/legal-service",
      clicks: 0,
      impressions: 0
    },
    {
      id: 4,
      title: "🏦 신용불량자 전용 대출 5분 승인",
      description: "면책자도 OK! 소액부터 시작하는 신용회복 대출",
      cta: "대출 신청하기",
      category: ['경험담', 'all'],
      url: "/ad-landing/recovery-loan",
      clicks: 0,
      impressions: 0
    },
    {
      id: 5,
      title: "💼 신용회복 전문 상담사 1:1 컨설팅",
      description: "개인별 맞춤 신용회복 로드맵 제공. 성공사례 1000건+",
      cta: "상담 예약하기",
      category: ['all'],
      url: "/ad-landing/consulting",
      clicks: 0,
      impressions: 0
    }
  ]

  // Supabase에서 네이티브 광고 불러오기
  const fetchNativeAds = async () => {
    try {
      console.log('🚀 네이티브 광고 로드 시작...')
      const apiUrl = '/api/ads?category=creditStory&adType=native&isActive=true'
      console.log('📞 API 호출 URL:', apiUrl)
      
      const response = await fetch(apiUrl)
      console.log('📡 API 응답 상태:', response.status)
      
      const data = await response.json()
      console.log('📦 API 응답 데이터:', data)
      
      if (response.ok && data.ads) {
        console.log('🎯 네이티브 광고 로드 성공:', data.ads.length, '개')
        setNativeAds(data.ads)
      } else {
        console.error('❌ 네이티브 광고 로드 실패:', data.error)
        console.error('❌ 응답 전체:', data)
      }
    } catch (error) {
      console.error('❌ 네이티브 광고 API 오류:', error)
    }
  }

  // 게시글 데이터 로드 (로컬 스토리지 + 샘플 데이터)
  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: 1,
        title: '[면책후카드] 면책 후 6개월, 우리카드 발급 성공!',
        content: '면책 결정 받고 6개월 지나서 우리카드 체크카드 신청했는데 바로 승인됐어요! 월 30만원씩 사용하고 있습니다.',
        author: '새출발123',
        category: 'credit-story',
        prefix: '면책후카드',
        tags: ['신용카드', '면책후', '우리카드'],
        created_at: '2024-01-15T10:30:00Z',
        view_count: 234,
        like_count: 15,
        comment_count: 8,
        images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzAwNGNjMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTZweCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7smrDrpqzsubTrk5zsnbQ8L3RleHQ+PC9zdmc+'],
        imageCount: 1
      },
      {
        id: 2,
        title: '[신용등급] 10등급에서 6등급까지 올린 방법',
        content: '면책 후 2년간 꾸준히 관리해서 신용등급을 6등급까지 올렸습니다. 제가 사용한 구체적인 방법들 공유해요.',
        author: '등급상승왕',
        category: 'credit-story',
        prefix: '신용등급',
        tags: ['신용등급', '관리방법', '성공후기'],
        created_at: '2024-01-14T15:20:00Z',
        view_count: 456,
        like_count: 32,
        comment_count: 12,
        images: [
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTRweCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7si6Dsqahu2rHq0YM6IDbnp4Dquac8L3RleHQ+PC9zdmc+',
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzM3MzNkYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTRweCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5OaWNlOiA27rK8656w6quc6raI7ZXt7KeAPC90ZXh0Pjwvc3ZnPg=='
        ],
        imageCount: 2
      },
      {
        id: 3,
        title: '[경험담] 개인회생 3년 변제 완료한 후기',
        content: '드디어 3년간의 개인회생 변제를 모두 마쳤습니다. 힘들었지만 이제 새 출발할 수 있어서 기뻐요.',
        author: '완주성공',
        category: 'credit-story',
        prefix: '경험담',
        tags: ['개인회생', '변제완료', '후기'],
        created_at: '2024-01-13T09:15:00Z',
        view_count: 678,
        like_count: 45,
        comment_count: 19
      },
      {
        id: 4,
        title: '[신용이야기] 신용 관리의 중요성을 뒤늦게 깨달았네요',
        content: '20대에 신용을 너무 함부로 썼다가 큰 고생했습니다. 지금은 체계적으로 관리하고 있어요.',
        author: '늦깨달음',
        category: 'credit-story',
        prefix: '신용이야기',
        tags: ['신용관리', '경험담', '깨달음'],
        created_at: '2024-01-12T14:45:00Z',
        view_count: 345,
        like_count: 23,
        comment_count: 11
      },
      {
        id: 5,
        title: '[면책후카드] 새마을금고 체크카드 발급 정보',
        content: '면책자에게 관대한 새마을금고에서 체크카드 발급받았어요. 신청 과정과 필요 서류 정리해드려요.',
        author: '정보공유',
        category: 'credit-story',
        prefix: '면책후카드',
        tags: ['새마을금고', '체크카드', '정보'],
        created_at: '2024-01-11T11:20:00Z',
        view_count: 567,
        like_count: 28,
        comment_count: 15
      },
      // 페이징 테스트용 추가 게시글들
      {
        id: 6,
        title: '[신용등급] CB에서 6등급 받은 후기',
        content: '오늘 CB 조회해보니 6등급까지 올랐네요! 정말 기쁩니다.',
        author: '6등급달성',
        category: 'credit-story',
        prefix: '신용등급',
        tags: ['신용등급', 'CB', '성공'],
        created_at: '2024-01-10T14:30:00Z',
        view_count: 345,
        like_count: 22,
        comment_count: 9
      },
      {
        id: 7,
        title: '[경험담] 개인회생 신청 과정 상세 후기',
        content: '작년에 개인회생 신청해서 인가 받은 과정을 자세히 공유합니다.',
        author: '인가받음',
        category: 'credit-story',
        prefix: '경험담',
        tags: ['개인회생', '신청과정', '후기'],
        created_at: '2024-01-09T16:45:00Z',
        view_count: 678,
        like_count: 41,
        comment_count: 23
      },
      {
        id: 8,
        title: '[면책후카드] 하나카드 발급 성공!',
        content: '면책 후 8개월 만에 하나카드 체크카드 발급 성공했어요!',
        author: '하나성공',
        category: 'credit-story',
        prefix: '면책후카드',
        tags: ['하나카드', '체크카드', '발급'],
        created_at: '2024-01-08T12:15:00Z',
        view_count: 432,
        like_count: 26,
        comment_count: 14,
        images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VjNGNjOCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTZweCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7smZjrgZzssubTrE48L3RleHQ+PC9zdmc+'],
        imageCount: 1
      },
      {
        id: 9,
        title: '[신용이야기] 신용관리 1년 후 변화',
        content: '체계적으로 신용관리 한 지 1년이 되었는데 많은 변화가 있었어요.',
        author: '1년후기',
        category: 'credit-story',
        prefix: '신용이야기',
        tags: ['신용관리', '1년', '변화'],
        created_at: '2024-01-07T10:00:00Z',
        view_count: 523,
        like_count: 35,
        comment_count: 18
      },
      {
        id: 10,
        title: '[신용등급] NICE 등급 상승 팁',
        content: 'NICE 신용평가에서 등급 올리는 실질적인 방법들을 공유합니다.',
        author: 'NICE전문가',
        category: 'credit-story',
        prefix: '신용등급',
        tags: ['NICE', '등급상승', '팁'],
        created_at: '2024-01-06T15:30:00Z',
        view_count: 756,
        like_count: 42,
        comment_count: 21
      }
    ]

    // 로컬 스토리지에서 사용자가 작성한 게시글 가져오기
    const savedPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
    
    // 기존 샘플 데이터 확인 (로컬 스토리지에 샘플 데이터가 없으면 추가)
    const existingSamplePosts = JSON.parse(localStorage.getItem('credit-story-sample-posts') || '[]')
    
    if (existingSamplePosts.length === 0) {
      // 처음 방문 시 샘플 데이터를 로컬 스토리지에 저장
      localStorage.setItem('credit-story-sample-posts', JSON.stringify(samplePosts))
      localStorage.setItem('community-posts', JSON.stringify([...savedPosts, ...samplePosts]))
    }
    
    // 로컬 스토리지에서 모든 게시글 가져오기
    const allPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
    
    // 신용이야기 카테고리만 필터링
    const creditStoryPosts = allPosts.filter((post: Post) => 
      post.category === 'credit-story'
    )
    
    // 중복 제거 (ID 기준)
    const uniquePosts = creditStoryPosts.filter((post: Post, index: number, self: Post[]) => 
      index === self.findIndex((p: Post) => p.id === post.id)
    )
    
    // 최신순으로 정렬
    const sortedPosts = uniquePosts.sort((a: Post, b: Post) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    
    setPosts(sortedPosts)
    
    // 네이티브 광고 로드
    fetchNativeAds()
  }, [])

  // 말머리에 맞는 광고 선택
  useEffect(() => {
    const getRandomAd = () => {
      let availableAds = ads

      // 선택된 말머리에 맞는 광고 필터링
      if (selectedPrefix !== 'all') {
        availableAds = ads.filter(ad => 
          ad.category.includes(selectedPrefix) || ad.category.includes('all')
        )
      }

      // 랜덤 선택
      const randomIndex = Math.floor(Math.random() * availableAds.length)
      const ad = availableAds[randomIndex]
      
      // 노출수 증가
      ad.impressions++
      
      setSelectedAd(ad)
    }

    getRandomAd()
  }, [selectedPrefix]) // 말머리 변경시마다 새로운 광고

  // 광고 클릭 처리
  const handleAdClick = (ad: Ad) => {
    // 클릭수 증가
    ad.clicks++
    
    // 클릭 추적 로그
    console.log(`광고 클릭: ${ad.title}, 총 클릭: ${ad.clicks}`)
    
    // 실제로는 여기서 서버에 클릭 데이터 전송
    // await trackAdClick(ad.id)
    
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <MessageCircle className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">신용이야기</h1>
          </div>
          <p className="text-blue-100 text-lg">
            면책후 신용회복의 모든 이야기를 나누는 공간입니다.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <CreditCard className="w-4 h-4 mr-1" />
                카드 발급
              </div>
              <div>면책후 카드 발급 정보</div>
            </div>
            <div className="bg-blue-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                신용등급
              </div>
              <div>신용등급 관리 방법</div>
            </div>
            <div className="bg-blue-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                신용이야기
              </div>
              <div>일반적인 신용 이야기</div>
            </div>
            <div className="bg-blue-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Star className="w-4 h-4 mr-1" />
                경험담
              </div>
              <div>개인적인 성공/실패 경험</div>
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
              placeholder="신용이야기 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPrefix}
              onChange={(e) => setSelectedPrefix(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">전체 말머리</option>
              {prefixes.filter(p => p !== 'all').map(prefix => (
                <option key={prefix} value={prefix}>[{prefix}]</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="latest">최신순</option>
              <option value="views">조회순</option>
              <option value="likes">추천순</option>
              <option value="comments">댓글순</option>
            </select>
            <button
              onClick={() => setShowWriteModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
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
                  <Link href={`/credit-story/${post.id}`}>
                    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                              {post.prefix}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 hover:text-blue-600">
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
                  {(index + 1) % 5 === 0 && nativeAds.length > 0 && (
                    (() => {
                      const adIndex = Math.floor(index / 5) % nativeAds.length;
                      const ad = nativeAds[adIndex];
                      const bgColor = ad.native_config?.backgroundColor || '#fff3cd';
                      const showEvery = ad.native_config?.showEvery || 5;
                      
                      return (
                        <div 
                          className="rounded-lg p-6 border-2 hover:shadow-xl transition-all cursor-pointer mt-4 mb-4"
                          style={{ 
                            backgroundColor: bgColor,
                            borderColor: bgColor.replace('50', '300')
                          }}
                          onClick={() => {
                            console.log('🎯 네이티브 광고 클릭:', ad.title);
                            window.open(ad.link, '_blank');
                          }}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <span className="bg-yellow-400 text-yellow-900 text-xs px-3 py-1 rounded-full mr-2 font-bold">
                                  [광고] {ad.native_config?.ctaText || 'Sponsored'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {showEvery}개마다 표시
                                </span>
                              </div>
                              <h3 className="font-bold text-xl mb-2 text-gray-900">
                                {ad.title}
                              </h3>
                              <p className="text-gray-700 mb-3 leading-relaxed">
                                {ad.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                                  {ad.native_config?.ctaText || '자세히 보기'}
                                  <ExternalLink className="w-4 h-4 ml-2" />
                                </button>
                                <div className="text-xs text-gray-400">
                                  광고 ID: {ad.id}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )}

                  {/* 디버깅용 로그 */}
                  {console.log(`🔍 게시글 렌더링: ${post.id} (${post.title}), 인덱스: ${index}, 광고표시: ${(index + 1) % 5 === 0 ? 'YES' : 'NO'}`)}


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
                        ? 'bg-blue-600 text-white border-blue-600'
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

            {/* 페이지 정보 */}
            <div className="text-center text-sm text-gray-500 mt-4">
              전체 {sortedPosts.length}개 중 {startIndex + 1}-{Math.min(endIndex, sortedPosts.length)}개 표시
            </div>
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
                    className={`${ad.buttonColor} text-white px-4 py-2 rounded-lg ${ad.buttonHoverColor} transition-colors text-sm w-full`}
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
                <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {['신용카드', '면책후', '신용등급', '대출', '체크카드', '우리카드', '개인회생', '변제'].map((tag) => (
                  <button
                    key={tag}
                    className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 text-sm px-3 py-1 rounded-full transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 도움말 */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-lg mb-3">💡 신용 관리 팁</h3>
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

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <PostWriteModal
          category="credit-story"
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