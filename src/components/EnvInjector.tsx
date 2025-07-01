'use client'

import { useEffect } from 'react'

export default function EnvInjector() {
  useEffect(() => {
    // 클라이언트에서 환경변수 주입
    if (typeof window !== 'undefined') {
      window.__NEXT_PUBLIC_SUPABASE_URL__ = process.env.NEXT_PUBLIC_SUPABASE_URL;
      window.__NEXT_PUBLIC_SUPABASE_ANON_KEY__ = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      console.log('🔧 [EnvInjector] 환경변수 주입 시도');
      console.log('🔗 URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 40) + '...');
      console.log('🔑 KEY 길이:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);
      console.log('✅ window.SUPABASE_URL:', window.__NEXT_PUBLIC_SUPABASE_URL__?.substring(0, 40) + '...');
      console.log('✅ window.SUPABASE_KEY 길이:', window.__NEXT_PUBLIC_SUPABASE_ANON_KEY__?.length);
      
      // isDemoMode 재계산
      const url = window.__NEXT_PUBLIC_SUPABASE_URL__;
      const key = window.__NEXT_PUBLIC_SUPABASE_ANON_KEY__;
      const isDemoMode = !url || !key || url === '' || key === '' || 
                        url.includes('your-project-id') || key.includes('your-anon-key');
      
      console.log('🎯 [EnvInjector] isDemoMode:', isDemoMode);
      
      if (!isDemoMode) {
        console.log('🚀 [EnvInjector] 실제 Supabase 모드로 설정됨!');
      } else {
        console.log('⚠️ [EnvInjector] 여전히 데모 모드... 환경변수 확인 필요');
      }
    }
  }, [])

  return null
} 