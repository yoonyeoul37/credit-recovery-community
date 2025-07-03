'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Heart, MessageCircle, Eye, Clock, User, Send, 
  ThumbsUp, Reply, MoreVertical, Flag, Share2, Edit3, Trash2, X, Image as LucideImage
} from 'lucide-react'
import Image from 'next/image'

interface Comment {
  id: number
  content: string
  user_nickname: string
  created_at: string
  likes_count: number
  like_count?: number  // API 호환성을 위해 추가
  replies: Comment[]
  is_liked?: boolean
}

interface Post {
  id: number
  title: string
  content: string
  user_nickname: string
  created_at: string
  updated_at: string
  like_count: number
  comment_count?: number   // API 호환성을 위해 추가
  comments_count: number
  view_count?: number      // API 호환성을 위해 추가
  views_count: number
  category: string
  tags: string[]
  images?: string[]
  is_liked?: boolean
}

interface PostDetailProps {
  postId: string
  category: string
  className?: string
}

// parseInt(postId) 사용 전 방어 코드 추가
function safeParsePostId(postId: string): number | null {
  if (!postId || isNaN(Number(postId)) || postId === 'NaN') {
    console.error('❌ 잘못된 postId:', postId)
    return null
  }
  return parseInt(postId)
}

// 하트(좋아요) 개수, 댓글 개수, 댓글 좋아요 개수 NaN 방어
function safeCount(val: any, fallback: string | number = 0) {
  return Number.isFinite(val) && !isNaN(val) ? val : fallback;
}

const PostDetail = ({ postId, category, className = '' }: PostDetailProps) => {
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentContent, setCommentContent] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [userNickname, setUserNickname] = useState('')
  const [commentPassword, setCommentPassword] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordAction, setPasswordAction] = useState<'edit' | 'delete' | null>(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  
  // 댓글 삭제 관련 state
  const [showCommentDeleteModal, setShowCommentDeleteModal] = useState(false)
  const [commentDeletePassword, setCommentDeletePassword] = useState('')
  const [commentDeleteError, setCommentDeleteError] = useState('')
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null)
  
  // 댓글 수정 관련 state
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const [showCommentEditModal, setShowCommentEditModal] = useState(false)
  const [commentEditPassword, setCommentEditPassword] = useState('')
  const [commentEditError, setCommentEditError] = useState('')
  
  // 북마크 관련 state
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  
  // 신고 관련 state
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDetail, setReportDetail] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  
  const router = useRouter()

  // 저장된 닉네임 불러오기 또는 자동 생성
  useEffect(() => {
    const generateNickname = () => {
      const adjectives = ['따뜻한', '희망찬', '용기있는', '지혜로운', '친근한', '성실한']
      const nouns = ['시작', '여행', '도전', '성장', '변화', '꿈']
      const numbers = Math.floor(Math.random() * 900) + 100
      return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${numbers}`
    }
    
    const savedNickname = localStorage.getItem('user-nickname')
    if (savedNickname) {
      setUserNickname(savedNickname)
    } else {
      setUserNickname(generateNickname())
    }
  }, [])

  // 댓글 로드 함수
  const loadComments = async (postId: number) => {
    try {
      console.log('💬 댓글 로딩 시작:', postId)
      
      // Supabase에서 댓글 로드 시도
      const { supabase } = await import('@/lib/supabase')
      
      const { data: supabaseComments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })
      
      if (error) {
        console.warn('⚠️ Supabase 댓글 로딩 실패 - 로컬 데이터 사용')
        console.log('📝 오류 정보:', {
          message: error?.message || '네트워크 연결 문제',
          code: error?.code || 'NETWORK_ERROR',
          info: '로컬 환경에서는 정상적인 현상입니다'
        })
        
        // 로컬 백업 데이터 로드
        loadLocalComments(postId)
        return
      }
      
      if (supabaseComments && supabaseComments.length > 0) {
        console.log('✅ Supabase 댓글 로딩 성공:', supabaseComments.length, '개', supabaseComments)
        
        // Supabase 댓글을 Comment 형태로 변환
        const formattedComments: Comment[] = supabaseComments
          .filter(comment => !comment.parent_id) // 최상위 댓글만
          .map(comment => ({
            id: comment.id,
            content: comment.content,
            user_nickname: comment.author_nickname,
            created_at: comment.created_at,
            likes_count: comment.like_count || 0,
            like_count: comment.like_count || 0,
            replies: supabaseComments
              .filter(reply => reply.parent_id === comment.id)
              .map(reply => ({
                id: reply.id,
                content: reply.content,
                user_nickname: reply.author_nickname,
                created_at: reply.created_at,
                likes_count: reply.like_count || 0,
                like_count: reply.like_count || 0,
                replies: []
              }))
          }))
        
        setComments(formattedComments)
      } else {
        console.log('📋 Supabase 댓글 없음 - 로컬 데이터 사용')
        loadLocalComments(postId)
      }
      
    } catch (error) {
      console.warn('⚠️ 댓글 로딩 완전 실패 - 로컬 데이터 사용')
      console.log('📝 예외 정보:', {
        name: error instanceof Error ? error.name : 'NetworkError',
        message: error instanceof Error ? error.message : 'Failed to fetch',
        info: '네트워크 연결 문제로 인한 현상일 수 있습니다'
      })
      loadLocalComments(postId)
    }
  }

  // 로컬 댓글 데이터 로드
  const loadLocalComments = (postId: number) => {
    // 로컬 스토리지에서 댓글 데이터 찾기
    const savedComments = JSON.parse(localStorage.getItem(`comments-${postId}`) || '[]')
    
    if (savedComments.length > 0) {
      console.log('📱 로컬 댓글 데이터 로드:', savedComments.length, '개')
      setComments(savedComments)
      return
    }
    
    // 댓글이 없으면 빈 배열로 설정
    console.log('📝 댓글이 없습니다')
    setComments([])
  }

  // 실제 저장된 글 + 데모 데이터 로드
  useEffect(() => {
    const loadPost = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();
        if (data) {
          setPost(data);
          setLoading(false);
          return;
        }
      } catch (e) {
        // 무시하고 기존 로컬/데모 데이터 로직 실행
      }
      // 기존 로컬/데모 데이터 로직
      const loadData = async () => {
        console.log('📖 게시글 및 댓글 로딩 시작:', postId)
        
        // 🚀 로컬 스토리지에서 실제 저장된 글 찾기
        const savedPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
        const savedPost = savedPosts.find((p: any) => p.id.toString() === postId)
        
        if (savedPost) {
          // 실제 저장된 글 사용
          const realPost: Post = {
            id: savedPost.id,
            title: savedPost.title,
            content: savedPost.content,
            user_nickname: savedPost.user_nickname || savedPost.author_nickname,
            created_at: savedPost.created_at,
            updated_at: savedPost.created_at,
            like_count: savedPost.like_count || 0,
            comment_count: savedPost.comment_count || 0,
            comments_count: savedPost.comments_count || 0,
            view_count: savedPost.view_count || 0,
            views_count: savedPost.views_count || 0,
            category,
            tags: savedPost.tags || [],
            images: savedPost.images || [],
            is_liked: false
          }
          
          setPost(realPost)
          // 실제 댓글 로드
          const safeId = safeParsePostId(postId)
          if (safeId !== null) await loadComments(safeId)
          setLoading(false)
          return
        }
        
        // 저장된 글이 없으면 데모 데이터 사용
        const demoPost: Post = {
          id: parseInt(postId),
          title: "신용점수 200점 올린 후기 공유합니다",
          content: `안녕하세요. 6개월 전 신용점수가 400점대였던 절망적인 상황에서 드디어 600점대까지 올렸습니다. 

같은 상황에 계신 분들께 도움이 되길 바라며 제 경험을 공유드립니다.

**1. 연체 기록 정리**
가장 먼저 한 일은 모든 연체 기록을 정리하는 것이었습니다. 작은 금액이라도 연체된 것들을 모두 찾아서 납부했어요.

**2. 자동이체 설정**
실수로 연체하는 일이 없도록 모든 고정비를 자동이체로 설정했습니다. 

**3. 신용카드 사용 패턴 개선**
- 사용한 즉시 바로 결제
- 한도의 30% 이내로만 사용
- 무분별한 현금서비스 금지

**4. 꾸준한 모니터링**
매월 신용점수를 확인하며 변화를 추적했습니다.

처음엔 변화가 없어서 포기하고 싶었지만, 3개월 차부터 조금씩 오르기 시작했어요. 

여러분도 포기하지 마시고 꾸준히 하시면 분명 좋은 결과가 있을 거예요! 💪`,
          user_nickname: "희망찬시작123",
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          like_count: 24,
          comment_count: 8,
          comments_count: 8,
          view_count: 156,
          views_count: 156,
          category,
          tags: ['신용점수', '신용회복', '성공사례', '팁'],
          images: [
            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop'
          ],
          is_liked: false
        }

        setPost(demoPost)
        const safeId = safeParsePostId(postId)
        if (safeId !== null) await loadComments(safeId)
        setLoading(false)
      }

      loadData()
    };
    loadPost();
  }, [postId, category]);

  // 게시글이 로드된 후 북마크 상태 확인 및 조회수 증가
  useEffect(() => {
    if (post) {
      checkBookmarkStatus()
      
      // 조회수 증가 (한 번만 실행되도록 중복 방지)
      const viewedPosts = JSON.parse(localStorage.getItem('viewed-posts') || '[]')
      const sessionKey = `viewed-${post.id}-${Date.now().toString().slice(0, -6)}` // 시간 기반 세션
      
      if (!viewedPosts.includes(sessionKey)) {
        incrementViewCount(post.id.toString())
        viewedPosts.push(sessionKey)
        
        // 오래된 세션 키 정리 (10개만 유지)
        if (viewedPosts.length > 10) {
          viewedPosts.splice(0, viewedPosts.length - 10)
        }
        
        localStorage.setItem('viewed-posts', JSON.stringify(viewedPosts))
      }
    }
  }, [post?.id]) // post.id가 변경될 때만 실행

  // 메뉴 드롭다운 외부 클릭시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showMenu) {
        setShowMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMenu])

  // comments가 undefined/null이 되는 모든 상황을 방어
  useEffect(() => {
    if (!comments || !Array.isArray(comments)) setComments([])
  }, [comments])

  // 컴포넌트 마운트 시 댓글 무조건 로드
  useEffect(() => {
    if (postId) {
      console.log('🚩 컴포넌트 마운트/새로고침: 댓글 로드 시도', postId)
      const safeId = safeParsePostId(postId)
      if (safeId !== null) loadComments(safeId)
    } else {
      console.warn('❗ postId가 undefined임')
    }
  }, [postId])

  // 게시글 로드 시 is_liked 상태 localStorage 반영
  useEffect(() => {
    if (post) {
      const likedPosts = JSON.parse(localStorage.getItem('liked-posts') || '[]');
      setPost(p => p ? { ...p, is_liked: likedPosts.includes(p.id) } : p);
    }
  }, [postId, post?.id]);

  const getCategoryInfo = (cat: string) => {
    const categories: { [key: string]: { name: string; color: string; icon: string } } = {
      'credit-story': { name: '신용이야기', color: 'blue', icon: '💳' },
      'personal-recovery': { name: '개인회생', color: 'green', icon: '🔄' },
      'corporate-recovery': { name: '법인회생', color: 'purple', icon: '🏢' },
      'loan-story': { name: '대출이야기', color: 'orange', icon: '💰' },
      'success-story': { name: '성공사례', color: 'emerald', icon: '⭐' }
    }
    return categories[cat] || categories['credit-story']
  }

  const categoryInfo = getCategoryInfo(category)

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    return `${days}일 전`
  }

  // 좋아요(하트) 서버 반영
  const handleLike = async () => {
    if (!post) return;
    const likedPosts = JSON.parse(localStorage.getItem('liked-posts') || '[]');
    const hasLiked = likedPosts.includes(post.id);
    const { supabase } = await import('@/lib/supabase');
    const newLikesCount = hasLiked ? post.like_count - 1 : post.like_count + 1;
    const { error } = await supabase
      .from('posts')
      .update({ like_count: newLikesCount })
      .eq('id', post.id);
    if (!error) {
      let updatedLikedPosts;
      if (hasLiked) {
        updatedLikedPosts = likedPosts.filter((id: number) => id !== post.id);
      } else {
        updatedLikedPosts = [...likedPosts, post.id];
      }
      localStorage.setItem('liked-posts', JSON.stringify(updatedLikedPosts));
      const { data: updatedPost } = await supabase
        .from('posts')
        .select('*')
        .eq('id', post.id)
        .single();
      if (updatedPost) {
        setPost({ ...updatedPost, is_liked: !hasLiked });
      }
    }
  };

  // 북마크 상태 확인
  const checkBookmarkStatus = () => {
    if (!post) return

    const bookmarks = JSON.parse(localStorage.getItem('user-bookmarks') || '[]')
    const isAlreadyBookmarked = bookmarks.some((bookmark: any) => bookmark.id === post.id)
    setIsBookmarked(isAlreadyBookmarked)
  }

  // 북마크 토글
  const handleBookmark = async () => {
    if (!post || bookmarkLoading) return

    setBookmarkLoading(true)
    
    try {
      const bookmarks = JSON.parse(localStorage.getItem('user-bookmarks') || '[]')
      
      if (isBookmarked) {
        // 북마크 제거
        const updatedBookmarks = bookmarks.filter((bookmark: any) => bookmark.id !== post.id)
        localStorage.setItem('user-bookmarks', JSON.stringify(updatedBookmarks))
        setIsBookmarked(false)
        console.log('🔖 북마크 제거 완료')
      } else {
        // 북마크 추가
        const bookmarkData = {
          id: post.id,
          title: post.title,
          content: post.content.substring(0, 200) + '...',
          category: post.category,
          author: post.user_nickname,
          created_at: post.created_at,
          like_count: post.like_count,
          comments_count: post.comments_count,
          tags: post.tags,
          bookmarked_at: new Date().toISOString()
        }
        
        const updatedBookmarks = [bookmarkData, ...bookmarks]
        localStorage.setItem('user-bookmarks', JSON.stringify(updatedBookmarks))
        setIsBookmarked(true)
        console.log('🔖 북마크 추가 완료')
      }
      
      // 부드러운 애니메이션을 위한 딜레이
      await new Promise(resolve => setTimeout(resolve, 300))
      
    } catch (error) {
      console.error('❌ 북마크 처리 실패:', error)
    } finally {
      setBookmarkLoading(false)
    }
  }

  // 신고 처리
  const handleReport = () => {
    setShowReportModal(true)
  }

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      alert('신고 사유를 선택해주세요')
      return
    }

    setReportLoading(true)
    
    try {
      const reportData = {
        post_id: post?.id,
        post_title: post?.title,
        post_author: post?.user_nickname,
        report_reason: reportReason,
        report_detail: reportDetail.trim(),
        reported_at: new Date().toISOString(),
        reporter_ip: `user_${Date.now()}`,
        status: 'pending'
      }

      // 로컬 스토리지에 신고 내역 저장
      const reports = JSON.parse(localStorage.getItem('user-reports') || '[]')
      reports.unshift(reportData)
      localStorage.setItem('user-reports', JSON.stringify(reports))

      // 관리자용 신고 목록에도 저장
      const adminReports = JSON.parse(localStorage.getItem('admin-reports') || '[]')
      adminReports.unshift({ ...reportData, id: Date.now() })
      localStorage.setItem('admin-reports', JSON.stringify(adminReports))

      console.log('🚨 신고 접수 완료:', reportData)
      
      alert('신고가 접수되었습니다. 검토 후 적절한 조치를 취하겠습니다.')
      closeReportModal()
      
    } catch (error) {
      console.error('❌ 신고 처리 실패:', error)
      alert('신고 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setReportLoading(false)
    }
  }

  const closeReportModal = () => {
    setShowReportModal(false)
    setReportReason('')
    setReportDetail('')
    setReportLoading(false)
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // 필수값 체크 강화
    if (
      !commentContent.trim() ||
      !userNickname.trim() ||
      !commentPassword.trim() ||
      !postId ||
      isNaN(parseInt(postId)) ||
      parseInt(postId) === 0
    ) {
      alert('모든 필드를 올바르게 입력해주세요. (게시글 번호, 닉네임, 비밀번호, 내용)');
      return;
    }

    console.log('💬 댓글 작성 시작')

    // 닉네임 저장
    localStorage.setItem('user-nickname', userNickname.trim())

    const commentData = {
      post_id: parseInt(postId),
      content: commentContent.trim(),
      author_nickname: userNickname.trim(),
      author_ip_hash: `user_${Date.now()}`,
      password_hash: commentPassword.trim(),
      like_count: 0
    }

    try {
      // Supabase에 댓글 저장 시도
      const { supabase } = await import('@/lib/supabase')
      
      const { data, error } = await supabase
        .from('comments')
        .insert([commentData])
        .select()
      
      if (error) {
        console.warn('⚠️ Supabase 댓글 저장 실패 - 로컬 저장으로 전환')
        console.log('📝 오류 정보:', {
          message: error?.message || '네트워크 연결 문제',
          code: error?.code || 'NETWORK_ERROR',
          info: '로컬 환경에서는 정상적인 현상입니다'
        })
        // 로컬 백업 저장
        saveCommentLocally(commentData)
      } else {
        console.log('✅ Supabase 댓글 저장 성공:', data)
        // insert 결과를 state에 직접 추가하지 않고, DB에서 최신 목록을 반드시 다시 불러옴
        const safeId = safeParsePostId(postId)
        if (safeId !== null) await loadComments(safeId)
        setTimeout(() => {
          const safeId = safeParsePostId(postId)
          if (safeId !== null) loadComments(safeId)
        }, 200);
        // 게시글 정보 새로고침 (댓글 수 포함)
        if (post && post.id) {
          const { data: updatedPost, error: postError } = await supabase
            .from('posts')
            .select('*')
            .eq('id', post.id)
            .single()
          if (!postError && updatedPost) {
            setPost({ ...updatedPost, comment_count: updatedPost.comment_count })
          }
        }
      }
      
    } catch (error) {
      console.warn('⚠️ 댓글 저장 완전 실패 - 로컬 저장으로 전환')
      console.log('📝 예외 정보:', {
        name: error instanceof Error ? error.name : 'NetworkError',
        message: error instanceof Error ? error.message : 'Failed to fetch',
        info: '네트워크 연결 문제로 인한 현상일 수 있습니다'
      })
      
      // 로컬 백업 저장
      saveCommentLocally(commentData)
    }

    // 폼 초기화
    setCommentContent('')
    setCommentPassword('')
  }

  // 로컬 댓글 저장
  const saveCommentLocally = (commentData: any) => {
    const newComment: Comment = {
      id: Date.now(),
      content: commentData.content,
      user_nickname: commentData.author_nickname,
      created_at: new Date().toISOString(),
      likes_count: 0,
      like_count: 0,
      replies: []
    }

    const updatedComments = [...comments, newComment]
    setComments(updatedComments)
    
    // 로컬 스토리지에 저장
    localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedComments))
    
    if (post) {
      const currentCommentCount = getCommentCount(post);
      setPost({ 
        ...post, 
        comment_count: currentCommentCount + 1,
        comments_count: currentCommentCount + 1
      })
    }
    
    console.log('�� 로컬 댓글 저장 완료')
  }

  const handleReplySubmit = async (parentId: number) => {
    if (!replyContent.trim()) return

    console.log('💬 대댓글 작성 시작')

    const replyData = {
      post_id: parseInt(postId),
      parent_id: parentId,
      content: replyContent.trim(),
      author_nickname: userNickname,
      author_ip_hash: `user_${Date.now()}`,
      password_hash: `reply_${Date.now()}`,
      like_count: 0
    }

    try {
      // Supabase에 대댓글 저장 시도
      const { supabase } = await import('@/lib/supabase')
      
      const { data, error } = await supabase
        .from('comments')
        .insert([replyData])
        .select()
      
      if (error) {
        console.warn('⚠️ Supabase 대댓글 저장 실패 - 로컬 저장으로 전환')
        console.log('📝 오류 정보:', {
          message: error?.message || '네트워크 연결 문제',
          code: error?.code || 'NETWORK_ERROR',
          info: '로컬 환경에서는 정상적인 현상입니다'
        })
        
        // 로컬 백업 저장
        saveReplyLocally(replyData, parentId)
      } else {
        console.log('✅ Supabase 대댓글 저장 성공:', data)
        
        // 댓글 카운트 증가
        if (post && post.id) {
          await supabase
            .from('posts')
            .update({ comment_count: (post.comment_count || 0) + 1 })
            .eq('id', post.id)
        }
        // 성공 시 댓글 목록 새로고침
        const safeId = safeParsePostId(postId)
        if (safeId !== null) await loadComments(safeId)
      }
      
    } catch (error) {
      console.warn('⚠️ 대댓글 저장 완전 실패 - 로컬 저장으로 전환')
      console.log('📝 예외 정보:', {
        name: error instanceof Error ? error.name : 'NetworkError',
        message: error instanceof Error ? error.message : 'Failed to fetch',
        info: '네트워크 연결 문제로 인한 현상일 수 있습니다'
      })
      
      // 로컬 백업 저장
      saveReplyLocally(replyData, parentId)
    }

    // 답글 폼 초기화 및 숨기기
    setReplyContent('')
    setReplyingTo(null)
  }

  // 로컬 대댓글 저장
  const saveReplyLocally = (replyData: any, parentId: number) => {
    const newReply: Comment = {
      id: Date.now(),
      content: replyData.content,
      user_nickname: replyData.author_nickname,
      created_at: new Date().toISOString(),
      likes_count: 0,
      like_count: 0,
      replies: []
    }

    const updatedComments = comments.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...comment.replies, newReply] }
        : comment
    )

    setComments(updatedComments)
    
    // 로컬 스토리지에 저장
    localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedComments))
    
    if (post) {
      const currentCommentCount = getCommentCount(post);
      setPost({ 
        ...post, 
        comment_count: currentCommentCount + 1,
        comments_count: currentCommentCount + 1
      })
    }
    
    console.log('📱 로컬 대댓글 저장 완료')
  }

  // 댓글 좋아요 토글
  const handleCommentLike = async (commentId: number) => {
    const likedComments = getLikedComments();
    if (likedComments.includes(commentId)) {
      alert('이미 추천하셨습니다!');
      return;
    }
    console.log('👍 댓글 좋아요 토글:', commentId)

    try {
      // Supabase에 좋아요 업데이트 시도
      const { supabase } = await import('@/lib/supabase')
      
      // 현재 댓글 좋아요 수 가져오기
      const { data: currentComment, error: fetchError } = await supabase
        .from('comments')
        .select('like_count')
        .eq('id', commentId)
        .single()
      
      if (fetchError) {
        console.warn('⚠️ Supabase 댓글 조회 실패 - 로컬 처리')
        updateCommentLikeLocally(commentId)
        return
      }
      
      const newLikeCount = (currentComment.like_count || 0) + 1
      
      const { error: updateError } = await supabase
        .from('comments')
        .update({ like_count: newLikeCount })
        .eq('id', commentId)
      
      if (updateError) {
        console.warn('⚠️ Supabase 좋아요 업데이트 실패 - 로컬 처리')
        updateCommentLikeLocally(commentId)
      } else {
        setLikedComments([...likedComments, commentId]);
        console.log('✅ Supabase 댓글 좋아요 업데이트 성공')
        
        // 댓글 목록 새로고침
        const safeId = safeParsePostId(postId)
        if (safeId !== null) await loadComments(safeId)
      }
      
    } catch (error) {
      console.warn('⚠️ 댓글 좋아요 완전 실패 - 로컬 처리')
      updateCommentLikeLocally(commentId)
    }
  }

  // 로컬 댓글 좋아요 업데이트
  const updateCommentLikeLocally = (commentId: number) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return { 
          ...comment, 
          likes_count: getCommentLikeCount(comment) + 1,
          like_count: getCommentLikeCount(comment) + 1 
        }
      }
      // 대댓글 체크
      if (comment.replies.length > 0) {
        const updatedReplies = comment.replies.map(reply => 
          reply.id === commentId 
            ? { 
                ...reply, 
                likes_count: getCommentLikeCount(reply) + 1,
                like_count: getCommentLikeCount(reply) + 1 
              }
            : reply
        )
        return { ...comment, replies: updatedReplies }
      }
      return comment
    })

    setComments(updatedComments)
    
    // 로컬 스토리지에 저장
    localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedComments))
    
    console.log('📱 로컬 댓글 좋아요 업데이트 완료')
  }

  // 댓글 삭제 요청
  const handleCommentDelete = (commentId: number) => {
    setDeletingCommentId(commentId)
    setShowCommentDeleteModal(true)
    setCommentDeletePassword('')
    setCommentDeleteError('')
  }

  // 댓글 삭제 확인 및 실행
  const handleCommentDeleteConfirm = async () => {
    if (!commentDeletePassword.trim()) {
      setCommentDeleteError('비밀번호를 입력해주세요')
      return
    }

    if (commentDeletePassword.length !== 4 || !/^\d{4}$/.test(commentDeletePassword)) {
      setCommentDeleteError('4자리 숫자를 입력해주세요')
      return
    }

    if (!deletingCommentId) return

    console.log('🗑️ 댓글 삭제 시작:', deletingCommentId)

    try {
      // Supabase에서 댓글 삭제 (soft delete)
      const { supabase } = await import('@/lib/supabase')
      
      const { error } = await supabase
        .from('comments')
        .update({ is_deleted: true })
        .eq('id', deletingCommentId)
        .eq('password_hash', commentDeletePassword.trim())
      
      if (error) {
        console.warn('⚠️ Supabase 댓글 삭제 실패 - 로컬 삭제로 전환')
        console.log('📝 오류 정보:', {
          message: error?.message || '네트워크 연결 문제',
          code: error?.code || 'NETWORK_ERROR',
          info: '로컬 환경에서는 정상적인 현상입니다'
        })
        
        // 로컬 백업 삭제
        deleteCommentLocally(deletingCommentId)
      } else {
        console.log('✅ Supabase 댓글 삭제 성공')
        
        // 댓글 카운트 감소
        if (post && post.id) {
          await supabase
            .from('posts')
            .update({ comment_count: (post.comment_count || 1) - 1 })
            .eq('id', post.id)
        }
        // 성공 시 댓글 목록 새로고침
        const safeId = safeParsePostId(postId)
        if (safeId !== null) await loadComments(safeId)
      }
      
    } catch (error) {
      console.warn('⚠️ 댓글 삭제 완전 실패 - 로컬 삭제로 전환')
      console.log('📝 예외 정보:', {
        name: error instanceof Error ? error.name : 'NetworkError',
        message: error instanceof Error ? error.message : 'Failed to fetch',
        info: '네트워크 연결 문제로 인한 현상일 수 있습니다'
      })
      
      // 로컬 백업 삭제
      deleteCommentLocally(deletingCommentId)
    }

    // 모달 닫기
    closeCommentDeleteModal()
  }

  // 로컬 댓글 삭제
  const deleteCommentLocally = (commentId: number) => {
    // 비밀번호 확인 (데모용으로 간단히 처리)
    // 실제로는 서버에서 확인해야 함
    const isValidPassword = commentDeletePassword === '1234' // 데모용 비밀번호

    if (!isValidPassword) {
      setCommentDeleteError('비밀번호가 일치하지 않습니다')
      return
    }

    const updatedComments = comments.map(comment => {
      // 최상위 댓글 삭제
      if (comment.id === commentId) {
        return { ...comment, content: '삭제된 댓글입니다', user_nickname: '삭제됨' }
      }
      
      // 대댓글 삭제
      if (comment.replies.length > 0) {
        const updatedReplies = comment.replies.map(reply => 
          reply.id === commentId 
            ? { ...reply, content: '삭제된 댓글입니다', user_nickname: '삭제됨' }
            : reply
        )
        return { ...comment, replies: updatedReplies }
      }
      
      return comment
    })

    setComments(updatedComments)
    
    // 로컬 스토리지에 저장
    localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedComments))
    
    console.log('📱 로컬 댓글 삭제 완료')
  }

  // 댓글 삭제 모달 닫기
  const closeCommentDeleteModal = () => {
    setShowCommentDeleteModal(false)
    setCommentDeletePassword('')
    setCommentDeleteError('')
    setDeletingCommentId(null)
  }

  // 댓글 수정 요청
  const handleCommentEdit = (commentId: number) => {
    // 현재 댓글 내용 찾기
    const findComment = (comments: Comment[], id: number): string | null => {
      for (const comment of comments) {
        if (comment.id === id) {
          return comment.content
        }
        for (const reply of comment.replies) {
          if (reply.id === id) {
            return reply.content
          }
        }
      }
      return null
    }

    const currentContent = findComment(comments, commentId)
    if (currentContent) {
      setEditingCommentId(commentId)
      setEditingContent(currentContent)
      setShowCommentEditModal(true)
      setCommentEditPassword('')
      setCommentEditError('')
    }
  }

  // 댓글 수정 확인 및 실행
  const handleCommentEditConfirm = async () => {
    if (!commentEditPassword.trim()) {
      setCommentEditError('비밀번호를 입력해주세요')
      return
    }

    if (commentEditPassword.length !== 4 || !/^\d{4}$/.test(commentEditPassword)) {
      setCommentEditError('4자리 숫자를 입력해주세요')
      return
    }

    if (!editingCommentId || !editingContent.trim()) {
      setCommentEditError('수정할 내용을 입력해주세요')
      return
    }

    console.log('✏️ 댓글 수정 시작:', editingCommentId)

    try {
      // Supabase에서 댓글 수정
      const { supabase } = await import('@/lib/supabase')
      
      const { error } = await supabase
        .from('comments')
        .update({ 
          content: editingContent.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', editingCommentId)
        .eq('password_hash', commentEditPassword.trim())
      
      if (error) {
        console.warn('⚠️ Supabase 댓글 수정 실패 - 로컬 수정으로 전환')
        console.log('📝 오류 정보:', {
          message: error?.message || '네트워크 연결 문제',
          code: error?.code || 'NETWORK_ERROR',
          info: '로컬 환경에서는 정상적인 현상입니다'
        })
        
        // 로컬 백업 수정
        editCommentLocally(editingCommentId, editingContent.trim())
      } else {
        console.log('✅ Supabase 댓글 수정 성공')
        
        // 성공 시 댓글 목록 새로고침
        const safeId = safeParsePostId(postId)
        if (safeId !== null) await loadComments(safeId)
      }
      
    } catch (error) {
      console.warn('⚠️ 댓글 수정 완전 실패 - 로컬 수정으로 전환')
      console.log('📝 예외 정보:', {
        name: error instanceof Error ? error.name : 'NetworkError',
        message: error instanceof Error ? error.message : 'Failed to fetch',
        info: '네트워크 연결 문제로 인한 현상일 수 있습니다'
      })
      
      // 로컬 백업 수정
      editCommentLocally(editingCommentId, editingContent.trim())
    }

    // 모달 닫기
    closeCommentEditModal()
  }

  // 로컬 댓글 수정
  const editCommentLocally = (commentId: number, newContent: string) => {
    // 비밀번호 확인 (데모용으로 간단히 처리)
    const isValidPassword = commentEditPassword === '1234' // 데모용 비밀번호

    if (!isValidPassword) {
      setCommentEditError('비밀번호가 일치하지 않습니다')
      return
    }

    const updatedComments = comments.map(comment => {
      // 최상위 댓글 수정
      if (comment.id === commentId) {
        return { ...comment, content: newContent }
      }
      
      // 대댓글 수정
      if (comment.replies.length > 0) {
        const updatedReplies = comment.replies.map(reply => 
          reply.id === commentId 
            ? { ...reply, content: newContent }
            : reply
        )
        return { ...comment, replies: updatedReplies }
      }
      
      return comment
    })

    setComments(updatedComments)
    
    // 로컬 스토리지에 저장
    localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedComments))
    
    console.log('📱 로컬 댓글 수정 완료')
  }

  // 댓글 수정 모달 닫기
  const closeCommentEditModal = () => {
    setShowCommentEditModal(false)
    setEditingCommentId(null)
    setEditingContent('')
    setCommentEditPassword('')
    setCommentEditError('')
  }

  const handleEdit = () => {
    setPasswordAction('edit')
    setShowPasswordModal(true)
    setShowMenu(false)
  }

  const handleDelete = () => {
    setPasswordAction('delete')
    setShowPasswordModal(true)
    setShowMenu(false)
  }

  const handlePasswordSubmit = () => {
    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요')
      return
    }

    if (password.length !== 4 || !/^\d{4}$/.test(password)) {
      setPasswordError('4자리 숫자를 입력해주세요')
      return
    }

    // 실제로는 서버에서 비밀번호 확인
    // 지금은 데모용으로 1234로 설정
    if (password !== '1234') {
      setPasswordError('비밀번호가 일치하지 않습니다')
      return
    }

    if (passwordAction === 'edit') {
      // 수정 페이지로 이동
      router.push(`/write?category=${category}&edit=${postId}`)
    } else if (passwordAction === 'delete') {
      // 삭제 처리
      if (confirm('정말로 삭제하시겠습니까?')) {
        alert('게시글이 삭제되었습니다')
        router.push(`/${category}`)
      }
    }

    setShowPasswordModal(false)
    setPassword('')
    setPasswordError('')
  }

  const closePasswordModal = () => {
    setShowPasswordModal(false)
    setPassword('')
    setPasswordError('')
    setPasswordAction(null)
  }

  // 댓글 좋아요(엄지) 중복 방지: localStorage liked-comments
  const getLikedComments = () => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('liked-comments') || '[]');
    } catch {
      return [];
    }
  };
  const setLikedComments = (arr: number[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('liked-comments', JSON.stringify(arr));
  };

  // 데이터 필드명 통일을 위한 헬퍼 함수들
  const getCommentCount = (post: Post) => {
    return post.comment_count || post.comments_count || 0;
  }

  const getViewCount = (post: Post) => {
    return post.view_count || post.views_count || 0;
  }

  const getCommentLikeCount = (comment: Comment) => {
    return comment.like_count || comment.likes_count || 0;
  }

  // 조회수 증가 함수
  const incrementViewCount = async (postId: string) => {
    try {
      console.log('👀 조회수 증가 시작:', postId)
      
      // Supabase에 조회수 증가 시도
      const { supabase } = await import('@/lib/supabase')
      
      const { data: currentPost, error: fetchError } = await supabase
        .from('posts')
        .select('view_count')
        .eq('id', postId)
        .single()
      
      if (!fetchError && currentPost) {
        const newViewCount = (currentPost.view_count || 0) + 1
        
        const { error: updateError } = await supabase
          .from('posts')
          .update({ view_count: newViewCount })
          .eq('id', postId)
        
        if (!updateError) {
          console.log('✅ Supabase 조회수 업데이트 성공:', newViewCount)
          
          // 현재 post state 업데이트
          if (post) {
            setPost({ 
              ...post, 
              view_count: newViewCount,
              views_count: newViewCount 
            })
          }
          return
        }
      }
      
      console.warn('⚠️ Supabase 조회수 업데이트 실패 - 로컬 처리')
      incrementViewCountLocally(postId)
      
    } catch (error) {
      console.warn('⚠️ 조회수 증가 완전 실패 - 로컬 처리')
      incrementViewCountLocally(postId)
    }
  }

  // 로컬 조회수 증가
  const incrementViewCountLocally = (postId: string) => {
    try {
      // 로컬스토리지의 게시글 목록 업데이트
      const savedPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
      const updatedPosts = savedPosts.map((p: any) => 
        p.id.toString() === postId 
          ? { 
              ...p, 
              view_count: (p.view_count || 0) + 1,
              views_count: (p.views_count || 0) + 1
            }
          : p
      )
      localStorage.setItem('community-posts', JSON.stringify(updatedPosts))
      
      // 현재 post state 업데이트
      if (post) {
        const currentViewCount = getViewCount(post)
        setPost({ 
          ...post, 
          view_count: currentViewCount + 1,
          views_count: currentViewCount + 1
        })
      }
      
      console.log('📱 로컬 조회수 증가 완료')
    } catch (error) {
      console.error('❌ 로컬 조회수 증가 실패:', error)
    }
  }

  if (loading) {
    return (
      <div className={`max-w-4xl mx-auto ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">게시글을 찾을 수 없습니다.</p>
        <Link href={`/${category}`} className="text-blue-600 hover:underline mt-2 inline-block">
          목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* 네비게이션 */}
      <div className="mb-6">
        <Link
          href={`/${category}`}
          className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {categoryInfo.name}로 돌아가기
        </Link>
      </div>

      {/* 게시글 */}
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        {/* 게시글 헤더 */}
        <div className="p-6 border-b border-gray-100 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-lg">{categoryInfo.icon}</span>
            <span className={`text-sm font-medium text-${categoryInfo.color}-700 bg-${categoryInfo.color}-100 px-2 py-1 rounded-full`}>
              {categoryInfo.name}
            </span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight text-center">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span className="font-medium text-green-700">💚 {post.user_nickname}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatTimeAgo(post.created_at)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{getViewCount(post)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{safeCount(getCommentCount(post), 0)}개</span>
              </div>
            </div>
          </div>
        </div>

        {/* 게시글 내용 */}
        <div className="p-6">
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* 이미지 갤러리 - 내용 바로 아래 */}
          {post.images && post.images.length > 0 && (
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(post.images.filter(url => url && url.startsWith('http'))).map((image, index) => {
                  const safeUrl = encodeURI(image);
                  console.log('상세 이미지 src:', safeUrl);
                  return (
                    <div key={index} className="relative group cursor-pointer">
                      <div
                        style={{ 
                          width: '100%', 
                          height: '300px',
                          backgroundImage: `url("${safeUrl}")`,
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          backgroundColor: '#f9fafb',
                          borderRadius: '12px',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                          minHeight: '200px',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          window.open(safeUrl, '_blank')
                        }}
                        title={`게시글 이미지 ${index + 1} - 클릭하여 크게 보기`}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <LucideImage className="w-8 h-8 text-white drop-shadow-lg" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* 태그 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className={`bg-${categoryInfo.color}-50 text-${categoryInfo.color}-700 px-3 py-1 rounded-full text-sm hover:bg-${categoryInfo.color}-100 cursor-pointer transition-colors`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 게시글 액션 */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  post.is_liked 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
                <span>{safeCount(post.like_count, 0)}</span>
              </button>
              
              <button
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isBookmarked 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isBookmarked ? '북마크에서 제거' : '북마크에 추가'}
              >
                <svg 
                  className={`w-4 h-4 transition-all ${isBookmarked ? 'fill-current' : ''} ${bookmarkLoading ? 'animate-pulse' : ''}`} 
                  fill={isBookmarked ? 'currentColor' : 'none'} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>{isBookmarked ? '저장됨' : '저장'}</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>공유</span>
              </button>
            </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-white transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>수정하기</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>삭제하기</span>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleReport}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                    <span>신고하기</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </article>

      {/* 댓글 섹션 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            댓글 {safeCount(getCommentCount(post), 0)}개
          </h3>
        </div>

        {/* 댓글 작성 */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={userNickname}
                    onChange={(e) => setUserNickname(e.target.value)}
                    placeholder="닉네임 입력"
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={10}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 (4자리)</label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">🔒</span>
                  <input
                    type="password"
                    value={commentPassword}
                    onChange={(e) => setCommentPassword(e.target.value)}
                    placeholder="4자리 숫자"
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="따뜻한 댓글을 남겨주세요..."
                rows={3}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!commentContent.trim() || !userNickname.trim() || !commentPassword.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* 댓글 목록 */}
        <div className="divide-y divide-gray-100">
          {(comments && Array.isArray(comments) ? comments : []).map((comment) => (
            <div key={comment.id || `comment-${Math.random()}`} className="p-6">
              {/* 댓글 */}
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-green-700">💚 {comment.user_nickname}</span>
                    <span className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-800 mb-3 whitespace-pre-wrap">{comment.content}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <button 
                      onClick={() => handleCommentLike(comment.id)}
                      disabled={getLikedComments().includes(comment.id)}
                      className={`flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors ${getLikedComments().includes(comment.id) ? 'text-blue-600 opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{safeCount(getCommentLikeCount(comment), 0)}</span>
                    </button>
                    <button 
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Reply className="w-3 h-3" />
                      <span>답글</span>
                    </button>
                    <button 
                      onClick={() => handleCommentEdit(comment.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>수정</span>
                    </button>
                    <button 
                      onClick={() => handleCommentDelete(comment.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>삭제</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 답글 입력 */}
              {replyingTo === comment.id && (
                <div className="mt-4 ml-6 pl-4 border-l-2 border-gray-200">
                  <form onSubmit={(e) => { e.preventDefault(); handleReplySubmit(comment.id); }} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">💚 {userNickname}</span>
                    </div>
                    <div className="flex space-x-2">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="답글을 작성해주세요..."
                        rows={2}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        maxLength={300}
                      />
                      <button
                        type="submit"
                        disabled={!replyContent.trim()}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        답글
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 답글 목록 */}
              {(comment.replies || []).map((reply, idx) => (
                <div key={reply.id || `${comment.id}-reply-${idx}`} className="pl-4 border-l-2 border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-green-700 text-sm">💚 {reply.user_nickname}</span>
                    <span className="text-xs text-gray-500">{formatTimeAgo(reply.created_at)}</span>
                  </div>
                  <p className="text-gray-800 text-sm mb-2 whitespace-pre-wrap">{reply.content}</p>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleCommentLike(reply.id)}
                      disabled={getLikedComments().includes(reply.id)}
                      className={`flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 transition-colors ${getLikedComments().includes(reply.id) ? 'text-blue-600 opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{safeCount(getCommentLikeCount(reply), 0)}</span>
                    </button>
                    <button 
                      onClick={() => handleCommentEdit(reply.id)}
                      className="flex items-center space-x-1 text-xs text-gray-500 hover:text-green-600 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>수정</span>
                    </button>
                    <button 
                      onClick={() => handleCommentDelete(reply.id)}
                      className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>삭제</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>아직 댓글이 없어요</p>
            <p className="text-sm mt-1">첫 번째 댓글을 남겨주세요! ✨</p>
          </div>
        )}
      </div>

      {/* 비밀번호 확인 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {passwordAction === 'edit' ? '게시글 수정' : '게시글 삭제'}
              </h3>
              <button
                onClick={closePasswordModal}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                {passwordAction === 'edit' 
                  ? '게시글을 수정하려면 작성시 설정한 비밀번호를 입력해주세요.' 
                  : '게시글을 삭제하려면 작성시 설정한 비밀번호를 입력해주세요.'
                }
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 (4자리 숫자)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="4자리 숫자 입력"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={4}
                autoFocus
              />
              
              {passwordError && (
                <p className="text-red-600 text-sm mt-2">{passwordError}</p>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={closePasswordModal}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handlePasswordSubmit}
                className={`flex-1 px-4 py-3 text-white rounded-lg transition-colors ${
                  passwordAction === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {passwordAction === 'edit' ? '수정하기' : '삭제하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 댓글 삭제 확인 모달 */}
      {showCommentDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                댓글 삭제
              </h3>
              <button
                onClick={closeCommentDeleteModal}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                댓글을 삭제하려면 작성시 설정한 비밀번호를 입력해주세요.
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 (4자리 숫자)
              </label>
              <input
                type="password"
                value={commentDeletePassword}
                onChange={(e) => setCommentDeletePassword(e.target.value)}
                placeholder="4자리 숫자 입력"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={4}
                autoFocus
              />
              
              {commentDeleteError && (
                <p className="text-red-600 text-sm mt-2">{commentDeleteError}</p>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={closeCommentDeleteModal}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCommentDeleteConfirm}
                className="flex-1 px-4 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 댓글 수정 확인 모달 */}
      {showCommentEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                댓글 수정
              </h3>
              <button
                onClick={closeCommentEditModal}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                댓글을 수정하려면 작성시 설정한 비밀번호를 입력해주세요.
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수정할 내용
              </label>
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                placeholder="수정할 댓글 내용을 입력하세요..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
                maxLength={500}
              />
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 (4자리 숫자)
              </label>
              <input
                type="password"
                value={commentEditPassword}
                onChange={(e) => setCommentEditPassword(e.target.value)}
                placeholder="4자리 숫자 입력"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={4}
              />
              
              {commentEditError && (
                <p className="text-red-600 text-sm mt-2">{commentEditError}</p>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={closeCommentEditModal}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCommentEditConfirm}
                className="flex-1 px-4 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                수정하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 신고 모달 */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Flag className="w-5 h-5 mr-2 text-orange-600" />
                게시글 신고
              </h3>
              <button
                onClick={closeReportModal}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                부적절한 게시글을 신고해주세요. 신고는 익명으로 처리되며, 
                관리자가 검토 후 적절한 조치를 취하겠습니다.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  신고 사유 <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'spam', label: '스팸/광고', description: '상업적 홍보, 무분별한 광고' },
                    { value: 'abuse', label: '욕설/비방', description: '욕설, 인신공격, 혐오 표현' },
                    { value: 'inappropriate', label: '부적절한 내용', description: '음란물, 폭력적 내용' },
                    { value: 'misinformation', label: '허위정보', description: '거짓 정보, 가짜 뉴스' },
                    { value: 'privacy', label: '개인정보 노출', description: '타인의 개인정보 무단 공개' },
                    { value: 'other', label: '기타', description: '위에 해당하지 않는 사유' }
                  ].map((reason) => (
                    <label key={reason.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-200 cursor-pointer">
                      <input
                        type="radio"
                        value={reason.value}
                        checked={reportReason === reason.value}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="mt-1 text-orange-600 focus:ring-orange-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{reason.label}</div>
                        <div className="text-sm text-gray-500">{reason.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상세 설명 (선택사항)
                </label>
                <textarea
                  value={reportDetail}
                  onChange={(e) => setReportDetail(e.target.value)}
                  placeholder="신고 사유에 대한 추가 설명을 입력해주세요..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {reportDetail.length}/500
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={closeReportModal}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={!reportReason.trim() || reportLoading}
                className="flex-1 px-4 py-3 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reportLoading ? '신고 중...' : '신고하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetail 