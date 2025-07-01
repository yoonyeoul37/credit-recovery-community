'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X, Filter } from 'lucide-react'

export interface SearchFilters {
  query: string
  sortBy: 'latest' | 'popular' | 'views' | 'comments'
  timeRange: 'all' | 'day' | 'week' | 'month'
  hasImages: boolean | null
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void
  placeholder?: string
  className?: string
}

const SearchBar = ({ 
  onSearch, 
  placeholder = "제목, 내용, 태그, 닉네임으로 검색...", 
  className = "" 
}: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sortBy: 'latest',
    timeRange: 'all',
    hasImages: null
  })

  const handleSearch = (newQuery?: string) => {
    const searchQuery = newQuery !== undefined ? newQuery : query
    const newFilters = { ...filters, query: searchQuery }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const clearSearch = () => {
    setQuery('')
    const newFilters = { ...filters, query: '' }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const resetFilters = () => {
    const newFilters: SearchFilters = {
      query: '',
      sortBy: 'latest',
      timeRange: 'all',
      hasImages: null
    }
    setQuery('')
    setFilters(newFilters)
    onSearch(newFilters)
    setShowFilters(false)
  }

  return (
    <div className={`w-full ${className}`}>
      {/* 검색 바 */}
      <div className="relative flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 text-gray-900 placeholder-gray-500 bg-transparent border-0 focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="flex items-center border-l border-gray-300">
          <button
            onClick={() => handleSearch()}
            className="px-4 py-3 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700 transition-colors"
          >
            검색
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`ml-2 mr-2 p-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 필터 패널 */}
      {showFilters && (
        <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              상세 필터
            </h3>
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              초기화
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 정렬 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정렬 기준
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="latest">최신순</option>
                <option value="popular">인기순 (좋아요)</option>
                <option value="views">조회순</option>
                <option value="comments">댓글순</option>
              </select>
            </div>

            {/* 기간 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                작성 기간
              </label>
              <select
                value={filters.timeRange}
                onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">전체 기간</option>
                <option value="day">오늘</option>
                <option value="week">1주일</option>
                <option value="month">1개월</option>
              </select>
            </div>

            {/* 이미지 여부 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 포함
              </label>
              <select
                value={filters.hasImages === null ? 'all' : filters.hasImages ? 'yes' : 'no'}
                onChange={(e) => {
                  const value = e.target.value === 'all' ? null : e.target.value === 'yes'
                  handleFilterChange('hasImages', value)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">전체</option>
                <option value="yes">이미지 있음</option>
                <option value="no">텍스트만</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 활성 필터 태그 */}
      {(filters.query || filters.sortBy !== 'latest' || filters.timeRange !== 'all' || filters.hasImages !== null) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.query && (
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              검색: "{filters.query}"
              <button
                onClick={() => handleFilterChange('query', '')}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.sortBy !== 'latest' && (
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {filters.sortBy === 'popular' ? '인기순' : 
               filters.sortBy === 'views' ? '조회순' : '댓글순'}
              <button
                onClick={() => handleFilterChange('sortBy', 'latest')}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.timeRange !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              {filters.timeRange === 'day' ? '오늘' :
               filters.timeRange === 'week' ? '1주일' : '1개월'}
              <button
                onClick={() => handleFilterChange('timeRange', 'all')}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.hasImages !== null && (
            <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
              {filters.hasImages ? '이미지 있음' : '텍스트만'}
              <button
                onClick={() => handleFilterChange('hasImages', null)}
                className="ml-1 text-orange-600 hover:text-orange-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar 