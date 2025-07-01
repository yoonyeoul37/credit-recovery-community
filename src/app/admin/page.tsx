'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdminAuth from '@/components/AdminAuth'
import { 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Users, 
  AlertTriangle, 
  Settings,
  Monitor,
  Eye,
  ThumbsUp,
  MessageCircle,
  TrendingUp
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats] = useState({
    totalPosts: 2847,
    totalComments: 5632,
    totalUsers: 1234,
    todayPosts: 156,
    todayComments: 298,
    todayUsers: 45,
    reportedPosts: 12,
    pendingAds: 3
  })

  const [recentPosts] = useState([
    {
      id: 1,
      title: '신용점수 200점 올린 후기 공유합니다',
      category: '신용이야기',
      author: '희망찬시작',
      createdAt: '2024-01-15 14:30',
      views: 156,
      likes: 23,
      comments: 8,
      status: 'published'
    },
    {
      id: 2,
      title: '개인회생 인가 결정 받았습니다!',
      category: '개인회생',
      author: '새출발123',
      createdAt: '2024-01-15 13:15',
      views: 89,
      likes: 34,
      comments: 12,
      status: 'published'
    },
    {
      id: 3,
      title: '부채 5천만원에서 완전 탈출까지의 여정',
      category: '성공사례',
      author: '탈출성공자',
      createdAt: '2024-01-15 11:45',
      views: 234,
      likes: 67,
      comments: 23,
      status: 'published'
    }
  ])

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Monitor className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/"
                  className="text-gray-600 hover:text-blue-600 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  사이트 보기
                </Link>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">관</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">전체 게시글</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPosts.toLocaleString()}</p>
                  <p className="text-sm text-green-600">오늘 +{stats.todayPosts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageSquare className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">전체 댓글</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalComments.toLocaleString()}</p>
                  <p className="text-sm text-green-600">오늘 +{stats.todayComments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">활성 사용자</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600">오늘 +{stats.todayUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">신고된 게시글</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.reportedPosts}</p>
                  <p className="text-sm text-red-600">처리 필요</p>
                </div>
              </div>
            </div>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 관리 메뉴 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">관리 메뉴</h3>
                <nav className="space-y-2">
                  <Link 
                    href="/admin/posts"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    게시글 관리
                  </Link>
                  <Link 
                    href="/admin/comments"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 mr-3" />
                    댓글 관리
                  </Link>
                  <Link 
                    href="/admin/users"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Users className="w-5 h-5 mr-3" />
                    사용자 관리
                  </Link>
                  <Link 
                    href="/admin/ads"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Monitor className="w-5 h-5 mr-3" />
                    광고 관리
                  </Link>
                  <Link 
                    href="/admin/reports"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    신고 처리
                    {stats.reportedPosts > 0 && (
                      <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {stats.reportedPosts}
                      </span>
                    )}
                  </Link>
                  <Link 
                    href="/admin/settings"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    시스템 설정
                  </Link>
                </nav>
              </div>

              {/* 빠른 통계 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">오늘의 활동</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">새 게시글</span>
                    <span className="text-sm font-medium text-gray-900">{stats.todayPosts}개</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">새 댓글</span>
                    <span className="text-sm font-medium text-gray-900">{stats.todayComments}개</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">신규 사용자</span>
                    <span className="text-sm font-medium text-gray-900">{stats.todayUsers}명</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">대기 중인 광고</span>
                    <span className="text-sm font-medium text-orange-600">{stats.pendingAds}개</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 최근 게시글 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">최근 게시글</h3>
                    <Link 
                      href="/admin/posts"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      전체 보기
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {post.category}
                            </span>
                            <span className="text-xs text-gray-500">{post.createdAt}</span>
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">{post.title}</h4>
                          <p className="text-xs text-gray-600">작성자: {post.author}</p>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {post.views}
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {post.likes}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {post.comments}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  )
} 