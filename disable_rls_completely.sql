-- RLS 완전 비활성화 (개발/테스트용)
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- 모든 채팅 관련 테이블의 RLS 비활성화
ALTER TABLE chat_rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants DISABLE ROW LEVEL SECURITY;

-- 기존 정책들 모두 삭제
DROP POLICY IF EXISTS "Anyone can view chat rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Anyone can create chat rooms" ON chat_rooms;
DROP POLICY IF EXISTS "Anyone can update chat rooms" ON chat_rooms;

DROP POLICY IF EXISTS "Anyone can view messages" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can create messages" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can update messages" ON chat_messages;

DROP POLICY IF EXISTS "Anyone can view participants" ON chat_participants;
DROP POLICY IF EXISTS "Anyone can create participants" ON chat_participants;
DROP POLICY IF EXISTS "Anyone can update participants" ON chat_participants;

-- 확인
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'chat_%'; 