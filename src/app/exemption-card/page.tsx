'use client'

import { useState, useEffect } from 'react'
import PostList from '@/components/PostList'
import PostWrite from '@/components/PostWrite'
import { CreditCard, Plus, Filter, Search } from 'lucide-react'

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
}

export default function ExemptionCardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  // 면책후카드발급 관련 게시글들 (샘플 데이터)
  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: 1,
        title: '면책 후 6개월, 신용카드 발급 가능할까요?',
        content: '면책 결정 받은 지 6개월이 지났는데, 신용카드 발급이 가능한지 궁금합니다. 어떤 카드사가 면책자에게 관대한지 경험 공유 부탁드려요.',
        author: '새출발123',
        category: 'exemption-card',
        tags: ['신용카드', '면책후', '발급'],
        created_at: '2024-01-15T10:30:00Z',
        view_count: 234,
        like_count: 15,
        comment_count: 8
      },
      {
        id: 2,
        title: '[성공] 면책 후 1년만에 우리카드 발급 성공!',
        content: '면책 결정 받고 1년 2개월 만에 우리카드 체크카드에서 신용카드로 전환 성공했습니다! 신용관리 팁 공유해드립니다.',
        author: '희망찬미래',
        category: 'exemption-card',
        tags: ['우리카드', '성공후기', '체크카드'],
        created_at: '2024-01-14T15:20:00Z',
        view_count: 456,
        like_count: 32,
        comment_count: 12
      },
      {
        id: 3,
        title: '면책자도 발급 가능한 신용카드 정리',
        content: '면책자들에게 비교적 관대한 카드사들을 정리해봤습니다. 1. 새마을금고 2. 수협 3. 우리카드 순으로 발급률이 높네요.',
        author: '정보공유왕',
        category: 'exemption-card',
        tags: ['정보', '카드사', '발급률'],
        created_at: '2024-01-13T09:15:00Z',
        view_count: 678,
        like_count: 28,
        comment_count: 19
      }
    ]

    setPosts(samplePosts)
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === '' || post.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <CreditCard className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">면책후 카드발급</h1>
          </div>
          <p className="text-blue-100 text-lg">
            면책 결정 후 신용카드 발급 경험과 정보를 공유하는 공간입니다.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-500/30 rounded-lg p-3">
              <div className="font-semibold">💳 체크카드부터</div>
              <div>체크카드로 신용 쌓기</div>
            </div>
            <div className="bg-blue-500/30 rounded-lg p-3">
              <div className="font-semibold">📈 신용관리</div>
              <div>꾸준한 신용등급 관리</div>
            </div>
            <div className="bg-blue-500/30 rounded-lg p-3">
              <div className="font-semibold">🎯 단계별 접근</div>
              <div>소액 한도부터 시작</div>
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
              placeholder="게시글 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">모든 태그</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <button
              onClick={() => setShowWriteModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              글쓰기
            </button>
          </div>
        </div>

        {/* 광고 영역 */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                [광고]
              </span>
              <span className="text-sm font-medium text-gray-900">
                💳 면책자 전용 신용카드 바로 발급받기 ▶
              </span>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              상담신청
            </button>
          </div>
        </div>

        {/* 게시글 목록 */}
        <PostList 
          posts={filteredPosts} 
          category="exemption-card"
        />
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <PostWrite
          category="exemption-card"
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