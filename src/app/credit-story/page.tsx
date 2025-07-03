'use client'

import { useState, useEffect } from 'react'
import PostWrite from '@/components/PostWrite'
import { MessageCircle, Plus, Search, CreditCard, TrendingUp, Star, ExternalLink } from 'lucide-react'

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

export default function CreditStoryPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPrefix, setSelectedPrefix] = useState('all')
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)

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

  // 말머리별 게시글 샘플 데이터
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
        comment_count: 8
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
        comment_count: 12
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
      }
    ]

    setPosts(samplePosts)
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

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrefix = selectedPrefix === 'all' || post.prefix === selectedPrefix
    return matchesSearch && matchesPrefix
  })

  const prefixes = ['all', ...Array.from(new Set(posts.map(post => post.prefix).filter(Boolean)))]

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
            {/* 게시글 목록 with 네이티브 광고 */}
            <div className="space-y-4">
              {/* 첫 3개 게시글 */}
              {filteredPosts.slice(0, 3).map(post => (
                <div key={post.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
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
                      <h3 className="font-bold text-lg mb-2 hover:text-blue-600 cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {post.content}
                      </p>
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
              ))}

              {/* 네이티브 광고 */}
              {selectedAd && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-dashed border-yellow-200 hover:shadow-lg transition-all cursor-pointer"
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
                        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center text-sm font-medium">
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

              {/* 나머지 게시글 */}
              {filteredPosts.slice(3).map(post => (
                <div key={post.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
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
                      <h3 className="font-bold text-lg mb-2 hover:text-blue-600 cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {post.content}
                      </p>
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
              ))}
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 사이드바 배너 광고 */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <div className="text-center">
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full inline-block mb-3">
                  [광고]
                </div>
                <h3 className="font-bold text-lg mb-2">💳 신용카드 발급 전문</h3>
                <p className="text-sm text-gray-600 mb-4">
                  면책자도 OK! 당일 발급 가능한 신용카드 추천
                </p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm w-full">
                  무료 상담 신청
                </button>
              </div>
            </div>

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

            {/* 사이드바 배너 광고 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
              <div className="text-center">
                <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full inline-block mb-3">
                  [광고]
                </div>
                <h3 className="font-bold text-lg mb-2">📊 신용등급 관리</h3>
                <p className="text-sm text-gray-600 mb-4">
                  AI 기반 신용관리로 6개월 내 등급 상승!
                </p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm w-full">
                  등급 진단받기
                </button>
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
        <PostWrite
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