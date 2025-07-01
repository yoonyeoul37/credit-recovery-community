'use client'

import { useEffect } from 'react'

export default function EnvInjector() {
  useEffect(() => {
    // 환경변수 상태 확인만 수행
    if (typeof window !== 'undefined') {
      console.log('🔧 [EnvInjector] 환경변수 상태 확인');
      console.log('🔗 process.env.NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 40) + '...');
      console.log('🔑 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 길이:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);
      console.log('✅ 운영 모드가 강제로 활성화됨 (isDemoMode = false)');
    }
  }, [])

  return null
} 