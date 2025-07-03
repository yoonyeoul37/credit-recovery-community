'use client'

import { useState, useEffect } from 'react'
import PostList from '@/components/PostList'
import PostWrite from '@/components/PostWrite'
import { BarChart3, Plus, Search, TrendingUp, Clock, Award } from 'lucide-react'

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

export default function ExemptionCreditPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: 1,
        title: '면책 후 2년, 신용등급 6등급까지 올랐습니다!',
        content: '면책 결정 받고 2년 동안 꾸준히 신용관리했더니 10등급에서 6등급까지 올랐어요. 제가 사용한 신용등급 관리 방법들 공유드려요.',
        author: '등급상승',
        category: 'exemption-credit',
        tags: ['신용등급', '면책후', '관리방법'],
        created_at: '2024-01-15T12:30:00Z',
        view_count: 789,
        like_count: 45,
        comment_count: 18
      },
      {
        id: 2,
        title: '신용등급 올리는 실전 노하우 총정리',
        content: '면책자들이 실제로 신용등급을 올린 방법들을 정리해봤습니다. 1. 체크카드 사용 2. 통신비 자동이체 3. 소액 적금 등',
        author: '신용관리왕',
        category: 'exemption-credit',
        tags: ['신용등급', '노하우', '실전'],
        created_at: '2024-01-14T11:45:00Z',
        view_count: 1234,
        like_count: 67,
        comment_count: 25
      },
      {
        id: 3,
        title: '[질문] 면책 후 신용등급 조회 자주 해도 되나요?',
        content: '면책 받은 지 6개월인데 신용등급이 궁금해서 자주 조회하고 있어요. 너무 자주 조회하면 등급에 안 좋다는 얘기가 있던데 사실인가요?',
        author: '궁금이',
        category: 'exemption-credit',
        tags: ['신용조회', '면책후', '등급영향'],
        created_at: '2024-01-13T16:20:00Z',
        view_count: 345,
        like_count: 12,
        comment_count: 8
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
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">면책후 신용등급</h1>
          </div>
          <p className="text-indigo-100 text-lg">
            면책 결정 후 신용등급 회복과 관리 방법을 공유하는 공간입니다.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-indigo-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                등급 상승
              </div>
              <div>체계적 신용관리</div>
            </div>
            <div className="bg-indigo-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                점진적 회복
              </div>
              <div>꾸준한 관리가 핵심</div>
            </div>
            <div className="bg-indigo-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Award className="w-4 h-4 mr-1" />
                성공 사례
              </div>
              <div>실제 경험담 공유</div>
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
              placeholder="신용등급 정보 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">모든 태그</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <button
              onClick={() => setShowWriteModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              글쓰기
            </button>
          </div>
        </div>

        {/* 광고 영역 */}
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full mr-2">
                [광고]
              </span>
              <span className="text-sm font-medium text-gray-900">
                📊 면책후 신용등급 관리 서비스 바로가기 ▶
              </span>
            </div>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              등급관리
            </button>
          </div>
        </div>

        {/* 신용등급 관리 팁 */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            신용등급 관리 핵심 포인트
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</div>
                <div>
                  <div className="font-medium">체크카드 사용</div>
                  <div className="text-gray-600">매월 일정액 사용하여 결제이력 쌓기</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</div>
                <div>
                  <div className="font-medium">자동이체 설정</div>
                  <div className="text-gray-600">통신비, 보험료 등 자동이체 설정</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</div>
                <div>
                  <div className="font-medium">소액 적금</div>
                  <div className="text-gray-600">매월 소액이라도 꾸준히 적금 유지</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</div>
                <div>
                  <div className="font-medium">신용조회 자제</div>
                  <div className="text-gray-600">너무 자주 조회하지 않기</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 게시글 목록 */}
        <PostList 
          posts={filteredPosts} 
          category="exemption-credit"
        />
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <PostWrite
          category="exemption-credit"
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