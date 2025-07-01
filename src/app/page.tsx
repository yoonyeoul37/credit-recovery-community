'use client'

import Link from 'next/link'
import { ArrowRight, TrendingUp, MessageCircleHeart, Users, Sparkles, Heart, Eye, MessageCircle, ThumbsUp, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import Advertisement from '@/components/Advertisement'
import { sampleAds } from '@/lib/ads'

// 카테고리 데이터
const categories = [
  {
    name: '💳 신용이야기',
    href: '/credit-story',
    description: '신용점수 관리와 신용카드 관련 정보',
    color: 'bg-neutral-500 border border-neutral-400',
    icon: '💳'
  },
  {
    name: '🔄 개인회생',
    href: '/personal-recovery',
    description: '개인회생 절차와 경험 공유',
    color: 'bg-stone-500 border border-stone-400',
    icon: '🔄'
  },
  {
    name: '🏢 법인회생',
    href: '/corporate-recovery',
    description: '사업자를 위한 법인회생 정보',
    color: 'bg-zinc-500 border border-zinc-400',
    icon: '🏢'
  },
  {
    name: '💰 대출이야기',
    href: '/loan-story',
    description: '대출 경험과 정보 교환',
    color: 'bg-slate-500 border border-slate-400',
    icon: '💰'
  },
  {
    name: '⭐ 성공사례',
    href: '/success-story',
    description: '신용회복 성공 스토리',
    color: 'bg-gray-500 border border-gray-400',
    icon: '⭐'
  },
  {
    name: '💬 실시간상담',
    href: '/live-chat',
    description: '라이브 채팅 상담',
    color: 'bg-neutral-600 border border-neutral-500',
    icon: '💬'
  }
]

// 통계 데이터
const stats = [
  { value: '2,847', label: '전체 게시글' },
  { value: '1,234', label: '활성 회원' },
  { value: '156', label: '오늘 작성' },
  { value: '4.8', label: '만족도' }
]

// 카테고리별 링크 생성 함수
const getCategoryLink = (category: string, id: number) => {
  const categoryMap: { [key: string]: string } = {
    '신용이야기': '/credit-story',
    '개인회생': '/personal-recovery',
    '법인회생': '/corporate-recovery',
    '대출이야기': '/loan-story',
    '성공사례': '/success-story'
  }
  
  const basePath = categoryMap[category] || '/credit-story'
  return `${basePath}/${id}`
}

// 임시 데이터 (나중에 Supabase에서 가져올 데이터)
const hotPosts = [
  {
    id: 1,
    title: '신용점수 300점에서 700점까지 회복 후기',
    content: '3년 전 신용점수가 300점대였던 절망적인 상황에서, 지금은 700점까지 회복했습니다...',
    author: '희망나무',
    category: '신용이야기',
    tags: ['신용점수', '신용회복', '성공사례'],
    likes: 45,
    comments: 23,
    views: 312,
    time: '3시간 전',
    isHot: true
  },
  {
    id: 2,
    title: '개인회생 신청 과정 상세 후기',
    content: '개인회생을 신청하면서 겪었던 과정들을 상세히 공유드립니다...',
    author: '새시작',
    category: '개인회생',
    tags: ['개인회생', '법적절차', '후기'],
    likes: 34,
    comments: 18,
    views: 256,
    time: '4시간 전',
    isHot: true
  },
  {
    id: 3,
    title: '2금융권 대출 후기 - 솔직한 경험담',
    content: '은행 대출이 안 되어서 2금융권을 알아보며 겪은 경험들을 나누고 싶어요...',
    author: '다시일어서기',
    category: '대출이야기',
    tags: ['2금융권', '대출후기', '경험담'],
    likes: 18,
    comments: 12,
    views: 189,
    time: '1일 전',
    isHot: false
  }
]



export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 히어로 섹션 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            신용회복을 위한 따뜻한 커뮤니티
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            혼자가 아니에요
            <span className="block text-green-600">함께 새 출발해요</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            신용점수 관리부터 개인회생까지,<br />
            경험과 정보를 나누며 더 나은 내일을 만들어가는 공간입니다
          </p>

          {/* 전체 검색바 */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="전체 게시글에서 검색해보세요..."
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value
                    if (query.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(query)}`
                    }
                  }
                }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              💡 팁: 태그나 닉네임으로도 검색할 수 있어요
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/write"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <MessageCircleHeart className="w-5 h-5 mr-2" />
              이야기 나누기
            </Link>
            <Link
              href="/live-chat"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Users className="w-5 h-5 mr-2" />
              실시간 상담
            </Link>
          </div>
        </div>

        {/* 카테고리 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-8 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl",
                category.color
              )}
            >
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{category.icon}</span>
                  <h3 className="text-xl font-bold">{category.name}</h3>
                </div>
                <p className="text-white/90 mb-6 leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center text-white/80">
                  <span className="text-sm">자세히 보기</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              
              {/* 배경 패턴 */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-full"></div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/50 rounded-full"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* 인기 게시글 */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 text-red-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">🔥 인기 게시글</h2>
            </div>
            <Link
              href="/search?sort=popular"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              전체 보기 →
            </Link>
          </div>
          
          <div className="grid gap-6">
            {hotPosts.map((post, index) => (
              <div key={index} className="group">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      {post.isHot && (
                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                          🔥 HOT
                        </span>
                      )}
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    
                    <Link
                      href={getCategoryLink(post.category, post.id)}
                      className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer block"
                    >
                      {post.title}
                    </Link>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/search?tag=${encodeURIComponent(tag)}`}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="font-medium text-green-700">💚 {post.author}</span>
                        <span>{post.time}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {post.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.comments}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {post.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {index < hotPosts.length - 1 && (
                  <hr className="my-6 border-gray-100" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 커뮤니티 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 마지막 격려 메시지 */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">함께하면 더 나은 내일이 있어요! 💪</h2>
          <p className="text-xl mb-8 opacity-90">
            혼자 고민하지 마세요. 따뜻한 마음으로 응원하는 사람들이 여기 있어요.
          </p>
          <Link
            href="/write"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg"
          >
            지금 시작하기 <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}
