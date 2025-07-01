import { NextRequest, NextResponse } from 'next/server'
import { supabase, isDemoMode } from '@/lib/supabase'

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
  return '127.0.0.1'
}

// POST: 좋아요 토글
export async function POST(request: NextRequest) {
  try {
    if (isDemoMode || !supabase) {
      return NextResponse.json({
        success: false,
        error: '데모 모드에서는 좋아요 기능을 사용할 수 없습니다.'
      }, { status: 400 })
    }

    const body = await request.json()
    const { type, target_id } = body // type: 'post' | 'comment', target_id: 게시글 또는 댓글 ID

    // 입력 검증
    if (!type || !target_id || !['post', 'comment'].includes(type)) {
      return NextResponse.json(
        { success: false, error: '올바른 타입(post/comment)과 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // IP 해시 생성
    const clientIP = getClientIP(request)
    const ipHash = await generateIPHash(clientIP)

    const tableName = type === 'post' ? 'post_likes' : 'comment_likes'
    const fieldName = type === 'post' ? 'post_id' : 'comment_id'

    // 기존 좋아요 확인
    const { data: existingLike, error: checkError } = await supabase
      .from(tableName)
      .select('id')
      .eq(fieldName, parseInt(target_id))
      .eq('user_ip_hash', ipHash)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = No rows found
      console.error('좋아요 확인 오류:', checkError)
      return NextResponse.json(
        { success: false, error: checkError.message },
        { status: 500 }
      )
    }

    let isLiked = false

    if (existingLike) {
      // 좋아요 취소
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', existingLike.id)

      if (deleteError) {
        console.error('좋아요 취소 오류:', deleteError)
        return NextResponse.json(
          { success: false, error: deleteError.message },
          { status: 500 }
        )
      }

      // 카운트 감소
      if (type === 'post') {
        await supabase.rpc('decrement_post_like_count', { post_id: parseInt(target_id) })
      } else {
        await supabase.rpc('decrement_comment_like_count', { comment_id: parseInt(target_id) })
      }

      isLiked = false
    } else {
      // 좋아요 추가
      const likeData = {
        user_ip_hash: ipHash,
        [fieldName]: parseInt(target_id)
      }

      const { error: insertError } = await supabase
        .from(tableName)
        .insert([likeData])

      if (insertError) {
        console.error('좋아요 추가 오류:', insertError)
        return NextResponse.json(
          { success: false, error: insertError.message },
          { status: 500 }
        )
      }

      // 카운트 증가
      if (type === 'post') {
        await supabase.rpc('increment_post_like_count', { post_id: parseInt(target_id) })
      } else {
        await supabase.rpc('increment_comment_like_count', { comment_id: parseInt(target_id) })
      }

      isLiked = true
    }

    // 업데이트된 좋아요 수 조회
    const targetTable = type === 'post' ? 'posts' : 'comments'
    const { data: targetData, error: fetchError } = await supabase
      .from(targetTable)
      .select('like_count')
      .eq('id', parseInt(target_id))
      .single()

    if (fetchError) {
      console.error('좋아요 수 조회 오류:', fetchError)
    }

    return NextResponse.json({
      success: true,
      data: {
        isLiked,
        likeCount: targetData?.like_count || 0
      },
      message: isLiked ? '좋아요를 추가했습니다.' : '좋아요를 취소했습니다.'
    })

  } catch (error) {
    console.error('좋아요 처리 예외:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// GET: 좋아요 상태 확인
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const targetId = searchParams.get('target_id')

    if (!type || !targetId || !['post', 'comment'].includes(type)) {
      return NextResponse.json(
        { success: false, error: '올바른 타입(post/comment)과 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    if (isDemoMode || !supabase) {
      return NextResponse.json({
        success: true,
        data: { isLiked: false, likeCount: 0 }
      })
    }

    // IP 해시 생성
    const clientIP = getClientIP(request)
    const ipHash = await generateIPHash(clientIP)

    const tableName = type === 'post' ? 'post_likes' : 'comment_likes'
    const fieldName = type === 'post' ? 'post_id' : 'comment_id'

    // 좋아요 상태 확인
    const { data: existingLike, error } = await supabase
      .from(tableName)
      .select('id')
      .eq(fieldName, parseInt(targetId))
      .eq('user_ip_hash', ipHash)
      .single()

    const isLiked = !!existingLike && !error

    // 총 좋아요 수 조회
    const targetTable = type === 'post' ? 'posts' : 'comments'
    const { data: targetData } = await supabase
      .from(targetTable)
      .select('like_count')
      .eq('id', parseInt(targetId))
      .single()

    return NextResponse.json({
      success: true,
      data: {
        isLiked,
        likeCount: targetData?.like_count || 0
      }
    })

  } catch (error) {
    console.error('좋아요 상태 확인 예외:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 