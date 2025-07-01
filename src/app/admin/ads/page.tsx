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
  BarChart3
} from 'lucide-react'

interface Ad {
  id: number
  title: string
  description: string
  imageUrl: string
  link: string
  category: string
  position: 'header' | 'sidebar' | 'content' | 'footer'
  size: 'small' | 'medium' | 'large' | 'banner'
  isActive: boolean
  clickCount: number
  impressions: number
  createdAt: string
  expiresAt: string
}

export default function AdManagement() {
  const [ads, setAds] = useState<Ad[]>([
    {
      id: 1,
      title: '신용점수 무료 조회',
      description: '3개 신용평가사 점수를 한번에 확인하세요.',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop',
      link: 'https://example.com/credit-score',
      category: 'creditStory',
      position: 'sidebar',
      size: 'medium',
      isActive: true,
      clickCount: 234,
      impressions: 12450,
      createdAt: '2024-01-10',
      expiresAt: '2024-02-10'
    },
    {
      id: 2,
      title: '개인회생 전문 법무사 상담',
      description: '무료 상담으로 개인회생 절차를 도와드립니다.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
      link: 'https://example.com/personal-recovery-law',
      category: 'personalRecovery',
      position: 'sidebar',
      size: 'banner',
      isActive: true,
      clickCount: 156,
      impressions: 8900,
      createdAt: '2024-01-12',
      expiresAt: '2024-02-12'
    },
    {
      id: 3,
      title: '2금융권 대출 비교',
      description: '안전하고 투명한 대출상품 비교서비스',
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=200&fit=crop',
      link: 'https://example.com/loan-compare',
      category: 'loanStory',
      position: 'content',
      size: 'large',
      isActive: false,
      clickCount: 89,
      impressions: 5600,
      createdAt: '2024-01-08',
      expiresAt: '2024-01-25'
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)

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

  const getCategoryName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      creditStory: '신용이야기',
      personalRecovery: '개인회생',
      corporateRecovery: '법인회생',
      loanStory: '대출이야기',
      successStory: '성공사례',
      liveChat: '실시간상담'
    }
    return categoryMap[category] || category
  }

  const getPositionName = (position: string) => {
    const positionMap: { [key: string]: string } = {
      header: '헤더',
      sidebar: '사이드바',
      content: '컨텐츠 내부',
      footer: '푸터'
    }
    return positionMap[position] || position
  }

  const getSizeName = (size: string) => {
    const sizeMap: { [key: string]: string } = {
      small: '소형',
      medium: '중형',
      large: '대형',
      banner: '배너형'
    }
    return sizeMap[size] || size
  }

  return (
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
              <Monitor className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">광고 관리</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              새 광고 추가
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 통계 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 광고</p>
                <p className="text-2xl font-bold text-gray-900">{ads.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">활성 광고</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ads.filter(ad => ad.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 노출수</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ads.reduce((sum, ad) => sum + ad.impressions, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExternalLink className="w-8 h-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 클릭수</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ads.reduce((sum, ad) => sum + ad.clickCount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 광고 목록 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">광고 목록</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    광고 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리/위치
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    성과
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    기간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img 
                            className="h-16 w-16 rounded-lg object-cover" 
                            src={ad.imageUrl} 
                            alt={ad.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{ad.title}</div>
                          <div className="text-sm text-gray-500">{ad.description}</div>
                          <div className="text-xs text-blue-600 flex items-center mt-1">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {ad.link}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getCategoryName(ad.category)}</div>
                      <div className="text-sm text-gray-500">
                        {getPositionName(ad.position)} · {getSizeName(ad.size)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        노출: {ad.impressions.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        클릭: {ad.clickCount.toLocaleString()} 
                        ({((ad.clickCount / ad.impressions) * 100).toFixed(2)}%)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{ad.createdAt}</div>
                      <div className="text-sm text-gray-500">~ {ad.expiresAt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleAdStatus(ad.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ad.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingAd(ad)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAd(ad.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 광고 추가/수정 모달은 별도 컴포넌트로 분리 예정 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">새 광고 추가</h3>
            <p className="text-gray-600 mb-4">광고 추가 폼이 여기에 들어갑니다.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 