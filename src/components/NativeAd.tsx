'use client'

import { useState, useEffect } from 'react'

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
  showEvery: number
  backgroundColor: string
  ctaText: string
}

const NativeAd = ({ category, index }: NativeAdProps) => {
  const [adData, setAdData] = useState<NativeAdData | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const fetchNativeAd = async () => {
      try {
        setLoading(true)
        
        const categoryMap: { [key: string]: string } = {
          'creditStory': 'creditStory',
          'credit-story': 'creditStory',
          'personalRecovery': 'personalRecoveryBankruptcy',
          'personal-recovery': 'personalRecoveryBankruptcy',
          'corporateRecovery': 'corporateRecoveryBankruptcy',
          'corporate-recovery': 'corporateRecoveryBankruptcy',
          'loanInfo': 'loanInfo',
          'loan-story': 'loanInfo',
          'successStory': 'successStory',
          'success-story': 'successStory',
          'exemptionCard': 'exemptionCardIssue',
          'exemption-card': 'exemptionCardIssue',
          'exemptionCredit': 'exemptionCreditScore',
          'exemption-credit': 'exemptionCreditScore',
          'qa': 'qa',
          'news': 'news',
          'liveChat': 'liveChat',
          'live-chat': 'liveChat'
        }

        const apiCategory = categoryMap[category] || 'creditStory'
        const apiUrl = `/api/ads?category=${apiCategory}&adType=native&isActive=true`
        
        console.log('🌐 API 요청:', {
          category: category,
          apiCategory: apiCategory,
          apiUrl: apiUrl,
          index: index
        })
        
        const response = await fetch(apiUrl)
        const data = await response.json()

        console.log('🔍 네이티브 광고 조회:', {
          category: apiCategory,
          totalAds: data.ads?.length || 0,
          ads: data.ads?.map((ad: any) => ({
            id: ad.id,
            title: ad.title,
            adType: ad.adType,
            hasNativeConfig: !!ad.nativeConfig,
            nativeConfig: ad.nativeConfig
          })) || []
        })

        if (response.ok && data.ads && data.ads.length > 0) {
          // 모든 네이티브 타입 광고 사용 (nativeConfig 필터링 제거)
          let nativeAds = data.ads.filter((ad: any) => ad.adType === 'native')
          
          // 만약 해당 카테고리에 네이티브 광고가 없다면 전체 네이티브 광고에서 선택
          if (nativeAds.length === 0) {
            console.log('⚠️ 해당 카테고리에 네이티브 광고 없음, 전체에서 검색...')
            const fallbackUrl = `/api/ads?adType=native&isActive=true`
            const fallbackResponse = await fetch(fallbackUrl)
            const fallbackData = await fallbackResponse.json()
            if (fallbackResponse.ok && fallbackData.ads) {
              nativeAds = fallbackData.ads.filter((ad: any) => ad.adType === 'native')
              console.log('🔄 전체 네이티브 광고:', nativeAds.length + '개')
            }
          }
          
          console.log('🎯 최종 네이티브 광고:', nativeAds.length + '개')
          
          if (nativeAds.length > 0) {
            // 랜덤 광고 선택 (단순화)
            const randomAd = nativeAds[Math.floor(Math.random() * nativeAds.length)]
            
            console.log('🎲 선택된 광고:', {
              id: randomAd.id,
              title: randomAd.title,
              hasImage: !!randomAd.imageUrl
            })
            
            // nativeConfig 안전하게 처리
            let nativeConfig = {
              showEvery: 5,
              backgroundColor: '#f0f9ff',
              ctaText: '자세히보기'
            }
            
            if (randomAd.nativeConfig) {
              try {
                nativeConfig = typeof randomAd.nativeConfig === 'string' 
                  ? JSON.parse(randomAd.nativeConfig) 
                  : randomAd.nativeConfig
              } catch (error) {
                console.log('⚠️ nativeConfig 파싱 오류, 기본값 사용')
              }
            }

            setAdData({
              id: randomAd.id,
              title: randomAd.title || '제목 없음',
              description: randomAd.description || '설명 없음',
              imageUrl: randomAd.imageUrl || '',
              link: randomAd.link || 'https://example.com',
              showEvery: nativeConfig.showEvery || 5,
              backgroundColor: nativeConfig.backgroundColor || '#f0f9ff',
              ctaText: nativeConfig.ctaText || '자세히보기'
            })

            // 노출 수 증가 (백그라운드에서)
            fetch('/api/ads/track', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                adId: randomAd.id,
                type: 'impression'
              }),
            }).catch(() => {}) // 에러 무시
          } else {
            console.log('🚫 네이티브 광고가 없습니다')
            // 최후의 수단: 테스트 광고 표시
            console.log('🛡️ 테스트 광고 표시')
            setAdData({
              id: 999,
              title: '🎯 테스트 네이티브 광고',
              description: '광고 시스템이 정상 작동중입니다. 관리자 페이지에서 실제 광고를 등록해보세요!',
              imageUrl: '',
              link: 'https://example.com',
              showEvery: 1,
              backgroundColor: '#fef3c7',
              ctaText: '테스트 링크'
            })
          }
        } else {
          console.log('🚫 광고 데이터가 없습니다:', { status: response.status, data })
          // API 실패 시에도 테스트 광고 표시
          console.log('🛡️ API 실패, 테스트 광고 표시')
          setAdData({
            id: 998,
            title: '⚠️ 광고 API 오류',
            description: 'API에서 광고를 가져올 수 없습니다. 서버 상태를 확인해주세요.',
            imageUrl: '',
            link: 'https://example.com',
            showEvery: 1,
            backgroundColor: '#fecaca',
            ctaText: '오류 확인'
          })
        }
        
      } catch (error) {
        console.error('💥 네이티브 광고 로드 오류:', error)
        // 에러 발생 시에도 테스트 광고 표시
        setAdData({
          id: 997,
          title: '💥 광고 로드 실패',
          description: '네트워크 오류로 광고를 불러올 수 없습니다. 페이지를 새로고침해보세요.',
          imageUrl: '',
          link: 'https://example.com',
          showEvery: 1,
          backgroundColor: '#fee2e2',
          ctaText: '새로고침'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchNativeAd()
  }, [category, index])

  const handleAdClick = async () => {
    if (adData) {
      // 클릭 수 증가 (백그라운드에서)
      fetch('/api/ads/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adId: adData.id,
          type: 'click'
        }),
      }).catch(() => {}) // 에러 무시

      // 링크 열기
      window.open(adData.link, '_blank')
    }
  }

  // 로딩 중이거나 광고 데이터가 없으면 아무것도 표시하지 않음
  if (loading || !adData) {
    return null
  }

  return (
    <div className="mb-6">
      {/* 광고 표시 라벨 */}
      <div className="text-center mb-2">
        <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full">
          광고
        </span>
      </div>
      
      {/* 광고 컨테이너 - 배경색 적용 */}
      <div 
        className="relative cursor-pointer group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
        style={{ backgroundColor: adData.backgroundColor }}
        onClick={handleAdClick}
      >
        {adData.imageUrl ? (
          <>
            <img 
              src={adData.imageUrl} 
              alt={adData.title}
              className="w-full h-32 object-cover block group-hover:opacity-95 transition-opacity duration-300"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                console.log('이미지 로드 실패:', adData.imageUrl)
                setImageLoaded(false)
              }}
            />
            
            {/* 이미지가 로드되지 않은 경우 대체 콘텐츠 */}
            {!imageLoaded && (
              <div className="w-full h-32 flex items-center justify-center">
                <div className="text-center p-3">
                  <div className="text-2xl mb-1">📢</div>
                  <div className="text-sm font-bold text-gray-800 mb-1">{adData.title}</div>
                  <div className="text-xs text-gray-600 mb-2">{adData.description}</div>
                  <div className="inline-block px-2 py-1 bg-white bg-opacity-20 text-gray-800 rounded text-xs font-semibold">
                    {adData.ctaText}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* 이미지가 없는 경우 텍스트 광고 */
          <div className="w-full h-32 flex items-center justify-center p-3">
            <div className="text-center">
              <div className="text-2xl mb-1">📢</div>
              <div className="text-sm font-bold text-gray-800 mb-1">{adData.title}</div>
              <div className="text-xs text-gray-600 mb-2">{adData.description}</div>
              <div className="inline-block px-2 py-1 bg-white bg-opacity-20 text-gray-800 rounded text-xs font-semibold">
                {adData.ctaText}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NativeAd 