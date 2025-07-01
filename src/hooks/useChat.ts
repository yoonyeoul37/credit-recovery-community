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
  const [userNickname, setUserNickname] = useState(() => {
    // 로컬 스토리지에서 저장된 닉네임 확인
    if (typeof window !== 'undefined') {
      const savedNickname = localStorage.getItem('chat-nickname')
      if (savedNickname) {
        return savedNickname
      }
    }
    return generateNickname()
  })
  const [isConnected, setIsConnected] = useState(false)
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null)

  // 채팅방 로드
  const loadRoom = useCallback(async () => {
    try {
      console.log('🔍 채팅방 로드 시도, roomId:', roomId)
      
      if (isDemoMode) {
        console.log('🏠 로컬 데모 모드 - 기본 채팅방 생성')
        setRoom({
          id: roomId,
          title: '💬 신용회복 종합상담방 (로컬 테스트)',
          description: '현재 로컬 테스트 모드입니다. 실제 Supabase 설정 후 실시간 채팅이 활성화됩니다.',
          category: '테스트',
          max_participants: 100,
          is_active: true,
          created_by_hash: 'demo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        return
      }
      
      console.log('🔗 Supabase 클라이언트 테스트:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length
      })

      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('id', roomId)
        .single()

      console.log('📊 Supabase 응답:', { data, error, roomId })

      if (error && error.code === 'PGRST116') {
        // 채팅방이 없으면 기본 채팅방 생성
        console.log('📝 기본 채팅방 생성 시도...')
        const { data: newRoom, error: createError } = await supabase
          .from('chat_rooms')
          .insert({
            id: roomId,
            title: '💬 신용회복 종합상담방',
            description: '신용회복에 관한 모든 궁금증을 함께 해결하는 메인 채팅방입니다.',
            category: '종합상담',
            max_participants: 100,
            is_active: true,
            created_by_hash: 'system'
          })
          .select()
          .single()

        if (createError) {
          console.error('❌ 채팅방 생성 실패:', createError)
          throw createError
        }
        
        console.log('✅ 기본 채팅방 생성 성공:', newRoom)
        setRoom(newRoom)
      } else if (error) {
        console.error('❌ Supabase 연결 오류:', error)
        throw error
      } else {
        console.log('✅ 채팅방 로드 성공:', data)
        setRoom(data)
      }
    } catch (err) {
      console.error('❌ 채팅방 로드 실패:', err)
      // 로컬 데모 모드로 fallback
      console.log('🔄 로컬 데모 모드로 전환')
      setRoom({
        id: roomId,
        title: '💬 신용회복 종합상담방 (데모)',
        description: '현재 데모 모드입니다. Supabase 연결 후 실시간 채팅이 활성화됩니다.',
        category: '데모',
        max_participants: 100,
        is_active: true,
        created_by_hash: 'demo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
  }, [roomId])

  // 메시지 로드
  const loadMessages = useCallback(async () => {
    try {
      if (isDemoMode) {
        console.log('🏠 로컬 데모 모드 - 데모 메시지 생성')
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
        return
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) throw error
      setMessages(data || [])
      console.log('✅ 메시지 로드 성공:', data?.length || 0, '개')
    } catch (err) {
      console.error('❌ 메시지 로드 실패:', err)
      // 데모 모드로 fallback
      console.log('🔄 메시지 데모 모드로 전환')
      setMessages([])
    }
  }, [roomId])

  // 참여자 로드
  const loadParticipants = useCallback(async () => {
    try {
      if (isDemoMode) {
        console.log('🏠 로컬 데모 모드 - 데모 참여자 생성')
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
        return
      }

      const { data, error } = await supabase
        .from('chat_participants')
        .select('*')
        .eq('room_id', roomId)
        .eq('is_online', true)

      if (error) throw error
      setParticipants(data || [])
      console.log('✅ 참여자 로드 성공:', data?.length || 0, '명')
    } catch (err) {
      console.error('❌ 참여자 로드 실패:', err)
      // 데모 모드로 fallback
      console.log('🔄 참여자 데모 모드로 전환')
      setParticipants([])
    }
  }, [roomId])

  // 채팅방 참여 (sendMessage보다 먼저 정의)
  const joinRoom = useCallback(async () => {
    try {
      console.log('🚪 채팅방 참여:', userNickname)
      
      if (isDemoMode) {
        console.log('🏠 로컬 데모 모드 - 로컬 참여 처리')
        setIsConnected(true)
        return
      }

      const { error } = await supabase
        .from('chat_participants')
        .upsert({
          room_id: roomId,
          user_ip_hash: userHash,
          user_nickname: userNickname,
          last_seen: new Date().toISOString(),
          is_online: true
        })

      if (error) throw error
      setIsConnected(true)
      console.log('✅ 채팅방 참여 성공')
    } catch (err) {
      console.error('❌ 채팅방 참여 실패:', err)
      // 데모 모드로 fallback
      console.log('🔄 로컬 참여 모드로 전환')
      setIsConnected(true)
    }
  }, [roomId, userHash, userNickname])

  // 채팅방 퇴장
  const leaveRoom = useCallback(async () => {
    try {
      console.log('🚪 채팅방 퇴장:', userNickname)
      
      if (isDemoMode) {
        console.log('🏠 로컬 데모 모드 - 로컬 퇴장 처리')
        setIsConnected(false)
        return
      }

      await supabase
        .from('chat_participants')
        .update({ 
          is_online: false,
          last_seen: new Date().toISOString()
        })
        .eq('room_id', roomId)
        .eq('user_ip_hash', userHash)
      
      setIsConnected(false)
      console.log('✅ 채팅방 퇴장 성공')
    } catch (err) {
      console.error('❌ 채팅방 퇴장 실패:', err)
      // 데모 모드로 fallback
      console.log('🔄 로컬 퇴장 모드로 전환')
      setIsConnected(false)
    }
  }, [roomId, userHash, userNickname])

  // 메시지 전송 (joinRoom 정의 후)
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) {
      console.log('📤 메시지가 비어있어서 전송하지 않음')
      return
    }

    try {
      console.log('📤 메시지 전송 시도:', { message, isConnected, isDemoMode, roomId })
      
      // 연결되지 않은 경우 자동으로 참여 시도
      if (!isConnected) {
        console.log('🔄 연결되지 않음, 자동 참여 시도...')
        try {
          await joinRoom()
          console.log('✅ 자동 참여 성공')
        } catch (joinError) {
          console.error('❌ 자동 참여 실패:', joinError)
          // 참여 실패해도 메시지 전송은 시도
        }
      }
      
      if (isDemoMode) {
        console.log('🏠 로컬 데모 모드 - 로컬 메시지 추가')
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
        setMessages(prev => {
          console.log('📝 메시지 목록 업데이트:', [...prev, newMessage])
          return [...prev, newMessage]
        })
        
        // 연결 상태도 true로 설정
        if (!isConnected) {
          setIsConnected(true)
        }
        
        return
      }

      console.log('🔗 Supabase로 메시지 전송 중...')
      const { data: insertedMessage, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          user_ip_hash: userHash,
          user_nickname: userNickname,
          message: message.trim(),
          message_type: 'text'
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Supabase 메시지 삽입 에러:', error)
        throw error
      }

      // 메시지 전송 성공 시 즉시 로컬에도 추가 (실시간 구독과 별개로)
      if (insertedMessage) {
        console.log('📝 전송된 메시지를 로컬에 즉시 추가:', insertedMessage)
        setMessages(prev => {
          // 중복 방지
          if (prev.some(msg => msg.id === insertedMessage.id)) {
            return prev
          }
          return [...prev, insertedMessage as ChatMessage]
        })
      }

      // 참여자 활동 시간 업데이트 (실패해도 메시지 전송은 성공으로 처리)
      try {
        await supabase
          .from('chat_participants')
          .update({ last_seen: new Date().toISOString() })
          .eq('room_id', roomId)
          .eq('user_ip_hash', userHash)
      } catch (updateError) {
        console.warn('⚠️ 참여자 활동 시간 업데이트 실패 (무시):', updateError)
      }

      console.log('✅ 메시지 전송 성공')
    } catch (err) {
      console.error('❌ 메시지 전송 실패:', err)
      
      // 에러가 발생해도 로컬에 메시지 추가 (사용자 경험 개선)
      console.log('🔄 에러 발생, 로컬에 임시 메시지 추가')
      const tempMessage = {
        id: Date.now(),
        room_id: roomId,
        user_ip_hash: userHash,
        user_nickname: userNickname,
        message: message.trim() + ' (전송 실패 - 재시도 필요)',
        message_type: 'text' as const,
        is_deleted: false,
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, tempMessage])
      
      setError('메시지 전송에 실패했습니다. 네트워크를 확인하고 다시 시도해주세요.')
    }
  }, [roomId, userHash, userNickname, isConnected, joinRoom])

  // 닉네임 변경
  const changeNickname = useCallback((newNickname: string) => {
    if (!newNickname.trim()) {
      setError('닉네임을 입력해주세요.')
      return false
    }
    
    if (newNickname.trim().length > 20) {
      setError('닉네임은 20자 이하로 입력해주세요.')
      return false
    }
    
    const trimmedNickname = newNickname.trim()
    setUserNickname(trimmedNickname)
    
    // 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat-nickname', trimmedNickname)
    }
    
    console.log('✅ 닉네임 변경:', trimmedNickname)
    return true
  }, [])

  // 실시간 구독 설정
  const setupRealtime = useCallback(async () => {
    if (!isConnected) return

    try {
      if (isDemoMode) {
        console.log('🏠 로컬 데모 모드 - 실시간 구독 건너뛰기')
        return
      }

      console.log('🔔 실시간 구독 설정 시작...')
      
      // 기존 채널 정리 (현재 상태에서 직접 참조)
      setRealtimeChannel(prevChannel => {
        if (prevChannel) {
          supabase.removeChannel(prevChannel)
        }
        return null
      })

      // 새 채널 생성
      const channel = supabase
        .channel(`chat_room_${roomId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `room_id=eq.${roomId}`
          },
          (payload) => {
            console.log('🔔 새 메시지 실시간 수신:', payload.new)
            const newMessage = payload.new as ChatMessage
            setMessages(prev => {
              // 중복 방지
              if (prev.some(msg => msg.id === newMessage.id)) {
                return prev
              }
              return [...prev, newMessage]
            })
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public', 
            table: 'chat_participants',
            filter: `room_id=eq.${roomId}`
          },
          (payload) => {
            console.log('🔔 새 참여자 실시간 수신:', payload.new)
            const newParticipant = payload.new as ChatParticipant
            setParticipants(prev => {
              if (prev.some(p => p.user_ip_hash === newParticipant.user_ip_hash)) {
                return prev.map(p => 
                  p.user_ip_hash === newParticipant.user_ip_hash 
                    ? { ...p, ...newParticipant }
                    : p
                )
              }
              return [...prev, newParticipant]
            })
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'chat_participants', 
            filter: `room_id=eq.${roomId}`
          },
          (payload) => {
            console.log('🔔 참여자 업데이트 실시간 수신:', payload.new)
            const updatedParticipant = payload.new as ChatParticipant
            setParticipants(prev => 
              prev.map(p => 
                p.user_ip_hash === updatedParticipant.user_ip_hash 
                  ? { ...p, ...updatedParticipant }
                  : p
              )
            )
          }
        )
        .subscribe((status) => {
          console.log('🔔 실시간 구독 상태:', status)
        })

      setRealtimeChannel(channel)
      console.log('✅ 실시간 구독 설정 완료')
      
    } catch (err) {
      console.error('❌ 실시간 구독 설정 실패:', err)
    }
  }, [roomId]) // isConnected, realtimeChannel 의존성 제거

  // 실시간 구독 해제
  const cleanupRealtime = useCallback(async () => {
    setRealtimeChannel(prevChannel => {
      if (prevChannel) {
        console.log('🔕 실시간 구독 해제...')
        supabase.removeChannel(prevChannel)
        console.log('✅ 실시간 구독 해제 완료')
      }
      return null
    })
  }, []) // realtimeChannel 의존성 제거

  // 실시간 구독 설정/해제 Effect
  useEffect(() => {
    if (isConnected) {
      setupRealtime()
    }
    
    return () => {
      cleanupRealtime()
    }
  }, [isConnected]) // setupRealtime, cleanupRealtime 의존성 제거

  // 초기 설정
  useEffect(() => {
    const setupChat = async () => {
      try {
        console.log('🚀 실제 채팅 설정 시작...')
        
        await Promise.all([
          loadRoom(),
          loadMessages(),
          loadParticipants()
        ])
        
        setLoading(false)
        console.log('✅ 실제 채팅 설정 완료!')
      } catch (err) {
        console.error('❌ 채팅 설정 실패:', err)
        setError('채팅을 불러올 수 없습니다.')
        setLoading(false)
      }
    }

    setupChat()
  }, [roomId]) // loadRoom, loadMessages, loadParticipants 의존성 제거

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      cleanupRealtime()
    }
  }, []) // cleanupRealtime 의존성 제거 (언마운트 시에만 실행)

  return {
    // 상태
    messages,
    participants,
    room,
    loading,
    error,
    isConnected,
    userNickname,
    
    // 액션 - 오직 실제 채팅만!
    sendMessage,
    joinRoom,
    leaveRoom,
    changeNickname,
    
    // 정보
    participantCount: participants.length
  }
} 