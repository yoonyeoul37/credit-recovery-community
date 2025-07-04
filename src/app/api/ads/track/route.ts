import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 광고 클릭 추적 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adId, type } = body // type: 'click' 또는 'impression'

    if (!adId || !type) {
      return NextResponse.json(
        { error: '광고 ID와 추적 타입이 필요합니다.' },
        { status: 400 }
      )
    }

    if (type === 'click') {
      // 클릭 수 증가
      const { data, error } = await supabase
        .from('ads')
        .update({
          click_count: supabase.sql`click_count + 1`
        })
        .eq('id', adId)
        .select('click_count')

      if (error) {
        console.error('클릭 추적 오류:', error)
        return NextResponse.json(
          { error: '클릭 추적 중 오류가 발생했습니다.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: '클릭이 추적되었습니다.',
        clickCount: data[0]?.click_count || 0
      })
    } else if (type === 'impression') {
      // 노출 수 증가
      const { data, error } = await supabase
        .from('ads')
        .update({
          impressions: supabase.sql`impressions + 1`
        })
        .eq('id', adId)
        .select('impressions')

      if (error) {
        console.error('노출 추적 오류:', error)
        return NextResponse.json(
          { error: '노출 추적 중 오류가 발생했습니다.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: '노출이 추적되었습니다.',
        impressions: data[0]?.impressions || 0
      })
    } else {
      return NextResponse.json(
        { error: '올바르지 않은 추적 타입입니다.' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('광고 추적 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 