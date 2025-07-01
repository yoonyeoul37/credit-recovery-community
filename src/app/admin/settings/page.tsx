'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Settings, Save, Plus, Edit, Trash2, Eye, EyeOff, Calendar, AlertCircle } from 'lucide-react'

// 공지사항 인터페이스
interface Notice {
  id: number
  title: string
  content: string
  type: 'info' | 'warning' | 'urgent'
  isActive: boolean
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'notices'>('general')
  const [settings, setSettings] = useState({
    siteName: '신용회복 커뮤니티',
    siteDescription: '신용회복과 재기를 위한 따뜻한 공간',
    maxPostsPerDay: 10,
    maxCommentsPerDay: 50,
    enableImageUpload: true,
    maxImageSize: 5,
    bannedWords: ['급전', '즉시대출', '무담보', '무보증', '현금화', '대출업체', '스팸', '광고'],
    enableAutoModeration: true
  })

  // 공지사항 관련 상태
  const [notices, setNotices] = useState<Notice[]>([])
  const [showNoticeForm, setShowNoticeForm] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'urgent',
    isActive: true,
    isPinned: false
  })

  // 공지사항 로드
  useEffect(() => {
    loadNotices()
  }, [])

  const loadNotices = () => {
    try {
      const savedNotices = localStorage.getItem('admin-notices')
      if (savedNotices) {
        setNotices(JSON.parse(savedNotices))
      } else {
        // 기본 공지사항 데이터
        const defaultNotices: Notice[] = [
          {
            id: 1,
            title: '🎉 신용회복 커뮤니티 오픈!',
            content: '안녕하세요! 신용회복을 위한 따뜻한 커뮤니티가 오픈했습니다.\n\n여러분의 경험과 정보를 나누며 함께 새로운 시작을 만들어가요.\n\n• 개인정보 보호를 위해 익명으로 활동해주세요\n• 서로를 존중하고 배려하는 마음으로 소통해주세요\n• 불법 대출 광고나 스팸은 즉시 신고해주세요',
            type: 'info',
            isActive: true,
            isPinned: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          },
          {
            id: 2,
            title: '⚠️ 불법 대출 광고 주의 안내',
            content: '최근 커뮤니티에 불법 대출 관련 광고가 증가하고 있습니다.\n\n다음과 같은 내용의 댓글이나 게시글을 발견하시면 즉시 신고해주세요:\n\n• "급전 필요하신 분", "즉시대출 가능"\n• "무담보 무보증", "신용불량자 OK"\n• 개인 연락처(전화번호, 카카오톡 ID) 요구\n\n⚠️ 이런 업체는 대부분 불법 사채업체입니다!\n정식 금융기관이 아닌 곳에서는 절대 대출받지 마세요.',
            type: 'warning',
            isActive: true,
            isPinned: true,
            createdAt: '2024-01-15T14:30:00Z',
            updatedAt: '2024-01-15T14:30:00Z'
          },
          {
            id: 3,
            title: '📋 개인회생 제도 변경 안내 (2024년)',
            content: '2024년부터 개인회생 제도가 일부 변경되었습니다.\n\n주요 변경사항:\n\n1. 최저변제액 기준 완화\n2. 변제기간 단축 가능 조건 확대\n3. 신청 서류 간소화\n\n자세한 내용은 법원 홈페이지나 전문가와 상담 후 진행하시기 바랍니다.\n\n※ 커뮤니티의 정보는 참고용이며, 정확한 법률 상담은 전문가에게 받으시기 바랍니다.',
            type: 'info',
            isActive: true,
            isPinned: false,
            createdAt: '2024-01-14T09:00:00Z',
            updatedAt: '2024-01-14T09:00:00Z'
          }
        ]
        setNotices(defaultNotices)
        localStorage.setItem('admin-notices', JSON.stringify(defaultNotices))
      }
    } catch (error) {
      console.error('공지사항 로드 실패:', error)
    }
  }

  const handleSave = () => {
    try {
      localStorage.setItem('admin-settings', JSON.stringify(settings))
      alert('✅ 설정이 저장되었습니다.')
    } catch (error) {
      alert('❌ 설정 저장에 실패했습니다.')
    }
  }

  // 공지사항 저장
  const saveNotice = () => {
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    try {
      const now = new Date().toISOString()
      
      if (editingNotice) {
        // 수정
        const updatedNotices = notices.map(notice =>
          notice.id === editingNotice.id
            ? { ...notice, ...noticeForm, updatedAt: now }
            : notice
        )
        setNotices(updatedNotices)
        localStorage.setItem('admin-notices', JSON.stringify(updatedNotices))
        alert('✅ 공지사항이 수정되었습니다.')
      } else {
        // 새 공지사항 추가
        const newNotice: Notice = {
          id: Date.now(),
          ...noticeForm,
          createdAt: now,
          updatedAt: now
        }
        const updatedNotices = [newNotice, ...notices]
        setNotices(updatedNotices)
        localStorage.setItem('admin-notices', JSON.stringify(updatedNotices))
        alert('✅ 새 공지사항이 추가되었습니다.')
      }

      // 폼 초기화
      setNoticeForm({
        title: '',
        content: '',
        type: 'info',
        isActive: true,
        isPinned: false
      })
      setShowNoticeForm(false)
      setEditingNotice(null)
      
    } catch (error) {
      alert('❌ 공지사항 저장에 실패했습니다.')
    }
  }

  // 공지사항 삭제
  const deleteNotice = (id: number) => {
    if (!confirm('이 공지사항을 삭제하시겠습니까?')) return

    try {
      const updatedNotices = notices.filter(notice => notice.id !== id)
      setNotices(updatedNotices)
      localStorage.setItem('admin-notices', JSON.stringify(updatedNotices))
      alert('✅ 공지사항이 삭제되었습니다.')
    } catch (error) {
      alert('❌ 공지사항 삭제에 실패했습니다.')
    }
  }

  // 공지사항 활성화/비활성화
  const toggleNoticeStatus = (id: number) => {
    try {
      const updatedNotices = notices.map(notice =>
        notice.id === id
          ? { ...notice, isActive: !notice.isActive, updatedAt: new Date().toISOString() }
          : notice
      )
      setNotices(updatedNotices)
      localStorage.setItem('admin-notices', JSON.stringify(updatedNotices))
    } catch (error) {
      alert('❌ 상태 변경에 실패했습니다.')
    }
  }

  // 공지사항 편집 시작
  const startEditNotice = (notice: Notice) => {
    setEditingNotice(notice)
    setNoticeForm({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      isActive: notice.isActive,
      isPinned: notice.isPinned
    })
    setShowNoticeForm(true)
  }

  // 공지사항 타입별 스타일
  const getNoticeTypeStyle = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  // 공지사항 타입 텍스트
  const getNoticeTypeText = (type: string) => {
    switch (type) {
      case 'urgent': return '🚨 긴급'
      case 'warning': return '⚠️ 주의'
      default: return 'ℹ️ 안내'
    }
  }

  return (
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
              <Settings className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">시스템 설정</h1>
            </div>
            
            {/* 탭 버튼 */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('general')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'general'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                기본 설정
              </button>
              <button
                onClick={() => setActiveTab('notices')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'notices'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                공지사항 관리
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 기본 설정 탭 */}
        {activeTab === 'general' && (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                설정 저장
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 기본 설정 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 설정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사이트 이름</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사이트 설명</label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* 제한 설정 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">제한 설정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">일일 게시글 제한</label>
                    <input
                      type="number"
                      value={settings.maxPostsPerDay}
                      onChange={(e) => setSettings({...settings, maxPostsPerDay: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">일일 댓글 제한</label>
                    <input
                      type="number"
                      value={settings.maxCommentsPerDay}
                      onChange={(e) => setSettings({...settings, maxCommentsPerDay: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">최대 이미지 크기 (MB)</label>
                    <input
                      type="number"
                      value={settings.maxImageSize}
                      onChange={(e) => setSettings({...settings, maxImageSize: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 기능 설정 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">기능 설정</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.enableImageUpload}
                      onChange={(e) => setSettings({...settings, enableImageUpload: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">이미지 업로드 허용</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.enableAutoModeration}
                      onChange={(e) => setSettings({...settings, enableAutoModeration: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">자동 검열 활성화</span>
                  </label>
                </div>
              </div>

              {/* 금지어 설정 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">금지어 설정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">금지어 목록 (쉼표로 구분)</label>
                    <textarea
                      value={settings.bannedWords.join(', ')}
                      onChange={(e) => setSettings({...settings, bannedWords: e.target.value.split(', ')})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="금지어를 쉼표로 구분하여 입력하세요"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    <p className="mb-2">현재 설정된 금지어:</p>
                    <div className="flex flex-wrap gap-2">
                      {settings.bannedWords.map((word, index) => (
                        <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 공지사항 관리 탭 */}
        {activeTab === 'notices' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">공지사항 관리</h2>
                <p className="text-gray-600 mt-1">커뮤니티 공지사항을 작성하고 관리하세요</p>
              </div>
              <button
                onClick={() => {
                  setShowNoticeForm(true)
                  setEditingNotice(null)
                  setNoticeForm({
                    title: '',
                    content: '',
                    type: 'info',
                    isActive: true,
                    isPinned: false
                  })
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                새 공지사항 작성
              </button>
            </div>

            {/* 공지사항 작성/편집 폼 */}
            {showNoticeForm && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingNotice ? '공지사항 수정' : '새 공지사항 작성'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                    <input
                      type="text"
                      value={noticeForm.title}
                      onChange={(e) => setNoticeForm({...noticeForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="공지사항 제목을 입력하세요"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">유형</label>
                      <select
                        value={noticeForm.type}
                        onChange={(e) => setNoticeForm({...noticeForm, type: e.target.value as 'info' | 'warning' | 'urgent'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="info">ℹ️ 일반 안내</option>
                        <option value="warning">⚠️ 주의사항</option>
                        <option value="urgent">🚨 긴급</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-4 pt-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={noticeForm.isActive}
                          onChange={(e) => setNoticeForm({...noticeForm, isActive: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">활성화</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={noticeForm.isPinned}
                          onChange={(e) => setNoticeForm({...noticeForm, isPinned: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">상단 고정</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                    <textarea
                      value={noticeForm.content}
                      onChange={(e) => setNoticeForm({...noticeForm, content: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={8}
                      placeholder="공지사항 내용을 입력하세요"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowNoticeForm(false)
                        setEditingNotice(null)
                      }}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      취소
                    </button>
                    <button
                      onClick={saveNotice}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {editingNotice ? '수정' : '저장'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 공지사항 목록 */}
            <div className="space-y-4">
              {notices.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">등록된 공지사항이 없습니다.</p>
                </div>
              ) : (
                notices.map((notice) => (
                  <div key={notice.id} className={`bg-white rounded-lg shadow-sm border p-6 ${
                    !notice.isActive ? 'opacity-60' : ''
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getNoticeTypeStyle(notice.type)}`}>
                            {getNoticeTypeText(notice.type)}
                          </span>
                          {notice.isPinned && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                              📌 고정
                            </span>
                          )}
                          {!notice.isActive && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium border border-gray-200">
                              비활성
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{notice.title}</h3>
                        <p className="text-gray-600 whitespace-pre-wrap">{notice.content}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-3">
                          <Calendar className="w-4 h-4 mr-1" />
                          작성: {new Date(notice.createdAt).toLocaleString('ko-KR')}
                          {notice.updatedAt !== notice.createdAt && (
                            <span className="ml-4">수정: {new Date(notice.updatedAt).toLocaleString('ko-KR')}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => toggleNoticeStatus(notice.id)}
                          className={`p-2 rounded-lg ${
                            notice.isActive 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={notice.isActive ? '비활성화' : '활성화'}
                        >
                          {notice.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => startEditNotice(notice)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="수정"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteNotice(notice.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
} 