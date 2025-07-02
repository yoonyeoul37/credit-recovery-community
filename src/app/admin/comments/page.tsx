'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminAuth from '@/components/AdminAuth'
import { ArrowLeft, MessageSquare, Trash2, Eye, EyeOff, AlertTriangle, Search, Filter, RefreshCw, ExternalLink, Flag } from 'lucide-react'

interface Comment {
  id: number
  content: string
  author_nickname: string
  post_id: number
  post_title?: string
  parent_id?: number | null
  like_count: number
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export default function CommentManagement() {
  const [comments, setComments] = useState<Comment[]>([])
  const [filteredComments, setFilteredComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'deleted'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalComments, setTotalComments] = useState(0)
  const commentsPerPage = 10

  // 댓글 데이터 로드
  const loadComments = async () => {
    setLoading(true)
    console.log('🔍 관리자: 댓글 데이터 로딩 시작')
    
    try {
      // Supabase에서 댓글 불러오기 시도
      const { supabase } = await import('@/lib/supabase')
      
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          author_nickname,
          post_id,
          parent_id,
          like_count,
          is_deleted,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.warn('⚠️ Supabase 댓글 로딩 실패 - 로컬 데이터 사용')
        console.log('📝 오류 정보:', {
          message: error.message,
          code: error.code,
          info: '로컬 환경에서는 정상적인 현상입니다'
        })
        
        // 로컬 백업 데이터 사용
        loadLocalComments()
      } else {
        console.log('✅ Supabase 댓글 로딩 성공:', data?.length || 0, '개')
        setComments(data || [])
        setTotalComments(data?.length || 0)
      }
      
    } catch (error) {
      console.warn('⚠️ 댓글 로딩 완전 실패 - 로컬 데이터로 전환')
      console.log('📝 예외 정보:', error)
      
      // 로컬 백업 데이터 사용
      loadLocalComments()
    }
    
    setLoading(false)
  }

  // 로컬 백업 댓글 데이터 (더 현실적이고 다양한 예시)
  const loadLocalComments = () => {
    const localComments: Comment[] = [
      {
        id: 1,
        content: '정말 도움이 되는 정보네요! 신용 관리에 큰 도움이 되었습니다. 저도 비슷한 방법으로 시도해보겠습니다.',
        author_nickname: '감사인123',
        post_id: 1,
        post_title: '신용점수 200점 올린 후기 공유합니다',
        parent_id: null,
        like_count: 15,
        is_deleted: false,
        created_at: '2024-01-15T15:30:00Z',
        updated_at: '2024-01-15T15:30:00Z'
      },
      {
        id: 2,
        content: '저도 비슷한 상황이었는데 희망이 생기네요. 용기 얻고 갑니다! 질문이 있는데 개인회생 신청할 때 가장 어려웠던 부분이 뭐였나요?',
        author_nickname: '희망찾기',
        post_id: 2,
        post_title: '개인회생 인가 결정 받았습니다!',
        parent_id: null,
        like_count: 8,
        is_deleted: false,
        created_at: '2024-01-15T14:45:00Z',
        updated_at: '2024-01-15T14:45:00Z'
      },
      {
        id: 3,
        content: '🚨 급전필요하신분 연락주세요! 빠른처리 가능합니다. 무담보 무보증 즉시대출 가능! 카톡: money123',
        author_nickname: '스팸러',
        post_id: 3,
        post_title: '부채 5천만원에서 완전 탈출까지의 여정',
        parent_id: null,
        like_count: 0,
        is_deleted: true,
        created_at: '2024-01-15T13:20:00Z',
        updated_at: '2024-01-15T16:10:00Z'
      },
      {
        id: 4,
        content: '@감사인123 저도 같은 방법으로 시도해볼게요! 혹시 어느 은행에서 하셨나요?',
        author_nickname: '따라해보기',
        post_id: 1,
        parent_id: 1,
        like_count: 3,
        is_deleted: false,
        created_at: '2024-01-15T16:15:00Z',
        updated_at: '2024-01-15T16:15:00Z'
      },
      {
        id: 5,
        content: '정말 감동적인 이야기네요. 포기하지 않고 끝까지 해낸 점이 존경스럽습니다. 저도 힘내서 해보겠습니다.',
        author_nickname: '응원단장',
        post_id: 2,
        parent_id: null,
        like_count: 12,
        is_deleted: false,
        created_at: '2024-01-15T17:30:00Z',
        updated_at: '2024-01-15T17:30:00Z'
      },
      {
        id: 6,
        content: '개인정보 털렸네요 ㅋㅋ 010-1234-5678 이 번호로 전화하세요',
        author_nickname: '악성유저',
        post_id: 1,
        parent_id: null,
        like_count: -2,
        is_deleted: true,
        created_at: '2024-01-15T18:00:00Z',
        updated_at: '2024-01-15T18:30:00Z'
      },
      {
        id: 7,
        content: '저는 3년 전에 개인회생했는데, 지금은 신용점수가 700점까지 올랐어요. 포기하지 마세요!',
        author_nickname: '성공한선배',
        post_id: 2,
        parent_id: 2,
        like_count: 25,
        is_deleted: false,
        created_at: '2024-01-15T19:15:00Z',
        updated_at: '2024-01-15T19:15:00Z'
      },
      {
        id: 8,
        content: '변호사 추천해드려요! 수임료 저렴하고 친절합니다. 연락처는 쪽지로 드릴게요.',
        author_nickname: '광고맨',
        post_id: 2,
        parent_id: null,
        like_count: 1,
        is_deleted: true,
        created_at: '2024-01-15T20:00:00Z',
        updated_at: '2024-01-15T20:30:00Z'
      }
    ]
    
    setComments(localComments)
    setTotalComments(localComments.length)
    console.log('📱 로컬 댓글 데이터 로딩 완료:', localComments.length, '개')
  }

  // 초기 로딩
  useEffect(() => {
    loadComments()
  }, [])

  // 검색 및 필터링
  useEffect(() => {
    let filtered = comments

    // 검색어 필터링
    if (searchQuery.trim()) {
      filtered = filtered.filter(comment => 
        comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.author_nickname.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 상태 필터링
    if (filterStatus === 'active') {
      filtered = filtered.filter(comment => !comment.is_deleted)
    } else if (filterStatus === 'deleted') {
      filtered = filtered.filter(comment => comment.is_deleted)
    }

    setFilteredComments(filtered)
    setCurrentPage(1) // 필터 변경시 첫 페이지로
  }, [comments, searchQuery, filterStatus])

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('이 댓글을 삭제하시겠습니까?')) return

    console.log('🗑️ 관리자: 댓글 삭제 시작:', commentId)
    
    try {
      const { supabase } = await import('@/lib/supabase')
      
      const { error } = await supabase
        .from('comments')
        .update({ is_deleted: true })
        .eq('id', commentId)
      
      if (error) {
        console.warn('⚠️ Supabase 댓글 삭제 실패 - 로컬 업데이트')
        
        // 로컬 상태 업데이트
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, is_deleted: true }
              : comment
          )
        )
      } else {
        console.log('✅ Supabase 댓글 삭제 성공')
        await loadComments() // 새로고침
      }
      
    } catch (error) {
      console.warn('⚠️ 댓글 삭제 완전 실패 - 로컬 업데이트')
      
      // 로컬 상태 업데이트
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, is_deleted: true }
            : comment
        )
      )
    }
  }

  // 댓글 복원
  const handleRestoreComment = async (commentId: number) => {
    if (!confirm('이 댓글을 복원하시겠습니까?')) return

    console.log('🔄 관리자: 댓글 복원 시작:', commentId)
    
    try {
      const { supabase } = await import('@/lib/supabase')
      
      const { error } = await supabase
        .from('comments')
        .update({ is_deleted: false })
        .eq('id', commentId)
      
      if (error) {
        console.warn('⚠️ Supabase 댓글 복원 실패 - 로컬 업데이트')
        
        // 로컬 상태 업데이트
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, is_deleted: false }
              : comment
          )
        )
      } else {
        console.log('✅ Supabase 댓글 복원 성공')
        await loadComments() // 새로고침
      }
      
    } catch (error) {
      console.warn('⚠️ 댓글 복원 완전 실패 - 로컬 업데이트')
      
      // 로컬 상태 업데이트
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, is_deleted: false }
            : comment
        )
      )
    }
  }

  // 페이징 계산
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage)
  const startIndex = (currentPage - 1) * commentsPerPage
  const endIndex = startIndex + commentsPerPage
  const currentComments = filteredComments.slice(startIndex, endIndex)

  // 시간 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\. /g, '-').replace('.', '')
    } catch {
      return dateString
    }
  }

  // 게시글로 이동하는 함수
  const goToPost = (postId: number) => {
    // 카테고리별 URL 매핑 (실제 구현에서는 post 데이터에서 가져와야 함)
    const categoryMap: { [key: number]: string } = {
      1: 'credit-story',
      2: 'personal-recovery', 
      3: 'success-story'
    }
    
    const category = categoryMap[postId] || 'credit-story'
    const url = `/${category}/${postId}`
    window.open(url, '_blank')
  }

  // 위험 댓글 감지 (스팸, 광고, 개인정보 등)
  const isDangerousComment = (content: string): { isDangerous: boolean; reason: string } => {
    const dangerousPatterns = [
      { pattern: /급전|즉시대출|무담보|무보증/, reason: '불법 대출 광고' },
      { pattern: /010-\d{4}-\d{4}|01[016789]-\d{3,4}-\d{4}/, reason: '전화번호 노출' },
      { pattern: /카톡|카카오톡|텔레그램|라인/, reason: '개인 연락처 유도' },
      { pattern: /변호사 추천|법무사 추천|수임료/, reason: '업체 광고' },
      { pattern: /🚨|‼️|💰|💵/, reason: '스팸성 이모지' },
      { pattern: /개인정보|털렸|ㅋㅋ.*전화/, reason: '개인정보 관련 악성' }
    ]

    for (const { pattern, reason } of dangerousPatterns) {
      if (pattern.test(content)) {
        return { isDangerous: true, reason }
      }
    }

    return { isDangerous: false, reason: '' }
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link 
                  href="/admin"
                  className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  대시보드
                </Link>
                <MessageSquare className="w-6 h-6 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">댓글 관리</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 검색 및 필터 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              {/* 검색 */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="댓글 내용 또는 작성자로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* 필터 */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'deleted')}
                    className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">전체 댓글</option>
                    <option value="active">활성 댓글</option>
                    <option value="deleted">삭제된 댓글</option>
                  </select>
                </div>
                
                <button
                  onClick={loadComments}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>새로고침</span>
                </button>
              </div>
            </div>
            
            {/* 통계 */}
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
              <span>전체: <strong>{totalComments}</strong>개</span>
              <span>검색결과: <strong>{filteredComments.length}</strong>개</span>
              <span>활성: <strong>{comments.filter(c => !c.is_deleted).length}</strong>개</span>
              <span>삭제: <strong>{comments.filter(c => c.is_deleted).length}</strong>개</span>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">댓글 데이터를 불러오는 중...</p>
              </div>
            ) : currentComments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">댓글이 없습니다</p>
                <p>검색 조건을 변경하거나 새로고침을 시도해보세요.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {currentComments.map(comment => {
                  const dangerCheck = isDangerousComment(comment.content)
                  
                  return (
                    <div key={comment.id} className={`p-6 ${
                      comment.is_deleted ? 'bg-red-50 border-l-4 border-red-400' : 
                      dangerCheck.isDangerous ? 'bg-yellow-50 border-l-4 border-yellow-400' : 
                      'bg-white'
                    }`}>
                      <div className="flex justify-between items-start space-x-4">
                        <div className="flex-1 min-w-0">
                          {/* 상태 및 경고 표시 */}
                          <div className="flex items-center gap-2 mb-2">
                            {comment.parent_id && (
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
                                답글
                              </span>
                            )}
                            {dangerCheck.isDangerous && !comment.is_deleted && (
                              <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md">
                                <Flag className="w-3 h-3 mr-1" />
                                {dangerCheck.reason}
                              </span>
                            )}
                            {comment.is_deleted && (
                              <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-md">
                                삭제됨
                              </span>
                            )}
                          </div>

                          {/* 댓글 내용 */}
                          <div className={`mb-3 ${comment.is_deleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            <p className="text-sm leading-relaxed break-words">{comment.content}</p>
                          </div>
                          
                          {/* 메타 정보 */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <strong className="text-gray-700">{comment.author_nickname}</strong>
                            </span>
                            <button
                              onClick={() => goToPost(comment.post_id)}
                              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                              title="원본 게시글 보기"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              게시글 #{comment.post_id}
                            </button>
                            <span className="flex items-center">
                              👍 {comment.like_count}
                            </span>
                            <span>{formatDate(comment.created_at)}</span>
                            {comment.updated_at !== comment.created_at && (
                              <span className="text-blue-600">(수정됨)</span>
                            )}
                          </div>
                        </div>
                        
                        {/* 관리 버튼들 */}
                        <div className="flex items-center space-x-2">
                          {comment.is_deleted ? (
                            <button
                              onClick={() => handleRestoreComment(comment.id)}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                              title="복원"
                            >
                              <Eye className="w-3 h-3" />
                              <span>복원</span>
                            </button>
                          ) : (
                            <>
                              {dangerCheck.isDangerous && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  ⚠️ 주의
                                </span>
                              )}
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className={`flex items-center space-x-1 px-3 py-1.5 text-white text-xs rounded-md transition-colors ${
                                  dangerCheck.isDangerous 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-gray-600 hover:bg-gray-700'
                                }`}
                                title="삭제"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>삭제</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* 페이징 */}
            {!loading && filteredComments.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    총 <span className="font-medium">{filteredComments.length}</span>개 중{' '}
                    <span className="font-medium">{startIndex + 1}</span>-<span className="font-medium">{Math.min(endIndex, filteredComments.length)}</span> 표시
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminAuth>
  )
} 