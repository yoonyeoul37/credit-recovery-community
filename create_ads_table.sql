-- 광고 테이블 생성
CREATE TABLE IF NOT EXISTS public.ads (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    link VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    ad_type VARCHAR(50) DEFAULT 'native',
    position VARCHAR(50) DEFAULT 'native', 
    size VARCHAR(50) DEFAULT 'medium',
    is_active BOOLEAN DEFAULT true,
    click_count INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    native_config JSONB
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_ads_category ON public.ads(category);
CREATE INDEX IF NOT EXISTS idx_ads_is_active ON public.ads(is_active);
CREATE INDEX IF NOT EXISTS idx_ads_ad_type ON public.ads(ad_type);
CREATE INDEX IF NOT EXISTS idx_ads_position ON public.ads(position);
CREATE INDEX IF NOT EXISTS idx_ads_created_at ON public.ads(created_at DESC);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 광고를 읽을 수 있도록 허용
CREATE POLICY "Allow read access for ads" ON public.ads
    FOR SELECT USING (is_active = true);

-- 인증된 사용자만 광고를 생성, 수정, 삭제할 수 있도록 허용 (관리자 기능)
CREATE POLICY "Allow full access for authenticated users" ON public.ads
    FOR ALL USING (auth.role() = 'authenticated');

-- 업데이트 트리거 함수 생성 (updated_at 자동 갱신)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 업데이트 트리거 생성
CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON public.ads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입 (테스트용)
INSERT INTO public.ads (title, description, image_url, link, category, ad_type, position, size, native_config) VALUES
('개인회생 전문 법무사 상담', '24시간 무료 상담 가능합니다. 개인회생 성공률 95% 이상!', '', 'https://example.com/personal-recovery', 'personalRecoveryBankruptcy', 'native', 'native', 'medium', '{"showEvery": 5, "ctaText": "무료 상담받기", "backgroundColor": "#dbeafe"}'),

('신용카드 발급 전문', '면책 후에도 신용카드 발급이 가능합니다. 전문 상담사가 도와드립니다.', '', 'https://example.com/credit-card', 'exemptionCardIssue', 'native', 'native', 'medium', '{"showEvery": 5, "ctaText": "카드 신청하기", "backgroundColor": "#dcfce7"}'),

('법인회생 전문 변호사', '기업 재건을 위한 법인회생 절차를 도와드립니다. 경험 많은 변호사팀!', '', 'https://example.com/corporate-recovery', 'corporateRecoveryBankruptcy', 'native', 'native', 'medium', '{"showEvery": 5, "ctaText": "상담 신청하기", "backgroundColor": "#fdf4ff"}'),

('신용회복 워크아웃 상담', '신용회복위원회 워크아웃 신청을 도와드립니다. 부채 정리의 첫걸음!', '', 'https://example.com/credit-workout', 'creditRecoveryWorkout', 'native', 'native', 'medium', '{"showEvery": 5, "ctaText": "워크아웃 신청", "backgroundColor": "#fff7ed"}'),

('사이드바 광고 - 대출정보', '저금리 대출 정보를 확인하세요', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=200&fit=crop', 'https://example.com/loan-info', 'creditStory', 'sidebar', 'sidebar', 'medium', null);

-- 광고 조회를 위한 뷰 생성 (선택사항)
CREATE OR REPLACE VIEW public.active_ads AS
SELECT 
    id,
    title,
    description,
    image_url,
    link,
    category,
    ad_type,
    position,
    size,
    click_count,
    impressions,
    created_at,
    expires_at,
    native_config
FROM public.ads 
WHERE is_active = true 
AND (expires_at IS NULL OR expires_at > NOW())
ORDER BY created_at DESC;

-- 통계 뷰 생성
CREATE VIEW ads_stats AS
SELECT 
    category,
    COUNT(*) as total_ads,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_ads,
    SUM(click_count) as total_clicks,
    SUM(impressions) as total_impressions,
    CASE 
        WHEN SUM(impressions) > 0 THEN ROUND((SUM(click_count)::numeric / SUM(impressions)::numeric) * 100, 2)
        ELSE 0
    END as avg_ctr
FROM ads
GROUP BY category;

-- 카테고리별 빈번한 조회를 위한 복합 인덱스
CREATE INDEX idx_ads_category_active ON ads(category, is_active);
CREATE INDEX idx_ads_performance ON ads(click_count DESC, impressions DESC);

-- 만료 날짜 확인을 위한 인덱스
CREATE INDEX idx_ads_expires_at ON ads(expires_at) WHERE expires_at IS NOT NULL; 