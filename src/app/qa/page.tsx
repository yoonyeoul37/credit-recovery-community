'use client'

import { useState, useEffect } from 'react'
import PostList from '@/components/PostList'
import PostWrite from '@/components/PostWrite'
import { HelpCircle, Plus, Search, MessageSquare, Users, CheckCircle } from 'lucide-react'
import PersonalRecoveryCalculator from '../../components/PersonalRecoveryCalculator'
import LoanCalculator from '../../components/LoanCalculator'

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
  is_answered?: boolean
}

export default function QAPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all') // all, answered, unanswered

  useEffect(() => {
    const samplePosts: Post[] = [
      {
        id: 1,
        title: '[질문] 개인회생 신청 자격 조건이 어떻게 되나요?',
        content: '개인회생을 신청하려고 하는데 자격 조건이 궁금합니다. 무담보 채무 한도나 소득 조건 등 자세히 알려주세요.',
        author: '초보자123',
        category: 'qa',
        tags: ['개인회생', '신청자격', '조건'],
        created_at: '2024-01-15T09:30:00Z',
        view_count: 234,
        like_count: 8,
        comment_count: 5,
        is_answered: true
      },
      {
        id: 2,
        title: '[답변완료] 면책 후 신용등급 회복 기간은?',
        content: '면책 결정을 받았는데 신용등급이 언제쯤 회복될까요? 보통 몇 년 정도 걸리는지 경험담 들려주세요.',
        author: '희망가득',
        category: 'qa',
        tags: ['면책후', '신용등급', '회복기간'],
        created_at: '2024-01-14T14:20:00Z',
        view_count: 456,
        like_count: 15,
        comment_count: 12,
        is_answered: true
      },
      {
        id: 3,
        title: '[긴급] 강제집행 받고 있는데 개인회생 가능한가요?',
        content: '현재 급여압류 당하고 있는 상황입니다. 이런 상태에서도 개인회생 신청이 가능한지 급하게 알고 싶어요.',
        author: '급한상황',
        category: 'qa',
        tags: ['강제집행', '급여압류', '개인회생'],
        created_at: '2024-01-15T16:45:00Z',
        view_count: 123,
        like_count: 3,
        comment_count: 2,
        is_answered: false
      }
    ]

    setPosts(samplePosts)
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesFilter = true
    if (filter === 'answered') matchesFilter = post.is_answered === true
    if (filter === 'unanswered') matchesFilter = post.is_answered === false
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <HelpCircle className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">Q&A</h1>
          </div>
          <p className="text-purple-100 text-lg">
            신용회복 관련 궁금한 점을 질문하고 답변받는 공간입니다.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-purple-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                무료 상담
              </div>
              <div>전문가 답변 제공</div>
            </div>
            <div className="bg-purple-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Users className="w-4 h-4 mr-1" />
                경험 공유
              </div>
              <div>실제 경험담 공유</div>
            </div>
            <div className="bg-purple-500/30 rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                빠른 답변
              </div>
              <div>24시간 내 답변</div>
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
              placeholder="질문 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">전체</option>
              <option value="unanswered">답변대기</option>
              <option value="answered">답변완료</option>
            </select>
            <button
              onClick={() => setShowWriteModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              질문하기
            </button>
          </div>
        </div>

        {/* 광고 영역 */}
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mr-2">
                [광고]
              </span>
              <span className="text-sm font-medium text-gray-900">
                ⚖️ 개인회생 전문 법무사 무료 상담받기 ▶
              </span>
            </div>
            <button className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
              무료상담
            </button>
          </div>
        </div>

        {/* 개인회생 변제금 계산기 섹션 */}
        <div className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            🧮 개인회생 변제금 계산기
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              자주 묻는 질문
            </span>
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            "내 변제금이 얼마나 될까요?" - 가장 많이 묻는 질문을 바로 계산해보세요!
          </p>
          
          {/* 계산기 컴포넌트 */}
          <PersonalRecoveryCalculator />
        </div>

        {/* 대출 계산기 섹션 */}
        <div className="mb-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            💰 대출 계산기
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              유용한 도구
            </span>
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            "대출 받으면 월 상환금이 얼마나 될까요?" - 미리 계산해보고 대출 계획을 세워보세요!
          </p>
          
          {/* 대출 계산기 컴포넌트 */}
          <LoanCalculator />
        </div>

        {/* 통계 */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg text-center border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{posts.length}</div>
            <div className="text-sm text-gray-600">총 질문수</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {posts.filter(p => p.is_answered).length}
            </div>
            <div className="text-sm text-gray-600">답변완료</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {posts.filter(p => !p.is_answered).length}
            </div>
            <div className="text-sm text-gray-600">답변대기</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((posts.filter(p => p.is_answered).length / posts.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">답변률</div>
          </div>
        </div>

        {/* 게시글 목록 */}
        <PostList 
          posts={filteredPosts} 
          category="qa"
        />
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <PostWrite
          category="qa"
          onClose={() => setShowWriteModal(false)}
          onSubmit={(newPost) => {
            setPosts([{...newPost, is_answered: false}, ...posts])
            setShowWriteModal(false)
          }}
        />
      )}
    </div>
  )
} 