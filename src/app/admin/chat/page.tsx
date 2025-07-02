'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminAuth from '@/components/AdminAuth'
import { supabase } from '@/lib/supabase'
import { 
  MessageCircle, 
  Trash2, 
  AlertTriangle, 
  ArrowLeft,
  RefreshCw,
  Eye,
  Clock,
  User,
  Filter,
  Search
} from 'lucide-react'
import { formatAdminTime } from '@/lib/utils'

interface ChatMessage {
  id: number
  message: string
  user_nickname: string
  user_ip_hash: string
  room_id: number
  message_type: string
  is_deleted: boolean
  created_at: string
  room_title?: string
  reported_count?: number
}

interface ChatRoom {
  id: number
  title: string
  category: string
  is_active: boolean
}

export default function AdminChatManagement() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState<number | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingMessage, setDeletingMessage] = useState<ChatMessage | null>(null)
  const [deleteReason, setDeleteReason] = useState('')
  const [lastUpdated, setLastUpdated] = useState<string>('')

  // 채팅 메시지 로드
  const loadChatMessages = async () => {
    try {
      console.log('📋 채팅 메시지 로딩 시작...')
      
      let query = supabase
        .from('chat_messages')
        .select(`
          *,
          chat_rooms(title)
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      if (selectedRoom !== 'all') {
        query = query.eq('room_id', selectedRoom)
      }

      const { data, error } = await query

      if (error) {
        console.error('❌ 채팅 메시지 로딩 실패:', error)
        // 데모 데이터로 fallback
        setMessages(getDemoMessages())
        return
      }

      // 데이터 변환
      const transformedMessages: ChatMessage[] = (data || []).map(msg => ({
        id: msg.id,
        message: msg.message,
        user_nickname: msg.user_nickname,
        user_ip_hash: msg.user_ip_hash,
        room_id: msg.room_id,
        message_type: msg.message_type || 'user',
        is_deleted: msg.is_deleted || false,
        created_at: msg.created_at,
        room_title: msg.chat_rooms?.title || `채팅방 ${msg.room_id}`,
        reported_count: 0 // 추후 신고 기능 구현 시 사용
      }))

      setMessages(transformedMessages)
      console.log('✅ 채팅 메시지 로딩 완료:', transformedMessages.length)
      
    } catch (error) {
      console.error('❌ 채팅 메시지 로딩 에러:', error)
      setMessages(getDemoMessages())
    }
  }

  // 채팅방 목록 로드
  const loadChatRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('is_active', true)
        .order('id')

      if (error) {
        console.error('❌ 채팅방 로딩 실패:', error)
        setRooms(getDefaultRooms())
        return
      }

      setRooms(data || getDefaultRooms())
      
    } catch (error) {
      console.error('❌ 채팅방 로딩 에러:', error)
      setRooms(getDefaultRooms())
    }
  }

  // 데모 메시지 데이터
  const getDemoMessages = (): ChatMessage[] => [
    {
      id: 1,
      message: "신용점수 올리는 방법 좀 알려주세요",
      user_nickname: "희망찬시작123",
      user_ip_hash: "hash_1",
      room_id: 1,
      message_type: "user",
      is_deleted: false,
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      room_title: "💬 신용점수 관련 즉석 질문방",
      reported_count: 0
    },
    {
      id: 2,
      message: "개인회생 신청하면 얼마나 걸리나요?",
      user_nickname: "새로운출발456",
      user_ip_hash: "hash_2",
      room_id: 2,
      message_type: "user",
      is_deleted: false,
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      room_title: "🔄 개인회생 진행 중인 분들 모임",
      reported_count: 1
    },
    {
      id: 3,
      message: "저도 궁금해요! 같이 알아봐요",
      user_nickname: "따뜻한내일789",
      user_ip_hash: "hash_3",
      room_id: 1,
      message_type: "user",
      is_deleted: false,
      created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      room_title: "💬 신용점수 관련 즉석 질문방",
      reported_count: 0
    }
  ]

  // 기본 채팅방 데이터
  const getDefaultRooms = (): ChatRoom[] => [
    { id: 1, title: "💬 신용점수 관련 즉석 질문방", category: "신용관리", is_active: true },
    { id: 2, title: "🔄 개인회생 진행 중인 분들 모임", category: "개인회생", is_active: true },
    { id: 3, title: "💰 신용카드발급 · 대출 정보 공유방", category: "대출정보", is_active: true },
    { id: 4, title: "⭐ 성공사례 라이브 토크", category: "성공사례", is_active: true }
  ]

  // 메시지 삭제
  const handleDeleteMessage = async () => {
    if (!deletingMessage) return

    try {
      console.log('🗑️ 메시지 삭제 시작:', deletingMessage.id)

      // Supabase에서 soft delete
      const { error } = await supabase
        .from('chat_messages')
        .update({ 
          is_deleted: true,
          deleted_reason: deleteReason || '관리자에 의해 삭제됨',
          deleted_at: new Date().toISOString()
        })
        .eq('id', deletingMessage.id)

      if (error) {
        console.error('❌ Supabase 삭제 실패:', error)
        // 로컬에서 삭제 처리
        setMessages(prev => prev.map(msg => 
          msg.id === deletingMessage.id 
            ? { ...msg, is_deleted: true }
            : msg
        ))
      } else {
        console.log('✅ Supabase 삭제 성공')
        // 메시지 목록 새로고침
        await loadChatMessages()
      }

      // 모달 닫기
      setShowDeleteModal(false)
      setDeletingMessage(null)
      setDeleteReason('')
      
    } catch (error) {
      console.error('❌ 메시지 삭제 에러:', error)
      alert('메시지 삭제 중 오류가 발생했습니다.')
    }
  }

  // 삭제 모달 열기
  const openDeleteModal = (message: ChatMessage) => {
    setDeletingMessage(message)
    setShowDeleteModal(true)
  }

  // 삭제 모달 닫기
  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setDeletingMessage(null)
    setDeleteReason('')
  }

  // 새로고침
  const handleRefresh = async () => {
    setLoading(true)
    await Promise.all([loadChatMessages(), loadChatRooms()])
    setLastUpdated(new Date().toLocaleTimeString('ko-KR'))
    setLoading(false)
  }

  // 필터링된 메시지
  const filteredMessages = messages.filter(msg => {
    const matchesSearch = searchTerm === '' || 
      msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.user_nickname.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  // 초기 로딩
  useEffect(() => {
    const init = async () => {
      await Promise.all([loadChatMessages(), loadChatRooms()])
      setLastUpdated(new Date().toLocaleTimeString('ko-KR'))
      setLoading(false)
    }
    init()
  }, [selectedRoom])

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link 
                  href="/admin"
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <MessageCircle className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">채팅 관리</h1>
                {lastUpdated && (
                  <span className="ml-4 text-sm text-gray-500">
                    마지막 업데이트: {lastUpdated}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  새로고침
                </button>
                <Link 
                  href="/live-chat"
                  className="text-gray-600 hover:text-blue-600 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  채팅방 보기
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 필터 및 검색 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Filter className="w-5 h-5 text-gray-400 mr-2" />
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">전체 채팅방</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>
                        {room.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="메시지 또는 닉네임 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 메시지 목록 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                채팅 메시지 목록 ({filteredMessages.length}개)
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-8 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">메시지를 불러오는 중...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">메시지가 없습니다</h3>
                  <p className="text-gray-600">
                    {searchTerm ? '검색 조건에 맞는 메시지가 없습니다.' : '아직 채팅 메시지가 없습니다.'}
                  </p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            {message.room_title}
                          </span>
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="w-4 h-4 mr-1" />
                            {message.user_nickname}
                          </div>
                                                     <div className="flex items-center text-sm text-gray-500">
                             <Clock className="w-4 h-4 mr-1" />
                             {formatAdminTime(message.created_at)}
                           </div>
                          {message.reported_count && message.reported_count > 0 && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              신고 {message.reported_count}회
                            </span>
                          )}
                          {message.is_deleted && (
                            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                              삭제됨
                            </span>
                          )}
                        </div>
                        
                        <div className="mb-3">
                          {message.is_deleted ? (
                            <p className="text-gray-400 italic">🚫 삭제된 메시지입니다</p>
                          ) : (
                            <p className="text-gray-900 break-words">{message.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!message.is_deleted && (
                          <button
                            onClick={() => openDeleteModal(message)}
                            className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 삭제 확인 모달 */}
        {showDeleteModal && deletingMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">메시지 삭제</h3>
              </div>
              
              <div className="px-6 py-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">삭제할 메시지:</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-900 break-words">
                      {deletingMessage.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      작성자: {deletingMessage.user_nickname}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    삭제 사유 (선택사항)
                  </label>
                  <textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    placeholder="삭제 사유를 입력하세요..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                
                <p className="text-sm text-red-600">
                  ⚠️ 삭제된 메시지는 "삭제된 메시지입니다"로 표시되며, 복구할 수 없습니다.
                </p>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteMessage}
                  className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  삭제하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminAuth>
  )
} 