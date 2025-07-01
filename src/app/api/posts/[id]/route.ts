import { NextRequest, NextResponse } from 'next/server'
import { supabase, isDemoMode } from '@/lib/supabase'

interface Props {
  params: Promise<{ id: string }>
}

// GET: 개별 게시글 조회
export async function GET(request: NextRequest, { params }: Props) {
  try {
    // Next.js 15: params는 Promise이므로 await 필요
    const { id } = await params
    const postId = parseInt(id)
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { success: false, error: '올바른 게시글 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    if (isDemoMode || !supabase) {
      console.log('📝 API: 데모 모드에서 개별 게시글 조회')
      // 1. localStorage에서 community-posts 데이터 읽기 (서버 환경에서는 불가하므로, 데모 데이터로 대체)
      // 2. postId에 맞는 데모 게시글 반환
      const demoPosts = [
        {
          id: 1,
          title: "API 연동 테스트 - 신용점수 200점 올린 성공 후기",
          content: "신용점수 200점 올린 실제 후기입니다. 연체 정리, 자동이체, 신용카드 패턴 개선 등 경험 공유.",
          author_nickname: "희망찬시작123",
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          like_count: 24,
          comment_count: 8,
          view_count: 156,
          category_id: 1,
          tags: ['신용점수', '신용회복', '성공사례', '팁'],
          images: [
            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop'
          ],
          is_hot: false,
          is_notice: false
        },
        {
          id: 2,
          title: "백엔드 완성! 개인회생 인가 결정",
          content: "개인회생 인가 결정받은 후기와 절차 공유합니다.",
          author_nickname: "용기있는도전456",
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          like_count: 12,
          comment_count: 3,
          view_count: 77,
          category_id: 2,
          tags: ['개인회생', '법원', '성공사례'],
          images: [],
          is_hot: false,
          is_notice: false
        }
      ];
      const post = demoPosts.find(p => p.id === postId) || null;
      return NextResponse.json({
        success: true,
        data: post,
        message: '데모 모드입니다. 환경변수를 설정해주세요.'
      });
    }

    // Supabase에서 개별 게시글 조회
    const { data: post, error } = await supabase
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
      .eq('id', postId)
      .eq('is_deleted', false)
      .single()

    if (error) {
      console.error('개별 게시글 조회 오류:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 조회수 증가
    await supabase
      .from('posts')
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq('id', postId)

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        view_count: (post.view_count || 0) + 1
      }
    })

  } catch (error) {
    console.error('개별 게시글 조회 예외:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 