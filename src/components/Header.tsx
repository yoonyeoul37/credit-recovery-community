'use client'

import Link from 'next/link'
import { Heart, Home, MessageCircle, RefreshCw, Building2, DollarSign, Star, Headphones, Bookmark, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { name: '신용이야기', href: '/credit-story', icon: MessageCircle },
  { name: '개인회생', href: '/personal-recovery', icon: RefreshCw },
  { name: '법인회생', href: '/corporate-recovery', icon: Building2 },
  { name: '대출이야기', href: '/loan-story', icon: DollarSign },
  { name: '성공사례', href: '/success-story', icon: Star },
  { name: '실시간상담', href: '/live-chat', icon: Headphones },
]

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      {/* 상단 인사말 */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 px-4 py-2">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            <Heart className="inline w-4 h-4 text-red-400 mr-1" />
            혼자가 아니에요. 함께 새 출발해요!
          </p>
        </div>
      </div>

      {/* 메인 헤더 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">새출발 커뮤니티</h1>
              <p className="text-xs text-gray-500">함께하는 희망의 공간</p>
            </div>
          </Link>

          {/* 우측 정보 */}
          <div className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="내 프로필"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">프로필</span>
            </Link>
            
            <Link
              href="/bookmarks"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title="내 북마크"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">북마크</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>오늘 156명이 서로 응원했어요</span>
            </div>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="border-t border-gray-100">
          <div className="flex justify-center space-x-0 overflow-x-auto py-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </header>
  )
} 