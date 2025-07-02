-- Supabase Realtime 활성화
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- chat_messages 테이블에 대한 Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- chat_participants 테이블에 대한 Realtime 활성화  
ALTER PUBLICATION supabase_realtime ADD TABLE chat_participants;

-- chat_rooms 테이블에 대한 Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;

-- 확인
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'; 