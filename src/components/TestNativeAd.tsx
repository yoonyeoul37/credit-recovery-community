'use client'

import { ExternalLink, ImageIcon } from 'lucide-react'

interface TestNativeAdProps {
  index: number
}

const TestNativeAd = ({ index }: TestNativeAdProps) => {
  console.log('🧪 테스트 네이티브 광고 - index:', index)

  // 4번째마다 표시
  const shouldShow = (index + 1) % 4 === 0
  console.log('🎯 테스트 광고 표시 여부:', { 
    index, 
    indexPlusOne: index + 1, 
    shouldShow,
    calculation: `(${index + 1}) % 4 === 0`
  })

  if (!shouldShow) {
    return null
  }

  console.log('🎉 테스트 네이티브 광고 렌더링!')

  const testAdData = {
    title: "개인회생 전문 법무사 무료 상담",
    description: "개인회생 성공률 95%! 24시간 무료 상담 가능",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
    link: "https://example.com/personal-recovery-law",
    ctaText: "무료 상담받기",
    backgroundColor: "#fef3c7"
  }

  const handleAdClick = () => {
    console.log('🖱️ 테스트 광고 클릭!')
    window.open(testAdData.link, '_blank')
  }

  return (
    <div 
      className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group mb-4"
      style={{ backgroundColor: testAdData.backgroundColor }}
      onClick={handleAdClick}
    >
      {/* 광고 표시 */}
      <div className="absolute top-2 right-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
        광고 (테스트)
      </div>

      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* 광고 이미지 */}
          <div className="flex-shrink-0">
            <img 
              src={testAdData.imageUrl} 
              alt={testAdData.title}
              className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* 광고 내용 */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
              {testAdData.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {testAdData.description}
            </p>
            
            {/* CTA 버튼 */}
            <div className="mt-4 flex items-center justify-between">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors group-hover:scale-105">
                {testAdData.ctaText}
                <ExternalLink className="w-4 h-4 ml-2" />
              </button>
              
              <div className="text-xs text-gray-500">
                후원 광고 (테스트)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestNativeAd 