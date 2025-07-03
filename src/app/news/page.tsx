'use client'

import { useState, useEffect } from 'react'
import PostList from '@/components/PostList'
import PostWrite from '@/components/PostWrite'
import { Newspaper, Plus, Search, Calendar, Eye, TrendingUp } from 'lucide-react'

interface Post {
  id: number
  title: string
  content: string
  author: string
  category: string
  tags: string[]
  created_at: string
  view_count: number
  like_count: number
  comment_count: number
  is_featured?: boolean
}

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: 1,
        title: '[속보] 개인회생 신청 절차 간소화 법안 국회 통과',
        content: '개인회생 신청 절차를 간소화하는 법안이 국회를 통과했습니다. 이번 개정으로 신청 서류가 대폭 줄어들고, 신청 기간도 단축될 예정입니다.',
        author: '금융뉴스',
        category: 'news',
        tags: ['개인회생', '법안', '국회'],
        created_at: '2024-01-15T10:30:00Z',
        view_count: 1234,
        like_count: 85,
        comment_count: 23,
        is_featured: true
      },
      {
        id: 2,
        title: '2024년 신용회복 지원 정책 발표, 금리 인하 혜택 확대',
        content: '정부가 신용회복 지원을 위한 2024년 정책을 발표했습니다. 저금리 대출 지원과 신용관리 교육 프로그램이 확대됩니다.',
        author: '정책뉴스',
        category: 'news',
        tags: ['신용회복', '정책', '금리인하'],
        created_at: '2024-01-14T15:20:00Z',
        view_count: 876,
        like_count: 45,
        comment_count: 12,
        is_featured: false
      },
      {
        id: 3,
        title: '면책 후 신용카드 발급 기준 완화, 대형 카드사 동참',
        content: '면책자에 대한 신용카드 발급 기준이 완화되면서 대형 카드사들이 잇달아 면책자 전용 상품을 출시하고 있습니다.',
        author: '카드뉴스',
        category: 'news',
        tags: ['면책후', '신용카드', '발급기준'],
        created_at: '2024-01-13T11:15:00Z',
        view_count: 654,
        like_count: 32,
        comment_count: 8,
        is_featured: false
      }
    ]

    setPosts(samplePosts)
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesCategory = true
    if (selectedCategory === 'featured') matchesCategory = post.is_featured === true
    if (selectedCategory === 'policy') matchesCategory = post.tags.includes('정책')
    if (selectedCategory === 'law') matchesCategory = post.tags.includes('법안') || post.tags.includes('개인회생')
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <Newspaper className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">뉴스</h1>
          </div>
          <p className="text-red-100 text-lg">
            신용회복 관련 최신 뉴스와 정책 소식을 전해드립니다.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-red-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                실시간 뉴스
              </div>
              <div>빠른 소식 전달</div>
            </div>
            <div className="bg-red-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                정책 업데이트
              </div>
              <div>정부 정책 소식</div>
            </div>
            <div className="bg-red-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                전문 분석
              </div>
              <div>깊이 있는 분석</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 검색 및 필터 */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="뉴스 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">전체</option>
              <option value="featured">주요뉴스</option>
              <option value="policy">정책</option>
              <option value="law">법안</option>
            </select>
            <button
              onClick={() => setShowWriteModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              소식 공유
            </button>
          </div>
        </div>

        {/* 광고 영역 */}
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full mr-2">
                [광고]
              </span>
              <span className="text-sm font-medium text-gray-900">
                📰 신용회복 관련 최신 뉴스 알림 서비스 ▶
              </span>
            </div>
            <button className="text-red-600 hover:text-red-800 text-sm font-medium">
              알림신청
            </button>
          </div>
        </div>

        {/* 주요 뉴스 섹션 */}
        {posts.filter(p => p.is_featured).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
              주요 뉴스
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.filter(p => p.is_featured).map(post => (
                <div key={post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        주요뉴스
                      </span>
                      <span className="text-sm text-gray-500 ml-auto">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 hover:text-red-600 cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>조회 {post.view_count}</span>
                      <span>댓글 {post.comment_count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 전체 뉴스 목록 */}
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Newspaper className="w-5 h-5 mr-2 text-red-600" />
          전체 뉴스
        </h2>
        <PostList 
          posts={filteredPosts} 
          category="news"
        />
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <PostWrite
          category="news"
          onClose={() => setShowWriteModal(false)}
          onSubmit={(newPost) => {
            setPosts([newPost, ...posts])
            setShowWriteModal(false)
          }}
        />
      )}
    </div>
  )
} 