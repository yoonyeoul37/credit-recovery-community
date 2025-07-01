import { createClient } from '@supabase/supabase-js'

// 운영 환경 강제 설정 - 환경변수 문제 해결을 위한 직접 설정
const PRODUCTION_SUPABASE_URL = 'https://bqsyujtveafhxwknpxik.supabase.co'
const PRODUCTION_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxc3l1anR2ZWFmaHh3a25weGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDI2OTMsImV4cCI6MjA2Njc3ODY5M30.Y38nmrl3V06L7_WasiTLRK8pT-N3Cvf_0h3hxuN9TyA'

// 환경변수 우선 시도, 실패 시 하드코딩 값 사용
const supabaseUrl = typeof window === 'undefined'
  ? (process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || PRODUCTION_SUPABASE_URL)
  : (window?.__NEXT_PUBLIC_SUPABASE_URL__?.trim() || PRODUCTION_SUPABASE_URL);

const supabaseAnonKey = typeof window === 'undefined'
  ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || PRODUCTION_SUPABASE_ANON_KEY)
  : (window?.__NEXT_PUBLIC_SUPABASE_ANON_KEY__?.trim() || PRODUCTION_SUPABASE_ANON_KEY);

// 실제 데이터베이스 사용 - 운영 모드
export const isDemoMode = false

console.log('[supabase.ts] 🚀 운영 모드 활성화 - RLS 정책 설정됨!')
console.log('[supabase.ts] 🔗 supabaseUrl:', supabaseUrl?.substring(0, 40) + '...')
console.log('[supabase.ts] 🔑 supabaseKey 길이:', supabaseAnonKey?.length)
console.log('[supabase.ts] 🎯 isDemoMode:', isDemoMode)
console.log('[supabase.ts] 🌐 환경:', typeof window === 'undefined' ? 'Server' : 'Client')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // 울트라 사용자 자동 로그인 활성화
    autoRefreshToken: true,
    storageKey: 'credit-community-auth' // 커스텀 스토리지 키
  },
  global: {
    headers: {
      'X-Client-Info': 'credit-community-web'
    }
  }
})

// 연결 테스트 함수 추가
export const testSupabaseConnection = async () => {
  try {
    console.log('[supabase.ts] 🔄 연결 테스트 시작...')
    const { data, error } = await supabase.from('posts').select('count').limit(1)
    
    if (error) {
      console.error('[supabase.ts] ❌ 연결 테스트 실패:', error)
      return { success: false, error }
    }
    
    console.log('[supabase.ts] ✅ 연결 테스트 성공:', data)
    return { success: true, data }
  } catch (err) {
    console.error('[supabase.ts] ❌ 연결 테스트 예외:', err)
    return { success: false, error: err }
  }
}

// 데이터베이스 타입 정의
export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  order_num: number
  is_active: boolean
  created_at: string
}

export interface Post {
  id: number
  category_id: number
  title: string
  content: string
  author_nickname: string
  author_ip_hash: string
  tags: string[]
  view_count: number
  like_count: number
  comment_count: number
  is_hot: boolean
  is_notice: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
  // 관계 데이터
  category?: Category
  comments?: Comment[]
}

export interface Comment {
  id: number
  post_id: number
  parent_id: number | null
  content: string
  author_nickname: string
  author_ip_hash: string
  like_count: number
  is_deleted: boolean
  created_at: string
  updated_at: string
  // 관계 데이터
  post?: Post
  replies?: Comment[]
}

// 채팅 관련 타입 정의
export interface ChatRoom {
  id: number
  title: string
  description: string | null
  category: string | null
  max_participants: number
  is_active: boolean
  created_by_hash: string | null
  created_at: string
  updated_at: string
  // 실시간 데이터
  current_participants?: number
  participants?: ChatParticipant[]
}

export interface ChatMessage {
  id: number
  room_id: number
  user_ip_hash: string
  user_nickname: string
  message: string
  message_type: 'text' | 'emoji' | 'system'
  is_deleted: boolean
  created_at: string
  // 관계 데이터
  room?: ChatRoom
}

export interface ChatParticipant {
  id: number
  room_id: number
  user_ip_hash: string
  user_nickname: string
  last_seen: string
  is_online: boolean
  joined_at: string
  // 관계 데이터
  room?: ChatRoom
} 