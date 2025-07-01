'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Clock,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import SearchBar, { SearchFilters } from './SearchBar'

interface Post {
  id: number
  title: string
  content: string
  author_nickname: string
  created_at: string
  updated_at: string
  like_count: number
  comment_count: number
  view_count: number
  category_id: number
  tags?: string[]
  images?: string[]
}

interface PostListProps {
  category: string
  className?: string
  showSearch?: boolean
}

const PostList = ({ category, className = '', showSearch = true }: PostListProps) => {
  const router = useRouter()
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    timeRange: 'all',
    sortBy: 'latest',
    hasImages: null
  })

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)
      
      try {
        // 🚀 Supabase에서 실제 데이터 가져오기
        const { supabase } = await import('@/lib/supabase')
        
        console.log('📥 Supabase에서 게시글 로딩 시작...')
        
        // 카테고리 ID 매핑
        const categoryMapping: { [key: string]: number } = {
          'credit-story': 1,
          'personal-recovery': 2,
          'corporate-recovery': 3,
          'loan-story': 4,
          'success-story': 5
        }
        
        const categoryId = categoryMapping[category] || 1
        
        // Supabase에서 해당 카테고리의 게시글 가져오기
        const { data: supabasePosts, error } = await supabase
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
            images
          `)
          .eq('category_id', categoryId)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.warn('⚠️ Supabase 데이터 로딩 실패 - 로컬 백업 데이터로 전환')
          console.log('📝 오류 정보:', {
            message: error?.message || '네트워크 연결 문제',
            code: error?.code || 'NETWORK_ERROR',
            details: error?.details || '로컬 환경에서는 정상적인 현상입니다',
            hint: error?.hint || 'localhost에서 Supabase 연결이 차단될 수 있습니다'
          })
          
          // 오류 시 localStorage에서 백업 데이터 로드
          await loadLocalBackupData()
        } else {
          console.log('✅ Supabase 연결 성공!')
          console.log('📊 데이터 상태:', {
            category: category,
            categoryId: categoryId,
            supabaseCount: supabasePosts?.length || 0,
            status: supabasePosts?.length ? '데이터 존재' : '데이터 없음'
          })
          
          // Supabase 데이터가 없으면 localStorage + 데모 데이터 로드
          if (!supabasePosts || supabasePosts.length === 0) {
            console.log('📋 Supabase 데이터가 비어있어서 로컬 + 데모 데이터 로드')
            await loadLocalBackupData()
          } else {
            // Supabase 데이터 + localStorage 백업 데이터 합치기
            console.log('🔄 Supabase 데이터와 로컬 데이터 병합 중...')
            const localPosts = await loadLocalBackupData(false)
            const allPostsData = [...(supabasePosts || []), ...localPosts]
            console.log('✅ 데이터 병합 완료:', {
              supabaseCount: supabasePosts?.length || 0,
              localCount: localPosts?.length || 0,
              totalCount: allPostsData.length
            })
            setAllPosts(allPostsData)
          }
        }
        
      } catch (error) {
        console.warn('⚠️ 게시글 로딩 완전 실패 - 로컬 데이터만 사용')
        console.log('📝 예외 정보:', {
          name: error instanceof Error ? error.name : 'UnknownError',
          message: error instanceof Error ? error.message : '알 수 없는 오류',
          type: typeof error,
          info: '네트워크 연결이나 방화벽 문제로 인한 현상일 수 있습니다'
        })
        
        // 완전 실패시 로컬 백업 데이터만 로드
        await loadLocalBackupData()
      } finally {
        setLoading(false)
      }
    }

    // 로컬 백업 데이터 로드 함수
    const loadLocalBackupData = async (setData = true) => {
      try {
        // localStorage에서 저장된 글 가져오기
        const savedPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
        const filteredSavedPosts = savedPosts.filter((post: any) => post.category === category)
        
        // 데모 데이터 (실제 서비스에서는 제거 가능)
        const demoPosts: Post[] = [
          {
            id: 9999,
            title: "신용점수 200점 올린 성공 후기",
            content: "안녕하세요. 6개월 전 신용점수가 400점대였던 절망적인 상황에서 드디어 600점대까지 올렸습니다. 꾸준한 노력의 결과를 공유합니다.",
            author_nickname: "희망찬시작",
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            like_count: 45,
            comment_count: 18,
            view_count: 234,
            category_id: 1,
            tags: ['신용점수', '성공후기', '팁'],
            images: []
          },
          {
            id: 9998,
            title: "개인회생 인가 결정 받았습니다!",
            content: "드디어 개인회생 인가 결정을 받았어요. 앞으로 3년간 열심히 변제하겠습니다. 같은 상황에 계신 분들께 도움이 되길 바랍니다.",
            author_nickname: "새출발123",
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            like_count: 67,
            comment_count: 23,
            view_count: 345,
            category_id: 2,
            tags: ['개인회생', '인가결정', '희망'],
            images: ['https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=300&fit=crop']
          },
          {
            id: 9997,
            title: "부채 5천만원에서 완전 탈출까지의 여정",
            content: "5천만원의 부채로 시작해서 5년 만에 완전히 탈출한 이야기를 나누고 싶어요. 포기하지 마시고 함께 힘내요!",
            author_nickname: "탈출성공자",
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            like_count: 89,
            comment_count: 34,
            view_count: 567,
            category_id: 5,
            tags: ['부채탈출', '성공사례', '5년여정'],
            images: []
          }
        ]
        
        // 카테고리에 맞는 데모 데이터 필터링
        const categoryMapping: { [key: string]: number } = {
          'credit-story': 1,
          'personal-recovery': 2,
          'corporate-recovery': 3,
          'loan-story': 4,
          'success-story': 5
        }
        const categoryId = categoryMapping[category] || 1
        const filteredDemoPosts = demoPosts.filter(post => post.category_id === categoryId)
        
        const localPostsData = [...filteredSavedPosts, ...filteredDemoPosts]
        
        if (setData) {
          setAllPosts(localPostsData)
        }
        
        return localPostsData
        
      } catch (error) {
        console.warn('⚠️ 로컬 데이터 로딩 실패')
        console.log('📝 로컬 데이터 오류:', {
          name: error instanceof Error ? error.name : 'LocalStorageError',
          message: error instanceof Error ? error.message : '로컬 스토리지 접근 실패',
          info: 'localStorage가 비활성화되었거나 데이터가 손상되었을 수 있습니다'
        })
        return []
      }
    }

    loadPosts()
  }, [category])

  // 검색 및 필터링 로직
  const filteredPosts = useMemo(() => {
    let result = [...allPosts]

    // 텍스트 검색 (제목, 내용, 닉네임, 태그)
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase()
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author_nickname.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    }

    // 기간 필터
    if (searchFilters.timeRange !== 'all') {
      const now = new Date()
      const filterTime = {
        day: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000
      }[searchFilters.timeRange]

      if (filterTime) {
        result = result.filter(post => 
          now.getTime() - new Date(post.created_at).getTime() <= filterTime
        )
      }
    }

    // 이미지 필터
    if (searchFilters.hasImages !== null) {
      result = result.filter(post => {
        const hasImages = post.images && post.images.length > 0
        return searchFilters.hasImages ? hasImages : !hasImages
      })
    }

    // 정렬
    result.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case 'popular':
          return (b.like_count || 0) - (a.like_count || 0)
        case 'views':
          return (b.view_count || 0) - (a.view_count || 0)
        case 'comments':
          return (b.comment_count || 0) - (a.comment_count || 0)
        case 'latest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return result
  }, [allPosts, searchFilters])

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters)
    setCurrentPage(1) // 검색 시 첫 페이지로
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) {
      return `${minutes}분 전`
    } else if (hours < 24) {
      return `${hours}시간 전`
    } else if (days < 30) {
      return `${days}일 전`
    } else {
      return new Date(date).toLocaleDateString()
    }
  }

  const getCategoryName = (cat: string) => {
    const categories: { [key: string]: string } = {
      'credit-story': '신용이야기',
      'personal-recovery': '개인회생',
      'corporate-recovery': '법인회생',
      'loan-story': '대출이야기',
      'success-story': '성공사례'
    }
    return categories[cat] || '게시판'
  }

  // 페이징 계산
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 로딩 상태
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 게시판 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{getCategoryName(category)}</h2>
          <p className="text-gray-600 mt-1">경험과 정보를 나누어 함께 성장해요 💪</p>
        </div>
        <Link
          href={`/write?category=${category}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          글쓰기
        </Link>
      </div>

      {/* 검색바 */}
      {showSearch && (
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch}
            placeholder={`${getCategoryName(category)}에서 검색...`}
          />
        </div>
      )}

      {/* 검색 결과 요약 */}
      {searchFilters.query && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            '<span className="font-semibold">{searchFilters.query}</span>' 검색 결과: 
            <span className="font-semibold ml-1">{filteredPosts.length}개</span>의 게시글
          </p>
        </div>
      )}

      {/* 게시글 목록 */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-500 mb-4">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            {searchFilters.query ? (
              <>
                <p className="text-lg font-medium">검색 결과가 없어요</p>
                <p className="text-sm mt-1">다른 키워드로 검색해보세요 🔍</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">아직 게시글이 없어요</p>
                <p className="text-sm mt-1">첫 번째 이야기를 들려주세요! ✨</p>
              </>
            )}
          </div>
          {!searchFilters.query && (
            <Link
              href={`/write?category=${category}`}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              첫 글 작성하기
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {currentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/${category}/${post.id}`}
              className="block bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all p-8 group"
            >
              {/* 제목 */}
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-3 line-clamp-2">
                {post.title}
              </h3>

              {/* 메타 정보 */}
              <div className="flex items-center justify-between text-base text-gray-500">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span className="font-medium text-green-700">💚 {post.author_nickname}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{formatTimeAgo(post.created_at)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-5 h-5" />
                    <span>{post.view_count || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-5 h-5" />
                    <span>{post.like_count || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comment_count || 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              이전
            </button>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
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
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {/* 페이지 번호들 */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === currentPage
                          ? 'bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostList 