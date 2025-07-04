import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST - 프리미엄 광고 추적
export async function POST(request: NextRequest) {
  try {
    const { adId, action } = await request.json()
    
    console.log('🔍 프리미엄 광고 추적 요청:', { adId, action })
    
    if (!adId || !action) {
      return NextResponse.json({ error: '광고 ID와 액션이 필요합니다.' }, { status: 400 })
    }
    
    // 현재 값 조회 후 1 증가
    const columnName = action === 'click' ? 'click_count' : 'impressions'
    
    // 현재 값 조회
    const { data: currentData, error: selectError } = await supabase
      .from('premium_ads')
      .select(columnName)
      .eq('id', adId)
      .single()
    
    if (selectError) {
      console.error('현재 값 조회 오류:', selectError)
      return NextResponse.json({ error: '추적 실패' }, { status: 500 })
    }
    
    // 값 증가
    const newValue = (currentData[columnName] || 0) + 1
    
    const { error } = await supabase
      .from('premium_ads')
      .update({ [columnName]: newValue })
      .eq('id', adId)
    
    if (error) {
      console.error('프리미엄 광고 추적 오류:', error)
      return NextResponse.json({ error: '추적 실패' }, { status: 500 })
    }
    
    console.log(`✅ 프리미엄 광고 ${action} 추적 완료: ${adId}`)
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('프리미엄 광고 추적 오류:', error)
    return NextResponse.json({ error: '추적 실패' }, { status: 500 })
  }
} 