// 샘플 광고 데이터
export const sampleAds = {
  header: {
    title: '신용회복 전문 법무사 - 무료 상담',
    description: '개인회생, 파산 전문 법무사가 도와드립니다.',
    link: 'https://example.com/law-office'
  },
  sidebar: {
    title: '2금융권 대출 비교 서비스',
    description: '안전하고 투명한 대출 상품을 한 번에 비교해보세요.',
    link: 'https://example.com/loan-compare'
  },
  content: {
    title: '신용점수 무료 조회 서비스',
    description: '3개 신용평가사 점수를 한 번에 확인하세요.',
    link: 'https://example.com/credit-check'
  },
  footer: {
    title: '부채 정리 전문 상담센터',
    description: '1:1 맞춤 상담으로 부채 문제를 해결하세요.',
    link: 'https://example.com/debt-consulting'
  }
}

// 카테고리별 광고 데이터
export const categoryAds = {
  personalRecovery: [
    {
      title: '개인회생 전문 법무사 상담',
      description: '무료 상담으로 개인회생 절차를 도와드립니다.',
      link: 'https://example.com/personal-recovery-law',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=200&fit=crop'
    },
    {
      title: '개인회생 성공률 90% 법무사',
      description: '15년 경력의 전문가가 함께합니다.',
      link: 'https://example.com/recovery-expert',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'
    }
  ],
  corporateRecovery: [
    {
      title: '법인회생 전문 변호사',
      description: '사업재생과 법인회생을 전문으로 합니다.',
      link: 'https://example.com/corporate-recovery',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop'
    }
  ],
  creditStory: [
    {
      title: '신용점수 무료 조회',
      description: '3개 신용평가사 점수를 한번에 확인하세요.',
      link: 'https://example.com/credit-score',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop'
    },
    {
      title: '💳 면책후 신용카드 발급',
      description: '면책 완료자도 신용카드 발급 가능! 무료 상담 후 당일 발급',
      link: 'https://example.com/credit-card-recovery',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop'
    },
    {
      title: '📊 신용등급 관리 서비스',
      description: 'AI 기반 맞춤 신용관리로 6개월 내 등급 상승 보장',
      link: 'https://example.com/credit-grade-management',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop'
    }
  ],
  loanStory: [
    {
      title: '2금융권 대출 비교',
      description: '안전하고 투명한 대출상품 비교서비스',
      link: 'https://example.com/loan-compare',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=200&fit=crop'
    }
  ],
  successStory: [
    {
      title: '신용회복 성공사례',
      description: '체계적인 신용관리 시스템을 제공합니다.',
      link: 'https://example.com/success-system',
      image: 'https://images.unsplash.com/photo-1519452634265-7b808fcb3be2?w=300&h=200&fit=crop'
    }
  ],
  liveChat: [
    {
      title: '24시간 신용상담 핫라인',
      description: '전문 상담사가 실시간으로 도와드립니다.',
      link: 'https://example.com/live-consultation',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop'
    },
    {
      title: '무료 부채정리 상담',
      description: '1:1 맞춤 상담으로 부채 문제를 해결하세요.',
      link: 'https://example.com/debt-consultation',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop'
    }
  ]
}

// 사이드바 랜덤 광고 데이터 (확장된 구조)
export const sidebarRandomAds = [
  {
    id: 1,
    title: '💳 신용카드 발급 전문',
    description: '면책자도 OK! 당일 발급 가능한 신용카드 추천',
    cta: '무료 상담 신청',
    url: 'https://example.com/credit-card',
    bgColor: 'from-green-50 to-blue-50',
    borderColor: 'border-green-200',
    badgeColor: 'bg-green-100 text-green-800',
    buttonColor: 'bg-green-600',
    buttonHoverColor: 'hover:bg-green-700',
    category: ['면책후카드', '신용카드']
  },
  {
    id: 2,
    title: '📊 신용등급 관리',
    description: 'AI 기반 신용관리로 6개월 내 등급 상승!',
    cta: '등급 진단받기',
    url: 'https://example.com/credit-grade',
    bgColor: 'from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    badgeColor: 'bg-purple-100 text-purple-800',
    buttonColor: 'bg-purple-600',
    buttonHoverColor: 'hover:bg-purple-700',
    category: ['신용등급', '신용관리']
  },
  {
    id: 3,
    title: '⚖️ 개인회생 전문 법무사',
    description: '무료 상담으로 개인회생 절차를 완벽 지원',
    cta: '법무사 상담받기',
    url: 'https://example.com/personal-recovery',
    bgColor: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-800',
    buttonColor: 'bg-blue-600',
    buttonHoverColor: 'hover:bg-blue-700',
    category: ['개인회생', '법무사']
  },
  {
    id: 4,
    title: '🏦 신용불량자 전용 대출',
    description: '신용등급 무관! 5분 승인 가능한 대출상품',
    cta: '대출 신청하기',
    url: 'https://example.com/loan',
    bgColor: 'from-orange-50 to-red-50',
    borderColor: 'border-orange-200',
    badgeColor: 'bg-orange-100 text-orange-800',
    buttonColor: 'bg-orange-600',
    buttonHoverColor: 'hover:bg-orange-700',
    category: ['대출', '신용불량']
  },
  {
    id: 5,
    title: '💰 부채정리 전문 상담',
    description: '1:1 맞춤 상담으로 부채 문제 완전 해결',
    cta: '부채정리 상담',
    url: 'https://example.com/debt-consulting',
    bgColor: 'from-teal-50 to-cyan-50',
    borderColor: 'border-teal-200',
    badgeColor: 'bg-teal-100 text-teal-800',
    buttonColor: 'bg-teal-600',
    buttonHoverColor: 'hover:bg-teal-700',
    category: ['부채정리', '상담']
  },
  {
    id: 6,
    title: '🏛️ 법인회생 전문 변호사',
    description: '사업재생과 법인회생 15년 경력 전문가',
    cta: '변호사 상담받기',
    url: 'https://example.com/corporate-recovery',
    bgColor: 'from-slate-50 to-gray-50',
    borderColor: 'border-slate-200',
    badgeColor: 'bg-slate-100 text-slate-800',
    buttonColor: 'bg-slate-600',
    buttonHoverColor: 'hover:bg-slate-700',
    category: ['법인회생', '변호사']
  },
  {
    id: 7,
    title: '📈 워크아웃 전문 상담',
    description: '신용회복위원회 워크아웃 절차 완벽 가이드',
    cta: '워크아웃 상담',
    url: 'https://example.com/workout',
    bgColor: 'from-emerald-50 to-green-50',
    borderColor: 'border-emerald-200',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    buttonColor: 'bg-emerald-600',
    buttonHoverColor: 'hover:bg-emerald-700',
    category: ['워크아웃', '신용회복']
  },
  {
    id: 8,
    title: '💎 신용카드 한도 증액',
    description: '면책 후에도 가능한 신용카드 한도 증액',
    cta: '한도 증액 신청',
    url: 'https://example.com/credit-limit',
    bgColor: 'from-violet-50 to-purple-50',
    borderColor: 'border-violet-200',
    badgeColor: 'bg-violet-100 text-violet-800',
    buttonColor: 'bg-violet-600',
    buttonHoverColor: 'hover:bg-violet-700',
    category: ['신용카드', '한도증액']
  },
  {
    id: 9,
    title: '🏠 부동산 담보 대출',
    description: '신용등급 무관! 부동산 담보 대출 상담',
    cta: '담보대출 상담',
    url: 'https://example.com/mortgage',
    bgColor: 'from-amber-50 to-yellow-50',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-800',
    buttonColor: 'bg-amber-600',
    buttonHoverColor: 'hover:bg-amber-700',
    category: ['담보대출', '부동산']
  },
  {
    id: 10,
    title: '🚗 신차 할부 금융',
    description: '신용회복 후 신차 할부 금융 전문 상담',
    cta: '할부 상담받기',
    url: 'https://example.com/car-finance',
    bgColor: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    badgeColor: 'bg-rose-100 text-rose-800',
    buttonColor: 'bg-rose-600',
    buttonHoverColor: 'hover:bg-rose-700',
    category: ['할부금융', '신차']
  }
] 