'use client'

import { useEffect } from 'react'
import { createPageTitle } from '@/lib/utils'

interface DynamicTitleProps {
  pageTitle?: string
}

export default function DynamicTitle({ pageTitle }: DynamicTitleProps) {
  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window === 'undefined') return
    
    const updateTitle = () => {
      document.title = createPageTitle(pageTitle)
    }

    // 초기 타이틀 설정을 약간 지연시켜 하이드레이션 완료 후 실행
    const timer = setTimeout(updateTitle, 100)
    
    // 사이트 설정 변경 감지
    const handleSettingsChange = () => {
      updateTitle()
    }

    window.addEventListener('siteSettingsChanged', handleSettingsChange)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('siteSettingsChanged', handleSettingsChange)
    }
  }, [pageTitle])

  return null
} 