-- 프리미엄 광고 테이블 생성
CREATE TABLE IF NOT EXISTS public.premium_ads (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link VARCHAR(500) NOT NULL,
  position VARCHAR(50) NOT NULL DEFAULT 'top', -- top, bottom, sidebar
  priority INTEGER NOT NULL DEFAULT 0, -- 높을수록 우선순위 높음
  is_active BOOLEAN NOT NULL DEFAULT true,
  click_count INTEGER NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_premium_ads_position ON public.premium_ads(position);
CREATE INDEX IF NOT EXISTS idx_premium_ads_is_active ON public.premium_ads(is_active);
CREATE INDEX IF NOT EXISTS idx_premium_ads_priority ON public.premium_ads(priority DESC);
CREATE INDEX IF NOT EXISTS idx_premium_ads_created_at ON public.premium_ads(created_at DESC);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE public.premium_ads ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 활성 광고를 읽을 수 있도록 허용
CREATE POLICY "premium_ads_read_policy" ON public.premium_ads
    FOR SELECT USING (is_active = true);

-- 모든 사용자가 광고를 생성, 수정, 삭제할 수 있도록 허용 (관리자 기능)
CREATE POLICY "premium_ads_all_policy" ON public.premium_ads
    FOR ALL USING (true);

-- 업데이트 트리거 함수 생성 (updated_at 자동 갱신)
CREATE OR REPLACE FUNCTION update_premium_ads_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 업데이트 트리거 생성
CREATE TRIGGER update_premium_ads_updated_at BEFORE UPDATE ON public.premium_ads
    FOR EACH ROW EXECUTE FUNCTION update_premium_ads_updated_at_column();

-- 샘플 프리미엄 광고 데이터 삽입
INSERT INTO public.premium_ads (title, description, image_url, link, position, priority, is_active, click_count, impressions, created_at, expires_at) VALUES
('🏆 프리미엄 개인회생 전문 법무사', '전국 1위 개인회생 전문 법무사! 24시간 무료상담 진행중', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop', 'https://example.com/premium-recovery', 'top', 100, true, 0, 0, NOW(), NOW() + INTERVAL '12 months'),
('💎 신용회복 전문 컨설팅', '신용등급 상승 보장! 개인별 맞춤 컨설팅 제공', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop', 'https://example.com/credit-consulting', 'top', 90, true, 0, 0, NOW(), NOW() + INTERVAL '12 months'),
('⚡ 빠른 대출 승인 서비스', '최대 3억까지! 당일 승인 가능한 대출 상품', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=300&fit=crop', 'https://example.com/quick-loan', 'top', 80, true, 0, 0, NOW(), NOW() + INTERVAL '12 months'),
('📞 무료 상담 핫라인', '24시간 신용회복 전문가 상담 가능', 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=200&h=100&fit=crop', 'tel:1588-0000', 'bottom', 50, true, 0, 0, NOW(), NOW() + INTERVAL '12 months'),
('💼 전문 법무법인 추천', '신용회복 전문 법무법인 무료 매칭', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=100&fit=crop', 'https://example.com/law-firm', 'bottom', 40, true, 0, 0, NOW(), NOW() + INTERVAL '12 months');

-- 완료 메시지
SELECT '✅ 프리미엄 광고 테이블 생성 완료!' as message; 