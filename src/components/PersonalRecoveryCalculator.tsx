'use client'

import { useState, useEffect } from 'react'
import { Calculator, Info, AlertCircle, CheckCircle, DollarSign, Users, MapPin, Calendar } from 'lucide-react'

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

// 2024년 기준 최저생계비 (지역별, 가구원 수별)
const MINIMUM_LIVING_COSTS = {
  seoul: {
    1: 1200000,
    2: 1800000,
    3: 2300000,
    4: 2800000,
    5: 3300000,
    6: 3800000
  },
  metro: {
    1: 1100000,
    2: 1650000,
    3: 2100000,
    4: 2550000,
    5: 3000000,
    6: 3450000
  },
  other: {
    1: 1000000,
    2: 1500000,
    3: 1900000,
    4: 2300000,
    5: 2700000,
    6: 3100000
  }
}

export default function PersonalRecoveryCalculator() {
  const [isOpen, setIsOpen] = useState(false)
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [familySize, setFamilySize] = useState('1')
  const [region, setRegion] = useState('other')
  const [totalDebt, setTotalDebt] = useState('')
  const [paymentPeriod, setPaymentPeriod] = useState('36')
  const [debtType, setDebtType] = useState('normal') // normal, longterm_invest, shortterm_invest, crypto, futures, gambling
  const [specialStatus, setSpecialStatus] = useState('none') // none, disability, basic_livelihood, elderly, single_parent, addiction_treatment
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // 숫자 포맷팅 함수 (쉼표 추가)
  const formatNumber = (value: string) => {
    // 숫자만 추출
    const numericValue = value.replace(/[^0-9]/g, '')
    // 쉼표 추가
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // 숫자 언포맷팅 함수 (쉼표 제거)
  const unformatNumber = (value: string) => {
    return value.replace(/,/g, '')
  }

  // 월소득 입력 핸들러
  const handleMonthlyIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value)
    setMonthlyIncome(formatted)
  }

  // 총 부채액 입력 핸들러
  const handleTotalDebtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value)
    setTotalDebt(formatted)
  }

  // 계산 로직
  const calculatePayment = () => {
    if (!monthlyIncome || !totalDebt) {
      alert('월소득과 총 부채액을 입력해주세요.')
      return
    }

    setIsCalculating(true)
    
    // 약간의 로딩 시간 후 계산
    setTimeout(() => {
      const income = parseInt(unformatNumber(monthlyIncome))
      const debt = parseInt(unformatNumber(totalDebt))
      const period = parseInt(paymentPeriod)
      const family = parseInt(familySize)
      
      // 최저생계비 계산
      const regionKey = region as keyof typeof MINIMUM_LIVING_COSTS
      const familyKey = Math.min(family, 6) as keyof typeof MINIMUM_LIVING_COSTS[typeof regionKey]
      let minimumLiving = MINIMUM_LIVING_COSTS[regionKey][familyKey]
      
      // 특수 상황에 따른 최저생계비 조정
      if (specialStatus !== 'none') {
        switch (specialStatus) {
          case 'disability':
            // 장애인의 경우 의료비, 보조기구비 등으로 최저생계비 30% 증가
            minimumLiving = Math.floor(minimumLiving * 1.3)
            break
          case 'basic_livelihood':
            // 기초생활 수급자의 경우 월소득의 90%를 최저생계비로 설정 (거의 변제 불가)
            minimumLiving = Math.floor(income * 0.9)
            break
          case 'addiction_treatment':
            // 도박 중독 치료 중인 경우 치료비 등으로 최저생계비 25% 증가
            minimumLiving = Math.floor(minimumLiving * 1.25)
            break
          case 'elderly':
            // 고령자의 경우 의료비 등으로 최저생계비 20% 증가
            minimumLiving = Math.floor(minimumLiving * 1.2)
            break
          case 'single_parent':
            // 한부모 가정의 경우 양육비 등으로 최저생계비 25% 증가
            minimumLiving = Math.floor(minimumLiving * 1.25)
            break
        }
      }
      
      // 변제 가능 소득 계산
      const availableIncome = Math.max(0, income - minimumLiving)
      
      // 월 변제금 계산 (가용소득의 80-90%)
      const monthlyPayment = Math.floor(availableIncome * 0.85)
      
      // 총 변제금 계산
      const totalPayment = monthlyPayment * period
      
             // 부채 성격에 따른 변제 비율 계산
       let repaymentRate = 0.25 // 기본 25% (일반 부채)
       
       switch (debtType) {
         case 'gambling':
           repaymentRate = 0.95 // 도박: 95% 변제
           break
         case 'futures':
           repaymentRate = 0.90 // 선물/옵션/FX: 90% 변제
           break
         case 'crypto':
           repaymentRate = 0.85 // 암호화폐: 85% 변제
           break
         case 'shortterm_invest':
           repaymentRate = 0.80 // 단기 주식투기: 80% 변제
           break
         case 'longterm_invest':
           repaymentRate = 0.50 // 장기 주식투자: 50% 변제
           break
         default:
           repaymentRate = 0.25 // 일반 부채: 25% 변제
       }
       
       // 특수 상황에 따른 변제 비율 완화 적용
       if (specialStatus !== 'none') {
         switch (specialStatus) {
           case 'disability':
             // 장애인의 경우 변제 비율 20% 완화
             repaymentRate = Math.max(0.25, repaymentRate * 0.8)
             break
           case 'basic_livelihood':
             // 기초생활 수급자의 경우 변제 비율 30% 완화
             repaymentRate = Math.max(0.20, repaymentRate * 0.7)
             break
           case 'addiction_treatment':
             // 도박 중독 치료 이력이 있는 경우 40% 완화
             repaymentRate = Math.max(0.25, repaymentRate * 0.6)
             break
           case 'elderly':
             // 고령자의 경우 변제 비율 15% 완화
             repaymentRate = Math.max(0.25, repaymentRate * 0.85)
             break
           case 'single_parent':
             // 한부모 가정의 경우 변제 비율 20% 완화
             repaymentRate = Math.max(0.25, repaymentRate * 0.8)
             break
         }
       }
       
       // 청산가치 계산 (부채 성격별 차등 적용)
       const liquidationValue = Math.floor(debt * repaymentRate)
       
       // 실제 변제금은 청산가치와 비교하여 높은 금액
       const finalMonthlyPayment = Math.max(monthlyPayment, Math.floor(liquidationValue / period))
       const finalTotalPayment = finalMonthlyPayment * period
       
       // 신청 가능 여부 판단 (투기성 부채는 제한적)
       let canApply = income > minimumLiving && debt >= 1000000 && debt <= 5000000000
       
       // 투기성이 높은 부채는 추가 조건
       if (debtType === 'gambling') {
         canApply = canApply && finalTotalPayment >= debt * 0.9 // 90% 이상 변제 가능해야 함
       } else if (debtType === 'futures') {
         canApply = canApply && finalTotalPayment >= debt * 0.8 // 80% 이상 변제 가능해야 함
       } else if (debtType === 'crypto') {
         canApply = canApply && finalTotalPayment >= debt * 0.75 // 75% 이상 변제 가능해야 함
       }
      
      // 경고 메시지 생성
      const warnings: string[] = []
      if (income <= minimumLiving) {
        warnings.push('월소득이 최저생계비보다 낮습니다. 개인회생 신청이 어려울 수 있습니다.')
      }
      if (debt < 1000000) {
        warnings.push('총 부채액이 100만원 미만입니다. 개인회생 대상이 아닐 수 있습니다.')
      }
      if (debt > 5000000000) {
        warnings.push('총 부채액이 50억원을 초과합니다. 개인회생 한도를 확인해주세요.')
      }
      if (finalMonthlyPayment > availableIncome) {
        warnings.push('청산가치로 인해 변제금이 높게 계산되었습니다.')
      }
             if (finalTotalPayment > debt * 0.8) {
         warnings.push('변제금이 너무 높습니다. 전문가 상담을 받아보세요.')
       }
       
       // 부채 성격별 특별 경고
       switch (debtType) {
         case 'gambling':
           warnings.push('🚨 도박 부채는 면책이 매우 제한적입니다. 거의 전액 변제해야 합니다.')
           warnings.push('🚨 도박 중독 치료 이력이 개인회생 승인에 도움이 될 수 있습니다.')
           warnings.push('🚨 도박 부채가 전체 부채의 주요 원인이면 신청 자체가 거절될 수 있습니다.')
           break
         case 'futures':
           warnings.push('⚠️ 선물/옵션/FX 거래는 투기성이 높아 90% 변제율이 적용됩니다.')
           warnings.push('⚠️ 거래 내역과 손실 과정에 대한 상세한 자료가 필요합니다.')
           break
         case 'crypto':
           warnings.push('⚠️ 암호화폐 투자는 투기성 투자로 분류되어 85% 변제율이 적용됩니다.')
           warnings.push('⚠️ 거래소 내역과 투자 경위를 상세히 설명해야 합니다.')
           break
         case 'shortterm_invest':
           warnings.push('⚠️ 단기 주식투기는 투기성 투자로 80% 변제율이 적용됩니다.')
           warnings.push('⚠️ 투자 목적과 기간, 거래 빈도 등이 심사 기준이 됩니다.')
           break
         case 'longterm_invest':
           warnings.push('💡 장기 투자는 상대적으로 낮은 50% 변제율이 적용됩니다.')
           warnings.push('💡 투자 목적과 기간을 입증할 수 있는 자료를 준비하세요.')
           break
       }
       
       // 특수 상황별 안내 메시지
       if (specialStatus !== 'none') {
         switch (specialStatus) {
           case 'disability':
             warnings.push('🤝 장애인 특별 고려: 최저생계비 30% 증가 + 변제 비율 20% 완화 적용')
             warnings.push('🤝 의료비, 보조기구비 등 추가 비용으로 월변제금이 크게 감소합니다.')
             warnings.push('🤝 장애 정도와 경제적 어려움을 입증할 수 있는 자료를 준비하세요.')
             warnings.push('🤝 정신적 장애의 경우 투기 행위의 판단능력 부족이 인정될 수 있습니다.')
             break
           case 'basic_livelihood':
             warnings.push('💙 기초생활 수급자 특별 고려: 최저생계비 대폭 증가 + 변제 비율 30% 완화')
             warnings.push('💙 월소득의 90%를 최저생계비로 인정하여 월변제금이 최소화됩니다.')
             warnings.push('💙 수급자 증명서와 생계급여 내역을 준비하세요.')
             warnings.push('💙 생존권 보장 차원에서 관대한 처리가 가능합니다.')
             break
           case 'addiction_treatment':
             warnings.push('🏥 도박 중독 치료 이력 고려: 최저생계비 25% 증가 + 변제 비율 40% 완화')
             warnings.push('🏥 치료비 등 추가 비용으로 월변제금이 감소합니다.')
             warnings.push('🏥 정신과 진료 기록과 치료 이력을 반드시 제출하세요.')
             warnings.push('🏥 질병으로 인한 의지력 상실 상태가 인정될 수 있습니다.')
             break
           case 'elderly':
             warnings.push('👵 고령자 특별 고려: 최저생계비 20% 증가 + 변제 비율 15% 완화')
             warnings.push('👵 의료비 등 추가 비용으로 월변제금이 감소합니다.')
             warnings.push('👵 나이와 건강 상태, 소득 능력을 입증할 자료를 준비하세요.')
             break
           case 'single_parent':
             warnings.push('👨‍👩‍👧‍👦 한부모 가정 특별 고려: 최저생계비 25% 증가 + 변제 비율 20% 완화')
             warnings.push('👨‍👩‍👧‍👦 양육비 등 추가 비용으로 월변제금이 감소합니다.')
             warnings.push('👨‍👩‍👧‍👦 한부모 가정 증명서와 양육비 부담을 입증하세요.')
             break
         }
       }
      
      setResult({
        monthlyPayment: finalMonthlyPayment,
        totalPayment: finalTotalPayment,
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

     // 입력 초기화
   const resetCalculator = () => {
     setMonthlyIncome('')
     setFamilySize('1')
     setRegion('other')
     setTotalDebt('')
     setPaymentPeriod('36')
     setDebtType('normal')
     setSpecialStatus('none')
     setResult(null)
   }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            <span className="font-medium">개인회생 변제금 계산기</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-2">무료 계산</span>
            <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* 계산기 본체 */}
      {isOpen && (
        <div className="p-6 space-y-6">
          {/* 안내 문구 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">📌 계산 기준 안내</p>
                                 <ul className="space-y-1 text-xs">
                   <li>• 2024년 법원 기준 최저생계비 적용</li>
                   <li>• 가용소득의 85% 기준 계산</li>
                   <li>• 일반 25%, 장기투자 50%, 단기투기 80%, 코인 85%, 선물 90%, 도박 95%</li>
                   <li>• 투기성이 높을수록 변제 비율이 증가합니다</li>
                   <li>• 🤝 취약계층은 최저생계비 증가 + 변제 비율 완화로 월변제금 크게 감소</li>
                   <li>• 💡 장애인 30%↑, 기초생활 수급자 90%↑, 한부모·중독치료 25%↑, 고령자 20%↑</li>
                   <li>• 🏥 도박 중독 치료 이력이 있으면 질병으로 인정받을 수 있습니다</li>
                   <li>• 실제 결과는 법원 심사에 따라 달라질 수 있습니다</li>
                 </ul>
              </div>
            </div>
          </div>

          {/* 입력 폼 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 월소득 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                월소득 (세후 실수령액)
              </label>
              <input
                type="text"
                value={monthlyIncome}
                onChange={handleMonthlyIncomeChange}
                placeholder="예: 2,500,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">단위: 원 (세금 제외된 실제 받는 금액)</p>
            </div>

            {/* 가구원 수 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                가구원 수
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
              <p className="text-xs text-gray-500 mt-1">본인 포함 부양가족 수</p>
            </div>

            {/* 거주지역 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                거주지역
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="other">기타 지역</option>
                <option value="metro">광역시</option>
                <option value="seoul">서울</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">최저생계비 계산 기준</p>
            </div>

                         {/* 총 부채액 */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 <AlertCircle className="w-4 h-4 inline mr-1" />
                 총 부채액
               </label>
               <input
                 type="text"
                 value={totalDebt}
                 onChange={handleTotalDebtChange}
                 placeholder="예: 50,000,000"
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               />
               <p className="text-xs text-gray-500 mt-1">단위: 원 (모든 부채 합계)</p>
             </div>
 
             {/* 부채 성격 */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 <AlertCircle className="w-4 h-4 inline mr-1" />
                 부채 발생 원인
               </label>
               <select
                 value={debtType}
                 onChange={(e) => setDebtType(e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               >
                 <option value="normal">일반 생활비/사업자금 (25% 변제)</option>
                 <option value="longterm_invest">장기 주식투자/펀드 (50% 변제)</option>
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