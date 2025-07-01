import { NextRequest, NextResponse } from 'next/server'
import { supabase, isDemoMode } from '@/lib/supabase'
import { generateNickname } from '@/lib/utils'

// IP 해시 생성 (서버사이드)
async function generateIPHash(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + process.env.HASH_SALT || 'default-salt-2024')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 클라이언트 IP 주소 가져오기
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const real = request.headers.get('x-real-ip')
  const remote = request.headers.get('x-vercel-forwarded-for')
  
  if (forwarded) return forwarded.split(',')[0].trim()
  if (real) return real
  if (remote) return remote
  return '127.0.0.1' // 로컬 개발용 기본값
}

// GET: 게시글 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    
    if (isDemoMode || !supabase) {
      console.log('📝 API: 데모 모드에서 게시글 조회')
      return NextResponse.json({
        success: true,
        data: [],
        message: '데모 모드입니다. 환경변수를 설정해주세요.'
      })
    }

    let query = supabase
      .from('posts')
      .select(`
        id,
        title,
        content,
        author_nickname,
        created_at,
        updated_at,
        like_count,
        comment_count,
        view_count,
        category_id,
        tags,
        images,
        is_hot,
        is_notice
      `)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    // 카테고리 필터
    if (categoryId) {
      query = query.eq('category_id', parseInt(categoryId))
    }

    // 검색 필터
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    // 페이징
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: posts, error, count } = await query

    if (error) {
      console.error('게시글 조회 오류:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: posts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('게시글 조회 예외:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 새 게시글 작성
export async function POST(request: NextRequest) {
  try {
    if (isDemoMode || !supabase) {
      return NextResponse.json({
        success: false,
        error: '데모 모드에서는 게시글을 작성할 수 없습니다. 환경변수를 설정해주세요.'
      }, { status: 400 })
    }

    const body = await request.json()
    const { title, content, category_id, tags, images } = body

    // 입력 검증
    if (!title || !content || !category_id) {
      return NextResponse.json(
        { success: false, error: '제목, 내용, 카테고리는 필수입니다.' },
        { status: 400 }
      )
    }

    if (title.length > 200) {
      return NextResponse.json(
        { success: false, error: '제목은 200자를 초과할 수 없습니다.' },
        { status: 400 }
      )
    }

    // IP 해시 및 닉네임 생성
    const clientIP = getClientIP(request)
    const ipHash = await generateIPHash(clientIP)
    const nickname = generateNickname()

    // 게시글 삽입
    const { data: newPost, error } = await supabase
      .from('posts')
      .insert([{
        title: title.trim(),
        content: content.trim(),
        category_id: parseInt(category_id),
        tags: tags || [],
        images: images || [],
        author_nickname: nickname,
        author_ip_hash: ipHash
      }])
      .select()
      .single()

    if (error) {
      console.error('게시글 작성 오류:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newPost,
      message: '게시글이 성공적으로 작성되었습니다.'
    })

  } catch (error) {
    console.error('게시글 작성 예외:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 