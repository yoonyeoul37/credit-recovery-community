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

    // 네이티브 광고 디버깅 로그
    const nativeAds = adsData.filter(ad => ad.adType === 'native')
    if (nativeAds.length > 0) {
      console.log('🎯 네이티브 광고 조회 결과:', nativeAds.map(ad => ({
        id: ad.id,
        title: ad.title,
        imageUrl: ad.imageUrl ? `${ad.imageUrl.substring(0, 50)}...` : 'NO_IMAGE',
        imageUrlType: ad.imageUrl?.startsWith('data:image/') ? 'Base64' : 'URL',
        category: ad.category,
        nativeConfig: ad.nativeConfig
      })))
    }

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

    // 이미지 URL 검증 (Base64 또는 일반 URL)
    if (imageUrl && imageUrl.startsWith('data:image/')) {
      // Base64 이미지 크기 검증 (약 3MB)
      const sizeInBytes = (imageUrl.length * 3) / 4
      if (sizeInBytes > 3 * 1024 * 1024) {
        return NextResponse.json(
          { error: '이미지 크기는 3MB 이하여야 합니다.' },
          { status: 400 }
        )
      }
    }

    // 데이터베이스에 삽입 - 기본값 설정
    const { data, error } = await supabase
      .from('ads')
      .insert([
        {
          title: title || '제목 없음',
          description: description || '설명 없음',
          image_url: imageUrl || '',
          link: link || 'https://example.com',
          category: category || 'creditStory',
          ad_type: adType || 'native',
          position: position || 'native',
          size: size || 'medium',
          is_active: true,
          click_count: 0,
          impressions: 0,
          created_at: new Date().toISOString(),
          expires_at: expiresAt || null,
          native_config: nativeConfig || { showEvery: 5, ctaText: '자세히보기', backgroundColor: '#f0f9ff' }
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

    console.log('✅ 광고 등록 성공:', {
      id: data[0].id,
      title: data[0].title,
      imageUrlLength: data[0].image_url?.length || 0,
      imageUrlType: data[0].image_url?.startsWith('data:image/') ? 'Base64' : 'URL',
      category: data[0].category,
      ad_type: data[0].ad_type,
      native_config: data[0].native_config
    })
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
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: '광고 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    console.log('🗑️ 광고 삭제 요청:', { id })

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

    console.log('✅ 광고 삭제 성공:', { id })
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