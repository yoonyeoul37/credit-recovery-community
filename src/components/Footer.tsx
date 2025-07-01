import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 사이트 정보 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">새출발 커뮤니티</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              신용회복과 새로운 시작을 함께하는 따뜻한 커뮤니티입니다. 
              혼자가 아니에요, 우리가 함께합니다.
            </p>
            <p className="text-xs text-gray-500">
              익명성을 보장하며 안전하게 정보를 나눌 수 있는 공간입니다.
            </p>
          </div>

          {/* 커뮤니티 가이드 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">커뮤니티 가이드</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 서로를 존중하고 배려해주세요</li>
              <li>• 개인정보는 절대 공유하지 마세요</li>
              <li>• 허위 정보나 광고는 금지됩니다</li>
              <li>• 따뜻한 격려와 응원을 나눠주세요</li>
              <li>• 전문적인 법률 상담은 전문가에게 문의하세요</li>
            </ul>
          </div>

          {/* 면책 조항 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">면책 조항</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              본 사이트의 모든 정보는 참고용으로만 제공되며, 
              개인의 경험과 의견을 바탕으로 한 것입니다. 
              법적, 재정적 결정을 내리기 전에는 반드시 
              전문가와 상담하시기 바랍니다.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  © 2024 새출발 커뮤니티. 모든 권리 보유.
                </p>
                <a 
                  href="/admin" 
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  title="관리자 페이지"
                >
                  관리자
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 메시지 */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-600">
            <Heart className="inline w-4 h-4 text-red-400 mr-1" />
            당신의 새로운 시작을 진심으로 응원합니다
            <Heart className="inline w-4 h-4 text-red-400 ml-1" />
          </p>
        </div>
      </div>
    </footer>
  )
} 