import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 프리미엄 광고 데이터 타입
interface PremiumAd {
  id: number
  title: string
  description: string
  imageUrl: string
  link: string
  position: string
  priority: number
  isActive: boolean
  clickCount: number
  impressions: number
  createdAt: string
  updatedAt: string
  expiresAt: string
}

// GET - 프리미엄 광고 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position') || 'top'
    
    console.log(`🔍 프리미엄 광고 조회 요청: position=${position}`)
    
    // Supabase에서 프리미엄 광고 조회
    let query = supabase
      .from('premium_ads')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
    
    // position이 'all'이 아닌 경우에만 필터링
    if (position !== 'all') {
      query = query.eq('position', position)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('프리미엄 광고 조회 오류:', error)
      
      // 테이블이 존재하지 않는 경우 빈 배열 반환
      if (error.code === '42P01') {
        console.log('⚠️ premium_ads 테이블이 없음 - 빈 배열 반환')
        return NextResponse.json([])
      }
      
      return NextResponse.json({ error: '프리미엄 광고 조회 실패' }, { status: 500 })
    }
    
    // 데이터 변환 (snake_case → camelCase)
    const transformedData = (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      imageUrl: item.image_url,
      link: item.link,
      position: item.position,
      priority: item.priority,
      isActive: item.is_active,
      clickCount: item.click_count,
      impressions: item.impressions,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      expiresAt: item.expires_at
    }))
    
    console.log(`✅ 프리미엄 광고 조회 성공:`, transformedData.length)
    return NextResponse.json(transformedData)
    
  } catch (error) {
    console.error('프리미엄 광고 조회 예외:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

// POST - 프리미엄 광고 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, imageUrl, link, position, priority } = body
    
    console.log('🔍 프리미엄 광고 추가 요청:', { title, position, priority })
    
    // 필수 필드 검증
    if (!title || !imageUrl || !link || !position) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다' }, { status: 400 })
    }
    
    // Supabase에 추가
    const { data, error } = await supabase
      .from('premium_ads')
      .insert([{
        title,
        description: description || '',
        image_url: imageUrl,
        link,
        position,
        priority: priority || 0,
        is_active: true,
        click_count: 0,
        impressions: 0
      }])
      .select()
    
    if (error) {
      console.error('프리미엄 광고 추가 오류:', error)
      return NextResponse.json({ error: '프리미엄 광고 추가 실패' }, { status: 500 })
    }
    
    console.log('✅ 프리미엄 광고 추가 성공:', data)
    return NextResponse.json(data[0])
    
  } catch (error) {
    console.error('프리미엄 광고 추가 예외:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

// PUT - 프리미엄 광고 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, imageUrl, link, position, priority, isActive } = body
    
    console.log('🔍 프리미엄 광고 수정 요청:', { id, title, position, priority })
    
    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다' }, { status: 400 })
    }
    
    // Supabase에서 수정
    const { data, error } = await supabase
      .from('premium_ads')
      .update({
        title,
        description,
        image_url: imageUrl,
        link,
        position,
        priority,
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('프리미엄 광고 수정 오류:', error)
      return NextResponse.json({ error: '프리미엄 광고 수정 실패' }, { status: 500 })
    }
    
    console.log('✅ 프리미엄 광고 수정 성공:', data)
    return NextResponse.json(data[0])
    
  } catch (error) {
    console.error('프리미엄 광고 수정 예외:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

// DELETE - 프리미엄 광고 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    console.log('🔍 프리미엄 광고 삭제 요청:', { id })
    
    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다' }, { status: 400 })
    }
    
    // Supabase에서 삭제
    const { error } = await supabase
      .from('premium_ads')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('프리미엄 광고 삭제 오류:', error)
      return NextResponse.json({ error: '프리미엄 광고 삭제 실패' }, { status: 500 })
    }
    
    console.log('✅ 프리미엄 광고 삭제 성공:', { id })
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('프리미엄 광고 삭제 예외:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
} 