'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, ImageIcon } from 'lucide-react'

interface NativeAdProps {
  category: string
  index: number
}

interface NativeAdData {
  id: number
  title: string
  description: string
  imageUrl: string
  link: string
  ctaText: string
  backgroundColor: string
  showEvery: number
}

const NativeAd = ({ category, index }: NativeAdProps) => {
  const [adData, setAdData] = useState<NativeAdData | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)

  console.log('🎯 네이티브 광고 컴포넌트 시작:', { category, index })

  useEffect(() => {
    console.log('⚡ useEffect 실행됨:', { category, index })
    
    const fetchNativeAd = async () => {
      try {
        setLoading(true)
        console.log('🔍 네이티브 광고 로드 시작:', { category, index })
        
        // 즉시 fallback 데이터 설정 (테스트용)
        console.log('🛡️ 즉시 fallback 데이터 설정')
        setAdData({
          id: 999,
          title: "🎯 네이티브 광고 테스트",
          description: "이 광고가 보인다면 네이티브 광고 시스템이 작동하고 있습니다! 개인회생 전문 상담을 받아보세요.",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
          link: "https://example.com/personal-recovery-law",
          ctaText: "무료 상담받기",
          backgroundColor: "#fef3c7",
          showEvery: 1 // 모든 게시글에 표시
        })
        
        // 그 다음 실제 API 호출
        const categoryMap: { [key: string]: string } = {
          'credit-story': 'creditStory',
          'personal-recovery': 'personalRecoveryBankruptcy',
          'corporate-recovery': 'corporateRecoveryBankruptcy',
          'loan-story': 'loanInfo',
          'success-story': 'successStory',
          'exemption-card': 'exemptionCardIssue',
          'exemption-credit': 'exemptionCreditScore',
          'qa': 'qa',
          'news': 'news',
          'live-chat': 'liveChat'
        }

        const apiCategory = categoryMap[category] || 'creditStory'
        const apiUrl = `/api/ads?category=${apiCategory}&adType=native&isActive=true`
        console.log('📡 API 호출:', apiUrl)
        
        const response = await fetch(apiUrl)
        const data = await response.json()
        
        console.log('📥 API 응답:', { status: response.status, data })

        if (response.ok && data.ads && data.ads.length > 0) {
          console.log('✅ 광고 데이터 존재:', data.ads.length + '개')
          
          // 네이티브 광고 중에서 랜덤 선택
          const nativeAds = data.ads.filter((ad: any) => ad.nativeConfig)
          console.log('🎯 네이티브 광고 필터링:', nativeAds.length + '개')
          
          if (nativeAds.length > 0) {
            const randomAd = nativeAds[Math.floor(Math.random() * nativeAds.length)]
            console.log('🎲 선택된 광고:', randomAd)
            
            const nativeConfig = typeof randomAd.nativeConfig === 'string' 
              ? JSON.parse(randomAd.nativeConfig) 
              : randomAd.nativeConfig

            console.log('⚙️ 네이티브 설정:', nativeConfig)

            setAdData({
              id: randomAd.id,
              title: randomAd.title,
              description: randomAd.description,
              imageUrl: randomAd.imageUrl,
              link: randomAd.link,
              ctaText: nativeConfig.ctaText || '자세히 보기',
              backgroundColor: nativeConfig.backgroundColor || '#f0f9ff',
              showEvery: nativeConfig.showEvery || 1
            })

            // 노출 수 증가
            fetch('/api/ads/track', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                adId: randomAd.id,
                type: 'impression'
              }),
            }).catch(err => console.error('노출 추적 오류:', err))
          }
        }
        
      } catch (error) {
        console.error('💥 네이티브 광고 로드 오류:', error)
        console.log('🛡️ 오류 발생해도 fallback 데이터 유지')
      } finally {
        setLoading(false)
        console.log('✅ 네이티브 광고 로딩 완료')
      }
    }

    fetchNativeAd()
  }, [category, index])

  const handleAdClick = async () => {
    console.log('👆 네이티브 광고 클릭됨:', { adData })
    if (adData) {
      // 클릭 수 증가
      fetch('/api/ads/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adId: adData.id,
          type: 'click'
        }),
      }).catch(err => console.error('클릭 추적 오류:', err))

      // 링크 열기
      window.open(adData.link, '_blank')
    }
  }

  console.log('🔍 렌더링 상태 확인:', { loading, hasAdData: !!adData, index })

  // 로딩 중일 때는 로딩 표시
  if (loading) {
    console.log('⏳ 로딩 중 - 스켈레톤 표시:', { index })
    return (
      <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  // 광고 데이터가 없어도 테스트 광고 표시
  if (!adData) {
    console.log('🚫 광고 데이터 없음 - 긴급 테스트 광고 표시:', { index })
    return (
      <div className="mb-6 p-6 bg-red-50 border-2 border-red-300 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-bold text-red-800 mb-2">⚠️ 네이티브 광고 테스트</h3>
          <p className="text-red-700">이 메시지가 보인다면 NativeAd 컴포넌트는 작동하지만 광고 데이터가 없습니다.</p>
          <p className="text-sm text-red-600 mt-2">Index: {index}, Category: {category}</p>
        </div>
      </div>
    )
  }

  // 이제 showEvery 조건 없이 항상 표시 (테스트용)
  console.log('🎉 네이티브 광고 렌더링!', { index, adData: adData.title })

  return (
    <div 
      className="relative overflow-hidden rounded-lg border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group mb-6"
      onClick={handleAdClick}
    >
      {/* 광고 표시 */}
      <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full shadow-md z-10">
        🎯 네이티브 광고 #{index}
      </div>

      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* 광고 이미지 */}
          <div className="flex-shrink-0">
            {adData.imageUrl ? (
              <div className="relative">
                <img 
                  src={adData.imageUrl} 
                  alt={adData.title}
                  className="w-24 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(false)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📢</span>
              </div>
            )}
          </div>

          {/* 광고 콘텐츠 */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {adData.title}
            </h3>
            
            <p className="text-gray-700 mb-4 leading-relaxed">
              {adData.description}
            </p>
            
            <div className="flex items-center justify-between">
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                {adData.ctaText || '자세히 보기'}
              </button>
              
              <div className="flex items-center text-gray-500 text-sm">
                <ExternalLink className="w-4 h-4 mr-1" />
                <span>외부 링크</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NativeAd 