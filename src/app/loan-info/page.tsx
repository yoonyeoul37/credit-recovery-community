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
  Shield
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

export default function LoanInfoPage() {
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

  // 대출정보 관련 말머리
  const prefixes = ['all', '대출후기', '대출정보', '금리비교', '심사후기', '대출팁']

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
    }
  ]

  // 초기 게시글 로드 및 저장된 게시글 불러오기
  useEffect(() => {
    console.log('🔄 대출정보 페이지 데이터 로딩 시작...')
    
    // 로컬 스토리지에서 저장된 게시글 로드
    const savedPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
    
    // 대출정보 카테고리 게시글 필터링
    const loanInfoPosts = savedPosts.filter((post: Post) => post.category === 'loan-info')
    
    // 기본 샘플 데이터
    const samplePosts: Post[] = [
      {
        id: 101,
        title: '면책 후 첫 대출 승인받은 후기',
        content: '면책 후 2년 지나서 드디어 첫 대출 승인받았습니다. 캐피탈이지만 너무 기뻐요!',
        author: '새출발123',
        category: 'loan-info',
        tags: ['면책후대출', '승인후기', '캐피탈'],
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        view_count: 245,
        like_count: 18,
        comment_count: 12,
        prefix: '대출후기'
      },
      {
        id: 102,
        title: '신용불량자도 가능한 대출 상품 정리',
        content: '신용불량자도 신청 가능한 대출 상품들을 직접 알아본 결과를 공유합니다.',
        author: '대출정보왕',
        category: 'loan-info',
        tags: ['신용불량', '대출정보', '상품정리'],
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        view_count: 567,
        like_count: 35,
        comment_count: 23,
        prefix: '대출정보'
      },
      {
        id: 103,
        title: '1금융권 vs 2금융권 금리 비교해봤어요',
        content: '현재 시중은행과 저축은행, 캐피탈 금리를 비교분석해서 정리했습니다.',
        author: '금리전문가',
        category: 'loan-info',
        tags: ['금리비교', '1금융권', '2금융권'],
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        view_count: 434,
        like_count: 27,
        comment_count: 19,
        prefix: '금리비교'
      }
    ]

    // 로컬 스토리지에 샘플 데이터가 없으면 저장
    if (loanInfoPosts.length === 0) {
      console.log('📝 대출정보 샘플 데이터 저장 중...')
      const allPosts = [...savedPosts, ...samplePosts]
      localStorage.setItem('community-posts', JSON.stringify(allPosts))
      setPosts(samplePosts)
    } else {
      console.log(`✅ 저장된 대출정보 게시글 ${loanInfoPosts.length}개 로드 완료`)
      setPosts(loanInfoPosts)
    }

    // 광고 및 사이드바 설정
    const getRandomAd = () => {
      const randomIndex = Math.floor(Math.random() * nativeAds.length)
      return nativeAds[randomIndex]
    }

    setSelectedAd(getRandomAd())

    // 랜덤 사이드바 광고 선택 (2-3개)
    const getRandomSidebarAds = () => {
      const shuffled = [...sidebarRandomAds].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, Math.floor(Math.random() * 2) + 2) // 2-3개
    }

    setRandomSidebarAds(getRandomSidebarAds())
  }, [])

  // 광고 클릭 핸들러
  const handleAdClick = (ad: Ad) => {
    console.log('광고 클릭:', ad.title)
    // 실제로는 광고 클릭 추적 API 호출
    window.open(ad.url, '_blank')
  }

  // 게시글 필터링 및 정렬
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrefix = selectedPrefix === 'all' || post.prefix === selectedPrefix
    return matchesSearch && matchesPrefix
  })

  const sortedPosts = filteredPosts.sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'views':
        return b.view_count - a.view_count
      case 'likes':
        return b.like_count - a.like_count
      case 'comments':
        return b.comment_count - a.comment_count
      default:
        return 0
    }
  })

  // 페이지네이션
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = sortedPosts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <DollarSign className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">대출정보</h1>
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
              placeholder="대출정보 검색..."
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
                  <Link href={`/loan-info/${post.id}`}>
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
                <TrendingUp className="w-5 h-5 mr-2 text-teal-500" />
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {['면책후대출', '신용등급', '대출승인', '저신용대출', '급전', '대출후기', '승인팁', '대출비교'].map((tag) => (
                  <button
                    key={tag}
                    className="bg-gray-100 hover:bg-teal-100 text-gray-700 hover:text-teal-700 text-sm px-3 py-1 rounded-full transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 대출 성공 팁 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6 border border-teal-200">
              <h3 className="font-bold text-lg mb-3 flex items-center">
                <Star className="w-5 h-5 mr-2 text-teal-500" />
                대출 성공 팁
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 신용정보를 미리 확인하고 오류가 있다면 정정</li>
                <li>• 여러 금융기관에 동시 신청보다는 선별적으로 신청</li>
                <li>• 필요한 서류를 미리 준비해서 승인 확률을 높이기</li>
                <li>• 대출 조건을 꼼꼼히 비교하고 선택</li>
                <li>• 상환 계획을 세우고 연체되지 않도록 관리</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <PostWriteModal
          category="loan-info"
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