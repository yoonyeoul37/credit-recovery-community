'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Headphones, Clock, Users, MessageCircle, Send, Heart, User, Eye } from 'lucide-react'
import Advertisement from '@/components/Advertisement'
import { categoryAds } from '@/lib/ads'
import ChatRoom from '@/components/ChatRoom'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'

// 단순한 상태 표시 컴포넌트
function EnvironmentStatus() {
  return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h4 className="font-semibold text-green-900">실시간 채팅 시스템</h4>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
            🚀 실제 Supabase 모드 (환경변수 업데이트됨)
          </span>
        </div>
        
        <p className="text-sm text-green-700 mt-3">
          Supabase Realtime을 통한 실시간 채팅이 활성화되었습니다. 
          모든 메시지가 실제 데이터베이스에 저장됩니다.
        </p>
      </div>
  )
}

const liveChats = [
  {
    id: 1,
    title: '💬 신용점수 관련 즉석 질문방',
    description: '신용점수, 신용카드 관련 궁금한 것들을 바로바로 물어보세요!',
    participants: 23,
    status: 'active',
    category: '신용관리',
    time: '지금 활성화'
  },
  {
    id: 2,
    title: '🔄 개인회생 진행 중인 분들 모임',
    description: '개인회생 진행 과정에서 생기는 궁금증들을 함께 해결해요',
    participants: 15,
    status: 'active',
    category: '개인회생',
    time: '지금 활성화'
  },
  {
    id: 3,
    title: '💰 대출 정보 공유방',
    description: '안전한 대출 정보와 주의사항을 실시간으로 나눠요',
    participants: 31,
    status: 'active',
    category: '대출정보',
    time: '지금 활성화'
  },
  {
    id: 4,
    title: '⭐ 성공사례 라이브 토크',
    description: '신용회복에 성공한 분들이 직접 경험담을 들려드려요',
    participants: 8,
    status: 'scheduled',
    category: '성공사례',
    time: '저녁 8시 예정'
  }
]

// 카테고리명 변환 함수 (PostList 참고)
const categoryNameMap: { [key: number]: string } = {
  1: '신용이야기',
  2: '개인회생',
  3: '법인회생',
  4: '대출정보',
  5: '성공사례',
}
function getCategoryName(catId: number) {
  return categoryNameMap[catId] || '기타'
}
function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)}초 전`
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`
  return date.toLocaleDateString()
}

export default function LiveChatPage() {
  // 실시간 현황 상태
  const [liveStats, setLiveStats] = useState({
    onlineUsers: null as number | null,
    activeRooms: null as number | null,
    todayQuestions: null as number | null,
    todayAnswers: null as number | null,
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [firstLoading, setFirstLoading] = useState(true)

  // 최근 작성글 상태
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [recentPostsLoading, setRecentPostsLoading] = useState(true)

  const searchParams = useSearchParams()

  async function fetchRecentPosts() {
    setRecentPostsLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, author_nickname, category_id, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    console.log('posts data:', data)
    console.log('posts error:', error)
    if (!error && data) {
      setRecentPosts(data)
    }
    setRecentPostsLoading(false)
  }

  useEffect(() => {
    fetchRecentPosts();
    if (searchParams.get('refresh') === '1') {
      fetchRecentPosts();
    }
    // Supabase Realtime 구독으로 즉시 반영
    const channel = supabase
      .channel('realtime:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        fetchRecentPosts();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const chatGuidelines = [
    '서로를 존중하고 따뜻하게 대해주세요',
    '개인정보는 절대 공유하지 마세요',
    '욕설이나 비방은 금지됩니다',
    '상업적 홍보는 제한됩니다',
    '전문적인 법률 상담은 전문가에게 문의하세요'
  ]

  // 실제 Supabase에서 집계값 불러오기
  async function fetchLiveStats() {
    // setStatsLoading(true) // 삭제
    // 1. 온라인 사용자 (최근 2분 이내)
    const { count: onlineUsers } = await supabase
      .from('chat_participants')
      .select('user_ip_hash', { count: 'exact', head: true })
      .gt('last_seen', new Date(Date.now() - 2 * 60 * 1000).toISOString())
    // 2. 활성 채팅방 (최근 2분 이내)
    const { data: activeRoomsData } = await supabase
      .from('chat_participants')
      .select('room_id')
      .gt('last_seen', new Date(Date.now() - 2 * 60 * 1000).toISOString())
    const activeRooms = activeRoomsData ? new Set(activeRoomsData.map(r => r.room_id)).size : 0
    // 3. 오늘 질문/답변 (chat_messages 테이블에서 집계, message_type: 'question'/'answer')
    const today = new Date().toISOString().slice(0, 10)
    const { count: todayQuestions } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact', head: true })
      .eq('message_type', 'question')
      .gte('created_at', today)
    const { count: todayAnswers } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact', head: true })
      .eq('message_type', 'answer')
      .gte('created_at', today)
    setLiveStats({
      onlineUsers: onlineUsers ?? 0,
      activeRooms,
      todayQuestions: todayQuestions ?? 0,
      todayAnswers: todayAnswers ?? 0,
    })
    if (firstLoading) setFirstLoading(false)
    setStatsLoading(false)
  }

  useEffect(() => {
    fetchLiveStats()
    const interval = setInterval(fetchLiveStats, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head>
        <title>실시간상담 - 신용회복 커뮤니티</title>
        <meta name="description" content="실시간으로 소통하며 함께 해결책을 찾아가는 따뜻한 공간입니다" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              홈으로
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Headphones className="w-8 h-8 mr-3 text-indigo-600" />
                실시간상담
              </h1>
              <p className="text-gray-600 mt-2">
                실시간으로 소통하며 함께 해결책을 찾아가는 따뜻한 공간입니다
              </p>
            </div>
            
            <Link
              href="/write?category=live-chat"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" />
              질문하기
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-2">
            {/* 메인 실시간 채팅방 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-green-500" />
                💬 신용회복 종합상담방
              </h2>
              
              {/* 채팅 환경 상태 */}
              <EnvironmentStatus />
              
              {/* 실시간 채팅 컴포넌트 */}
              <ChatRoom roomId={1} className="mb-6" />
            </section>

            {/* 다른 채팅방 목록 */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏠 다른 채팅방</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {liveChats.slice(1).map((chat) => {
                  const handleChatClick = () => {
                    if (chat.status === 'active') {
                      // 실제로는 다른 채팅방으로 이동하지만, 데모에서는 알림만 표시
                      alert(`${chat.title}로 이동합니다! (데모 모드에서는 같은 채팅방이 표시됩니다)`)
                    } else {
                      alert(`${chat.title}은(는) ${chat.time}에 예정되어 있습니다.`)
                    }
                  }

                  return (
                    <div
                      key={chat.id}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:border-indigo-200 group"
                      onClick={handleChatClick}
                    >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 text-sm transition-colors">
                        {chat.title}
                      </h4>
                      <div className="flex items-center space-x-1">
                        {chat.status === 'active' ? (
                          <>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600 font-medium">LIVE</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span className="text-xs text-yellow-600 font-medium">예정</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {chat.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                        {chat.category}
                      </span>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {chat.participants}명
                        </span>
                        <span className="text-xs">
                          {chat.status === 'active' ? '지금 참여' : chat.time}
                        </span>
                      </div>
                    </div>
                    
                    {chat.status === 'active' && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <button className="w-full bg-indigo-600 text-white text-xs py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                          채팅방 입장하기
                        </button>
                      </div>
                    )}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* 최근 작성글 */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Send className="w-5 h-5 mr-2 text-blue-500" />
                  📝 최근 작성글
                </h2>
                <Link
                  href="/questions"
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  더보기 →
                </Link>
              </div>
              
              {recentPostsLoading ? (
                <div className="text-center text-gray-400 py-8">불러오는 중...</div>
              ) : (
                <ul className="divide-y divide-gray-100 bg-white rounded-xl shadow-sm border">
                  {recentPosts.map((post) => (
                    <li
                      key={post.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => window.location.href = `/credit-story/${post.id}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {getCategoryName(post.category_id)}
                        </span>
                        <span className="text-xs text-gray-400">{formatTimeAgo(post.created_at)}</span>
                      </div>
                      <div className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">{post.title}</div>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span className="flex items-center"><User className="w-3 h-3 mr-1" />{post.author_nickname || '익명'}</span>
                        <span className="flex items-center"><MessageCircle className="w-3 h-3 mr-1" />{post.comment_count ?? 0}</span>
                        <span className="flex items-center"><Heart className="w-3 h-3 mr-1" />{post.like_count ?? 0}</span>
                        <span className="flex items-center"><Eye className="w-3 h-3 mr-1" />{post.view_count ?? 0}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 실시간상담 관련 광고 */}
            <div className="space-y-4">
              {categoryAds.liveChat.map((ad, index) => (
                <Advertisement
                  key={index}
                  position="sidebar"
                  title={ad.title}
                  description={ad.description}
                  link={ad.link}
                  size="medium"
                  closeable={true}
                />
              ))}
            </div>
            
            {/* 구글 애드센스 광고 자리 */}
            <Advertisement
              position="adsense"
              title="사이드바 중간 (300x250)"
              description=""
              link="#"
              size="medium"
              adType="adsense"
            />
            
            {/* 실시간 현황 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                실시간 현황
                <span className="ml-2 text-xs text-gray-500">(5초마다 업데이트)</span>
              </h3>
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow border divide-y sm:divide-y-0 sm:divide-x">
                  <div className="flex-1 py-4 px-6 text-center">
                    <div className="text-xs text-gray-500 mb-1">온라인 사용자</div>
                    <div className="text-2xl font-bold text-green-600">
                      {firstLoading ? '집계 중...' : liveStats.onlineUsers}
                    </div>
                  </div>
                  <div className="flex-1 py-4 px-6 text-center">
                    <div className="text-xs text-gray-500 mb-1">활성 채팅방</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {firstLoading ? '집계 중...' : liveStats.activeRooms}
                    </div>
                  </div>
                  <div className="flex-1 py-4 px-6 text-center">
                    <div className="text-xs text-gray-500 mb-1">오늘 질문</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {firstLoading ? '집계 중...' : liveStats.todayQuestions}
                    </div>
                  </div>
                  <div className="flex-1 py-4 px-6 text-center">
                    <div className="text-xs text-gray-500 mb-1">오늘 답변</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {firstLoading ? '집계 중...' : liveStats.todayAnswers}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 실시간 활동 표시 */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  <span>실시간 업데이트 중...</span>
                </div>
              </div>
            </div>

            {/* 채팅 가이드라인 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 채팅 가이드라인</h3>
              <ul className="space-y-2">
                {chatGuidelines.map((guideline, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 응원 메시지 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                함께해요!
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                혼자 고민하지 마세요. 여기 있는 모든 분들이 
                당신의 든든한 동반자가 되어드릴게요.
              </p>
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-indigo-700 font-medium text-sm">
                  💪 "함께하면 더 큰 힘이 됩니다!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
} 