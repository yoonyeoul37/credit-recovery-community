import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// UTC 시간을 한국시간으로 변환하는 유틸리티 함수
export function formatKoreanTime(utcDateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(utcDateString)
  
  // 명시적으로 9시간 추가 (UTC+9)
  const koreaTime = new Date(date.getTime() + (9 * 60 * 60 * 1000))
  
  return koreaTime.toLocaleString('ko-KR', options)
}

// 채팅 메시지용 시간 포맷 (시:분만 표시)
export function formatChatTime(utcDateString: string): string {
  return formatKoreanTime(utcDateString, {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 관리자 페이지용 시간 포맷 (날짜 + 시간)
export function formatAdminTime(utcDateString: string): string {
  return formatKoreanTime(utcDateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 메인 페이지용 시간 포맷 (월/일 시:분)
export function formatMainPageTime(utcDateString: string): string {
  return formatKoreanTime(utcDateString, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 날짜 포맷팅 함수
export function formatDate(date: string | Date): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return '방금 전'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}분 전`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}시간 전`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}일 전`
  } else {
    return targetDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

// 조회수 포맷팅 함수
export function formatViewCount(count: number): string {
  if (count < 1000) {
    return count.toString()
  } else if (count < 10000) {
    return `${(count / 1000).toFixed(1)}k`
  } else {
    return `${Math.floor(count / 1000)}k`
  }
}

// IP 해시 생성 함수 (클라이언트용 - 실제로는 서버에서 처리)
export async function generateIPHash(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + process.env.NEXT_PUBLIC_HASH_SALT || 'default-salt')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 닉네임 생성 함수
export function generateNickname(): string {
  const prefixes = [
    '희망', '새출발', '다시시작', '용기', '힘내기', '꿈꾸는', '따뜻한', 
    '밝은', '행복한', '평온한', '건강한', '웃는', '긍정적인', '멋진'
  ]
  const suffixes = [
    '나무', '새싹', '바람', '햇살', '구름', '별빛', '달빛', '꽃잎',
    '마음', '미소', '희망', '꿈', '날개', '무지개', '하늘', '바다'
  ]
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  
  return `${prefix}${suffix}`
}

// 태그 색상 함수
export function getTagColor(tag: string): string {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800', 
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800'
  ]
  
  // 태그 문자열을 기반으로 해시값 생성하여 일관된 색상 적용
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    const char = tag.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 32비트 정수로 변환
  }
  
  return colors[Math.abs(hash) % colors.length]
} 