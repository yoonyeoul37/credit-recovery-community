// Supabase 연결 테스트
const { createClient } = require('@supabase/supabase-js')

// 환경변수 로드
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 환경변수 확인:')
console.log('URL:', supabaseUrl ? '설정됨' : '❌ 없음')
console.log('KEY:', supabaseKey ? '설정됨' : '❌ 없음')

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ 환경변수가 설정되지 않았습니다!')
  process.exit(1)
}

if (supabaseUrl.includes('your-project-id') || supabaseKey.includes('your-anon-key')) {
  console.log('❌ placeholder 값이 그대로 있습니다!')
  console.log('실제 Supabase 값으로 교체해주세요.')
  process.exit(1)
}

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('🔗 Supabase 연결 테스트 중...')
    
    // 간단한 쿼리 테스트
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ 연결 실패:', error.message)
      if (error.message.includes('relation "chat_rooms" does not exist')) {
        console.log('💡 해결방법: chat_tables_simplified.sql을 Supabase에서 실행하세요!')
      }
    } else {
      console.log('✅ Supabase 연결 성공!')
      console.log('📊 데이터:', data)
    }
  } catch (err) {
    console.log('❌ 연결 오류:', err.message)
  }
}

testConnection() 