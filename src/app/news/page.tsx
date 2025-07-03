'use client'

import { useState, useEffect } from 'react'
import { Calendar, Eye, Clock, ExternalLink, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  content: string
  summary: string
  imageUrl?: string
  sourceUrl?: string
  sourceName: string
  publishedAt: string
  category: string
  tags: string[]
  views: number
  isPinned?: boolean
}

// 샘플 뉴스 데이터
const sampleNews: NewsArticle[] = [
  {
    id: '1',
    title: '신용회복위원회, 2024년 신용회복 지원 대상 확대 발표',
    content: '신용회복위원회가 2024년 신용회복 지원 대상을 기존 대비 30% 확대한다고 발표했습니다. 이번 조치로 더 많은 금융취약계층이 신용회복 혜택을 받을 수 있을 것으로 기대됩니다.',
    summary: '신용회복위원회가 2024년 신용회복 지원 대상을 30% 확대한다고 발표했습니다.',
    imageUrl: '/api/placeholder/400/200',
    sourceUrl: 'https://www.kostat.go.kr',
    sourceName: '금융감독원',
    publishedAt: '2024-01-15',
    category: '정책',
    tags: ['신용회복', '정책', '금융지원'],
    views: 1250,
    isPinned: true
  },
  {
    id: '2',
    title: '면책 후 신용카드 발급 기준 완화, 주요 카드사 가이드라인 변경',
    content: '주요 카드사들이 면책 후 신용카드 발급 기준을 완화하기로 결정했습니다. 면책 후 1년 경과 시 발급 신청이 가능하도록 기준이 변경됩니다.',
    summary: '주요 카드사들이 면책 후 신용카드 발급 기준을 완화하기로 결정했습니다.',
    sourceUrl: 'https://www.fss.or.kr',
    sourceName: '연합뉴스',
    publishedAt: '2024-01-12',
    category: '카드',
    tags: ['면책', '신용카드', '발급기준'],
    views: 2100,
    isPinned: false
  },
  {
    id: '3',
    title: '개인회생 신청 절차 간소화, 온라인 신청 시스템 도입',
    content: '법원행정처가 개인회생 신청 절차를 간소화하고 온라인 신청 시스템을 도입한다고 발표했습니다. 이로써 개인회생 신청이 더욱 편리해질 것으로 예상됩니다.',
    summary: '개인회생 신청 절차가 간소화되고 온라인 신청 시스템이 도입됩니다.',
    sourceUrl: 'https://www.scourt.go.kr',
    sourceName: '법원행정처',
    publishedAt: '2024-01-10',
    category: '개인회생',
    tags: ['개인회생', '온라인신청', '절차간소화'],
    views: 1800,
    isPinned: false
  },
  {
    id: '4',
    title: '2024년 신용등급 평가 기준 변경 예정, 신용회복자에게 유리',
    content: '신용평가기관들이 2024년 신용등급 평가 기준을 변경할 예정이라고 발표했습니다. 새로운 기준은 신용회복자들에게 더 유리하게 적용될 것으로 예상됩니다.',
    summary: '2024년 신용등급 평가 기준이 변경되어 신용회복자에게 유리해집니다.',
    sourceUrl: 'https://www.nice.co.kr',
    sourceName: '머니투데이',
    publishedAt: '2024-01-08',
    category: '신용등급',
    tags: ['신용등급', '평가기준', '신용회복'],
    views: 1650,
    isPinned: false
  },
  {
    id: '5',
    title: '금융당국, 과도한 대출 마케팅 규제 강화 방안 발표',
    content: '금융당국이 과도한 대출 마케팅으로 인한 서민들의 피해를 줄이기 위해 규제 강화 방안을 발표했습니다. 특히 고금리 대출에 대한 광고 제한이 강화됩니다.',
    summary: '금융당국이 과도한 대출 마케팅 규제 강화 방안을 발표했습니다.',
    sourceUrl: 'https://www.fss.or.kr',
    sourceName: '한국경제',
    publishedAt: '2024-01-05',
    category: '규제',
    tags: ['대출마케팅', '규제', '금융당국'],
    views: 990,
    isPinned: false
  },
  {
    id: '6',
    title: '서민금융진흥원, 신용회복 지원 프로그램 확대 운영',
    content: '서민금융진흥원이 신용회복 지원 프로그램을 확대 운영한다고 발표했습니다. 저소득층과 신용회복자를 위한 다양한 금융지원 서비스가 제공됩니다.',
    summary: '서민금융진흥원이 신용회복 지원 프로그램을 확대 운영합니다.',
    sourceUrl: 'https://www.kinfa.or.kr',
    sourceName: '뉴스1',
    publishedAt: '2024-01-03',
    category: '지원',
    tags: ['서민금융', '신용회복', '지원프로그램'],
    views: 1320,
    isPinned: false
  }
]

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>(sampleNews)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')
  
  const newsPerPage = 6
  const categories = ['전체', '정책', '카드', '개인회생', '신용등급', '규제', '지원']

  // 필터링 및 정렬
  const filteredNews = news
    .filter(article => 
      (selectedCategory === '전체' || article.category === selectedCategory) &&
      (searchTerm === '' || 
       article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
       article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      if (sortBy === 'latest') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      } else {
        return b.views - a.views
      }
    })

  const totalPages = Math.ceil(filteredNews.length / newsPerPage)
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * newsPerPage,
    currentPage * newsPerPage
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSortChange = (sort: 'latest' | 'popular') => {
    setSortBy(sort)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 페이지 헤더 */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📰 신용회복 뉴스
          </h1>
          <p className="text-sm text-gray-600">
            신용회복 관련 최신 뉴스
          </p>
        </div>

        {/* 뉴스 카테고리 소개 섹션 */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl shadow-sm p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <h2 className="text-base font-semibold">신용회복 뉴스</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-blue-500/30 px-2 py-1 rounded-full">정책</span>
              <span className="bg-blue-500/30 px-2 py-1 rounded-full">카드</span>
              <span className="bg-blue-500/30 px-2 py-1 rounded-full">개인회생</span>
              <span className="bg-blue-500/30 px-2 py-1 rounded-full">신용등급</span>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
            {/* 검색 */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="뉴스 검색..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>

            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* 정렬 */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as 'latest' | 'popular')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="latest">최신순</option>
                <option value="popular">인기순</option>
              </select>
            </div>
          </div>
        </div>

        {/* 뉴스 목록 - 리스트 스타일 */}
        <div className="space-y-4 mb-8">
          {paginatedNews.map((article, index) => (
            <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              {article.isPinned && (
                <div className="bg-red-600 text-white text-xs px-3 py-1 font-medium rounded-t-xl">
                  📌 중요 뉴스
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="inline-block w-8 text-center text-lg font-bold text-blue-600">
                        {index + 1}.
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                        {article.category}
                      </span>
                      {article.isPinned && (
                        <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                          📌 핀 고정
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors leading-tight">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 text-base mb-4 leading-relaxed">
                      {article.summary.length > 120 ? article.summary.substring(0, 120) + '...' : article.summary}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 4 && (
                        <span className="text-gray-400 text-sm">+{article.tags.length - 4}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 ml-6">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{article.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="font-medium">{article.sourceName}</span>
                      {article.sourceUrl && (
                        <a
                          href={article.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-blue-600 font-medium hover:text-blue-800">
                    자세히 보기 →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* 관리자 공지 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <h3 className="text-lg font-semibold text-blue-900">관리자 공지</h3>
          </div>
          <p className="text-blue-800 text-sm">
            뉴스 페이지는 관리자가 직접 선별한 신용회복 관련 뉴스만 게시됩니다. 
            궁금한 뉴스나 제보하고 싶은 내용이 있으시면 관리자에게 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  )
} 