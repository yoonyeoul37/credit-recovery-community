'use client'

import { useState, useEffect } from 'react'
import PostList from '@/components/PostList'
import PostWrite from '@/components/PostWrite'
import { Target, Plus, Search, Users, CheckCircle, Clock } from 'lucide-react'

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

export default function CreditWorkoutPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: 1,
        title: '워크아웃 신청 후 3년만에 완전 정상화!',
        content: '신용회복워크아웃 신청해서 3년간 성실히 변제했습니다. 이제 모든 채무가 정리되고 신용도 많이 회복됐어요. 워크아웃 과정 상세히 공유드려요.',
        author: '완전회복',
        category: 'credit-workout',
        tags: ['워크아웃', '변제완료', '신용회복'],
        created_at: '2024-01-15T13:30:00Z',
        view_count: 567,
        like_count: 38,
        comment_count: 15
      },
      {
        id: 2,
        title: '워크아웃 vs 개인회생, 어떤걸 선택해야 할까요?',
        content: '채무가 많아서 고민 중입니다. 워크아웃과 개인회생 중 어떤 것을 선택해야 할지 기준이 궁금해요. 각각의 장단점을 알고 싶습니다.',
        author: '고민중',
        category: 'credit-workout',
        tags: ['워크아웃', '개인회생', '비교'],
        created_at: '2024-01-14T10:15:00Z',
        view_count: 890,
        like_count: 25,
        comment_count: 22
      },
      {
        id: 3,
        title: '워크아웃 변제 중 추가 대출 가능한가요?',
        content: '현재 워크아웃으로 변제 중인데 급하게 돈이 필요한 상황입니다. 워크아웃 진행 중에도 추가 대출이 가능한지 궁금해요.',
        author: '변제중',
        category: 'credit-workout',
        tags: ['워크아웃', '추가대출', '변제중'],
        created_at: '2024-01-13T15:45:00Z',
        view_count: 234,
        like_count: 8,
        comment_count: 6
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
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <Target className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">신용회복워크아웃</h1>
          </div>
          <p className="text-emerald-100 text-lg">
            신용회복위원회 워크아웃 프로그램 경험과 정보를 공유하는 공간입니다.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-emerald-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Users className="w-4 h-4 mr-1" />
                합의 중심
              </div>
              <div>채권자와 원만한 합의</div>
            </div>
            <div className="bg-emerald-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                분할 변제
              </div>
              <div>장기 분할 변제 가능</div>
            </div>
            <div className="bg-emerald-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                신용 회복
              </div>
              <div>변제 완료 후 정상화</div>
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
              placeholder="워크아웃 정보 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">모든 태그</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <button
              onClick={() => setShowWriteModal(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              글쓰기
            </button>
          </div>
        </div>

        {/* 광고 영역 */}
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full mr-2">
                [광고]
              </span>
              <span className="text-sm font-medium text-gray-900">
                🎯 워크아웃 전문 상담사 무료 상담받기 ▶
              </span>
            </div>
            <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
              상담신청
            </button>
          </div>
        </div>

        {/* 워크아웃 프로세스 안내 */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-3 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            워크아웃 프로세스
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mx-auto mb-2">1</div>
              <div className="font-medium">신청</div>
              <div className="text-gray-600">신용회복위원회 신청</div>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mx-auto mb-2">2</div>
              <div className="font-medium">심사</div>
              <div className="text-gray-600">채무조사 및 심사</div>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mx-auto mb-2">3</div>
              <div className="font-medium">합의</div>
              <div className="text-gray-600">채권자와 합의</div>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mx-auto mb-2">4</div>
              <div className="font-medium">변제</div>
              <div className="text-gray-600">약정에 따른 변제</div>
            </div>
          </div>
        </div>

        {/* 장단점 비교 */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">장점</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                <span>원금 감면 가능</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                <span>이자율 인하</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                <span>변제기간 연장</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                <span>강제집행 중지</span>
              </li>
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">주의사항</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-start">
                <div className="w-4 h-4 text-red-600 mr-2 mt-0.5">⚠️</div>
                <span>신용등급 하락</span>
              </li>
              <li className="flex items-start">
                <div className="w-4 h-4 text-red-600 mr-2 mt-0.5">⚠️</div>
                <span>신규 대출 제한</span>
              </li>
              <li className="flex items-start">
                <div className="w-4 h-4 text-red-600 mr-2 mt-0.5">⚠️</div>
                <span>변제 의무 지속</span>
              </li>
              <li className="flex items-start">
                <div className="w-4 h-4 text-red-600 mr-2 mt-0.5">⚠️</div>
                <span>채권자 동의 필요</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 게시글 목록 */}
        <PostList 
          posts={filteredPosts} 
          category="credit-workout"
        />
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <PostWrite
          category="credit-workout"
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