import { NextRequest, NextResponse } from 'next/server'
import { supabase, isDemoMode } from '@/lib/supabase'

// GET: 카테고리 목록 조회
export async function GET() {
  try {
    if (isDemoMode || !supabase) {
      console.log('📂 API: 데모 모드에서 카테고리 조회')
      return NextResponse.json({
        success: true,
        data: [
          { id: 1, name: '신용이야기', slug: 'credit-story', description: '신용점수 관리와 신용카드 관련 정보 공유', icon: '💳', order_num: 1, is_active: true },
          { id: 2, name: '개인회생', slug: 'personal-recovery', description: '개인회생 절차와 경험담을 나누는 공간', icon: '🔄', order_num: 2, is_active: true },
          { id: 3, name: '법인회생', slug: 'corporate-recovery', description: '법인회생과 사업 관련 정보 공유', icon: '🏢', order_num: 3, is_active: true },
          { id: 4, name: '대출이야기', slug: 'loan-story', description: '대출 후기와 정보를 교환하는 공간', icon: '💰', order_num: 4, is_active: true },
          { id: 5, name: '성공사례', slug: 'success-story', description: '신용 회복 성공 사례 공유', icon: '⭐', order_num: 5, is_active: true },
          { id: 6, name: '실시간상담', slug: 'live-chat', description: '실시간 상담과 질문 답변', icon: '💬', order_num: 6, is_active: true }
        ]
      })
    }

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('order_num', { ascending: true })

    if (error) {
      console.error('카테고리 조회 오류:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: categories || []
    })

  } catch (error) {
    console.error('카테고리 조회 예외:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 