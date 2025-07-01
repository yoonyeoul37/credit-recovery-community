'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { User, ArrowLeft, Edit3, MessageCircle, Heart, Bookmark, Calendar, BarChart3, FileText, Settings, Trash2 } from 'lucide-react'

interface UserProfile {
  nickname: string
  joinedAt: string
  postsCount: number
  commentsCount: number
  likesReceived: number
  bookmarksCount: number
}

interface UserPost {
  id: number
  title: string
  content: string
  category: string
  created_at: string
  likes_count: number
  comment_count: number
  tags: string[]
}

interface UserComment {
  id: number
  content: string
  post_id: number
  post_title: string
  created_at: string
  likes_count: number
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userPosts, setUserPosts] = useState<UserPost[]>([])
  const [userComments, setUserComments] = useState<UserComment[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'comments' | 'bookmarks'>('overview')
  const [loading, setLoading] = useState(true)
  const [editingNickname, setEditingNickname] = useState(false)
  const [newNickname, setNewNickname] = useState('')

  // 프로필 데이터 로드
  useEffect(() => {
    const loadProfile = () => {
      try {
        const nickname = localStorage.getItem('user-nickname') || '익명사용자'
        const bookmarks = JSON.parse(localStorage.getItem('user-bookmarks') || '[]')
        const posts = JSON.parse(localStorage.getItem('community-posts') || '[]')
        const userSpecificPosts = posts.filter((post: any) => post.author_nickname === nickname)
        
        // 사용자 댓글 찾기 (간단한 예시)
        const comments: UserComment[] = [
          {
            id: 1,
            content: '정말 도움이 되는 정보네요! 감사합니다.',
            post_id: 1,
            post_title: '신용점수 200점 올린 후기 공유합니다',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            likes_count: 5
          },
          {
            id: 2,
            content: '저도 비슷한 경험이 있어서 공감이 많이 돼요.',
            post_id: 2,
            post_title: '개인회생 신청 과정 후기',
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            likes_count: 3
          }
        ]

        const userProfile: UserProfile = {
          nickname,
          joinedAt: localStorage.getItem('user-joined-at') || new Date().toISOString(),
          postsCount: userSpecificPosts.length,
          commentsCount: comments.length,
          likesReceived: userSpecificPosts.reduce((sum: number, post: any) => sum + (post.likes_count || 0), 0),
          bookmarksCount: bookmarks.length
        }

        setProfile(userProfile)
        setUserPosts(userSpecificPosts)
        setUserComments(comments)
        setNewNickname(nickname)
        
        console.log('👤 프로필 로드 완료:', userProfile)
      } catch (error) {
        console.error('❌ 프로필 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  // 닉네임 변경
  const handleNicknameChange = () => {
    if (!newNickname.trim() || newNickname.length < 2 || newNickname.length > 10) {
      alert('닉네임은 2-10자 사이로 입력해주세요')
      return
    }

    try {
      localStorage.setItem('user-nickname', newNickname.trim())
      setProfile(prev => prev ? { ...prev, nickname: newNickname.trim() } : null)
      setEditingNickname(false)
      console.log('✅ 닉네임 변경 완료:', newNickname.trim())
    } catch (error) {
      console.error('❌ 닉네임 변경 실패:', error)
      alert('닉네임 변경에 실패했습니다')
    }
  }

  // 게시글 삭제
  const handleDeletePost = (postId: number) => {
    if (!confirm('이 게시글을 삭제하시겠습니까?')) return

    try {
      const posts = JSON.parse(localStorage.getItem('community-posts') || '[]')
      const updatedPosts = posts.filter((post: any) => post.id !== postId)
      localStorage.setItem('community-posts', JSON.stringify(updatedPosts))
      
      setUserPosts(prev => prev.filter(post => post.id !== postId))
      setProfile(prev => prev ? { ...prev, postsCount: prev.postsCount - 1 } : null)
      
      console.log('🗑️ 게시글 삭제 완료:', postId)
    } catch (error) {
      console.error('❌ 게시글 삭제 실패:', error)
    }
  }

  // 카테고리 정보
  const getCategoryInfo = (cat: string) => {
    const categories: { [key: string]: { name: string; color: string; icon: string } } = {
      'credit-story': { name: '신용이야기', color: 'blue', icon: '💳' },
      'personal-recovery': { name: '개인회생', color: 'green', icon: '🔄' },
      'corporate-recovery': { name: '법인회생', color: 'purple', icon: '🏢' },
      'loan-story': { name: '대출이야기', color: 'orange', icon: '💰' },
      'success-story': { name: '성공사례', color: 'emerald', icon: '⭐' }
    }
    return categories[cat] || { name: cat, color: 'gray', icon: '📄' }
  }

  // 시간 포맷팅
  const formatTimeAgo = (dateString: string) => {
    try {
      const now = new Date()
      const date = new Date(dateString)
      const diff = now.getTime() - date.getTime()
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor(diff / (1000 * 60))
      
      if (days > 0) return `${days}일 전`
      if (hours > 0) return `${hours}시간 전`
      return `${minutes}분 전`
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">프로필을 불러올 수 없습니다</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>내 프로필 - 신용회복 커뮤니티</title>
        <meta name="description" content="내 활동 내역과 프로필을 확인하세요" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-blue-600 mr-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                홈으로
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">내 프로필</h1>
                <p className="text-gray-600 mt-1">활동 내역과 설정을 관리하세요</p>
              </div>
            </div>
          </div>

          {/* 프로필 카드 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">기본 정보</h2>
              <button
                onClick={() => setEditingNickname(!editingNickname)}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>편집</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 닉네임 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
                {editingNickname ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newNickname}
                      onChange={(e) => setNewNickname(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={10}
                    />
                    <button
                      onClick={handleNicknameChange}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => {
                        setEditingNickname(false)
                        setNewNickname(profile.nickname)
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium text-green-700">💚 {profile.nickname}</span>
                  </div>
                )}
              </div>

              {/* 가입일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">활동 시작일</label>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatTimeAgo(profile.joinedAt)} 시작</span>
                </div>
              </div>
            </div>

            {/* 활동 통계 */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{profile.postsCount}</div>
                <div className="text-sm text-blue-700">작성한 글</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <MessageCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{profile.commentsCount}</div>
                <div className="text-sm text-green-700">작성한 댓글</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">{profile.likesReceived}</div>
                <div className="text-sm text-red-700">받은 좋아요</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <Bookmark className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{profile.bookmarksCount}</div>
                <div className="text-sm text-yellow-700">저장한 북마크</div>
              </div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', name: '활동 개요', icon: BarChart3 },
                  { id: 'posts', name: '내가 쓴 글', icon: FileText },
                  { id: 'comments', name: '내가 쓴 댓글', icon: MessageCircle },
                  { id: 'bookmarks', name: '저장한 글', icon: Bookmark }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">활동 개요</h3>
                  
                  {/* 최근 활동 */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">최근 작성한 글</h4>
                    {userPosts.length === 0 ? (
                      <p className="text-gray-500">아직 작성한 글이 없어요</p>
                    ) : (
                      <div className="space-y-3">
                        {userPosts.slice(0, 3).map((post) => {
                          const categoryInfo = getCategoryInfo(post.category)
                          return (
                            <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm">{categoryInfo.icon}</span>
                                <div>
                                  <Link
                                    href={`/${post.category}/${post.id}`}
                                    className="font-medium text-gray-900 hover:text-blue-600"
                                  >
                                    {post.title}
                                  </Link>
                                  <div className="text-xs text-gray-500">
                                    {formatTimeAgo(post.created_at)} • 좋아요 {post.likes_count} • 댓글 {post.comment_count}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* 최근 댓글 */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">최근 작성한 댓글</h4>
                    {userComments.length === 0 ? (
                      <p className="text-gray-500">아직 작성한 댓글이 없어요</p>
                    ) : (
                      <div className="space-y-3">
                        {userComments.slice(0, 3).map((comment) => (
                          <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-800 mb-2">{comment.content}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <Link
                                href={`/credit-story/${comment.post_id}`}
                                className="hover:text-blue-600"
                              >
                                {comment.post_title}
                              </Link>
                              <span>{formatTimeAgo(comment.created_at)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'posts' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">내가 쓴 글 ({userPosts.length}개)</h3>
                  </div>
                  
                  {userPosts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">아직 작성한 글이 없어요</p>
                      <p>첫 번째 게시글을 작성해보세요!</p>
                      <Link
                        href="/write"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
                      >
                        글쓰기
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userPosts.map((post) => {
                        const categoryInfo = getCategoryInfo(post.category)
                        return (
                          <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-sm">{categoryInfo.icon}</span>
                                  <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${categoryInfo.color}-100 text-${categoryInfo.color}-700`}>
                                    {categoryInfo.name}
                                  </span>
                                  <span className="text-xs text-gray-500">{formatTimeAgo(post.created_at)}</span>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-2 hover:text-blue-600">
                                  <Link href={`/${post.category}/${post.id}`}>
                                    {post.title}
                                  </Link>
                                </h4>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                  {post.content.substring(0, 150)}...
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <Heart className="w-3 h-3 mr-1" />
                                    {post.likes_count}
                                  </span>
                                  <span className="flex items-center">
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    {post.comment_count}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Link
                                  href={`/write?category=${post.category}&edit=${post.id}`}
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="수정"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="삭제"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'comments' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">내가 쓴 댓글 ({userComments.length}개)</h3>
                  
                  {userComments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">아직 작성한 댓글이 없어요</p>
                      <p>다양한 게시글에 댓글을 남겨보세요!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userComments.map((comment) => (
                        <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                          <p className="text-gray-800 mb-3">{comment.content}</p>
                          <div className="flex items-center justify-between">
                            <Link
                              href={`/credit-story/${comment.post_id}`}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              원글: {comment.post_title}
                            </Link>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Heart className="w-3 h-3 mr-1" />
                                {comment.likes_count}
                              </span>
                              <span>{formatTimeAgo(comment.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bookmarks' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">저장한 글 ({profile.bookmarksCount}개)</h3>
                    <Link
                      href="/bookmarks"
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      전체 보기 →
                    </Link>
                  </div>
                  
                  <div className="text-center py-12 text-gray-500">
                    <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">북마크한 글들을 확인하세요</p>
                    <p>유용한 게시글들을 저장해서 나중에 다시 볼 수 있어요</p>
                    <Link
                      href="/bookmarks"
                      className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors mt-4"
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      북마크 보기
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 