'use client'

import { useState } from 'react'
import { Calculator, DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react'

interface CalculationResult {
  monthlyPayment: number
  totalPayment: number
  paymentPeriod: number
  minimumLiving: number
  availableIncome: number
  liquidationValue: number
  canApply: boolean
  warnings: string[]
}

export default function PersonalRecoveryCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [totalDebt, setTotalDebt] = useState('')
  const [assets, setAssets] = useState('')
  const [familySize, setFamilySize] = useState('1')
  const [debtType, setDebtType] = useState('normal')
  const [specialStatus, setSpecialStatus] = useState('none')
  const [paymentPeriod, setPaymentPeriod] = useState('60')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)

  const formatNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const unformatNumber = (value: string) => {
    return value.replace(/,/g, '')
  }

  const handleMonthlyIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value)
    setMonthlyIncome(formatted)
  }

  const handleTotalDebtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value)
    setTotalDebt(formatted)
  }

  const calculatePayment = () => {
    if (!monthlyIncome || !totalDebt) {
      alert('월 소득과 총 부채를 입력해주세요.')
      return
    }

    setIsCalculating(true)
    
    setTimeout(() => {
      const income = parseInt(unformatNumber(monthlyIncome))
      const debt = parseInt(unformatNumber(totalDebt))
      const assetValue = parseInt(unformatNumber(assets)) || 0
      const family = parseInt(familySize)
      const period = parseInt(paymentPeriod)

      // 최저생계비 계산 (2024년 기준)
      const baseMinimumLiving = {
        1: 713102,
        2: 1178435,
        3: 1508690,
        4: 1833572,
        5: 2142635,
        6: 2432120
      }

      let minimumLiving = baseMinimumLiving[family as keyof typeof baseMinimumLiving] || 
                         baseMinimumLiving[6] + (family - 6) * 289485

      // 특수 상황에 따른 최저생계비 조정
      let specialAdjustment = 0
      switch (specialStatus) {
        case 'disability':
          specialAdjustment = 0.30
          break
        case 'basic_livelihood':
          specialAdjustment = 0.50
          break
        case 'addiction_treatment':
          specialAdjustment = 0.25
          break
        case 'elderly':
          specialAdjustment = 0.20
          break
        case 'single_parent':
          specialAdjustment = 0.25
          break
      }

      minimumLiving = Math.floor(minimumLiving * (1 + specialAdjustment))

      // 가용소득 계산
      const availableIncome = Math.max(0, income - minimumLiving)

      // 청산가치 계산
      const liquidationValue = Math.floor(assetValue * 0.8)

      // 부채 성격별 변제율
      let debtRate = 0.25
      switch (debtType) {
        case 'normal':
          debtRate = 0.25
          break
        case 'longterm_invest':
          debtRate = 0.50
          break
        case 'shortterm_invest':
          debtRate = 0.80
          break
        case 'crypto':
          debtRate = 0.85
          break
        case 'futures':
          debtRate = 0.90
          break
        case 'gambling':
          debtRate = 0.95
          break
      }

      // 특수 상황에 따른 변제율 완화
      let rateReduction = 0
      switch (specialStatus) {
        case 'disability':
          rateReduction = 0.20
          break
        case 'basic_livelihood':
          rateReduction = 0.30
          break
        case 'addiction_treatment':
          rateReduction = 0.40
          break
        case 'elderly':
          rateReduction = 0.15
          break
        case 'single_parent':
          rateReduction = 0.20
          break
      }

      const finalDebtRate = Math.max(0.15, debtRate - rateReduction)

      // 변제금 계산
      const debtBasedPayment = Math.floor((debt * finalDebtRate) / period)
      const liquidationBasedPayment = Math.floor(liquidationValue / period)
      const incomeBasedPayment = Math.floor(availableIncome * 0.8)

      // 최종 월 변제금 (세 가지 중 최대값)
      const monthlyPayment = Math.max(debtBasedPayment, liquidationBasedPayment, incomeBasedPayment)
      const totalPayment = monthlyPayment * period

      // 경고 메시지
      const warnings: string[] = []

      if (availableIncome < monthlyPayment) {
        warnings.push('가용소득이 부족하여 변제가 어려울 수 있습니다.')
      }

      if (totalPayment > debt * 0.8) {
        warnings.push('변제금이 너무 높아 개인회생 승인이 어려울 수 있습니다.')
      }

      if (income < minimumLiving * 1.2) {
        warnings.push('소득이 최저생계비에 비해 낮아 신청이 어려울 수 있습니다.')
      }

      if (debt < 5000000) {
        warnings.push('부채가 500만원 미만인 경우 개인회생보다 다른 방법을 고려해보세요.')
      }

      // 신청 가능 여부 판단
      const canApply = availableIncome >= monthlyPayment && 
                      totalPayment <= debt * 0.8 && 
                      income >= minimumLiving * 1.1

      setResult({
        monthlyPayment,
        totalPayment,
        paymentPeriod: period,
        minimumLiving,
        availableIncome,
        liquidationValue,
        canApply,
        warnings
      })

      setIsCalculating(false)
    }, 1000)
  }

  const resetCalculator = () => {
    setMonthlyIncome('')
    setTotalDebt('')
    setAssets('')
    setFamilySize('1')
    setDebtType('normal')
    setSpecialStatus('none')
    setPaymentPeriod('60')
    setResult(null)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calculator className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">개인회생 변제금 계산기</h3>
        </div>
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {showCalculator ? '접기' : '계산하기'}
        </button>
      </div>

      {!showCalculator ? (
        <div className="text-center py-8">
          <Calculator className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">개인회생 변제금을 간편하게 계산해보세요</p>
          <p className="text-sm text-gray-500">
            • 부채 성격별 차등 계산 (일반 25% ~ 도박 95%)<br />
            • 취약계층 특별 고려사항 적용<br />
            • 실제 법원 기준 반영
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 월 소득 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                월 소득 (세후)
              </label>
              <input
                type="text"
                value={monthlyIncome}
                onChange={handleMonthlyIncomeChange}
                placeholder="예: 3,000,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">실제 받는 월 소득을 입력하세요</p>
            </div>

            {/* 총 부채 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                총 부채
              </label>
              <input
                type="text"
                value={totalDebt}
                onChange={handleTotalDebtChange}
                placeholder="예: 100,000,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">모든 부채의 총합을 입력하세요</p>
            </div>

            {/* 자산 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                총 자산 (선택)
              </label>
              <input
                type="text"
                value={assets}
                onChange={(e) => setAssets(formatNumber(e.target.value))}
                placeholder="예: 50,000,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">부동산, 예금 등 모든 자산</p>
            </div>

            {/* 가족 수 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                가족 수
              </label>
              <select
                value={familySize}
                onChange={(e) => setFamilySize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">1명 (본인만)</option>
                <option value="2">2명</option>
                <option value="3">3명</option>
                <option value="4">4명</option>
                <option value="5">5명</option>
                <option value="6">6명 이상</option>
              </select>
            </div>

            {/* 부채 성격 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                부채 성격
              </label>
              <select
                value={debtType}
                onChange={(e) => setDebtType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="normal">일반 부채 (25% 변제)</option>
                <option value="longterm_invest">장기 주식투자 (50% 변제)</option>
                <option value="shortterm_invest">단기 주식투기 (80% 변제)</option>
                <option value="crypto">암호화폐(코인) 투자 (85% 변제)</option>
                <option value="futures">선물/옵션/FX거래 (90% 변제)</option>
                <option value="gambling">도박 관련 부채 (95% 변제)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">부채 성격에 따라 변제 비율이 달라집니다</p>
            </div>

            {/* 특수 상황 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                특수 상황 (해당사항 있는 경우)
              </label>
              <select
                value={specialStatus}
                onChange={(e) => setSpecialStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="none">해당 없음</option>
                <option value="disability">장애인 (생계비 30%↑ + 변제율 20%↓)</option>
                <option value="basic_livelihood">기초생활 수급자 (생계비 대폭↑ + 변제율 30%↓)</option>
                <option value="addiction_treatment">도박 중독 치료 이력 (생계비 25%↑ + 변제율 40%↓)</option>
                <option value="elderly">고령자 (만 65세 이상, 생계비 20%↑ + 변제율 15%↓)</option>
                <option value="single_parent">한부모 가정 (생계비 25%↑ + 변제율 20%↓)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">취약계층에 대한 특별 고려사항이 적용됩니다</p>
            </div>

            {/* 변제기간 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                변제기간
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="36"
                    checked={paymentPeriod === '36'}
                    onChange={(e) => setPaymentPeriod(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">3년 (36개월)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="60"
                    checked={paymentPeriod === '60'}
                    onChange={(e) => setPaymentPeriod(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">5년 (60개월)</span>
                </label>
              </div>
            </div>
          </div>

          {/* 계산 버튼 */}
          <div className="flex space-x-3">
            <button
              onClick={calculatePayment}
              disabled={isCalculating}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isCalculating ? '계산 중...' : '💰 변제금 계산하기'}
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
              <div className={`p-4 rounded-lg border ${result.canApply ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center mb-2">
                  {result.canApply ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  )}
                  <span className={`font-medium ${result.canApply ? 'text-green-800' : 'text-red-800'}`}>
                    {result.canApply ? '개인회생 신청 가능' : '개인회생 신청 어려움'}
                  </span>
                </div>
              </div>

              {/* 상세 결과 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💰 월 변제금</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {result.monthlyPayment.toLocaleString()}원
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    {result.paymentPeriod}개월 동안 매월 납부
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">💵 총 변제금</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {result.totalPayment.toLocaleString()}원
                  </p>
                  <p className="text-sm text-purple-700 mt-1">
                    전체 변제 완료 금액
                  </p>
                </div>
              </div>

              {/* 세부 정보 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">📊 계산 세부사항</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">최저생계비:</span>
                    <span className="font-medium ml-2">{result.minimumLiving.toLocaleString()}원</span>
                  </div>
                  <div>
                    <span className="text-gray-600">가용소득:</span>
                    <span className="font-medium ml-2">{result.availableIncome.toLocaleString()}원</span>
                  </div>
                  <div>
                    <span className="text-gray-600">청산가치:</span>
                    <span className="font-medium ml-2">{result.liquidationValue.toLocaleString()}원</span>
                  </div>
                  <div>
                    <span className="text-gray-600">변제기간:</span>
                    <span className="font-medium ml-2">{result.paymentPeriod}개월</span>
                  </div>
                  <div>
                    <span className="text-gray-600">부채 성격:</span>
                    <span className="font-medium ml-2">
                      {debtType === 'normal' && '일반 부채 (25% 변제)'}
                      {debtType === 'longterm_invest' && '장기 주식투자 (50% 변제)'}
                      {debtType === 'shortterm_invest' && '단기 주식투기 (80% 변제)'}
                      {debtType === 'crypto' && '암호화폐 투자 (85% 변제)'}
                      {debtType === 'futures' && '선물/옵션/FX (90% 변제)'}
                      {debtType === 'gambling' && '도박 부채 (95% 변제)'}
                    </span>
                  </div>
                  {specialStatus !== 'none' && (
                    <div>
                      <span className="text-gray-600">특수 상황:</span>
                      <span className="font-medium ml-2 text-green-600">
                        {specialStatus === 'disability' && '장애인 (20% 완화)'}
                        {specialStatus === 'basic_livelihood' && '기초생활 수급자 (30% 완화)'}
                        {specialStatus === 'addiction_treatment' && '도박 중독 치료 (40% 완화)'}
                        {specialStatus === 'elderly' && '고령자 (15% 완화)'}
                        {specialStatus === 'single_parent' && '한부모 가정 (20% 완화)'}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">실제 변제율:</span>
                    <span className="font-medium ml-2">
                      {Math.round((result.totalPayment / parseInt(unformatNumber(totalDebt))) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 경고 메시지 */}
              {result.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    주의사항
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {result.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 안내 메시지 */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">💡 다음 단계</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• 위 계산 결과는 예상 값이며, 실제 법원 심사 결과와 다를 수 있습니다.</p>
                  <p>• 정확한 신청 가능 여부는 법무사나 변호사와 상담받으시기 바랍니다.</p>
                  <p>• 개인회생 신청 전 전문가 무료 상담을 받아보세요.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}