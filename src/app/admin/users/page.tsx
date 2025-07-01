'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdminAuth from '@/components/AdminAuth'
import { ArrowLeft, Users, Ban, Shield } from 'lucide-react'

export default function UserManagement() {
  const [users] = useState([
    {
      id: 1,
      nickname: '희망찬시작',
      lastActive: '2024-01-15 14:30',
      postsCount: 3,
      commentsCount: 12,
      status: 'active',
      ipAddress: '192.168.1.100'
    },
    {
      id: 2,
      nickname: '새출발123',
      lastActive: '2024-01-15 13:15',
      postsCount: 1,
      commentsCount: 5,
      status: 'active',
      ipAddress: '192.168.1.101'
    },
    {
      id: 3,
      nickname: '스팸계정',
      lastActive: '2024-01-15 09:10',
      postsCount: 1,
      commentsCount: 0,
      status: 'banned',
      ipAddress: '192.168.1.102'
    }
  ])

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
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
              <Users className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">사용자 관리</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">사용자 관리 페이지</h2>
          <p className="text-gray-600 mb-6">익명 사용자 활동 로그와 관리 기능입니다.</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">닉네임</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">마지막 활동</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">게시글/댓글</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP 주소</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.nickname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      게시글 {user.postsCount}개 / 댓글 {user.commentsCount}개
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? '활성' : '차단됨'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이징 */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                이전
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                다음
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  총 <span className="font-medium">45</span>명 중 <span className="font-medium">1</span>-<span className="font-medium">10</span> 표시
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    이전
                  </button>
                  <button className="bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    1
                  </button>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    2
                  </button>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    다음
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminAuth>
  )
} 