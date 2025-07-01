'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminAuth from '@/components/AdminAuth'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  FileText,
  MessageCircle,
  ThumbsUp,
  AlertTriangle,
  Calendar,
  User,
  Tag
} from 'lucide-react'

interface Post {
  id: number
  title: string
  content: string
  category: string
  categoryName: string
  author: string
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  comments: number
  tags: string[]
  isReported: boolean
  reportCount: number
  status: 'published' | 'hidden' | 'pending'
  images: string[]
}

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showReportedOnly, setShowReportedOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // 실제 데이터베이스에서 게시글 불러오기
  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      console.log('🔍 관리자: 게시글 목록 로딩 시작')
      
      const { supabase, isDemoMode } = await import('@/lib/supabase')
      
      if (isDemoMode) {
        console.log('📋 데모 모드: 하드코딩 데이터 사용')
        // 데모 모드일 때만 하드코딩 데이터 사용
        setPosts([
          {
            id: 1,
            title: '신용점수 200점 올린 후기 공유합니다',
            content: '안녕하세요. 6개월 전 신용점수가 400점대였던 절망적인 상황에서 드디어 600점대까지 올렸습니다...',
            category: 'credit-story',
            categoryName: '신용이야기',
            author: '희망찬시작',
            createdAt: '2024-01-15 14:30',
            updatedAt: '2024-01-15 14:30',
            views: 156,
            likes: 23,
            comments: 8,
            tags: ['신용점수', '후기', '성공'],
            isReported: false,
            reportCount: 0,
            status: 'published',
            images: []
          },
          {
            id: 2,
            title: '개인회생 인가 결정 받았습니다!',
            content: '드디어 개인회생 인가 결정을 받았어요. 앞으로 3년간 열심히 변제하겠습니다...',
            category: 'personal-recovery',
            categoryName: '개인회생',
            author: '새출발123',
            createdAt: '2024-01-15 13:15',
            updatedAt: '2024-01-15 13:15',
            views: 89,
            likes: 34,
            comments: 12,
            tags: ['개인회생', '인가결정', '성공'],
            isReported: false,
            reportCount: 0,
            status: 'published',
            images: []
          }
        ])
        setLoading(false)
        return
      }

      // 실제 Supabase에서 데이터 가져오기
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('⚠️ Supabase 게시글 로딩 실패:', error)
        // 로컬스토리지 백업 사용
        const localPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
        const formattedPosts = localPosts.map((post: any) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          categoryName: getCategoryName(post.category),
          author: post.user_nickname || post.author || '익명',
          createdAt: formatDate(post.created_at || post.createdAt),
          updatedAt: formatDate(post.updated_at || post.updatedAt),
          views: post.view_count || post.views || 0,
          likes: post.like_count || post.likes || 0,
          comments: post.comment_count || post.comments || 0,
          tags: post.tags || [],
          isReported: false,
          reportCount: 0,
          status: 'published',
          images: post.images || []
        }))
        setPosts(formattedPosts)
      } else {
        console.log('✅ Supabase 게시글 로딩 성공:', postsData?.length || 0, '개')
        const formattedPosts = postsData.map((post: any) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category_id ? getCategoryById(post.category_id) : 'credit-story',
          categoryName: post.category_id ? getCategoryNameById(post.category_id) : '신용이야기',
          author: post.author_nickname || '익명',
          createdAt: formatDate(post.created_at),
          updatedAt: formatDate(post.updated_at),
          views: post.view_count || 0,
          likes: post.like_count || 0,
          comments: post.comment_count || 0,
          tags: post.tags || [],
          isReported: false,
          reportCount: 0,
          status: post.is_deleted ? 'hidden' : 'published',
          images: post.images || []
        }))
        setPosts(formattedPosts)
      }

    } catch (error) {
      console.warn('⚠️ 게시글 로딩 완전 실패 - 로컬 데이터 사용')
      const localPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
      const formattedPosts = localPosts.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        categoryName: getCategoryName(post.category),
        author: post.user_nickname || post.author || '익명',
        createdAt: formatDate(post.created_at || post.createdAt),
        updatedAt: formatDate(post.updated_at || post.updatedAt),
        views: post.view_count || post.views || 0,
        likes: post.like_count || post.likes || 0,
        comments: post.comment_count || post.comments || 0,
        tags: post.tags || [],
        isReported: false,
        reportCount: 0,
        status: 'published',
        images: post.images || []
      }))
      setPosts(formattedPosts)
    } finally {
      setLoading(false)
    }
  }

  // 카테고리 이름 매핑
  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      'credit-story': '신용이야기',
      'personal-recovery': '개인회생',
      'corporate-recovery': '법인회생',
      'loan-story': '대출이야기',
      'success-story': '성공사례'
    }
    return categories[category] || category
  }

  // 카테고리 ID로 slug 변환
  const getCategoryById = (id: number) => {
    const mapping: { [key: number]: string } = {
      1: 'credit-story',
      2: 'personal-recovery', 
      3: 'corporate-recovery',
      4: 'loan-story',
      5: 'success-story'
    }
    return mapping[id] || 'credit-story'
  }

  // 카테고리 ID로 이름 변환
  const getCategoryNameById = (id: number) => {
    const mapping: { [key: number]: string } = {
      1: '신용이야기',
      2: '개인회생',
      3: '법인회생', 
      4: '대출이야기',
      5: '성공사례'
    }
    return mapping[id] || '신용이야기'
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  // 검색어나 필터 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedStatus, showReportedOnly])

  const categories = [
    { value: 'all', label: '전체 카테고리' },
    { value: 'credit-story', label: '신용이야기' },
    { value: 'personal-recovery', label: '개인회생' },
    { value: 'corporate-recovery', label: '법인회생' },
    { value: 'loan-story', label: '대출이야기' },
    { value: 'success-story', label: '성공사례' }
  ]

  const statuses = [
    { value: 'all', label: '전체 상태' },
    { value: 'published', label: '게시됨' },
    { value: 'hidden', label: '숨김' },
    { value: 'pending', label: '검토 중' }
  ]

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus
    const matchesReported = !showReportedOnly || post.isReported

    return matchesSearch && matchesCategory && matchesStatus && matchesReported
  })

  // 페이징 계산
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const togglePostStatus = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, status: post.status === 'published' ? 'hidden' : 'published' }
        : post
    ))
  }

  const deletePost = async (id: number) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return

    try {
      console.log('🗑️ 관리자: 게시글 삭제 시작:', id)
      
      const { supabase, isDemoMode } = await import('@/lib/supabase')
      
      if (isDemoMode) {
        console.log('📋 데모 모드: 로컬 삭제만 수행')
        setPosts(posts.filter(post => post.id !== id))
        return
      }

      // Supabase에서 실제 삭제 (soft delete)
      const { error } = await supabase
        .from('posts')
        .update({ is_deleted: true })
        .eq('id', id)

      if (error) {
        console.warn('⚠️ Supabase 게시글 삭제 실패 - 로컬 삭제로 대체')
        
        // 로컬 스토리지에서도 삭제
        const localPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
        const updatedPosts = localPosts.filter((post: any) => post.id !== id)
        localStorage.setItem('community-posts', JSON.stringify(updatedPosts))
        
        // 화면에서 제거
        setPosts(posts.filter(post => post.id !== id))
      } else {
        console.log('✅ Supabase 게시글 삭제 성공')
        
        // 성공 시 목록 새로고침
        await loadPosts()
      }

    } catch (error) {
      console.warn('⚠️ 게시글 삭제 완전 실패 - 로컬 삭제로 대체')
      
      // 로컬 스토리지에서 삭제
      const localPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
      const updatedPosts = localPosts.filter((post: any) => post.id !== id)
      localStorage.setItem('community-posts', JSON.stringify(updatedPosts))
      
      // 화면에서 제거
      setPosts(posts.filter(post => post.id !== id))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">게시됨</span>
      case 'hidden':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">숨김</span>
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">검토 중</span>
      default:
        return null
    }
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
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">게시글 관리</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-gray-900">게시글 목록</h3>
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="제목, 내용, 작성자 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={showReportedOnly}
                      onChange={(e) => setShowReportedOnly(e.target.checked)}
                      className="mr-2 rounded border-gray-300 text-blue-600"
                    />
                    신고된 글만
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* 게시글 테이블 */}
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">게시글을 불러오는 중...</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    게시글 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    통계
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500">{post.content.substring(0, 50)}...</div>
                      <div className="text-xs text-gray-500 mt-1">{post.createdAt}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center text-xs text-gray-500">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.views}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {post.likes}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {post.comments}
                      </div>
                      {post.isReported && (
                        <div className="flex items-center text-xs text-red-500 mt-1">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          신고 {post.reportCount}건
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => togglePostStatus(post.id)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          title={post.status === 'published' ? '숨기기' : '게시하기'}
                        >
                          {post.status === 'published' ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => alert(`게시글 수정 기능 (ID: ${post.id})\n제목: ${post.title}`)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="수정"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          {/* 페이징 */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                이전
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                다음
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  총 <span className="font-medium">{filteredPosts.length}</span>개 중{' '}
                  <span className="font-medium">{startIndex + 1}</span>-
                  <span className="font-medium">{Math.min(endIndex, filteredPosts.length)}</span> 표시
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">이전</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">다음</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminAuth>
  )
} 