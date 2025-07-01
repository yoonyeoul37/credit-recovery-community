'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Users, LogIn, LogOut, AlertCircle, Loader2, Edit3, Check, X } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { ChatMessage } from '@/lib/supabase'

interface ChatRoomProps {
  roomId: number
  className?: string
}

const ChatRoom = ({ roomId, className = '' }: ChatRoomProps) => {
  const [inputMessage, setInputMessage] = useState('')
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [nicknameInput, setNicknameInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const nicknameInputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    participants,
    room,
    loading,
    error,
    isConnected,
    userNickname,
    sendMessage,
    joinRoom,
    leaveRoom,
    changeNickname,
    participantCount
  } = useChat(roomId)

  // 사용자가 맨 아래에 있는지 확인하는 함수
  const isAtBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true
    const container = messagesContainerRef.current
    const threshold = 100 // 100px 이내면 아래에 있다고 판단
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold
  }, [])

  // 스크롤을 맨 아래로 이동하는 함수
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [])

  // 메시지 변경 시 스크롤 관리
  useEffect(() => {
    if (!loading && messages.length > 0) {
      // 초기 로딩이거나 사용자가 맨 아래에 있을 때만 자동 스크롤
      const shouldAutoScroll = messages.length <= 3 || isAtBottom()
      
      if (shouldAutoScroll) {
        setTimeout(() => {
          scrollToBottom()
        }, 100)
      }
    }
  }, [messages.length, loading, scrollToBottom, isAtBottom])

  // 메시지 전송 핸들러
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const messageToSend = inputMessage.trim()
    
    try {
      await sendMessage(messageToSend)
      setInputMessage('') // 전송 성공 후 입력창 비우기
      
      // 메시지 전송 후 즉시 아래로 스크롤
      setTimeout(() => {
        scrollToBottom()
        inputRef.current?.focus()
      }, 50)
    } catch (error) {
      console.error('메시지 전송 실패:', error)
    }
  }

  // 키보드 이벤트 핸들러
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  // 입력창 포커스 핸들러 (단순화)
  const handleInputFocus = () => {
    // 입력창에 포커스할 때만 부드럽게 아래로 스크롤
    setTimeout(() => {
      scrollToBottom()
    }, 100)
  }

  // 닉네임 변경 핸들러들
  const handleEditNickname = () => {
    setNicknameInput(userNickname)
    setIsEditingNickname(true)
    setTimeout(() => {
      nicknameInputRef.current?.focus()
      nicknameInputRef.current?.select()
    }, 100)
  }

  const handleSaveNickname = () => {
    if (changeNickname(nicknameInput)) {
      setIsEditingNickname(false)
      setNicknameInput('')
    }
  }

  const handleCancelNickname = () => {
    setIsEditingNickname(false)
    setNicknameInput('')
  }

  const handleNicknameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveNickname()
    } else if (e.key === 'Escape') {
      handleCancelNickname()
    }
  }

  // 메시지 렌더링
  const renderMessage = (message: ChatMessage) => {
    const isSystem = message.message_type === 'system'
    const isMyMessage = message.user_ip_hash === userNickname // 임시로 닉네임으로 비교
    
    if (isSystem) {
      return (
        <div key={message.id} className="flex justify-center py-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {message.message}
          </span>
        </div>
      )
    }

    return (
      <div
        key={message.id}
        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md ${isMyMessage ? 'order-2' : ''}`}>
          {!isMyMessage && (
            <div className="text-xs text-gray-600 mb-1 px-2">
              💚 {message.user_nickname}
            </div>
          )}
          <div
            className={`rounded-2xl px-4 py-2 ${
              isMyMessage
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-200 text-gray-900'
            }`}
          >
            <p className="text-sm break-words">{message.message}</p>
            <div
              className={`text-xs mt-1 ${
                isMyMessage ? 'text-blue-100' : 'text-gray-500'
              }`}
            >
              {new Date(message.created_at).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">채팅방을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {/* 채팅방 헤더 */}
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{room?.title}</h3>
            <p className="text-sm text-gray-600">{room?.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* 닉네임 표시/변경 */}
            <div className="flex items-center space-x-2">
              {isEditingNickname ? (
                <div className="flex items-center space-x-1">
                  <input
                    ref={nicknameInputRef}
                    type="text"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    onKeyDown={handleNicknameKeyPress}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="닉네임 입력"
                    maxLength={20}
                  />
                  <button
                    onClick={handleSaveNickname}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                    title="저장"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelNickname}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="취소"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1 group">
                  <span className="text-sm text-gray-700 font-medium">💚 {userNickname}</span>
                  <button
                    onClick={handleEditNickname}
                    className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="닉네임 변경"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{participantCount}명 참여중</span>
            </div>
            {isConnected ? (
              <button
                onClick={leaveRoom}
                className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>퇴장</span>
              </button>
            ) : (
              <button
                onClick={joinRoom}
                className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>입장</span>
              </button>
            )}
          </div>
        </div>
        
        {/* 사용자 정보 */}
        {isConnected && (
          <div className="mt-2 text-sm text-gray-600">
            당신의 닉네임: <span className="font-medium text-green-700">💚 {userNickname}</span>
          </div>
        )}
      </div>

      {/* 메시지 영역 */}
      <div 
        ref={messagesContainerRef}
        className="h-96 overflow-y-auto p-4 bg-gray-50"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p>아직 메시지가 없습니다.</p>
              <p className="text-sm mt-1">첫 번째 메시지를 보내보세요! 👋</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {messages.map(renderMessage)}
          </div>
        )}
      </div>

      {/* 메시지 입력 영역 */}
      <div className="border-t border-gray-100 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={handleInputFocus}
            placeholder={isConnected ? "메시지를 입력하세요..." : "메시지를 입력하면 자동으로 채팅에 참여됩니다..."}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        
        {/* 연결 상태 표시 */}
        {!isConnected && (
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-500">
              💡 메시지를 보내면 자동으로 채팅방에 참여됩니다
            </p>
            <button
              onClick={joinRoom}
              className="mt-2 px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
            >
              또는 먼저 참여하기
            </button>
          </div>
        )}
      </div>

      {/* 참여자 목록 (간단히) */}
      {isConnected && participants.length > 0 && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="text-sm text-gray-600 mb-2">현재 참여자</div>
          <div className="flex flex-wrap gap-2">
            {participants.slice(0, 5).map((participant) => (
              <span
                key={participant.id}
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
              >
                💚 {participant.user_nickname}
              </span>
            ))}
            {participants.length > 5 && (
              <span className="text-xs text-gray-500">
                +{participants.length - 5}명 더
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatRoom 