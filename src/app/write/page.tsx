import { Metadata } from 'next'
import { Suspense } from 'react'
import PostWrite from '@/components/PostWrite'

export const metadata: Metadata = {
  title: '글쓰기',
  description: '신용회복 커뮤니티에서 경험과 정보를 나눠주세요.'
}

// 로딩 컴포넌트
function WritePageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        {/* 헤더 스켈레톤 */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        
        {/* 안내 메시지 스켈레톤 */}
        <div className="bg-gray-100 rounded-xl p-6">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
        
        {/* 폼 스켈레톤 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WritePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<WritePageSkeleton />}>
          <PostWrite />
        </Suspense>
      </div>
    </div>
  )
} 