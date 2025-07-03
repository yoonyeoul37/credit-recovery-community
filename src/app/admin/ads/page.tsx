'use client'

import { useState } from 'react'
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
  expiresAt: string
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

export default function AdManagement() {
  const [ads, setAds] = useState<Ad[]>([
    {
      id: 1,
      title: '개인회생 전문 법무사 무료 상담',
      description: '개인회생 성공률 95%! 24시간 무료 상담 가능',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
      link: 'https://example.com/personal-recovery-law',
      category: 'personalRecoveryBankruptcy',
      adType: 'native',
      position: 'native',
      size: 'medium',
      isActive: true,
      clickCount: 456,
      impressions: 12450,
      createdAt: '2024-01-10',
      expiresAt: '2024-02-10',
      nativeConfig: {
        showEvery: 4,
        ctaText: '⚖️ 개인회생 전문 법무사 무료 상담받기 ▶',
        backgroundColor: '#fef3c7'
      }
    },
    {
      id: 2,
      title: '면책자 전용 신용카드 발급',
      description: '면책 후 신용카드 발급률 90%! 전문 설계사 상담',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
      link: 'https://example.com/credit-card-recovery',
      category: 'exemptionCardIssue',
      adType: 'native',
      position: 'native',
      size: 'medium',
      isActive: true,
      clickCount: 789,
      impressions: 15670,
      createdAt: '2024-01-12',
      expiresAt: '2024-02-12',
      nativeConfig: {
        showEvery: 3,
        ctaText: '💳 면책자 전용 신용카드 바로 발급받기 ▶',
        backgroundColor: '#dbeafe'
      }
    },
    {
      id: 3,
      title: '신용불량자 대출 전문',
      description: '면책자, 개인회생자도 OK! 비대면 당일 승인',
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=200&fit=crop',
      link: 'https://example.com/loan-bad-credit',
      category: 'loanInfo',
      adType: 'native',
      position: 'native',
      size: 'medium',
      isActive: true,
      clickCount: 234,
      impressions: 8900,
      createdAt: '2024-01-08',
      expiresAt: '2024-02-08',
      nativeConfig: {
        showEvery: 5,
        ctaText: '💰 신용불량자 전용 대출 5분만에 신청하기 ▶',
        backgroundColor: '#dcfce7'
      }
    },
    {
      id: 4,
      title: '신용등급 관리 서비스',
      description: '면책 후 신용등급 복구 전문! 1개월 무료 체험',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop',
      link: 'https://example.com/credit-score-recovery',
      category: 'exemptionCreditScore',
      adType: 'native',
      position: 'native',
      size: 'medium',
      isActive: true,
      clickCount: 345,
      impressions: 11200,
      createdAt: '2024-01-15',
      expiresAt: '2024-02-15',
      nativeConfig: {
        showEvery: 4,
        ctaText: '📈 신용등급 무료 진단 + 관리 서비스 체험하기 ▶',
        backgroundColor: '#f3e8ff'
      }
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
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

  const toggleAdStatus = (id: number) => {
    setAds(ads.map(ad => 
      ad.id === id ? { ...ad, isActive: !ad.isActive } : ad
    ))
  }

  const deleteAd = (id: number) => {
    if (confirm('정말로 이 광고를 삭제하시겠습니까?')) {
      setAds(ads.filter(ad => ad.id !== id))
    }
  }

  const handleAddAd = () => {
    if (!formData.title || !formData.description || !formData.link) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    const newAd: Ad = {
      id: Math.max(...ads.map(ad => ad.id)) + 1,
      ...formData,
      isActive: true,
      clickCount: 0,
      impressions: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setAds([...ads, newAd])
    setShowAddModal(false)
    resetForm()
    alert('광고가 성공적으로 추가되었습니다!')
  }

  const handleEditAd = () => {
    if (!editingAd || !formData.title || !formData.description || !formData.link) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    setAds(ads.map(ad => 
      ad.id === editingAd.id 
        ? { ...ad, ...formData }
        : ad
    ))
    setEditingAd(null)
    resetForm()
    alert('광고가 성공적으로 수정되었습니다!')
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
      title: ad.title,
      description: ad.description,
      imageUrl: ad.imageUrl,
      link: ad.link,
      category: ad.category,
      adType: ad.adType,
      position: ad.position,
      size: ad.size,
      expiresAt: ad.expiresAt,
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
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      광고 정보
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      카테고리 / 타입
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
                    <tr key={ad.id} className={!ad.isActive ? 'opacity-60' : ''}>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          {ad.imageUrl && (
                            <img 
                              src={ad.imageUrl} 
                              alt={ad.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {ad.title}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {ad.description}
                            </div>
                            {ad.adType === 'native' && ad.nativeConfig && (
                              <div className="text-xs text-blue-600 mt-1 p-2 bg-blue-50 rounded">
                                📝 {ad.nativeConfig.ctaText}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {getCategoryName(ad.category)}
                          </div>
                          <div className="text-gray-500">
                            {getAdTypeName(ad.adType)}
                          </div>
                          {ad.adType === 'native' && ad.nativeConfig && (
                            <div className="text-xs text-orange-600 mt-1">
                              {ad.nativeConfig.showEvery}개 글마다 표시
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">
                            클릭: <span className="font-medium">{ad.clickCount.toLocaleString()}</span>
                          </div>
                          <div className="text-gray-500">
                            노출: {ad.impressions.toLocaleString()}
                          </div>
                          <div className="text-xs text-blue-600">
                            CTR: {ad.impressions > 0 ? ((ad.clickCount / ad.impressions) * 100).toFixed(2) : 0}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleAdStatus(ad.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
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
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(ad)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="수정"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAd(ad.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {ad.link && (
                            <a
                              href={ad.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50 transition-colors"
                              title="링크 확인"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {(showAddModal || editingAd) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingAd ? '광고 수정' : '새 광고 추가'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    광고 제목 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="예: 개인회생 전문 법무사 무료 상담"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    광고 설명 *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="예: 개인회생 성공률 95%! 24시간 무료 상담 가능"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    광고 링크 *
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    타겟 카테고리 *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="personalRecoveryBankruptcy">개인회생파산 (법무사 광고)</option>
                    <option value="corporateRecoveryBankruptcy">법인회생파산 (법인 법무사 광고)</option>
                    <option value="exemptionCardIssue">면책후카드발급 (신용카드 광고)</option>
                    <option value="exemptionCreditScore">면책후신용등급 (신용관리 광고)</option>
                    <option value="creditRecoveryWorkout">신용회복워크아웃 (상담 광고)</option>
                    <option value="loanInfo">대출정보 (대출회사 광고)</option>
                    <option value="creditStory">신용이야기 (신용카드 광고)</option>
                    <option value="qa">Q&A (법무사 광고)</option>
                    <option value="news">뉴스 (금융정보 광고)</option>
                    <option value="successStory">성공후기</option>
                    <option value="liveChat">실시간채팅</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    광고 타입 *
                  </label>
                  <select
                    value={formData.adType}
                    onChange={(e) => {
                      const adType = e.target.value as 'banner' | 'sidebar' | 'native'
                      setFormData({
                        ...formData, 
                        adType,
                        position: adType === 'native' ? 'native' : formData.position
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="native">네이티브 광고 (게시글 목록 삽입) - 추천!</option>
                    <option value="banner">배너 광고</option>
                    <option value="sidebar">사이드바 광고</option>
                  </select>
                </div>
              </div>

              {formData.adType === 'native' && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                  <h4 className="font-medium text-blue-900">네이티브 광고 설정</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        표시 간격 (몇 개 게시글마다)
                      </label>
                      <select
                        value={formData.nativeConfig?.showEvery || 4}
                        onChange={(e) => setFormData({
                          ...formData, 
                          nativeConfig: {
                            ...formData.nativeConfig!,
                            showEvery: parseInt(e.target.value)
                          }
                        })}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={3}>3개 게시글마다</option>
                        <option value={4}>4개 게시글마다</option>
                        <option value={5}>5개 게시글마다</option>
                        <option value={6}>6개 게시글마다</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        배경색
                      </label>
                      <select
                        value={formData.nativeConfig?.backgroundColor || '#dbeafe'}
                        onChange={(e) => setFormData({
                          ...formData, 
                          nativeConfig: {
                            ...formData.nativeConfig!,
                            backgroundColor: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="#dbeafe">파란색 (신용카드)</option>
                        <option value="#fef3c7">노란색 (법무사)</option>
                        <option value="#dcfce7">초록색 (대출)</option>
                        <option value="#f3e8ff">보라색 (신용관리)</option>
                        <option value="#fee2e2">빨간색 (긴급)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      클릭 유도 텍스트 (CTA) *
                    </label>
                    <input
                      type="text"
                      value={formData.nativeConfig?.ctaText || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        nativeConfig: {
                          ...formData.nativeConfig!,
                          ctaText: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="예: 💳 면책자 전용 신용카드 바로 발급받기 ▶"
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      �� 이모지와 화살표(▶)를 사용하면 클릭률이 높아집니다!
                    </p>
                  </div>

                  {formData.nativeConfig?.ctaText && (
                    <div className="border border-blue-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-700 mb-2">미리보기:</p>
                      <div 
                        className="p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: formData.nativeConfig.backgroundColor }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full mr-2">
                              [광고]
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {formData.nativeConfig.ctaText}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    광고 크기
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="small">소형</option>
                    <option value="medium">중형</option>
                    <option value="large">대형</option>
                    <option value="banner">배너</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    만료일
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={editingAd ? handleEditAd : handleAddAd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingAd ? '수정 완료' : '광고 추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 