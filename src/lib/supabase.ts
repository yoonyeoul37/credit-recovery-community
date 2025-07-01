import { createClient } from '@supabase/supabase-js'

// 배포 환경에서 환경변수 문제 해결을 위한 임시 하드코딩
const supabaseUrl = typeof window === 'undefined'
  ? (process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || 'https://bqsyujtveafhxwknpxik.supabase.co')
  : (window?.__NEXT_PUBLIC_SUPABASE_URL__ || 'https://bqsyujtveafhxwknpxik.supabase.co').trim();
const supabaseAnonKey = typeof window === 'undefined'
  ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxc3l1anR2ZWFmaHh3a25weGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMzAzMDIsImV4cCI6MjA1MDcwNjMwMn0.zYl8eSuClxIGjJwXVklXgz6TYM8NxkWJpK1Qb1xOA7s')
  : (window?.__NEXT_PUBLIC_SUPABASE_ANON_KEY__ || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxc3l1anR2ZWFmaHh3a25weGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMzAzMDIsImV4cCI6MjA1MDcwNjMwMn0.zYl8eSuClxIGjJwXVklXgz6TYM8NxkWJpK1Qb1xOA7s').trim();

// 실제 프로젝트 주소/키가 아니면 로컬 데모 모드 (하드코딩 값은 제외)
export const isDemoMode =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl === '' ||
  supabaseAnonKey === '' ||
  supabaseUrl.includes('your-project-id') ||
  supabaseAnonKey.includes('your-anon-key')

console.log('[supabase.ts] supabaseUrl:', supabaseUrl)
console.log('[supabase.ts] isDemoMode:', isDemoMode)

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