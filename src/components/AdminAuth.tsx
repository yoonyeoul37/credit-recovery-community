'use client'

import { useState, useEffect, ReactNode } from 'react'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'

interface AdminAuthProps {
  children: ReactNode
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)

  // 강화된 관리자 계정 (실제 운영에서는 환경변수나 암호화된 데이터베이스 사용 권장)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'dudnf1212@@'
  }

  // 로그인 시도 제한
  const MAX_LOGIN_ATTEMPTS = 5
  const BLOCK_DURATION = 15 * 60 * 1000 // 15분

  useEffect(() => {
    // 로컬 스토리지에서 인증 상태 확인
    const authStatus = localStorage.getItem('admin_authenticated')
    const loginTime = localStorage.getItem('admin_login_time')
    
    // 세션 만료 확인 (8시간)
    if (authStatus === 'true' && loginTime) {
      const loginDate = new Date(loginTime)
      const now = new Date()
      const timeDiff = now.getTime() - loginDate.getTime()
      const eightHours = 8 * 60 * 60 * 1000
      
      if (timeDiff < eightHours) {
        setIsAuthenticated(true)
      } else {
        // 세션 만료
        localStorage.removeItem('admin_authenticated')
        localStorage.removeItem('admin_login_time')
      }
    }

    // 로그인 차단 상태 확인
    const blockTime = localStorage.getItem('admin_block_time')
    const attempts = localStorage.getItem('admin_login_attempts')
    
    if (blockTime && attempts) {
      const blockDate = new Date(blockTime)
      const now = new Date()
      const timeDiff = now.getTime() - blockDate.getTime()
      
      if (timeDiff < BLOCK_DURATION) {
        setIsBlocked(true)
        setLoginAttempts(parseInt(attempts))
      } else {
        // 차단 시간 만료
        localStorage.removeItem('admin_block_time')
        localStorage.removeItem('admin_login_attempts')
        setLoginAttempts(0)
      }
    }
    
    setIsLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isBlocked) {
      setError('너무 많은 로그인 시도로 인해 15분간 차단되었습니다.')
      return
    }

    if (credentials.username === ADMIN_CREDENTIALS.username && 
        credentials.password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true)
      setLoginAttempts(0)
      localStorage.setItem('admin_authenticated', 'true')
      localStorage.setItem('admin_login_time', new Date().toISOString())
      localStorage.removeItem('admin_login_attempts')
      localStorage.removeItem('admin_block_time')
    } else {
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      localStorage.setItem('admin_login_attempts', newAttempts.toString())
      
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        setIsBlocked(true)
        localStorage.setItem('admin_block_time', new Date().toISOString())
        setError(`${MAX_LOGIN_ATTEMPTS}회 로그인 실패로 15분간 차단되었습니다.`)
      } else {
        setError(`로그인 정보가 올바르지 않습니다. (${newAttempts}/${MAX_LOGIN_ATTEMPTS})`)
      }
      
      setCredentials({ username: '', password: '' })
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
    localStorage.removeItem('admin_login_time')
    setCredentials({ username: '', password: '' })
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 인증되지 않은 경우 로그인 폼 표시
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              관리자 로그인
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              관리자 권한이 필요한 페이지입니다
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  사용자명
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  disabled={isBlocked}
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="관리자 아이디"
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isBlocked}
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="관리자 비밀번호"
                />
                <button
                  type="button"
                  disabled={isBlocked}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:cursor-not-allowed"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className={`rounded-md p-4 ${isBlocked ? 'bg-red-50' : 'bg-yellow-50'}`}>
                <div className="flex">
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${isBlocked ? 'text-red-800' : 'text-yellow-800'}`}>
                      {isBlocked ? '로그인 차단' : '로그인 오류'}
                    </h3>
                    <div className={`mt-2 text-sm ${isBlocked ? 'text-red-700' : 'text-yellow-700'}`}>
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isBlocked}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-blue-500 group-hover:text-blue-400" />
                </span>
                {isBlocked ? '로그인 차단됨' : '로그인'}
              </button>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-500 bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="font-medium text-blue-800">🔒 보안 안내</p>
                <p>• 관리자 계정 정보는 별도로 안내됩니다</p>
                <p>• 5회 로그인 실패 시 15분간 차단됩니다</p>
                <p>• 세션은 8시간 후 자동 만료됩니다</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // 인증된 경우 자식 컴포넌트 렌더링 (관리자 헤더 추가)
  return (
    <div>
      {/* 관리자 전용 헤더 */}
      <div className="bg-blue-600 text-white px-4 py-2 text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            <span>관리자 모드 (세션 8시간)</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-blue-100 hover:text-white text-sm px-3 py-1 rounded border border-blue-400 hover:border-white"
          >
            로그아웃
          </button>
        </div>
      </div>
      {children}
    </div>
  )
} 