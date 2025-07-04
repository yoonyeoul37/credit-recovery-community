import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 광고 데이터 타입
interface Ad {
  id?: number
  title: string
  description: string
  imageUrl: string
  link: string
  category: string
  adType: string
  position: string
  size: string
  isActive: boolean
  clickCount: number
  impressions: number
  createdAt: string
  expiresAt: string
  nativeConfig?: {
    showEvery: number
    ctaText: string
    backgroundColor: string
  }
}

// 광고 목록 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const position = searchParams.get('position')
    const adType = searchParams.get('adType')
    const isActive = searchParams.get('isActive')

    console.log('🔍 광고 조회 요청:', { category, position, adType, isActive })

    let query = supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false })

    // 필터 조건 추가
    if (category) {
      query = query.eq('category', category)
    }
    if (position) {
      query = query.eq('position', position)
    }
    if (adType) {
      query = query.eq('ad_type', adType)
    }
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }

    const { data, error } = await query

    if (error) {
      console.error('광고 조회 오류:', error)
      return NextResponse.json(
        { error: '광고 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    // 컬럼명 변환 (데이터베이스 snake_case → 프론트엔드 camelCase)
    const adsData = data?.map(ad => ({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      imageUrl: ad.image_url,
      link: ad.link,
      category: ad.category,
      adType: ad.ad_type,
      position: ad.position,
      size: ad.size,
      isActive: ad.is_active,
      clickCount: ad.click_count || 0,
      impressions: ad.impressions || 0,
      createdAt: ad.created_at,
      expiresAt: ad.expires_at,
      nativeConfig: ad.native_config
    })) || []

    return NextResponse.json({ ads: adsData })
  } catch (error) {
    console.error('광고 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 광고 등록 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      imageUrl,
      link,
      category,
      adType,
      position,
      size,
      expiresAt,
      nativeConfig
    } = body

    console.log('📝 광고 등록 요청 수신:', {
      title,
      description,
      imageUrlLength: imageUrl?.length || 0,
      imageUrlType: typeof imageUrl,
      link,
      category,
      adType,
      position,
      size,
      expiresAt,
      nativeConfig
    })

    // 필수 필드 검증
    if (!title || !description || !link || !category) {
      console.error('❌ 필수 필드 누락:', { title, description, link, category })
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 이미지 URL 검증 (Base64 또는 일반 URL)
    if (imageUrl) {
      if (imageUrl.startsWith('data:image/')) {
        // Base64 이미지 크기 검증 (약 5MB)
        const sizeInBytes = (imageUrl.length * 3) / 4
        if (sizeInBytes > 5 * 1024 * 1024) {
          console.error('❌ 이미지 크기 초과:', { sizeInBytes, maxSize: 5 * 1024 * 1024 })
          return NextResponse.json(
            { error: '이미지 크기는 5MB 이하여야 합니다.' },
            { status: 400 }
          )
        }
        console.log('✅ Base64 이미지 검증 통과:', { sizeInBytes })
      } else {
        console.log('✅ 일반 URL 이미지:', { imageUrl })
      }
    }

    console.log('💾 데이터베이스 삽입 시도...')

    // 데이터베이스에 삽입
    const { data, error } = await supabase
      .from('ads')
      .insert([
        {
          title,
          description,
          image_url: imageUrl || '',
          link,
          category,
          ad_type: adType || 'native',
          position: position || 'native',
          size: size || 'medium',
          is_active: true,
          click_count: 0,
          impressions: 0,
          created_at: new Date().toISOString(),
          expires_at: expiresAt || null,
          native_config: nativeConfig || null
        }
      ])
      .select()

    if (error) {
      console.error('❌ 광고 등록 오류:', error)
      return NextResponse.json(
        { error: `광고 등록 중 오류가 발생했습니다: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('✅ 광고 등록 성공:', data[0])
    return NextResponse.json({
      message: '광고가 성공적으로 등록되었습니다.',
      ad: data[0]
    })
  } catch (error) {
    console.error('❌ 광고 등록 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 광고 수정 (PUT)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      title,
      description,
      imageUrl,
      link,
      category,
      adType,
      position,
      size,
      isActive,
      expiresAt,
      nativeConfig
    } = body

    if (!id) {
      return NextResponse.json(
        { error: '광고 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('ads')
      .update({
        title,
        description,
        image_url: imageUrl,
        link,
        category,
        ad_type: adType,
        position,
        size,
        is_active: isActive,
        expires_at: expiresAt,
        native_config: nativeConfig
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('광고 수정 오류:', error)
      return NextResponse.json(
        { error: '광고 수정 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '광고가 성공적으로 수정되었습니다.',
      ad: data[0]
    })
  } catch (error) {
    console.error('광고 수정 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 광고 삭제 (DELETE)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: '광고 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('광고 삭제 오류:', error)
      return NextResponse.json(
        { error: '광고 삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '광고가 성공적으로 삭제되었습니다.'
    })
  } catch (error) {
    console.error('광고 삭제 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 