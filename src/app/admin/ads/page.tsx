'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Monitor,
  Image,
  ExternalLink,
  Calendar,
  BarChart3,
  Upload,
  X,
  Target,
  List,
  Settings
} from 'lucide-react'

interface Ad {
  id: number
  title: string
  description: string
  imageUrl: string
  link: string
  category: string
  adType: 'banner' | 'sidebar' | 'native'
  position: 'header' | 'sidebar' | 'content' | 'footer' | 'native'
  size: 'small' | 'medium' | 'large' | 'banner'
  isActive: boolean
  clickCount: number
  impressions: number
  createdAt: string
  expiresAt: string | null
  nativeConfig?: {
    showEvery: number
    ctaText: string
    backgroundColor: string
  }
}

interface AdFormData {
  title: string
  description: string
  imageUrl: string
  link: string
  category: string
  adType: 'banner' | 'sidebar' | 'native'
  position: 'header' | 'sidebar' | 'content' | 'footer' | 'native'
  size: 'small' | 'medium' | 'large' | 'banner'
  expiresAt: string
  nativeConfig?: {
    showEvery: number
    ctaText: string
    backgroundColor: string
  }
}

// 기본 제공 이미지 갤러리
const defaultImages = [
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    category: '법무사',
    description: '전문가 상담'
  },
  {
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
    category: '신용카드',
    description: '카드 발급'
  },
  {
    url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=200&fit=crop',
    category: '대출',
    description: '대출 상담'
  },
  {
    url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop',
    category: '신용관리',
    description: '신용점수 관리'
  },
  {
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=200&fit=crop',
    category: '법률상담',
    description: '법률 서비스'
  },
  {
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
    category: '비즈니스',
    description: '사업 재건'
  },
  {
    url: 'https://images.unsplash.com/photo-1519452634265-7b808fcb3be2?w=300&h=200&fit=crop',
    category: '성공',
    description: '성공 사례'
  },
  {
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop',
    category: '금융',
    description: '금융 서비스'
  }
]

export default function AdManagement() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [showImageGallery, setShowImageGallery] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<AdFormData>({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    category: 'personalRecoveryBankruptcy',
    adType: 'native',
    position: 'native',
    size: 'medium',
    expiresAt: '',
    nativeConfig: {
      showEvery: 4,
      ctaText: '',
      backgroundColor: '#dbeafe'
    }
  })

  // 광고 목록 조회
  const fetchAds = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ads')
      const data = await response.json()
      
      if (response.ok) {
        setAds(data.ads || [])
      } else {
        console.error('광고 조회 실패:', data.error)
        alert('광고 목록을 불러오는데 실패했습니다.')
      }
    } catch (error) {
      console.error('광고 조회 오류:', error)
      alert('광고 목록을 불러오는데 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트 마운트 시 광고 목록 조회
  useEffect(() => {
    fetchAds()
  }, [])

  // 파일 업로드 핸들러
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('📁 파일 업로드 시작:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileSizeMB: (file.size / (1024 * 1024)).toFixed(2)
    })

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      console.error('❌ 잘못된 파일 타입:', file.type)
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      console.error('❌ 파일 크기 초과:', { size: file.size, maxSize: 5 * 1024 * 1024 })
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    console.log('✅ 파일 검증 통과, Base64 변환 시작...')
    setUploading(true)

    try {
      // FileReader를 사용해서 base64로 변환
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        console.log('✅ Base64 변환 완료:', {
          base64Length: base64.length,
          estimatedSizeKB: (base64.length * 0.75 / 1024).toFixed(2),
          prefix: base64.substring(0, 50) + '...'
        })
        setFormData({...formData, imageUrl: base64})
        setUploading(false)
      }
      reader.onerror = (error) => {
        console.error('❌ 파일 읽기 실패:', error)
        alert('파일 읽기에 실패했습니다.')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('❌ 파일 업로드 오류:', error)
      alert('파일 업로드에 실패했습니다.')
      setUploading(false)
    }
  }

  // 이미지 선택 핸들러
  const selectImage = (imageUrl: string) => {
    setFormData({...formData, imageUrl})
    setShowImageGallery(false)
  }

  // 이미지 미리보기 컴포넌트
  const ImagePreview = ({ url, alt = "광고 이미지" }: { url: string; alt?: string }) => {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)

    if (imageError || !url) {
      return (
        <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Image className="w-8 h-8 text-gray-400 mx-auto mb-1" />
            <span className="text-xs text-gray-500">이미지 없음</span>
          </div>
        </div>
      )
    }

    return (
      <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        )}
        <img
          src={url}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      </div>
    )
  }

  const toggleAdStatus = async (id: number) => {
    const ad = ads.find(ad => ad.id === id)
    if (!ad) return

    try {
      const response = await fetch('/api/ads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: ad.id,
          isActive: !ad.isActive
        })
      })

      if (response.ok) {
        setAds(ads.map(a => 
          a.id === id ? { ...a, isActive: !a.isActive } : a
        ))
      } else {
        alert('광고 상태 변경에 실패했습니다.')
      }
    } catch (error) {
      console.error('광고 상태 변경 오류:', error)
      alert('광고 상태 변경 중 오류가 발생했습니다.')
    }
  }

  const handleAddAd = async () => {
    if (!formData.title || !formData.description || !formData.imageUrl) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    try {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isActive: true
        })
      })

      if (response.ok) {
        await fetchAds() // 목록 새로고침
        setShowAddModal(false)
        resetForm()
        alert('광고가 성공적으로 추가되었습니다.')
      } else {
        const data = await response.json()
        alert(`광고 추가에 실패했습니다: ${data.error}`)
      }
    } catch (error) {
      console.error('광고 추가 오류:', error)
      alert('광고 추가 중 오류가 발생했습니다.')
    }
  }

  const handleEditAd = async () => {
    if (!editingAd || !formData.title || !formData.description || !formData.imageUrl) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    try {
      const response = await fetch('/api/ads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingAd.id,
          ...formData
        })
      })

      if (response.ok) {
        await fetchAds() // 목록 새로고침
        setEditingAd(null)
        resetForm()
        alert('광고가 성공적으로 수정되었습니다.')
      } else {
        const data = await response.json()
        alert(`광고 수정에 실패했습니다: ${data.error}`)
      }
    } catch (error) {
      console.error('광고 수정 오류:', error)
      alert('광고 수정 중 오류가 발생했습니다.')
    }
  }

  const handleDeleteAd = async (adId: number) => {
    if (!confirm('정말로 이 광고를 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch('/api/ads', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: adId })
      })

      if (response.ok) {
        setAds(ads.filter(ad => ad.id !== adId))
        alert('광고가 성공적으로 삭제되었습니다.')
      } else {
        alert('광고 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('광고 삭제 오류:', error)
      alert('광고 삭제 중 오류가 발생했습니다.')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      link: '',
      category: 'personalRecoveryBankruptcy',
      adType: 'native',
      position: 'native',
      size: 'medium',
      expiresAt: '',
      nativeConfig: {
        showEvery: 4,
        ctaText: '',
        backgroundColor: '#dbeafe'
      }
    })
  }

  const openEditModal = (ad: Ad) => {
    setEditingAd(ad)
    setFormData({
      title: ad.title || '',
      description: ad.description || '',
      imageUrl: ad.imageUrl || '',
      link: ad.link || '',
      category: ad.category || 'personalRecoveryBankruptcy',
      adType: ad.adType || 'native',
      position: ad.position || 'native',
      size: ad.size || 'medium',
      expiresAt: ad.expiresAt || '',
      nativeConfig: ad.nativeConfig || {
        showEvery: 4,
        ctaText: '',
        backgroundColor: '#dbeafe'
      }
    })
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingAd(null)
    resetForm()
  }

  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      personalRecoveryBankruptcy: '개인회생파산',
      corporateRecoveryBankruptcy: '법인회생파산',
      exemptionCardIssue: '면책후카드발급',
      exemptionCreditScore: '면책후신용등급',
      creditRecoveryWorkout: '신용회복워크아웃',
      loanInfo: '대출정보',
      creditStory: '신용이야기',
      qa: 'Q&A',
      news: '뉴스',
      successStory: '성공후기',
      liveChat: '실시간채팅'
    }
    return categoryMap[category] || '기타'
  }

  const getAdTypeName = (adType: string) => {
    const adTypeMap: { [key: string]: string } = {
      banner: '배너 광고',
      sidebar: '사이드바 광고',
      native: '네이티브 광고 (게시글 목록 삽입)'
    }
    return adTypeMap[adType] || '기타'
  }

  const getPositionName = (position: string) => {
    const positionMap: { [key: string]: string } = {
      header: '헤더',
      sidebar: '사이드바',
      content: '컨텐츠 내',
      footer: '푸터',
      native: '게시글 목록 삽입'
    }
    return positionMap[position] || '기타'
  }

  const getSizeName = (size: string) => {
    const sizeMap: { [key: string]: string } = {
      small: '소형',
      medium: '중형',
      large: '대형',
      banner: '배너'
    }
    return sizeMap[size] || '기타'
  }

  const getCategoryStats = () => {
    const categoryStats: { [key: string]: { total: number, active: number, clicks: number } } = {}
    
    ads.forEach(ad => {
      if (!categoryStats[ad.category]) {
        categoryStats[ad.category] = { total: 0, active: 0, clicks: 0 }
      }
      categoryStats[ad.category].total++
      if (ad.isActive) categoryStats[ad.category].active++
      categoryStats[ad.category].clicks += ad.clickCount
    })
    
    return categoryStats
  }

  const categoryStats = getCategoryStats()

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link
                  href="/admin"
                  className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">광고 관리</h1>
                  <p className="text-sm text-gray-600">카테고리별 타겟 광고 관리 시스템</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/"
                  target="_blank"
                  className="text-gray-600 hover:text-blue-600 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  사이트 보기
                </Link>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  새 광고 추가
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              카테고리별 광고 현황
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categoryStats).map(([category, stats]) => (
                <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{getCategoryName(category)}</h3>
                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                      stats.active > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {stats.active}/{stats.total}개 활성
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>총 클릭수:</span>
                      <span className="font-medium">{stats.clicks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <List className="w-5 h-5 mr-2" />
                  전체 광고 목록 ({ads.length}개)
                </h2>
                <div className="text-sm text-gray-600">
                  활성: {ads.filter(ad => ad.isActive).length}개 | 
                  비활성: {ads.filter(ad => !ad.isActive).length}개
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-300 border-t-blue-600"></div>
                  <span className="ml-3 text-gray-600">광고 목록을 불러오는 중...</span>
                </div>
              ) : ads.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Image className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-xl font-medium text-gray-900 mb-2">등록된 광고가 없습니다</p>
                    <p className="text-gray-500">첫 번째 광고를 등록해보세요!</p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    첫 광고 등록하기
                  </button>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        광고 정보
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        타입/카테고리
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        성과
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ads.map((ad) => (
                      <tr key={ad.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-16 h-16 mr-4">
                              <ImagePreview url={ad.imageUrl} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{ad.title}</div>
                              <div className="text-sm text-gray-500">{ad.description}</div>
                              {ad.link && (
                                <div className="text-xs text-blue-600 mt-1">
                                  <ExternalLink className="w-3 h-3 inline mr-1" />
                                  {ad.link}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">{getAdTypeName(ad.adType)}</div>
                            <div className="text-gray-500">{getCategoryName(ad.category)}</div>
                            <div className="text-xs text-gray-400">{getPositionName(ad.position)} | {getSizeName(ad.size)}</div>
                            {ad.nativeConfig && (
                              <div className="text-xs text-blue-600 mt-1">
                                {ad.nativeConfig.showEvery}개마다 표시
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center mb-1">
                              <Monitor className="w-4 h-4 mr-1 text-blue-500" />
                              <span className="font-medium">{ad.impressions.toLocaleString()}</span>
                              <span className="text-gray-500 ml-1">조회</span>
                            </div>
                            <div className="flex items-center">
                              <ExternalLink className="w-4 h-4 mr-1 text-green-500" />
                              <span className="font-medium">{ad.clickCount.toLocaleString()}</span>
                              <span className="text-gray-500 ml-1">클릭</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleAdStatus(ad.id)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                ad.isActive 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {ad.isActive ? (
                                <>
                                  <Eye className="w-3 h-3 mr-1" />
                                  활성
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  비활성
                                </>
                              )}
                            </button>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {new Date(ad.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => openEditModal(ad)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAd(ad.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 광고 추가/수정 모달 */}
      {(showAddModal || editingAd) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingAd ? '광고 수정' : '새 광고 추가'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* 광고 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  광고 제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="광고 제목을 입력하세요"
                />
              </div>

              {/* 광고 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  광고 설명 *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="광고 설명을 입력하세요"
                />
              </div>

              {/* 이미지 업로드 섹션 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  광고 이미지 *
                </label>
                <div className="space-y-4">
                  {formData.imageUrl && (
                    <div className="w-full">
                      <ImagePreview url={formData.imageUrl} />
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="block w-full cursor-pointer">
                        <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {uploading ? '업로드 중...' : '이미지 파일 업로드'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowImageGallery(true)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Image className="w-4 h-4 inline mr-2" />
                      갤러리에서 선택
                    </button>
                  </div>
                </div>
              </div>

              {/* 링크 URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  링크 URL
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="personalRecoveryBankruptcy">개인회생파산</option>
                  <option value="corporateRecoveryBankruptcy">법인회생파산</option>
                  <option value="exemptionCardIssue">면책후카드발급</option>
                  <option value="exemptionCreditScore">면책후신용등급</option>
                  <option value="creditRecoveryWorkout">신용회복워크아웃</option>
                  <option value="loanInfo">대출정보</option>
                  <option value="creditStory">신용이야기</option>
                  <option value="qa">Q&A</option>
                  <option value="news">뉴스</option>
                  <option value="successStory">성공후기</option>
                  <option value="liveChat">실시간채팅</option>
                </select>
              </div>

              {/* 광고 타입 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  광고 타입
                </label>
                <select
                  value={formData.adType}
                  onChange={(e) => setFormData({...formData, adType: e.target.value as 'banner' | 'sidebar' | 'native'})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="native">네이티브 광고 (게시글 목록 삽입)</option>
                  <option value="banner">배너 광고</option>
                  <option value="sidebar">사이드바 광고</option>
                </select>
              </div>

              {/* 네이티브 광고 설정 */}
              {formData.adType === 'native' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-3">네이티브 광고 설정</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        표시 주기 (게시글 몇 개마다 표시?)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.nativeConfig?.showEvery || 4}
                        onChange={(e) => setFormData({
                          ...formData,
                          nativeConfig: {
                            ...formData.nativeConfig,
                            showEvery: parseInt(e.target.value) || 4,
                            ctaText: formData.nativeConfig?.ctaText || '',
                            backgroundColor: formData.nativeConfig?.backgroundColor || '#dbeafe'
                          }
                        })}
                        className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        CTA 텍스트
                      </label>
                      <input
                        type="text"
                        value={formData.nativeConfig?.ctaText || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          nativeConfig: {
                            ...formData.nativeConfig,
                            showEvery: formData.nativeConfig?.showEvery || 4,
                            ctaText: e.target.value,
                            backgroundColor: formData.nativeConfig?.backgroundColor || '#dbeafe'
                          }
                        })}
                        className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="자세히 보기"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        배경 색상
                      </label>
                      <input
                        type="color"
                        value={formData.nativeConfig?.backgroundColor || '#dbeafe'}
                        onChange={(e) => setFormData({
                          ...formData,
                          nativeConfig: {
                            ...formData.nativeConfig,
                            showEvery: formData.nativeConfig?.showEvery || 4,
                            ctaText: formData.nativeConfig?.ctaText || '',
                            backgroundColor: e.target.value
                          }
                        })}
                        className="w-full h-12 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 만료일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  만료일 (선택사항)
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                취소
              </button>
              <button
                onClick={editingAd ? handleEditAd : handleAddAd}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingAd ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 갤러리 모달 */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">이미지 갤러리</h2>
              <button
                onClick={() => setShowImageGallery(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {defaultImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="cursor-pointer group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    onClick={() => selectImage(image.url)}
                  >
                    <div className="aspect-video bg-gray-100">
                      <img 
                        src={image.url} 
                        alt={image.description}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-medium text-gray-900">{image.category}</div>
                      <div className="text-xs text-gray-500">{image.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 