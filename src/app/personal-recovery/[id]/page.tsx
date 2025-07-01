import { Metadata } from 'next'
import { Suspense } from 'react'
import PostDetail from '@/components/PostDetail'
import Advertisement from '@/components/Advertisement'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `게시글 #${id} - 개인회생`,
    description: '신용회복 커뮤니티의 개인회생 게시글입니다.'
  }
}

// 로딩 스켈레톤 (재사용)
function PostDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-20 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function PersonalRecoveryPostPage({ params }: PageProps) {
  const { id } = await params
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center px-4 py-8">
        <div className="w-full max-w-7xl">
          <div className="flex justify-center">
            {/* 메인 콘텐츠 */}
            <main className="w-full max-w-4xl">
              <Suspense fallback={<PostDetailSkeleton />}>
                <PostDetail 
                  postId={id} 
                  category="personal-recovery" 
                />
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
} 