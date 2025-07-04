-- Create ads table
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

-- Enable RLS
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "ads_read_policy" ON public.ads FOR SELECT USING (true);
CREATE POLICY "ads_all_policy" ON public.ads FOR ALL USING (true);

-- Insert sample data
INSERT INTO public.ads (title, description, image_url, link, category, ad_type, position, size, is_active, click_count, impressions, created_at, expires_at, native_config) VALUES
('Law Firm Free Consultation', 'Personal Recovery Success Rate 95%', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop', 'https://example.com/personal-recovery-law', 'personalRecoveryBankruptcy', 'native', 'native', 'medium', true, 456, 12450, NOW(), NOW() + INTERVAL '6 months', '{"showEvery": 4, "ctaText": "Free Consultation", "backgroundColor": "#fef3c7"}'),
('Credit Card for Discharged', 'Credit Card Approval Rate 90%', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop', 'https://example.com/credit-card-recovery', 'exemptionCardIssue', 'native', 'native', 'medium', true, 789, 15670, NOW(), NOW() + INTERVAL '6 months', '{"showEvery": 3, "ctaText": "Apply Now", "backgroundColor": "#dbeafe"}'),
('Bad Credit Loan', 'Same Day Approval for Bad Credit', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=200&fit=crop', 'https://example.com/loan-bad-credit', 'loanInfo', 'native', 'native', 'medium', true, 234, 8900, NOW(), NOW() + INTERVAL '6 months', '{"showEvery": 5, "ctaText": "Apply in 5 minutes", "backgroundColor": "#dcfce7"}'),
('Credit Score Management', 'Credit Score Recovery Service', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop', 'https://example.com/credit-score-recovery', 'exemptionCreditScore', 'native', 'native', 'medium', true, 345, 11200, NOW(), NOW() + INTERVAL '6 months', '{"showEvery": 4, "ctaText": "Free Trial", "backgroundColor": "#f3e8ff"}'); 