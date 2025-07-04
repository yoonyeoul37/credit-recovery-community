-- 빠른 광고 테이블 생성 (간소화 버전)
CREATE TABLE IF NOT EXISTS public.ads (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  link VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  ad_type VARCHAR(50) NOT NULL DEFAULT 'native',
  position VARCHAR(50) NOT NULL DEFAULT 'native',
  size VARCHAR(50) NOT NULL DEFAULT 'medium',
  is_active BOOLEAN NOT NULL DEFAULT true,
  click_count INTEGER NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  native_config JSONB
);

-- RLS 활성화
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 조회 가능
CREATE POLICY "Enable read access for all users" ON public.ads
    FOR SELECT USING (true);

-- 인증된 사용자만 삽입/업데이트/삭제 가능
CREATE POLICY "Enable all for authenticated users" ON public.ads
    FOR ALL USING (true);

-- 샘플 광고 데이터 삽입
INSERT INTO public.ads (title, description, image_url, link, category, ad_type, position, size, is_active, click_count, impressions, created_at, expires_at, native_config) VALUES
('개인회생 전문 법무사 무료 상담', '개인회생 성공률 95%! 24시간 무료 상담 가능', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop', 'https://example.com/personal-recovery-law', 'personalRecoveryBankruptcy', 'native', 'native', 'medium', true, 456, 12450, NOW(), NOW() + INTERVAL '6 months', '{"showEvery": 4, "ctaText": "⚖️ 개인회생 전문 법무사 무료 상담받기 ▶", "backgroundColor": "#fef3c7"}'),
('면책자 전용 신용카드 발급', '면책 후 신용카드 발급률 90%! 전문 설계사 상담', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop', 'https://example.com/credit-card-recovery', 'exemptionCardIssue', 'native', 'native', 'medium', true, 789, 15670, NOW(), NOW() + INTERVAL '6 months', '{"showEvery": 3, "ctaText": "💳 면책자 전용 신용카드 바로 발급받기 ▶", "backgroundColor": "#dbeafe"}'),
('신용불량자 대출 전문', '면책자, 개인회생자도 OK! 비대면 당일 승인', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=200&fit=crop', 'https://example.com/loan-bad-credit', 'loanInfo', 'native', 'native', 'medium', true, 234, 8900, NOW(), NOW() + INTERVAL '6 months', '{"showEvery": 5, "ctaText": "💰 신용불량자 전용 대출 5분만에 신청하기 ▶", "backgroundColor": "#dcfce7"}'),
('신용등급 관리 서비스', '면책 후 신용등급 복구 전문! 1개월 무료 체험', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop', 'https://example.com/credit-score-recovery', 'exemptionCreditScore', 'native', 'native', 'medium', true, 345, 11200, NOW(), NOW() + INTERVAL '6 months', '{"showEvery": 4, "ctaText": "📈 신용등급 무료 진단 + 관리 서비스 체험하기 ▶", "backgroundColor": "#f3e8ff"}'); 