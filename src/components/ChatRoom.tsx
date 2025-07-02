'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Users, LogIn, LogOut, AlertCircle, Loader2, Edit3, Check, X, Flag } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { ChatMessage } from '@/lib/supabase'
import { formatChatTime } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface ChatRoomProps {
  roomId: number
  className?: string
}

const ChatRoom = ({ roomId, className = '' }: ChatRoomProps) => {
  const [inputMessage, setInputMessage] = useState('')
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [nicknameInput, setNicknameInput] = useState('')
  const [reportingMessageId, setReportingMessageId] = useState<number | null>(null)
  const [reportReason, setReportReason] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
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
    userHash,
    sendMessage,
    joinRoom,
    leaveRoom,
    changeNickname,
    participantCount,
    onlineUsers
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

  // 신고 기능 핸들러들
  const handleReportMessage = (messageId: number) => {
    setReportingMessageId(messageId)
    setReportReason('')
    setReportDetails('')
  }

  const handleCancelReport = () => {
    setReportingMessageId(null)
    setReportReason('')
    setReportDetails('')
  }

  const handleSubmitReport = async () => {
    if (!reportingMessageId || !reportReason.trim()) {
      alert('신고 사유를 선택해주세요.')
      return
    }

    setIsSubmittingReport(true)
    
    try {
      const { error } = await supabase
        .from('chat_reports')
        .insert({
          message_id: reportingMessageId,
          reporter_ip_hash: userHash,
          reporter_nickname: userNickname,
          report_reason: reportReason,
          details: reportDetails.trim() || null,
          status: 'pending'
        })

      if (error) {
        console.error('신고 제출 실패:', error)
        alert('신고 제출에 실패했습니다. 다시 시도해주세요.')
        return
      }

      alert('신고가 접수되었습니다. 관리자가 검토 후 조치하겠습니다.')
      handleCancelReport()
      
    } catch (err) {
      console.error('신고 제출 오류:', err)
      alert('신고 제출 중 오류가 발생했습니다.')
    } finally {
      setIsSubmittingReport(false)
    }
  }

  // 메시지 렌더링
  const renderMessage = (message: ChatMessage) => {
    const isSystem = message.message_type === 'system'
    const isMyMessage = message.user_ip_hash === userNickname // 임시로 닉네임으로 비교
    const isDeleted = message.is_deleted || false
    
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
        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4 group`}
      >
        <div className={`max-w-xs lg:max-w-md ${isMyMessage ? 'order-2' : ''} relative`}>
          {!isMyMessage && (
            <div className="text-xs text-gray-600 mb-1 px-2 flex items-center justify-between">
              <span>💚 {isDeleted ? '삭제됨' : message.user_nickname}</span>
              {/* 신고 버튼 - 다른 사용자 메시지에만 표시 */}
              {!isDeleted && (
                <button
                  onClick={() => handleReportMessage(message.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
                  title="메시지 신고"
                >
                  <Flag className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
          <div
            className={`rounded-2xl px-4 py-2 ${
              isDeleted
                ? 'bg-gray-100 border border-gray-200 text-gray-500'
                : isMyMessage
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-200 text-gray-900'
            }`}
          >
            {isDeleted ? (
              <p className="text-sm italic">🚫 삭제된 메시지입니다</p>
            ) : (
              <p className="text-sm break-words">{message.message}</p>
            )}
            <div
              className={`text-xs mt-1 ${
                isDeleted
                  ? 'text-gray-400'
                  : isMyMessage 
                  ? 'text-blue-100' 
                  : 'text-gray-500'
              }`}
            >
              {formatChatTime(message.created_at)}
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
              <span className="font-medium text-green-600">{participantCount}명 실시간 접속중</span>
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

      {/* 실시간 접속자 목록 */}
      {participantCount > 0 && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="text-sm text-gray-600 mb-2 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            실시간 접속자 ({participantCount}명)
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(onlineUsers).slice(0, 8).map(([userHash, userInfo]) => (
              <span
                key={userHash}
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center"
                title={`접속 시간: ${new Date(userInfo.joinedAt).toLocaleTimeString()}`}
              >
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                💚 {userInfo.nickname}
              </span>
            ))}
            {participantCount > 8 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{participantCount - 8}명 더
              </span>
            )}
          </div>
          {participantCount === 0 && (
            <div className="text-xs text-gray-500 italic">
              현재 접속한 사용자가 없습니다
            </div>
          )}
        </div>
      )}

      {/* 신고 모달 */}
      {reportingMessageId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Flag className="w-5 h-5 mr-2 text-red-500" />
              메시지 신고하기
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                신고 사유를 선택해주세요 <span className="text-red-500">*</span>
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">사유를 선택하세요</option>
                <option value="욕설/비방">욕설 또는 비방</option>
                <option value="스팸">스팸 메시지</option>
                <option value="부적절한 내용">부적절한 내용</option>
                <option value="개인정보 노출">개인정보 노출</option>
                <option value="상업적 홍보">상업적 홍보</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상세 내용 (선택사항)
              </label>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="신고 사유에 대한 추가 설명을 입력해주세요..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {reportDetails.length}/500자
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelReport}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmittingReport}
              >
                취소
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={!reportReason.trim() || isSubmittingReport}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmittingReport ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  '신고하기'
                )}
              </button>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs text-yellow-800">
                💡 허위 신고 시 제재를 받을 수 있습니다. 신중하게 신고해주세요.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatRoom 