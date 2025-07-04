'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react'

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
  expiresAt: string
}

interface PremiumAdProps {
  position: 'top' | 'bottom'
  className?: string
}

const PremiumAd: React.FC<PremiumAdProps> = ({ position, className = '' }) => {
  const [ads, setAds] = useState<PremiumAd[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPremiumAds()
  }, [position])

  const fetchPremiumAds = async () => {
    try {
      const response = await fetch(`/api/premium-ads?position=${position}`)
      if (response.ok) {
        const data = await response.json()
        setAds(data)
        console.log(`✅ ${position} 프리미엄 광고 로드 완료:`, data.length)
      } else {
        console.error('프리미엄 광고 로드 실패:', response.status)
      }
    } catch (error) {
      console.error('프리미엄 광고 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const trackClick = async (adId: number) => {
    try {
      await fetch('/api/premium-ads/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adId, action: 'click' }),
      })
    } catch (error) {
      console.error('클릭 추적 오류:', error)
    }
  }

  const trackImpression = async (adId: number) => {
    try {
      await fetch('/api/premium-ads/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adId, action: 'impression' }),
      })
    } catch (error) {
      console.error('노출 추적 오류:', error)
    }
  }

  const handleAdClick = (ad: PremiumAd) => {
    trackClick(ad.id)
    if (ad.link.startsWith('tel:')) {
      window.location.href = ad.link
    } else {
      window.open(ad.link, '_blank', 'noopener,noreferrer')
    }
  }

  const nextAd = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length)
  }

  const prevAd = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length)
  }

  const closeAd = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    if (ads.length > 0) {
      trackImpression(ads[currentIndex].id)
    }
  }, [currentIndex, ads])

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        nextAd()
      }, 5000) // 5초마다 자동 로테이션
      return () => clearInterval(interval)
    }
  }, [ads.length])

  if (loading) {
    return (
      <div className={`${className} ${position === 'top' ? 'h-28' : 'h-16'} bg-gray-100 animate-pulse rounded-lg`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400 text-sm">광고 로딩 중...</div>
        </div>
      </div>
    )
  }

  if (!isVisible || ads.length === 0) return null

  const currentAd = ads[currentIndex]

  return (
    <div className={`${className} relative overflow-hidden rounded-lg shadow-sm`}>
      {/* 상단 프리미엄 광고 - 작고 아담한 크기 */}
      {position === 'top' && (
        <div className="relative h-28 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="absolute top-1 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
            💎 PREMIUM
          </div>
          <div className="absolute top-1 right-2 flex space-x-1">
            {ads.length > 1 && (
              <>
                <button
                  onClick={prevAd}
                  className="p-1 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  onClick={nextAd}
                  className="p-1 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                >
                  <ChevronRight size={12} />
                </button>
              </>
            )}
            <button
              onClick={closeAd}
              className="p-1 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
            >
              <X size={12} />
            </button>
          </div>
          
          <div 
            className="relative h-full cursor-pointer hover:brightness-110 transition-all duration-200"
            onClick={() => handleAdClick(currentAd)}
          >
            <img
              src={currentAd.imageUrl}
              alt={currentAd.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
              <div className="p-3 flex flex-col justify-center h-full">
                <h3 className="text-sm font-bold text-white mb-1">
                  {currentAd.title}
                </h3>
                <p className="text-white/90 text-xs leading-relaxed">
                  {currentAd.description}
                </p>
              </div>
            </div>
          </div>
          
          {ads.length > 1 && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-500' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 하단 스티키 광고 */}
      {position === 'bottom' && (
        <div className="relative h-16 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <div className="absolute top-1 left-2 bg-yellow-400 text-black px-2 py-0.5 rounded text-xs font-bold">
            AD
          </div>
          <button
            onClick={closeAd}
            className="absolute top-1 right-2 p-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X size={14} />
          </button>
          
          <div className="flex items-center justify-center h-full px-10">
            <div className="flex items-center space-x-4 max-w-2xl">
              <img
                src={currentAd.imageUrl}
                alt={currentAd.title}
                className="w-10 h-10 rounded-lg object-cover"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">{currentAd.title}</h4>
                <p className="text-xs text-gray-300 truncate">{currentAd.description}</p>
              </div>
              <button
                onClick={() => handleAdClick(currentAd)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <span>상담받기</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
          
          {ads.length > 1 && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {ads.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index === currentIndex ? 'bg-blue-400' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PremiumAd 