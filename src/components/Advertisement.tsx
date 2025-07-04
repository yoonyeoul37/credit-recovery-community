'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink, ImageIcon } from 'lucide-react'

interface AdProps {
  category?: string
  position: 'header' | 'sidebar' | 'content' | 'footer' | 'adsense'
  title?: string
  image?: string
  description?: string
  link?: string
  size?: 'small' | 'medium' | 'large' | 'banner'
  closeable?: boolean
  adType?: 'adsense' | 'regular'
}

// 이미지 로딩 상태 처리를 위한 컴포넌트
const AdImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (src) {
      const img = new Image()
      img.onload = () => {
        setImageLoaded(true)
        setIsLoading(false)
      }
      img.onerror = () => {
        setImageError(true)
        setIsLoading(false)
      }
      img.src = src
    } else {
      setIsLoading(false)
      setImageError(true)
    }
  }, [src])

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center animate-pulse`}>
        <ImageIcon className="w-6 h-6 text-gray-400" />
      </div>
    )
  }

  if (imageError || !src) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center`}>
        <div className="text-center">
          <ImageIcon className="w-8 h-8 text-blue-500 mx-auto mb-1" />
          <span className="text-xs text-blue-600 font-medium">광고 이미지</span>
        </div>
      </div>
    )
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className={`${className} object-cover`}
      onError={() => setImageError(true)}
    />
  )
}

// 헬퍼 함수들을 컴포넌트 밖으로 이동
const getSizeClasses = (size: string) => {
  switch (size) {
    case 'small':
      return 'h-32'
    case 'large':
      return 'h-40'
    case 'banner':
      return 'h-80' // 세로형 배너용
    default:
      return 'h-32'
  }
}

const getPositionClasses = (position: string) => {
  switch (position) {
    case 'header':
      return 'w-full max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200'
    case 'sidebar':
      return 'w-full bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200'
    case 'content':
      return 'w-full max-w-2xl mx-auto bg-gray-50 rounded-xl border border-gray-200'
    case 'footer':
      return 'w-full max-w-4xl mx-auto bg-gray-100 border-t border-gray-200'
    case 'adsense':
      return 'w-full bg-gray-50 rounded-xl border border-gray-200 border-dashed'
    default:
      return 'w-full bg-white rounded-lg border border-gray-200'
  }
}

const Advertisement = ({ 
  category,
  position, 
  title, 
  image, 
  description, 
  link, 
  size = 'medium',
  closeable = false,
  adType = 'regular'
}: AdProps) => {
  // 모든 Hook을 최상단에 선언
  const [isVisible, setIsVisible] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [realAdData, setRealAdData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 기본 광고 데이터 함수를 최상단으로 이동
  function getDefaultAdData() {
    const categoryAds: { [key: string]: any } = {
      creditStory: {
        title: '신용점수 상승 프로그램',
        description: '체계적인 신용관리로 점수를 올려보세요',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=400&fit=crop',
        link: 'https://example.com/credit-program'
      },
      personalRecovery: {
        title: '개인회생 전문 법무사',
        description: '경험 많은 전문가의 무료 상담',
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=400&fit=crop',
        link: 'https://example.com/personal-recovery'
      },
      corporateRecovery: {
        title: '법인회생 전문 변호사',
        description: '기업 재건을 위한 전문 법률 서비스',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=400&fit=crop',
        link: 'https://example.com/corporate-recovery'
      },
      loanStory: {
        title: '안전한 대출 비교 서비스',
        description: '투명하고 신뢰할 수 있는 대출 상품',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop',
        link: 'https://example.com/loan-service'
      },
      successStory: {
        title: '신용회복 성공 가이드',
        description: '실제 성공 사례로 배우는 회복 전략',
        image: 'https://images.unsplash.com/photo-1519452634265-7b808fcb3be2?w=300&h=400&fit=crop',
        link: 'https://example.com/success-guide'
      }
    }

    return categoryAds[category || 'creditStory'] || categoryAds.creditStory
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const fetchRealAd = async () => {
      try {
        setLoading(true)
        
        // 사용자가 직접 props로 광고 데이터를 제공한 경우
        if (title && link) {
          setRealAdData({ title, image, description, link })
          setLoading(false)
          return
        }

        // 카테고리별 실제 광고 데이터를 API에서 가져오기
        const categoryMap: { [key: string]: string } = {
          creditStory: 'creditStory',
          personalRecovery: 'personalRecoveryBankruptcy',
          corporateRecovery: 'corporateRecoveryBankruptcy',
          loanStory: 'loanInfo',
          successStory: 'successStory',
          exemptionCard: 'exemptionCardIssue',
          exemptionCredit: 'exemptionCreditScore',
          qa: 'qa',
          news: 'news',
          liveChat: 'liveChat'
        }

        const apiCategory = categoryMap[category || 'creditStory'] || 'creditStory'
        const response = await fetch(`/api/ads?category=${apiCategory}&position=${position}&isActive=true`)
        const data = await response.json()

        if (response.ok && data.ads && data.ads.length > 0) {
          // 랜덤하게 하나 선택
          const randomAd = data.ads[Math.floor(Math.random() * data.ads.length)]
          
          setRealAdData({
            title: randomAd.title,
            image: randomAd.imageUrl,
            description: randomAd.description,
            link: randomAd.link,
            id: randomAd.id
          })

          // 노출 수 증가
          if (randomAd.id) {
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
        } else {
          // 실제 광고가 없으면 기본 광고 데이터 사용
          setRealAdData(getDefaultAdData())
        }
      } catch (error) {
        console.error('광고 데이터 로드 오류:', error)
        setRealAdData(getDefaultAdData())
      } finally {
        setLoading(false)
      }
    }

    fetchRealAd()
  }, [category, position, title, link])

  // 조건부 렌더링은 모든 Hook 이후에 처리
  if (!isVisible) return null

  // 서버사이드에서는 기본 광고만 렌더링
  if (!isClient) {
    return (
      <div className="relative w-full bg-white rounded-2xl shadow-sm border border-gray-100 h-32">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-xs mb-1">광고</div>
            <div className="text-sm font-medium">로딩 중...</div>
          </div>
        </div>
      </div>
    )
  }

  // 광고 클릭 처리
  const handleAdClick = async (adData: any) => {
    // 클릭 수 증가
    if (adData.id) {
      try {
        await fetch('/api/ads/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adId: adData.id,
            type: 'click'
          }),
        })
      } catch (error) {
        console.error('클릭 추적 오류:', error)
      }
    }

    // 광고 페이지로 이동
    window.open(adData.link, '_blank')
  }

  const adData = realAdData

  const handleClick = () => {
    if (adType !== 'adsense' && adData?.link) {
      handleAdClick(adData)
    }
  }

  // 로딩 중이거나 광고 데이터가 없는 경우
  if (loading || !adData) {
    return (
      <div className={`relative ${getPositionClasses(position)} ${getSizeClasses(size)}`}>
        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="animate-pulse text-gray-400">
            광고 로딩 중...
          </div>
        </div>
      </div>
    )
  }

  // 애드센스용 더미 광고
  if (adType === 'adsense') {
    return (
      <div className={`relative ${getPositionClasses(position)} ${getSizeClasses(size)}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-xs mb-1">Google AdSense</div>
            <div className="text-sm font-medium">{adData.title}</div>
          </div>
        </div>
      </div>
    )
  }

  // 세로형 배너 광고 (사이드바용)
  if (size === 'banner' && position === 'sidebar') {
    return (
      <div className={`relative ${getPositionClasses(position)} ${getSizeClasses(size)}`}>
        {/* 광고 표시 라벨 */}
        <div className="absolute top-3 left-3 text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-1 font-medium z-10">
          광고
        </div>

        {/* 닫기 버튼 */}
        {closeable && (
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        )}

        {/* 세로형 배너 콘텐츠 */}
        <div 
          className="w-full h-full cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex flex-col"
          onClick={handleClick}
        >
          {/* 이미지 */}
          <AdImage 
            src={adData.image} 
            alt={adData.title}
            className="w-full h-48 rounded-t-2xl"
          />

          {/* 텍스트 콘텐츠 */}
          <div className="flex-1 p-4 flex flex-col justify-center">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 text-center">
              {adData.title}
            </h3>
            {adData.description && (
              <p className="text-xs text-gray-600 leading-relaxed text-center mb-3">
                {adData.description}
              </p>
            )}
            <div className="flex items-center justify-center">
              <ExternalLink className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 ml-1">자세히 보기</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 기본 가로형 광고
  return (
    <div className={`relative ${getPositionClasses(position)} ${getSizeClasses(size)}`}>
      {/* 광고 표시 라벨 */}
      <div className={`absolute text-gray-400 bg-gray-100 rounded-full font-medium ${
        size === 'small' 
          ? 'top-3 left-3 text-xs px-2 py-1' 
          : 'top-3 left-3 text-xs px-2 py-1'
      }`}>
        광고
      </div>

      {/* 닫기 버튼 */}
      {closeable && (
        <button
          onClick={() => setIsVisible(false)}
          className={`absolute bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10 ${
            size === 'small' 
              ? 'top-3 right-3 w-6 h-6' 
              : 'top-3 right-3 w-6 h-6'
          }`}
        >
          <X className={`text-gray-500 ${
            size === 'small' ? 'w-3 h-3' : 'w-3 h-3'
          }`} />
        </button>
      )}

      {/* 광고 콘텐츠 */}
      <div 
        className={`w-full h-full cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-4 ${
          size === 'small' ? 'p-6' : 'p-5'
        }`}
        onClick={handleClick}
      >
        {/* 이미지가 있는 경우 */}
        <AdImage 
          src={adData.image} 
          alt={adData.title}
          className={`flex-shrink-0 rounded-xl ${
            size === 'small' ? 'w-16 h-16' : 'w-14 h-14'
          }`}
        />

        {/* 텍스트 콘텐츠 */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-gray-900 leading-tight mb-1 ${
            size === 'small' ? 'text-sm' : 'text-base'
          }`}>
            {adData.title}
          </h3>
          {adData.description && (
            <p className={`text-gray-600 leading-relaxed mb-2 ${
              size === 'small' ? 'text-xs' : 'text-sm'
            }`}>
              {adData.description}
            </p>
          )}
          <div className="flex items-center">
            <ExternalLink className={`text-gray-400 ${
              size === 'small' ? 'w-3 h-3' : 'w-4 h-4'
            }`} />
            <span className={`text-gray-500 ml-1 ${
              size === 'small' ? 'text-xs' : 'text-sm'
            }`}>
              자세히 보기
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Advertisement

// 샘플 광고 데이터
export const sampleAds = {
  header: {
    title: '신용회복 전문 법무사 - 무료 상담',
    description: '개인회생, 파산 전문 법무사가 도와드립니다.',
    link: 'https://example.com/law-office',
    image: '/api/placeholder/64/64'
  },
  sidebar: {
    title: '2금융권 대출 비교 서비스',
    description: '안전하고 투명한 대출 상품을 한 번에 비교해보세요.',
    link: 'https://example.com/loan-compare',
    image: '/api/placeholder/64/64'
  },
  content: {
    title: '신용점수 무료 조회 서비스',
    description: '3개 신용평가사 점수를 한 번에 확인하세요.',
    link: 'https://example.com/credit-check',
    image: '/api/placeholder/64/64'
  },
  footer: {
    title: '부채 정리 전문 상담센터',
    description: '1:1 맞춤 상담으로 부채 문제를 해결하세요.',
    link: 'https://example.com/debt-consulting',
    image: '/api/placeholder/64/64'
  }
} 