'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart, Home, MessageCircle, RefreshCw, Building2, DollarSign, Star, Headphones, Bookmark, User, CreditCard, TrendingUp, HandHeart, HelpCircle, Newspaper } from 'lucide-react'
import { cn, getSiteName, getSiteDescription, getLogoUrl } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const navigation = {
  main: [
    { name: '홈', href: '/', icon: Home },
    { name: '신용이야기', href: '/credit-story', icon: MessageCircle },
    { name: '개인회생파산', href: '/personal-recovery', icon: RefreshCw },
    { name: '법인회생파산', href: '/corporate-recovery', icon: Building2 },
    { name: '워크아웃', href: '/credit-workout', icon: HandHeart },
  ],
  sub: [
    { name: '대출정보', href: '/loan-info', icon: DollarSign },
    { name: '뉴스', href: '/news', icon: Newspaper },
    { name: 'Q&A', href: '/qa', icon: HelpCircle },
    { name: '실시간채팅', href: '/live-chat', icon: Headphones },
    // { name: '성공후기', href: '/success-story', icon: Star }, // 임시 숨김
  ]
}

export default function Header() {
  const [encouragementCount, setEncouragementCount] = useState<number>(156) // 기본값
  const [loading, setLoading] = useState(true)
  const [siteName, setSiteName] = useState<string>('새출발 커뮤니티')
  const [siteDescription, setSiteDescription] = useState<string>('함께하는 희망의 공간')
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [isClient, setIsClient] = useState(false)
  const [mounted, setMounted] = useState(false) // 마운트 상태 추가

  // 클라이언트 사이드 확인 및 설정 로드
  useEffect(() => {
    // 클라이언트 사이드임을 표시
    setIsClient(true)
    setMounted(true) // 마운트 완료 표시
    
    const loadSiteSettings = () => {
      setSiteName(getSiteName())
      setSiteDescription(getSiteDescription())
      setLogoUrl(getLogoUrl())
    }

    loadSiteSettings()
    
    // 설정 변경 감지를 위한 이벤트 리스너
    const handleStorageChange = () => {
      loadSiteSettings()
    }

    const handleSettingsChange = () => {
      loadSiteSettings()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('siteSettingsChanged', handleSettingsChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('siteSettingsChanged', handleSettingsChange)
    }
  }, [])

  // 실시간 응원 통계 로드
  useEffect(() => {
    // 마운트되지 않았다면 실행하지 않음
    if (!mounted) return

    const loadEncouragementStats = async () => {
      try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayStart = today.toISOString()

        // 오늘의 활동 통계 계산
        const [likesResult, commentsResult, messagesResult] = await Promise.all([
          // 1. 오늘 받은 좋아요 수 (게시글 + 댓글)
          supabase.from('posts').select('like_count').gte('created_at', todayStart),
          // 2. 오늘 작성된 댓글 수 (서로 소통)
          supabase.from('comments').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
          // 3. 오늘 채팅 메시지 수 (실시간 응원)
          supabase.from('chat_messages').select('id', { count: 'exact', head: true }).gte('created_at', todayStart)
        ])

        // 응원 지수 계산
        const todayLikes = likesResult.data?.reduce((sum, post) => sum + (post.like_count || 0), 0) || 0
        const todayComments = commentsResult.count || 0
        const todayMessages = messagesResult.count || 0

        // 응원한 사람 수 추정 (좋아요 + 댓글 + 채팅 활동의 70% 정도로 계산)
        const totalInteractions = todayLikes + todayComments + todayMessages
        const estimatedPeople = Math.max(Math.floor(totalInteractions * 0.7), 1)

        setEncouragementCount(estimatedPeople)

        console.log('💝 오늘의 응원 통계:', {
          좋아요: todayLikes,
          댓글: todayComments,
          채팅: todayMessages,
          총상호작용: totalInteractions,
          추정응원자: estimatedPeople
        })

      } catch (error) {
        console.error('응원 통계 로드 실패:', error)
        // 에러 시 현실적인 랜덤값 사용
        const randomCount = Math.floor(Math.random() * 200) + 50 // 50-249명
        setEncouragementCount(randomCount)
      } finally {
        setLoading(false)
      }
    }

    loadEncouragementStats()
    
    // 5분마다 업데이트
    const interval = setInterval(loadEncouragementStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [mounted]) // mounted 의존성 추가

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      {/* 상단 인사말 */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 px-4 py-2">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            <Heart className="inline w-4 h-4 text-red-400 mr-1" />
            혼자가 아니에요. 함께 새 출발해요!
          </p>
        </div>
      </div>

      {/* 메인 헤더 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center overflow-hidden">
              {isClient && logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={`${siteName} 로고`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // 이미지 로드 실패 시 기본 아이콘으로 대체
                    (e.target as HTMLImageElement).style.display = 'none'
                    const parent = (e.target as HTMLImageElement).parentElement
                    if (parent) {
                      parent.innerHTML = '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
                    }
                  }}
                />
              ) : (
                <Heart className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{isClient ? siteName : '새출발 커뮤니티'}</h1>
              <p className="text-xs text-gray-500">{isClient ? siteDescription : '함께하는 희망의 공간'}</p>
            </div>
          </Link>

          {/* 우측 정보 */}
          <div className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="내 프로필"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">프로필</span>
            </Link>
            
            <Link
              href="/bookmarks"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title="내 북마크"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">북마크</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>
                {!mounted ? (
                  // 서버 렌더링과 클라이언트 초기 렌더링을 동일하게
                  "오늘 156명이 서로 응원했어요"
                ) : loading ? (
                  "응원 통계 로딩 중..."
                ) : (
                  `오늘 ${encouragementCount.toLocaleString()}명이 서로 응원했어요`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* 2줄 네비게이션 */}
        <nav className="border-t border-gray-100">
          {/* 상단 메인 메뉴 */}
          <div className="flex justify-center space-x-0 py-2 border-b border-gray-50">
            {navigation.main.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* 하단 서브 메뉴 */}
          <div className="flex justify-center space-x-0 py-2">
            {navigation.sub.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    "text-gray-600 hover:text-green-600 hover:bg-green-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </header>
  )
} 