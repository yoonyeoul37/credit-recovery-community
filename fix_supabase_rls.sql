-- Supabase RLS 정책 수정 - 익명 사용자 접근 허용
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요

-- 1. posts 테이블 RLS 정책 설정
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- posts 테이블 - 모든 사용자 읽기 허용
CREATE POLICY "posts_select_policy" ON posts
FOR SELECT USING (true);

-- posts 테이블 - 모든 사용자 쓰기 허용
CREATE POLICY "posts_insert_policy" ON posts
FOR INSERT WITH CHECK (true);

-- posts 테이블 - 모든 사용자 수정 허용
CREATE POLICY "posts_update_policy" ON posts
FOR UPDATE USING (true);

-- posts 테이블 - 모든 사용자 삭제 허용
CREATE POLICY "posts_delete_policy" ON posts
FOR DELETE USING (true);

-- 2. chat_rooms 테이블 RLS 정책 설정
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_rooms_select_policy" ON chat_rooms
FOR SELECT USING (true);

CREATE POLICY "chat_rooms_insert_policy" ON chat_rooms
FOR INSERT WITH CHECK (true);

CREATE POLICY "chat_rooms_update_policy" ON chat_rooms
FOR UPDATE USING (true);

-- 3. chat_messages 테이블 RLS 정책 설정
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_messages_select_policy" ON chat_messages
FOR SELECT USING (true);

CREATE POLICY "chat_messages_insert_policy" ON chat_messages
FOR INSERT WITH CHECK (true);

CREATE POLICY "chat_messages_update_policy" ON chat_messages
FOR UPDATE USING (true);

-- 4. chat_participants 테이블 RLS 정책 설정
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_participants_select_policy" ON chat_participants
FOR SELECT USING (true);

CREATE POLICY "chat_participants_insert_policy" ON chat_participants
FOR INSERT WITH CHECK (true);

CREATE POLICY "chat_participants_update_policy" ON chat_participants
FOR UPDATE USING (true);

-- 5. Storage 정책 설정 (이미지 업로드용)
-- post-images 버킷에 대한 정책
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage 읽기 정책
CREATE POLICY "post_images_select_policy" ON storage.objects
FOR SELECT USING (bucket_id = 'post-images');

-- Storage 업로드 정책
CREATE POLICY "post_images_insert_policy" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'post-images');

-- 6. 기본 데이터 삽입 (채팅방)
INSERT INTO chat_rooms (id, title, description, category, max_participants, is_active, created_by_hash)
VALUES (1, '💬 신용회복 종합상담방', '신용회복에 관한 모든 궁금증을 함께 해결하는 메인 채팅방입니다.', '종합상담', 100, true, 'system')
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  is_active = true;

-- 완료 메시지
SELECT '✅ RLS 정책 설정 완료! 이제 웹사이트에서 실제 데이터베이스 사용이 가능합니다.' as message; 