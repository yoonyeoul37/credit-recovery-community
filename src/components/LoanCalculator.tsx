'use client'

import { useState } from 'react'
import { Calculator, DollarSign, Percent, Calendar, Info, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

// 대출 계산 결과 인터페이스
interface LoanResult {
  monthlyPayment: number
  totalInterest: number
  totalPayment: number
  loanPeriod: number
  interestRate: number
  principal: number
  paymentType: string
}

// 신용등급별 금리 정보
const CREDIT_RATES = {
  '1등급': { range: '1~2등급', rate: '3.5~6.5%', description: '최우량 고객' },
  '2등급': { range: '1~2등급', rate: '3.5~6.5%', description: '최우량 고객' },
  '3등급': { range: '3~4등급', rate: '6.5~10.5%', description: '우량 고객' },
  '4등급': { range: '3~4등급', rate: '6.5~10.5%', description: '우량 고객' },
  '5등급': { range: '5~6등급', rate: '10.5~15.5%', description: '일반 고객' },
  '6등급': { range: '5~6등급', rate: '10.5~15.5%', description: '일반 고객' },
  '7등급': { range: '7~8등급', rate: '15.5~20.0%', description: '주의 고객' },
  '8등급': { range: '7~8등급', rate: '15.5~20.0%', description: '주의 고객' },
  '9등급': { range: '9~10등급', rate: '20.0~24.0%', description: '위험 고객' },
  '10등급': { range: '9~10등급', rate: '20.0~24.0%', description: '위험 고객' },
}

// 대출 종류별 정보
const LOAN_TYPES = {
  'credit': { name: '신용대출', rate: '5~20%', description: '무담보 개인신용 대출' },
  'mortgage': { name: '주택담보대출', rate: '3~7%', description: '주택을 담보로 한 대출' },
  'jeonse': { name: '전세대출', rate: '2~5%', description: '전세보증금 대출' },
  'car': { name: '자동차담보대출', rate: '4~12%', description: '자동차를 담보로 한 대출' },
  'business': { name: '사업자대출', rate: '4~15%', description: '사업자금 대출' },
}

export default function LoanCalculator() {
  const [isOpen, setIsOpen] = useState(false)
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanPeriod, setLoanPeriod] = useState('36')
  const [paymentType, setPaymentType] = useState('equal_payment') // equal_payment, equal_principal, grace_equal_payment, grace_equal_principal, bullet_payment
  const [gracePeriod, setGracePeriod] = useState('0') // 거치기간 (월)
  const [loanType, setLoanType] = useState('credit')
  const [creditGrade, setCreditGrade] = useState('5등급')
  const [result, setResult] = useState<LoanResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // 숫자 포맷팅 함수
  const formatNumber = (value: string) => {
    const number = value.replace(/[^0-9]/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // 숫자 언포맷팅 함수
  const unformatNumber = (value: string) => {
    return value.replace(/,/g, '')
  }

  // 대출 원금 입력 핸들러
  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value)
    setLoanAmount(formatted)
  }

  // 대출 계산 함수
  const calculateLoan = () => {
    if (!loanAmount || !interestRate) {
      alert('대출 원금과 금리를 입력해주세요.')
      return
    }

    setIsCalculating(true)

    setTimeout(() => {
      const principal = parseInt(unformatNumber(loanAmount))
      const rate = parseFloat(interestRate) / 100 / 12 // 월 이자율
      const period = parseInt(loanPeriod)
      const grace = parseInt(gracePeriod)

      let monthlyPayment = 0
      let totalInterest = 0
      let totalPayment = 0

      if (paymentType === 'equal_payment') {
        // 원리금 균등 상환
        if (rate > 0) {
          monthlyPayment = principal * (rate * Math.pow(1 + rate, period)) / (Math.pow(1 + rate, period) - 1)
        } else {
          monthlyPayment = principal / period
        }
        totalPayment = monthlyPayment * period
        totalInterest = totalPayment - principal
        
      } else if (paymentType === 'equal_principal') {
        // 원금 균등 상환
        const monthlyPrincipal = principal / period
        totalInterest = 0
        for (let i = 0; i < period; i++) {
          const remainingPrincipal = principal - (monthlyPrincipal * i)
          totalInterest += remainingPrincipal * rate
        }
        totalPayment = principal + totalInterest
        monthlyPayment = (totalPayment) / period // 평균 월 상환금
        
      } else if (paymentType === 'grace_equal_payment') {
        // 거치기간 후 원리금 균등 상환
        const graceInterest = principal * rate * grace // 거치기간 동안 이자
        const repaymentPeriod = period - grace // 실제 상환기간
        
        if (repaymentPeriod > 0 && rate > 0) {
          const monthlyRepayment = principal * (rate * Math.pow(1 + rate, repaymentPeriod)) / (Math.pow(1 + rate, repaymentPeriod) - 1)
          monthlyPayment = monthlyRepayment // 상환기간 동안의 월 상환금
          totalInterest = graceInterest + (monthlyRepayment * repaymentPeriod - principal)
        } else {
          monthlyPayment = grace > 0 ? principal / repaymentPeriod : principal / period
          totalInterest = graceInterest
        }
        totalPayment = principal + totalInterest
        
      } else if (paymentType === 'grace_equal_principal') {
        // 거치기간 후 원금 균등 상환
        const graceInterest = principal * rate * grace // 거치기간 동안 이자
        const repaymentPeriod = period - grace // 실제 상환기간
        
        if (repaymentPeriod > 0) {
          const monthlyPrincipal = principal / repaymentPeriod
          let repaymentInterest = 0
          for (let i = 0; i < repaymentPeriod; i++) {
            const remainingPrincipal = principal - (monthlyPrincipal * i)
            repaymentInterest += remainingPrincipal * rate
          }
          totalInterest = graceInterest + repaymentInterest
          monthlyPayment = (principal + repaymentInterest) / repaymentPeriod // 평균 상환금
        } else {
          totalInterest = graceInterest
          monthlyPayment = 0
        }
        totalPayment = principal + totalInterest
        
      } else if (paymentType === 'bullet_payment') {
        // 만기일시 상환 (이자만 납부)
        const monthlyInterest = principal * rate // 월 이자
        monthlyPayment = monthlyInterest
        totalInterest = monthlyInterest * period
        totalPayment = principal + totalInterest
      }

      setResult({
        monthlyPayment: Math.round(monthlyPayment),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment),
        loanPeriod: period,
        interestRate: parseFloat(interestRate),
        principal: principal,
        paymentType: paymentType
      })

      setIsCalculating(false)
    }, 1000)
  }

  // 입력 초기화
  const resetCalculator = () => {
    setLoanAmount('')
    setInterestRate('')
    setLoanPeriod('36')
    setPaymentType('equal_payment')
    setGracePeriod('0')
    setLoanType('credit')
    setCreditGrade('5등급')
    setResult(null)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div 
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 cursor-pointer hover:from-green-600 hover:to-blue-600 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            <span className="font-medium">대출 계산기</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-2">월 상환금 계산</span>
            <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* 내용 */}
      {isOpen && (
        <div className="p-6 space-y-6">
          {/* 안내 메시지 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">💰 대출 계산기 안내</p>
                <ul className="space-y-1 text-xs">
                  <li>• 원리금 균등: 매월 동일한 금액 상환 (일반적)</li>
                  <li>• 원금 균등: 매월 원금은 동일, 이자는 감소</li>
                  <li>• 거치기간 후 상환: 처음엔 이자만, 나중에 원금+이자</li>
                  <li>• 만기일시: 매월 이자만, 만기에 원금 전액</li>
                  <li>• 실제 대출 조건은 은행별로 다를 수 있습니다</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 대출 종류 및 신용등급 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 대출 종류 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-800 mb-2">📋 대출 종류별 금리</h4>
              <div className="space-y-1 text-xs">
                {Object.entries(LOAN_TYPES).map(([key, info]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-blue-700">{info.name}:</span>
                    <span className="text-blue-600 font-medium">{info.rate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 신용등급별 금리 */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <h4 className="font-medium text-purple-800 mb-2">🎯 신용등급별 금리</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-700">1~2등급:</span>
                  <span className="text-purple-600 font-medium">3.5~6.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">3~4등급:</span>
                  <span className="text-purple-600 font-medium">6.5~10.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">5~6등급:</span>
                  <span className="text-purple-600 font-medium">10.5~15.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">7~8등급:</span>
                  <span className="text-purple-600 font-medium">15.5~20.0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">9~10등급:</span>
                  <span className="text-purple-600 font-medium">20.0~24.0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 입력 폼 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 대출 원금 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                대출 원금
              </label>
              <input
                type="text"
                value={loanAmount}
                onChange={handleLoanAmountChange}
                placeholder="예: 50,000,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">단위: 원</p>
            </div>

            {/* 대출 금리 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Percent className="w-4 h-4 inline mr-1" />
                연 금리
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="예: 8.5"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">단위: % (연 이자율)</p>
            </div>

            {/* 대출 기간 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                대출 기간
              </label>
              <select
                value={loanPeriod}
                onChange={(e) => setLoanPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="12">1년 (12개월)</option>
                <option value="24">2년 (24개월)</option>
                <option value="36">3년 (36개월)</option>
                <option value="48">4년 (48개월)</option>
                <option value="60">5년 (60개월)</option>
                <option value="84">7년 (84개월)</option>
                <option value="120">10년 (120개월)</option>
                <option value="240">20년 (240개월)</option>
                <option value="360">30년 (360개월)</option>
              </select>
            </div>

            {/* 상환 방식 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                상환 방식
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="equal_payment">원리금 균등 상환 (일반적)</option>
                <option value="equal_principal">원금 균등 상환</option>
                <option value="grace_equal_payment">거치기간 후 원리금 균등</option>
                <option value="grace_equal_principal">거치기간 후 원금 균등</option>
                <option value="bullet_payment">만기일시 상환</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {paymentType === 'equal_payment' && '매월 동일한 금액 상환'}
                {paymentType === 'equal_principal' && '매월 원금은 동일, 이자는 감소'}
                {paymentType === 'grace_equal_payment' && '거치기간 동안 이자만, 이후 원리금 균등'}
                {paymentType === 'grace_equal_principal' && '거치기간 동안 이자만, 이후 원금 균등'}
                {paymentType === 'bullet_payment' && '매월 이자만 납부, 만기에 원금 전액'}
              </p>
            </div>

            {/* 거치기간 (거치기간 상환방식일 때만 표시) */}
            {(paymentType === 'grace_equal_payment' || paymentType === 'grace_equal_principal') && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  거치기간
                </label>
                <select
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="0">거치기간 없음</option>
                  <option value="6">6개월</option>
                  <option value="12">1년 (12개월)</option>
                  <option value="18">1년 6개월 (18개월)</option>
                  <option value="24">2년 (24개월)</option>
                  <option value="36">3년 (36개월)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  거치기간 동안은 이자만 납부하고, 이후 원금 상환 시작
                </p>
              </div>
            )}

            {/* 대출 종류 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                대출 종류
              </label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {Object.entries(LOAN_TYPES).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.name} ({info.rate})
                  </option>
                ))}
              </select>
            </div>

            {/* 신용등급 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                신용등급 (참고용)
              </label>
              <select
                value={creditGrade}
                onChange={(e) => setCreditGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {Object.entries(CREDIT_RATES).map(([grade, info]) => (
                  <option key={grade} value={grade}>
                    {grade} ({info.rate})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 계산 버튼 */}
          <div className="flex space-x-3">
            <button
              onClick={calculateLoan}
              disabled={isCalculating}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isCalculating ? '계산 중...' : '💰 월 상환금 계산하기'}
            </button>
            <button
              onClick={resetCalculator}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              초기화
            </button>
          </div>

          {/* 계산 결과 */}
          {result && (
            <div className="mt-6 space-y-4">
              {/* 결과 요약 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">대출 계산 결과</span>
                </div>
              </div>

              {/* 상세 결과 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">📊 상환 정보</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">월 상환금:</span>
                      <span className="font-bold text-green-600 ml-2 text-lg">
                        {result.monthlyPayment.toLocaleString()}원
                      </span>
                      {result.paymentType === 'bullet_payment' && (
                        <span className="text-xs text-gray-500 block mt-1">
                          * 만기일시: 매월 이자만 납부, 만기에 원금 {result.principal.toLocaleString()}원 추가
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-600">대출 원금:</span>
                      <span className="font-medium ml-2">
                        {result.principal.toLocaleString()}원
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">대출 기간:</span>
                      <span className="font-medium ml-2">
                        {result.loanPeriod}개월 ({Math.floor(result.loanPeriod / 12)}년 {result.loanPeriod % 12}개월)
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">적용 금리:</span>
                      <span className="font-medium ml-2">
                        연 {result.interestRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">상환 방식:</span>
                      <span className="font-medium ml-2">
                        {result.paymentType === 'equal_payment' && '원리금 균등 상환'}
                        {result.paymentType === 'equal_principal' && '원금 균등 상환'}
                        {result.paymentType === 'grace_equal_payment' && '거치기간 후 원리금 균등'}
                        {result.paymentType === 'grace_equal_principal' && '거치기간 후 원금 균등'}
                        {result.paymentType === 'bullet_payment' && '만기일시 상환'}
                      </span>
                    </div>
                    {(paymentType === 'grace_equal_payment' || paymentType === 'grace_equal_principal') && gracePeriod !== '0' && (
                      <div>
                        <span className="text-gray-600">거치기간:</span>
                        <span className="font-medium ml-2">
                          {gracePeriod}개월 (이자만 납부)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">💸 총 비용</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">총 이자:</span>
                      <span className="font-bold text-red-600 ml-2 text-lg">
                        {result.totalInterest.toLocaleString()}원
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">총 상환금:</span>
                      <span className="font-bold text-blue-600 ml-2 text-lg">
                        {result.totalPayment.toLocaleString()}원
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">이자 비율:</span>
                      <span className="font-medium ml-2">
                        {Math.round((result.totalInterest / result.principal) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 주의사항 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">⚠️ 주의사항</p>
                    <ul className="space-y-1 text-xs">
                      <li>• 실제 대출 조건은 은행별, 개인 신용도별로 다를 수 있습니다</li>
                      <li>• 중도상환 수수료, 보증료, 각종 부대비용은 별도입니다</li>
                      <li>• 변동금리 대출의 경우 금리 변동에 따라 상환금이 달라질 수 있습니다</li>
                      <li>• 정확한 대출 조건은 해당 금융기관에 문의하시기 바랍니다</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 