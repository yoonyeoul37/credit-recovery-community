'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye, MousePointer, Calendar, Settings, Upload, X } from 'lucide-react'
import AdminAuth from '@/components/AdminAuth'

interface PremiumAd {
  id: number
  title: string
  description: string
  imageUrl: string
  link: string
  position: string
  priority: number
  isActive: boolean
  clickCount: number
  impressions: number
  createdAt: string
  updatedAt: string
  expiresAt: string
}

const PremiumAdManagement = () => {
  const [ads, setAds] = useState<PremiumAd[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPosition, setSelectedPosition] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<PremiumAd | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    position: 'top',
    priority: 0,
    isActive: true
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/premium-ads?position=all')
      if (response.ok) {
        const data = await response.json()
        setAds(data)
      }
    } catch (error) {
      console.error('프리미엄 광고 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) { // 2MB 제한
      alert('이미지 크기는 2MB 이하여야 합니다.')
      return
    }

    setUploading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // 이미지 크기 조정
        const maxWidth = 800
        const maxHeight = 400
        let { width, height } = img

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        setFormData(prev => ({ ...prev, imageUrl: compressedDataUrl }))
        setUploading(false)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.imageUrl || !formData.link) {
      alert('제목, 이미지, 링크는 필수 항목입니다.')
      return
    }

    try {
      const method = editingAd ? 'PUT' : 'POST'
      const payload = editingAd 
        ? { ...formData, id: editingAd.id }
        : formData

      const response = await fetch('/api/premium-ads', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        alert(editingAd ? '광고가 수정되었습니다.' : '광고가 추가되었습니다.')
        setIsModalOpen(false)
        setEditingAd(null)
        resetForm()
        fetchAds()
      } else {
        alert('작업 실패!')
      }
    } catch (error) {
      console.error('광고 저장 오류:', error)
      alert('오류가 발생했습니다.')
    }
  }

  const handleEdit = (ad: PremiumAd) => {
    setEditingAd(ad)
    setFormData({
      title: ad.title,
      description: ad.description,
      imageUrl: ad.imageUrl,
      link: ad.link,
      position: ad.position,
      priority: ad.priority,
      isActive: ad.isActive
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('이 광고를 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/premium-ads?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('광고가 삭제되었습니다.')
        fetchAds()
      } else {
        alert('삭제 실패!')
      }
    } catch (error) {
      console.error('광고 삭제 오류:', error)
      alert('오류가 발생했습니다.')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      link: '',
      position: 'top',
      priority: 0,
      isActive: true
    })
    setEditingAd(null)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingAd(null)
    resetForm()
  }

  const filteredAds = selectedPosition === 'all' 
    ? ads 
    : ads.filter(ad => ad.position === selectedPosition)

  const getPositionBadge = (position: string) => {
    const badges = {
      'top': { text: '상단', color: 'bg-blue-100 text-blue-800' },
      'bottom': { text: '하단', color: 'bg-green-100 text-green-800' },
      'sidebar': { text: '사이드바', color: 'bg-purple-100 text-purple-800' }
    }
    const badge = badges[position as keyof typeof badges] || { text: position, color: 'bg-gray-100 text-gray-800' }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.text}</span>
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Settings className="mr-2" />
                💎 프리미엄 광고 관리
              </h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>새 광고 추가</span>
              </button>
            </div>

            {/* 필터 */}
            <div className="mb-6 flex space-x-4">
              <button
                onClick={() => setSelectedPosition('all')}
                className={`px-4 py-2 rounded-lg ${
                  selectedPosition === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setSelectedPosition('top')}
                className={`px-4 py-2 rounded-lg ${
                  selectedPosition === 'top'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                상단 광고
              </button>
              <button
                onClick={() => setSelectedPosition('bottom')}
                className={`px-4 py-2 rounded-lg ${
                  selectedPosition === 'bottom'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                하단 광고
              </button>
            </div>

            {/* 광고 목록 */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">로딩 중...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAds.map((ad) => (
                  <div key={ad.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                    <div className="relative">
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        {getPositionBadge(ad.position)}
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ad.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {ad.isActive ? '활성' : '비활성'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 truncate">{ad.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ad.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Eye size={14} className="mr-1" />
                            {ad.impressions.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <MousePointer size={14} className="mr-1" />
                            {ad.clickCount.toLocaleString()}
                          </span>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          우선순위: {ad.priority}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(ad)}
                          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg flex items-center justify-center space-x-1"
                        >
                          <Edit2 size={16} />
                          <span>수정</span>
                        </button>
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-lg flex items-center justify-center space-x-1"
                        >
                          <Trash2 size={16} />
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 모달 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingAd ? '광고 수정' : '새 광고 추가'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {uploading && (
                      <div className="text-sm text-blue-600">이미지 처리 중...</div>
                    )}
                    {formData.imageUrl && (
                      <img
                        src={formData.imageUrl}
                        alt="미리보기"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    링크 *
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    위치
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="top">상단</option>
                    <option value="bottom">하단</option>
                    <option value="sidebar">사이드바</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    우선순위
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    활성화
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    {editingAd ? '수정' : '추가'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminAuth>
  )
}

export default PremiumAdManagement 