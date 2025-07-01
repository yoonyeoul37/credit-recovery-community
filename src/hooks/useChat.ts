'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, ChatRoom, ChatMessage, ChatParticipant, isDemoMode } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

// 익명 사용자 관리
const generateUserHash = (): string => {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2)
  return `hash_${timestamp}_${random}`
}

const generateNickname = (): string => {
  const adjectives = [
    '희망찬', '용기있는', '새로운', '따뜻한', '밝은', '강한', '지혜로운', '친근한',
    '성실한', '열정적인', '긍정적인', '신중한', '배려깊은', '창의적인', '활기찬'
  ]
  const nouns = [
    '시작', '출발', '내일', '꿈', '도전', '변화', '성장', '희망', '미래', '기회',
    '새싹', '여행', '모험', '도약', '발걸음', '날개', '별', '햇살', '바람', '물결'
  ]
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 999) + 1
  
  return `${adj}${noun}${num}`
}

export const useChat = (roomId: number) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [participants, setParticipants] = useState<ChatParticipant[]>([])
  const [room, setRoom] = useState<ChatRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userHash] = useState(() => generateUserHash())
  const [userNickname] = useState(() => generateNickname())
  const [isConnected, setIsConnected] = useState(false)
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null)

  // 채팅방 로드
  const loadRoom = useCallback(async () => {
    try {
      console.log('🔍 채팅방 로드 시도, roomId:', roomId)
      
      // 안전한 데모 모드로 우선 처리
      console.log('🏠 안전 모드: 데모 채팅방 생성')
      setRoom({
        id: roomId,
        title: '💬 신용회복 종합상담방',
        description: '신용회복에 관한 모든 궁금증을 함께 해결하는 메인 채팅방입니다.',
        category: '종합상담',
        max_participants: 100,
        is_active: true,
        created_by_hash: 'demo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      
    } catch (err) {
      console.warn('⚠️ 채팅방 로드 중 오류 발생, 데모 모드로 계속 진행:', err)
      setRoom({
        id: roomId,
        title: '💬 신용회복 종합상담방 (안전모드)',
        description: '현재 안전 모드로 운영 중입니다.',
        category: '안전모드',
        max_participants: 100,
        is_active: true,
        created_by_hash: 'safe',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
  }, [roomId])

  // 메시지 로드
  const loadMessages = useCallback(async () => {
    try {
      console.log('📝 안전 모드: 데모 메시지 생성')
      setMessages([
        {
          id: 1,
          room_id: roomId,
          user_ip_hash: 'demo_user_1',
          user_nickname: '환영봇',
          message: '안녕하세요! 신용회복 종합상담방에 오신 것을 환영합니다! 💚',
          message_type: 'system',
          is_deleted: false,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          room_id: roomId,
          user_ip_hash: 'demo_user_2',
          user_nickname: '도움이',
          message: '궁금한 것이 있으시면 언제든 말씀해주세요!',
          message_type: 'text',
          is_deleted: false,
          created_at: new Date().toISOString()
        }
      ])
    } catch (err) {
      console.warn('⚠️ 메시지 로드 중 오류:', err)
      setMessages([])
    }
  }, [roomId])

  // 참여자 로드
  const loadParticipants = useCallback(async () => {
    try {
      console.log('👥 안전 모드: 데모 참여자 생성')
      setParticipants([
        {
          id: 1,
          room_id: roomId,
          user_ip_hash: 'demo_user_1',
          user_nickname: '환영봇',
          last_seen: new Date().toISOString(),
          is_online: true,
          joined_at: new Date().toISOString()
        },
        {
          id: 2,
          room_id: roomId,
          user_ip_hash: 'demo_user_2',
          user_nickname: '도움이',
          last_seen: new Date().toISOString(),
          is_online: true,
          joined_at: new Date().toISOString()
        }
      ])
    } catch (err) {
      console.warn('⚠️ 참여자 로드 중 오류:', err)
      setParticipants([])
    }
  }, [roomId])

  // 메시지 전송
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || !isConnected) return

    try {
      console.log('📤 안전 모드: 로컬 메시지 추가')
      const newMessage = {
        id: Date.now(),
        room_id: roomId,
        user_ip_hash: userHash,
        user_nickname: userNickname,
        message: message.trim(),
        message_type: 'text' as const,
        is_deleted: false,
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, newMessage])
    } catch (err) {
      console.warn('⚠️ 메시지 전송 중 오류:', err)
    }
  }, [roomId, userHash, userNickname, isConnected])

  // 채팅방 참여
  const joinRoom = useCallback(async () => {
    try {
      console.log('🚪 안전 모드: 로컬 참여 처리')
      setIsConnected(true)
    } catch (err) {
      console.warn('⚠️ 채팅방 참여 중 오류:', err)
      setIsConnected(true)
    }
  }, [])

  // 채팅방 퇴장
  const leaveRoom = useCallback(async () => {
    try {
      console.log('🚪 안전 모드: 로컬 퇴장 처리')
      setIsConnected(false)
    } catch (err) {
      console.warn('⚠️ 채팅방 퇴장 중 오류:', err)
      setIsConnected(false)
    }
  }, [])

  // 초기 설정
  useEffect(() => {
    const setupChat = async () => {
      try {
        console.log('🚀 안전 모드 채팅 설정 시작...')
        
        await Promise.all([
          loadRoom(),
          loadMessages(),
          loadParticipants()
        ])
        
        setLoading(false)
        console.log('✅ 안전 모드 채팅 설정 완료!')
      } catch (err) {
        console.warn('⚠️ 채팅 설정 중 오류 발생, 기본값으로 설정:', err)
        setError(null) // 오류 표시하지 않음
        setLoading(false)
      }
    }

    setupChat()
  }, [roomId, loadRoom, loadMessages, loadParticipants])

  return {
    // 상태
    messages,
    participants,
    room,
    loading,
    error: null, // 오류 숨김
    isConnected,
    userNickname,
    
    // 액션
    sendMessage,
    joinRoom,
    leaveRoom,
    
    // 정보
    participantCount: participants.length
  }
} 