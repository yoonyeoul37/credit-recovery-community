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

// GET: 댓글 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('post_id')
    
    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'post_id는 필수입니다.' },
        { status: 400 }
      )
    }

    if (isDemoMode || !supabase) {
      console.log('💬 API: 데모 모드에서 댓글 조회')
      return NextResponse.json({
        success: true,
        data: [],
        message: '데모 모드입니다. 환경변수를 설정해주세요.'
      })
    }

    // 댓글과 대댓글을 함께 조회
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        id,
        post_id,
        parent_id,
        content,
        author_nickname,
        like_count,
        created_at,
        updated_at
      `)
      .eq('post_id', parseInt(postId))
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('댓글 조회 오류:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // 댓글을 트리 구조로 정리
    const commentsTree = comments?.filter(comment => !comment.parent_id) || []
    const replies = comments?.filter(comment => comment.parent_id) || []

    commentsTree.forEach(comment => {
      comment.replies = replies.filter(reply => reply.parent_id === comment.id)
    })

    return NextResponse.json({
      success: true,
      data: commentsTree
    })

  } catch (error) {
    console.error('댓글 조회 예외:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 새 댓글/대댓글 작성
export async function POST(request: NextRequest) {
  try {
    if (isDemoMode || !supabase) {
      return NextResponse.json({
        success: false,
        error: '데모 모드에서는 댓글을 작성할 수 없습니다. 환경변수를 설정해주세요.'
      }, { status: 400 })
    }

    const body = await request.json()
    const { post_id, content, parent_id, author_nickname, author_ip_hash, password_hash } = body

    // 입력 검증
    if (!post_id || !content || !author_nickname || !author_ip_hash || !password_hash) {
      return NextResponse.json(
        { success: false, error: '모든 필수값이 필요합니다.' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { success: false, error: '댓글은 1000자를 초과할 수 없습니다.' },
        { status: 400 }
      )
    }

    // 댓글 삽입
    const { data: newComment, error } = await supabase
      .from('comments')
      .insert([{
        post_id: parseInt(post_id),
        parent_id: parent_id ? parseInt(parent_id) : null,
        content: content.trim(),
        author_nickname: author_nickname.trim(),
        author_ip_hash: author_ip_hash.trim(),
        password_hash: password_hash.trim()
      }])
      .select()
      .single()

    if (error) {
      console.error('댓글 작성 오류:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // 게시글의 댓글 수 업데이트
    await supabase.rpc('increment_comment_count', { post_id: parseInt(post_id) })

    return NextResponse.json({
      success: true,
      data: newComment,
      message: '댓글이 성공적으로 작성되었습니다.'
    })

  } catch (error) {
    console.error('댓글 작성 예외:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 