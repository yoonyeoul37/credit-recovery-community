'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Flag, Eye, Check, X, Clock, AlertTriangle, Filter, Search, RefreshCw } from 'lucide-react'
import AdminAuth from '@/components/AdminAuth'
import { supabase } from '@/lib/supabase'
import { formatAdminTime } from '@/lib/utils'

interface ChatReport {
  id: number
  message_id: number
  reporter_ip_hash: string
  reporter_nickname: string
  report_reason: string
  details: string | null
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  created_at: string
  updated_at: string
  processed_by?: string
  admin_notes?: string
  // 메시지 정보
  message?: {
    id: number
    message: string
    user_nickname: string
    room_id: number
    created_at: string
    is_deleted: boolean
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ChatReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [processingReportId, setProcessingReportId] = useState<number | null>(null)
  const [selectedReport, setSelectedReport] = useState<ChatReport | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  // 신고 목록 로드
  const loadReports = async () => {
    try {
      setLoading(true)
      console.log('📋 신고 목록 로딩 시작...')

      // 신고와 관련 메시지 정보를 함께 가져오기
      const { data: reportsData, error } = await supabase
        .from('chat_reports')
        .select(`
          *,
          message:chat_messages!inner(
            id,
            message,
            user_nickname,
            room_id,
            created_at,
            is_deleted
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ 신고 목록 로딩 실패:', error)
        throw error
      }

      console.log('✅ 신고 목록 로딩 성공:', reportsData?.length, '건')
      setReports(reportsData || [])

    } catch (err) {
      console.error('❌ 신고 목록 로딩 에러:', err)
      setError('신고 목록을 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 신고 상태 변경
  const updateReportStatus = async (reportId: number, status: string, notes?: string) => {
    try {
      setProcessingReportId(reportId)

      const { error } = await supabase
        .from('chat_reports')
        .update({
          status,
          admin_notes: notes || null,
          processed_by: 'admin', // 실제로는 로그인한 관리자 ID
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId)

      if (error) {
        console.error('신고 상태 변경 실패:', error)
        alert('상태 변경에 실패했습니다.')
        return
      }

      // 해결됨 상태일 때 메시지 삭제 처리
      if (status === 'resolved') {
        const report = reports.find(r => r.id === reportId)
        if (report?.message_id) {
          await supabase
            .from('chat_messages')
            .update({
              is_deleted: true,
              deleted_by: 'admin',
              deleted_reason: `신고 처리: ${report.report_reason}`,
              deleted_at: new Date().toISOString()
            })
            .eq('id', report.message_id)
        }
      }

      alert('신고 처리가 완료되었습니다.')
      loadReports() // 목록 새로고침
      setSelectedReport(null)
      setAdminNotes('')

    } catch (err) {
      console.error('신고 처리 오류:', err)
      alert('처리 중 오류가 발생했습니다.')
    } finally {
      setProcessingReportId(null)
    }
  }

  // 필터링된 신고 목록
  const filteredReports = reports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus
    const matchesSearch = searchTerm === '' || 
      report.reporter_nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.report_reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.message?.message || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'dismissed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // 상태 한글명
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '대기중'
      case 'reviewed': return '검토중'
      case 'resolved': return '해결됨'
      case 'dismissed': return '기각됨'
      default: return '알 수 없음'
    }
  }

  // 신고 사유 한글명
  const getReasonText = (reason: string) => {
    switch (reason) {
      case '욕설/비방': return '욕설/비방'
      case '스팸': return '스팸'
      case '부적절한 내용': return '부적절한 내용'
      case '개인정보 노출': return '개인정보 노출'
      case '상업적 홍보': return '상업적 홍보'
      case '기타': return '기타'
      default: return reason
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
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
                <Flag className="w-8 h-8 text-red-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">채팅 신고 관리</h1>
              </div>
              <button
                onClick={loadReports}
                disabled={loading}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                새로고침
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 필터 및 검색 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">전체 상태</option>
                    <option value="pending">대기중</option>
                    <option value="reviewed">검토중</option>
                    <option value="resolved">해결됨</option>
                    <option value="dismissed">기각됨</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="신고자, 사유, 메시지 내용 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                총 {filteredReports.length}건의 신고
              </div>
            </div>
          </div>

          {/* 신고 목록 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">신고 목록을 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={loadReports}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  다시 시도
                </button>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="p-8 text-center">
                <Flag className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchTerm || filterStatus !== 'all' ? '조건에 맞는 신고가 없습니다.' : '아직 신고가 없습니다.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <div key={report.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {getStatusText(report.status)}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {getReasonText(report.reason)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatAdminTime(report.created_at)}
                          </span>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">신고자:</span> 💚 {report.reporter_nickname}
                          </p>
                          {report.details && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">상세 내용:</span> {report.details}
                            </p>
                          )}
                        </div>

                        {/* 신고된 메시지 */}
                        {report.message && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-500">신고된 메시지</span>
                              <span className="text-xs text-gray-500">
                                💚 {report.message.user_nickname} • {formatAdminTime(report.message.created_at)}
                              </span>
                            </div>
                            <p className={`text-sm ${report.message.is_deleted ? 'text-gray-500 italic' : 'text-gray-900'}`}>
                              {report.message.is_deleted ? '🚫 삭제된 메시지입니다' : report.message.message}
                            </p>
                          </div>
                        )}

                        {/* 관리자 노트 */}
                        {report.admin_notes && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-3">
                            <p className="text-xs text-blue-600 font-medium mb-1">관리자 노트</p>
                            <p className="text-sm text-blue-800">{report.admin_notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="상세 보기"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {report.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateReportStatus(report.id, 'resolved', '부적절한 메시지로 판단하여 삭제 처리')}
                              disabled={processingReportId === report.id}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                              title="해결 처리 (메시지 삭제)"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateReportStatus(report.id, 'dismissed', '신고 내용이 부적절하여 기각')}
                              disabled={processingReportId === report.id}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                              title="기각 처리"
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
          </div>
        </div>

        {/* 상세 모달 */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Flag className="w-5 h-5 mr-2 text-red-500" />
                  신고 상세 정보
                </h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">신고 ID</label>
                    <p className="text-sm text-gray-900">#{selectedReport.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                      {getStatusText(selectedReport.status)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">신고자</label>
                  <p className="text-sm text-gray-900">💚 {selectedReport.reporter_nickname}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">신고 사유</label>
                  <p className="text-sm text-gray-900">{getReasonText(selectedReport.reason)}</p>
                </div>

                {selectedReport.details && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상세 내용</label>
                    <p className="text-sm text-gray-900">{selectedReport.details}</p>
                  </div>
                )}

                {selectedReport.message && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">신고된 메시지</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">
                          💚 {selectedReport.message.user_nickname}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatAdminTime(selectedReport.message.created_at)}
                        </span>
                      </div>
                      <p className={`text-sm ${selectedReport.message.is_deleted ? 'text-gray-500 italic' : 'text-gray-900'}`}>
                        {selectedReport.message.is_deleted ? '🚫 삭제된 메시지입니다' : selectedReport.message.message}
                      </p>
                    </div>
                  </div>
                )}

                {selectedReport.status === 'pending' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">관리자 노트</label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="처리 사유나 추가 정보를 입력하세요..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                )}

                {selectedReport.admin_notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">기존 관리자 노트</label>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800">{selectedReport.admin_notes}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">신고 시간</label>
                    <p className="text-sm text-gray-900">{formatAdminTime(selectedReport.created_at)}</p>
                  </div>
                  {selectedReport.updated_at !== selectedReport.created_at && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">마지막 수정</label>
                      <p className="text-sm text-gray-900">{formatAdminTime(selectedReport.updated_at)}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedReport.status === 'pending' && (
                <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => updateReportStatus(selectedReport.id, 'resolved', adminNotes || '부적절한 메시지로 판단하여 삭제 처리')}
                    disabled={processingReportId === selectedReport.id}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                  >
                    {processingReportId === selectedReport.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        해결 처리 (메시지 삭제)
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => updateReportStatus(selectedReport.id, 'dismissed', adminNotes || '신고 내용이 부적절하여 기각')}
                    disabled={processingReportId === selectedReport.id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                  >
                    {processingReportId === selectedReport.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        기각 처리
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminAuth>
  )
} 