'use client'

import { useState, useEffect } from 'react'
import PostList from '@/components/PostList'
import PostWrite from '@/components/PostWrite'
import { DollarSign, Plus, Filter, Search, TrendingUp, Shield, Clock } from 'lucide-react'

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

export default function LoanInfoPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  // 대출정보 관련 게시글들 (샘플 데이터)
  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: 1,
        title: '신용불량자도 가능한 대출 정보 정리',
        content: '신용불량자도 이용 가능한 대출 상품들을 정리해봤습니다. 1금융권은 어렵지만 2금융권, 3금융권에서는 가능성이 있어요.',
        author: '대출정보왕',
        category: 'loan-info',
        tags: ['신용불량', '2금융', '대출가능'],
        created_at: '2024-01-15T11:30:00Z',
        view_count: 567,
        like_count: 23,
        comment_count: 15
      },
      {
        id: 2,
        title: '면책자 대출 승인 받은 후기 (캐피탈)',
        content: '면책 후 2년 지나서 캐피탈에서 소액 대출 승인 받았습니다. 금리는 높지만 신용 쌓기용으로 이용 중이에요.',
        author: '재기성공',
        category: 'loan-info',
        tags: ['면책후', '캐피탈', '승인후기'],
        created_at: '2024-01-14T16:45:00Z',
        view_count: 345,
        like_count: 18,
        comment_count: 9
      },
      {
        id: 3,
        title: '[주의] 불법 사금융 피하는 방법',
        content: '급하다고 불법 사금융 이용하면 안됩니다. 합법적인 대출 업체 구분하는 방법과 주의사항 공유해요.',
        author: '안전제일',
        category: 'loan-info',
        tags: ['사금융', '주의사항', '합법업체'],
        created_at: '2024-01-13T14:20:00Z',
        view_count: 789,
        like_count: 45,
        comment_count: 22
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
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <DollarSign className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">대출정보</h1>
          </div>
          <p className="text-green-100 text-lg">
            신용회복 과정에서 필요한 대출 정보와 경험을 공유하는 공간입니다.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                안전한 대출
              </div>
              <div>합법 업체만 이용하기</div>
            </div>
            <div className="bg-green-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                신용 쌓기
              </div>
              <div>대출로 신용도 향상</div>
            </div>
            <div className="bg-green-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                단계별 접근
              </div>
              <div>소액부터 차근차근</div>
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
              placeholder="대출 정보 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">모든 태그</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <button
              onClick={() => setShowWriteModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              글쓰기
            </button>
          </div>
        </div>

        {/* 광고 영역 */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">
                [광고]
              </span>
              <span className="text-sm font-medium text-gray-900">
                💰 신용불량자 전용 대출 5분만에 신청하기 ▶
              </span>
            </div>
            <button className="text-green-600 hover:text-green-800 text-sm font-medium">
              대출상담
            </button>
          </div>
        </div>

        {/* 주의사항 안내 */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">대출 이용 시 주의사항</h3>
              <p className="text-sm text-yellow-700">
                • 불법 사금융 업체는 절대 이용하지 마세요<br/>
                • 과도한 고금리 대출은 피하세요<br/>
                • 상환 계획을 세우고 무리하지 마세요
              </p>
            </div>
          </div>
        </div>

        {/* 게시글 목록 */}
        <PostList 
          posts={filteredPosts} 
          category="loan-info"
        />
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <PostWrite
          category="loan-info"
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