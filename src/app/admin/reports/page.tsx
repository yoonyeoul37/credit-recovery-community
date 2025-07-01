'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminAuth from '@/components/AdminAuth'
import { ArrowLeft, Flag, Search, Filter, Eye, Check, X, AlertTriangle, Clock, User } from 'lucide-react'

interface Report {
  id: number
  post_id: number
  post_title: string
  post_author: string
  report_reason: string
  report_detail: string
  reported_at: string
  reporter_ip: string
  status: 'pending' | 'resolved' | 'rejected'
}

export default function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved' | 'rejected'>('all')
  const [filterReason, setFilterReason] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const reportsPerPage = 10

  // 신고 데이터 로드
  const loadReports = () => {
    try {
      const adminReports = JSON.parse(localStorage.getItem('admin-reports') || '[]')
      setReports(adminReports)
      console.log('🚨 관리자: 신고 데이터 로딩 완료:', adminReports.length, '개')
    } catch (error) {
      console.error('❌ 신고 데이터 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  // 검색 및 필터링
  useEffect(() => {
    let filtered = reports

    // 검색어 필터링
    if (searchQuery.trim()) {
      filtered = filtered.filter(report => 
        report.post_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.post_author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.report_detail.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 상태 필터링
    if (filterStatus !== 'all') {
      filtered = filtered.filter(report => report.status === filterStatus)
    }

    // 신고 사유 필터링
    if (filterReason !== 'all') {
      filtered = filtered.filter(report => report.report_reason === filterReason)
    }

    // 최신 순으로 정렬
    filtered.sort((a, b) => new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime())

    setFilteredReports(filtered)
    setCurrentPage(1)
  }, [reports, searchQuery, filterStatus, filterReason])

  // 신고 처리
  const handleReportAction = (reportId: number, action: 'resolved' | 'rejected') => {
    if (!confirm(`이 신고를 ${action === 'resolved' ? '승인' : '반려'}하시겠습니까?`)) return

    try {
      const updatedReports = reports.map(report => 
        report.id === reportId 
          ? { ...report, status: action }
          : report
      )
      
      setReports(updatedReports)
      localStorage.setItem('admin-reports', JSON.stringify(updatedReports))
      
      console.log(`🔧 신고 ${action === 'resolved' ? '승인' : '반려'} 완료:`, reportId)
    } catch (error) {
      console.error('❌ 신고 처리 실패:', error)
    }
  }

  // 시간 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\. /g, '-').replace('.', '')
    } catch {
      return dateString
    }
  }

  // 신고 사유 텍스트
  const getReasonText = (reason: string) => {
    const reasons: { [key: string]: string } = {
      'spam': '스팸/광고',
      'abuse': '욕설/비방',
      'inappropriate': '부적절한 내용',
      'misinformation': '허위정보',
      'privacy': '개인정보 노출',
      'other': '기타'
    }
    return reasons[reason] || reason
  }

  // 상태 스타일
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // 상태 텍스트
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '대기 중'
      case 'resolved': return '승인됨'
      case 'rejected': return '반려됨'
      default: return status
    }
  }

  // 페이징 계산
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)
  const startIndex = (currentPage - 1) * reportsPerPage
  const endIndex = startIndex + reportsPerPage
  const currentReports = filteredReports.slice(startIndex, endIndex)

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link 
                  href="/admin"
                  className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  대시보드
                </Link>
                <Flag className="w-6 h-6 text-orange-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">신고 관리</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 검색 및 필터 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              {/* 검색 */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="게시글 제목, 작성자, 신고 내용으로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* 필터 */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">전체 상태</option>
                    <option value="pending">대기 중</option>
                    <option value="resolved">승인됨</option>
                    <option value="rejected">반려됨</option>
                  </select>
                </div>
                
                <select
                  value={filterReason}
                  onChange={(e) => setFilterReason(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체 사유</option>
                  <option value="spam">스팸/광고</option>
                  <option value="abuse">욕설/비방</option>
                  <option value="inappropriate">부적절한 내용</option>
                  <option value="misinformation">허위정보</option>
                  <option value="privacy">개인정보 노출</option>
                  <option value="other">기타</option>
                </select>
              </div>
            </div>
            
            {/* 통계 */}
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
              <span>전체: <strong>{reports.length}</strong>건</span>
              <span>검색결과: <strong>{filteredReports.length}</strong>건</span>
              <span>대기: <strong>{reports.filter(r => r.status === 'pending').length}</strong>건</span>
              <span>승인: <strong>{reports.filter(r => r.status === 'resolved').length}</strong>건</span>
              <span>반려: <strong>{reports.filter(r => r.status === 'rejected').length}</strong>건</span>
            </div>
          </div>

          {/* 신고 목록 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">신고 데이터를 불러오는 중...</p>
              </div>
            ) : currentReports.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">신고가 없습니다</p>
                <p>검색 조건을 변경하거나 새로고침을 시도해보세요.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {currentReports.map((report) => (
                  <div key={report.id} className={`p-6 ${report.status === 'pending' ? 'bg-yellow-50' : 'bg-white'}`}>
                    <div className="flex justify-between items-start space-x-4">
                      <div className="flex-1 min-w-0">
                        {/* 신고 정보 헤더 */}
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusStyle(report.status)}`}>
                            {getStatusText(report.status)}
                          </span>
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                            {getReasonText(report.report_reason)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(report.reported_at)}
                          </span>
                        </div>

                        {/* 신고된 게시글 정보 */}
                        <div className="mb-3">
                          <h3 className="font-medium text-gray-900 mb-1">
                            신고된 게시글: {report.post_title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              작성자: {report.post_author}
                            </span>
                            <span>게시글 ID: {report.post_id}</span>
                          </div>
                        </div>

                        {/* 신고 세부 내용 */}
                        {report.report_detail && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                              "{report.report_detail}"
                            </p>
                          </div>
                        )}

                        {/* 신고자 정보 */}
                        <div className="text-xs text-gray-500">
                          신고자: {report.reporter_ip}
                        </div>
                      </div>
                      
                      {/* 관리 버튼들 */}
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/credit-story/${report.post_id}`}
                          className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="게시글 보기"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        
                        {report.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleReportAction(report.id, 'resolved')}
                              className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="신고 승인"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReportAction(report.id, 'rejected')}
                              className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="신고 반려"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 페이징 */}
            {!loading && filteredReports.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    총 <span className="font-medium">{filteredReports.length}</span>건 중{' '}
                    <span className="font-medium">{startIndex + 1}</span>-<span className="font-medium">{Math.min(endIndex, filteredReports.length)}</span> 표시
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminAuth>
  )
} 