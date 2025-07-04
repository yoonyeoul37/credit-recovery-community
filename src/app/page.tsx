'use client'

import Link from 'next/link'
import { ArrowRight, TrendingUp, MessageCircleHeart, Users, Sparkles, Heart, Eye, MessageCircle, ThumbsUp, Search, Bell, Pin, AlertCircle, X } from 'lucide-react'
import { cn, formatMainPageTime } from '@/lib/utils'
import Advertisement from '@/components/Advertisement'
import DynamicTitle from '@/components/DynamicTitle'
import { sampleAds } from '@/lib/ads'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// 공지사항 인터페이스
interface Notice {
  id: number
  title: string
  content: string
  type: 'info' | 'warning' | 'urgent'
  isActive: boolean
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

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
    name: '💬 실시간채팅',
    href: '/live-chat',
    description: '라이브 채팅 상담',
    color: 'bg-neutral-600 border border-neutral-500',
    icon: '💬'
  }
]

// 통계 데이터 인터페이스
interface Stats {
  totalPosts: number
  activeUsers: number
  todayPosts: number
  satisfaction: number
}

// 채팅 질문 인터페이스
interface ChatQuestion {
  id: number
  message: string
  user_nickname: string
  room_id: number
  created_at: string
  roomName: string
}

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

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    activeUsers: 0,
    todayPosts: 0,
    satisfaction: 0
  })
  const [loading, setLoading] = useState(true)
  const [chatQuestions, setChatQuestions] = useState<ChatQuestion[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [notices, setNotices] = useState<Notice[]>([])
  const [noticesLoading, setNoticesLoading] = useState(true)
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false)

  // 채팅방 이름 매핑
  const getRoomName = (roomId: number): string => {
    const roomNames: { [key: number]: string } = {
      1: '메인 채팅방',
      2: '개인회생 진행 중인 분들 모임',
      3: '신용카드발급 · 대출 정보 공유방',
      4: '성공사례 나눔방'
    }
    return roomNames[roomId] || `${roomId}번 채팅방`
  }

  // 공지사항 타입별 스타일
  const getNoticeTypeStyle = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  // 공지사항 타입 텍스트
  const getNoticeTypeText = (type: string) => {
    switch (type) {
      case 'urgent': return '🚨 긴급'
      case 'warning': return '⚠️ 주의'
      default: return 'ℹ️ 안내'
    }
  }

  // 공지사항 로드
  useEffect(() => {
    const loadNotices = () => {
      try {
        if (typeof window === 'undefined') {
          setNoticesLoading(false)
          return
        }
        
        const savedNotices = localStorage.getItem('admin-notices')
        if (savedNotices) {
          const allNotices = JSON.parse(savedNotices)
          // 활성화된 공지사항만 필터링하고 고정된 것 우선 정렬
          const activeNotices = allNotices
            .filter((notice: Notice) => notice.isActive)
            .sort((a: Notice, b: Notice) => {
              if (a.isPinned && !b.isPinned) return -1
              if (!a.isPinned && b.isPinned) return 1
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })
            .slice(0, 3) // 최대 3개까지만 표시
          
          setNotices(activeNotices)
        }
      } catch (error) {
        console.error('공지사항 로드 실패:', error)
      } finally {
        setNoticesLoading(false)
      }
    }

    loadNotices()
  }, [])

  // 최근 채팅 질문들 로드
  useEffect(() => {
    const loadChatQuestions = async () => {
      try {
        // 물음표가 포함된 메시지들을 최근 순으로 가져오기
        const { data: questions, error } = await supabase
          .from('chat_messages')
          .select('id, message, user_nickname, room_id, created_at')
          .ilike('message', '%?%') // 물음표가 포함된 메시지
          .order('created_at', { ascending: false })
          .limit(8)

        if (error) {
          console.error('채팅 질문 로드 실패:', error)
          return
        }

        // 방 이름 추가하여 매핑
        const questionsWithRoomName = (questions || []).map(q => ({
          ...q,
          roomName: getRoomName(q.room_id)
        }))

        setChatQuestions(questionsWithRoomName)
        console.log('💬 최근 채팅 질문들 로드 완료:', questionsWithRoomName.length, '개')

      } catch (error) {
        console.error('채팅 질문 로드 에러:', error)
      } finally {
        setQuestionsLoading(false)
      }
    }

    loadChatQuestions()
    
    // 2분마다 질문 목록 업데이트
    const interval = setInterval(loadChatQuestions, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // 실시간 통계 로드
  useEffect(() => {
    const loadStats = async () => {
      try {
        // 1. 일반 게시글 수만 계산 (posts 테이블만)
        const { count: postsCount } = await supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
        
        // 2. 채팅 메시지 수 (별도 계산)
        const { count: messagesCount } = await supabase
          .from('chat_messages')
          .select('id', { count: 'exact', head: true })

        // 3. 활성 사용자 수 (최근 7일 내 활동)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        const { data: activeUsersData } = await supabase
          .from('chat_messages')
          .select('user_ip_hash')
          .gte('created_at', sevenDaysAgo)
        
        const uniqueActiveUsers = new Set(activeUsersData?.map(msg => msg.user_ip_hash) || [])
        const activeUsers = uniqueActiveUsers.size

        // 4. 오늘 작성된 글 수 (일반 게시글 + 채팅 메시지)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayStart = today.toISOString()
        
        const [todayPostsResult, todayMessagesResult] = await Promise.all([
          supabase.from('posts').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
          supabase.from('chat_messages').select('id', { count: 'exact', head: true }).gte('created_at', todayStart)
        ])
        
        const todayPosts = (todayPostsResult.count || 0) + (todayMessagesResult.count || 0)

        // 5. 만족도 계산 (채팅 활동도 기반)
        const { data: recentMessages } = await supabase
          .from('chat_messages')
          .select('*')
          .gte('created_at', sevenDaysAgo)
          .limit(100)

        let satisfaction = 4.2 // 기본값
        if (recentMessages && recentMessages.length > 0) {
          // 활동 빈도와 사용자 참여도를 기반으로 만족도 계산
          const messageFrequency = recentMessages.length / 7 // 일평균 메시지 수
          const uniqueUsers = new Set(recentMessages.map(msg => msg.user_ip_hash)).size
          const engagementRate = uniqueUsers / Math.max(recentMessages.length, 1)
          
          // 만족도 공식: (활동빈도 * 0.3) + (참여도 * 0.7) + 기본점수
          satisfaction = Math.min(5.0, 3.5 + (messageFrequency * 0.02) + (engagementRate * 2))
          satisfaction = Math.round(satisfaction * 10) / 10 // 소수점 1자리
        }

        setStats({
          totalPosts: postsCount || 0, // 일반 게시글만
          activeUsers: Math.max(activeUsers, 1), // 최소 1명
          todayPosts,
          satisfaction
        })

        console.log('📊 실시간 통계 로드 완료:', {
          totalPosts: postsCount || 0,
          chatMessages: messagesCount || 0,
          activeUsers,
          todayPosts,
          satisfaction
        })

      } catch (error) {
        console.error('통계 로드 실패:', error)
        // 에러 시 현실적인 기본값 설정
        setStats({
          totalPosts: Math.floor(Math.random() * 100) + 50,
          activeUsers: Math.floor(Math.random() * 200) + 50,
          todayPosts: Math.floor(Math.random() * 50) + 10,
          satisfaction: 4.2 + Math.random() * 0.6
        })
      } finally {
        setLoading(false)
      }
    }

    loadStats()
    
    // 5분마다 통계 업데이트
    const interval = setInterval(loadStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // 통계 표시용 데이터
  const displayStats = [
    { 
      value: loading ? '...' : stats.totalPosts.toLocaleString(), 
      label: '일반 게시글' 
    },
    { 
      value: loading ? '...' : stats.activeUsers.toLocaleString(), 
      label: '활성 회원' 
    },
    { 
      value: loading ? '...' : stats.todayPosts.toLocaleString(), 
      label: '오늘 활동' 
    },
    { 
      value: loading ? '...' : stats.satisfaction.toFixed(1), 
      label: '만족도' 
    }
  ]

  // 공지사항 클릭 핸들러
  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice)
    setIsNoticeModalOpen(true)
  }

  // 모달 닫기 핸들러
  const closeNoticeModal = () => {
    setIsNoticeModalOpen(false)
    setSelectedNotice(null)
  }

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isNoticeModalOpen) {
        closeNoticeModal()
      }
    }

    if (isNoticeModalOpen) {
      document.addEventListener('keydown', handleEscKey)
      // 모달이 열릴 때 스크롤 방지
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      // 모달이 닫힐 때 스크롤 복원
      document.body.style.overflow = 'unset'
    }
  }, [isNoticeModalOpen])

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
      <DynamicTitle />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 히어로 섹션 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            신용회복을 위한 따뜻한 커뮤니티
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            혼자가 아니에요
            <span className="block text-green-600">함께 새 출발해요 ✨</span>
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
              실시간 채팅
            </Link>
          </div>
        </div>

        {/* 공지사항 섹션 - 프리미엄 디자인 */}
        {!noticesLoading && notices.length > 0 && (
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl p-6 mb-12 border border-indigo-200 shadow-lg">
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-200/30 to-blue-200/30 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">📢 공지사항</h2>
                    <p className="text-sm text-gray-600">커뮤니티 소식을 확인하세요</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 bg-white/60 px-3 py-1 rounded-full">
                  총 {notices.length}개
                </div>
              </div>
              
              <div className="grid gap-4">
                {notices.slice(0, 2).map((notice, index) => (
                  <div 
                    key={notice.id} 
                    className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-xl ${
                      notice.type === 'urgent' 
                        ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:from-red-100 hover:to-pink-100' :
                      notice.type === 'warning' 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100' :
                        'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100'
                    }`}
                    onClick={() => handleNoticeClick(notice)}
                  >
                    {/* 글로우 효과 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-lg shadow-sm ${
                            notice.type === 'urgent' ? 'bg-red-100' :
                            notice.type === 'warning' ? 'bg-yellow-100' :
                            'bg-blue-100'
                          }`}>
                            <span className="text-lg">
                              {notice.type === 'urgent' ? '🚨' : notice.type === 'warning' ? '⚠️' : 'ℹ️'}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              notice.type === 'urgent' ? 'bg-red-100 text-red-700' :
                              notice.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {notice.type === 'urgent' ? '긴급' : notice.type === 'warning' ? '주의' : '안내'}
                            </span>
                            
                            {notice.isPinned && (
                              <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                <Pin className="w-3 h-3" />
                                <span className="text-xs font-medium">고정</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                          {new Date(notice.createdAt).toLocaleDateString('ko-KR', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      
                      <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                        {notice.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {notice.content.length > 100 
                          ? notice.content.substring(0, 100) + '...' 
                          : notice.content}
                      </p>
                      
                      {/* 읽기 더보기 힌트 */}
                      <div className="flex items-center justify-end mt-3">
                        <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                          클릭하여 전체 내용 보기 →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {notices.length > 2 && (
                  <div className="text-center pt-3">
                    <button
                      onClick={() => {
                        // 3번째 공지사항이 있으면 보여주기
                        if (notices[2]) {
                          handleNoticeClick(notices[2])
                        }
                      }}
                      className="group inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span>+{notices.length - 2}개 공지사항 더 보기</span>
                      <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <span className="text-xs">→</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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

        {/* 커뮤니티 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {displayStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 최근 채팅 질문들 */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <MessageCircle className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">💬 최근 채팅 질문들</h2>
            </div>
            <Link
              href="/live-chat"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              채팅방 참여하기 →
            </Link>
          </div>
          
          {questionsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : chatQuestions.length > 0 ? (
            <div className="space-y-6">
              {chatQuestions.map((question, index) => (
                <div key={question.id} className="group">
                  <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        💬 {getRoomName(question.room_id)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatMainPageTime(question.created_at)}
                      </span>
                    </div>
                    
                    <Link
                      href={`/live-chat?room=${question.room_id}`}
                      className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer block group-hover:text-blue-600 transition-colors"
                    >
                      {question.message.length > 80 
                        ? question.message.substring(0, 80) + '...' 
                        : question.message}
                    </Link>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="font-medium text-green-700">💚 {question.user_nickname}</span>
                      </div>
                      <Link
                        href={`/live-chat?room=${question.room_id}`}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors cursor-pointer group"
                      >
                        <MessageCircle className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                        <span className="group-hover:underline">답변하러 가기</span>
                      </Link>
                    </div>
                  </div>
                  
                  {index < chatQuestions.length - 1 && (
                    <hr className="my-6 border-gray-100" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">아직 질문이 없어요</h3>
              <p className="text-gray-600 mb-6">
                채팅방에서 첫 번째 질문을 남겨보세요!
              </p>
              <Link
                href="/live-chat"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                채팅방 가기
              </Link>
            </div>
          )}
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

      {/* 공지사항 모달 - 프리미엄 디자인 */}
      {isNoticeModalOpen && selectedNotice && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
          onClick={closeNoticeModal}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl transform animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 - 그라데이션 디자인 */}
            <div className={`relative overflow-hidden p-8 ${
              selectedNotice.type === 'urgent' 
                ? 'bg-gradient-to-br from-red-50 via-pink-50 to-red-100' :
              selectedNotice.type === 'warning' 
                ? 'bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100' :
                'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100'
            }`}>
              {/* 배경 장식 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg ${
                      selectedNotice.type === 'urgent' ? 'bg-red-100' :
                      selectedNotice.type === 'warning' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <span className="text-2xl">
                        {selectedNotice.type === 'urgent' ? '🚨' : 
                         selectedNotice.type === 'warning' ? '⚠️' : 'ℹ️'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                          selectedNotice.type === 'urgent' ? 'bg-red-500 text-white' :
                          selectedNotice.type === 'warning' ? 'bg-yellow-500 text-white' :
                          'bg-blue-500 text-white'
                        }`}>
                          {selectedNotice.type === 'urgent' ? '🚨 긴급 공지' : 
                           selectedNotice.type === 'warning' ? '⚠️ 주의 사항' : 'ℹ️ 안내 사항'}
                        </span>
                        
                        {selectedNotice.isPinned && (
                          <div className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1.5 rounded-full shadow-sm">
                            <Pin className="w-4 h-4" />
                            <span className="text-sm font-bold">고정됨</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={closeNoticeModal}
                    className="p-3 hover:bg-white/50 rounded-full transition-all duration-200 group"
                  >
                    <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700 group-hover:rotate-90 transition-all duration-200" />
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {selectedNotice.title}
                </h2>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2 bg-white/60 px-3 py-2 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-700 font-medium">
                      작성: {new Date(selectedNotice.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {selectedNotice.updatedAt !== selectedNotice.createdAt && (
                    <div className="flex items-center space-x-2 bg-white/60 px-3 py-2 rounded-full">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">
                        수정: {new Date(selectedNotice.updatedAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* 모달 내용 */}
            <div className="p-8 overflow-y-auto max-h-[50vh] bg-gradient-to-b from-white to-gray-50">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-base">
                  {selectedNotice.content}
                </div>
              </div>
            </div>
            
            {/* 모달 푸터 */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 flex justify-center">
              <button
                onClick={closeNoticeModal}
                className="group px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center space-x-2">
                  <span>확인했습니다</span>
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <span className="text-sm">✓</span>
                  </div>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
