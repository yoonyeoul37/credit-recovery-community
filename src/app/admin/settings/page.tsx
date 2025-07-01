'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Settings, Save } from 'lucide-react'

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: '신용회복 커뮤니티',
    siteDescription: '신용회복과 재기를 위한 따뜻한 공간',
    maxPostsPerDay: 10,
    maxCommentsPerDay: 50,
    enableImageUpload: true,
    maxImageSize: 5,
    bannedWords: ['스팸', '광고', '대출업체'],
    enableAutoModeration: true
  })

  const handleSave = () => {
    alert('설정이 저장되었습니다.')
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
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              저장
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 