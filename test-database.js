const { createClient } = require('@supabase/supabase-js')

// Supabase 연결
const supabaseUrl = 'https://bqsyujtveafhxwknpxik.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxc3l1anR2ZWFmaHh3a25weGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMzAzMDIsImV4cCI6MjA1MDcwNjMwMn0.zYl8eSuClxIGjJwXVklXgz6TYM8NxkWJpK1Qb1xOA7s'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabase() {
  console.log('🔍 데이터베이스 연결 테스트 시작...')
  
  try {
    // 1. 게시글 테이블 확인
    console.log('\n📋 posts 테이블 확인:')
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (postsError) {
      console.log('❌ posts 테이블 오류:', postsError)
    } else {
      console.log(`✅ posts 테이블 데이터 ${posts?.length || 0}개 발견:`)
      posts?.forEach(post => {
        console.log(`  - ID: ${post.id}, 제목: "${post.title}", 작성자: ${post.author_nickname}`)
      })
    }

    // 2. 댓글 테이블 확인
    console.log('\n💬 comments 테이블 확인:')
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (commentsError) {
      console.log('❌ comments 테이블 오류:', commentsError)
    } else {
      console.log(`✅ comments 테이블 데이터 ${comments?.length || 0}개 발견:`)
      comments?.forEach(comment => {
        console.log(`  - ID: ${comment.id}, 내용: "${comment.content?.substring(0, 50)}...", 작성자: ${comment.author_nickname}`)
      })
    }

    // 3. 채팅 메시지 테이블 확인
    console.log('\n💭 chat_messages 테이블 확인:')
    const { data: chatMessages, error: chatError } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (chatError) {
      console.log('❌ chat_messages 테이블 오류:', chatError)
    } else {
      console.log(`✅ chat_messages 테이블 데이터 ${chatMessages?.length || 0}개 발견:`)
      chatMessages?.forEach(msg => {
        console.log(`  - ID: ${msg.id}, 메시지: "${msg.message}", 작성자: ${msg.user_nickname}`)
      })
    }

    console.log('\n🎯 결론:')
    if (posts && posts.length > 0) {
      console.log('✅ 실제 게시글 데이터가 데이터베이스에 저장되어 있습니다!')
      console.log('✅ 백엔드 연결이 정상적으로 작동하고 있습니다!')
    } else {
      console.log('❌ 게시글 데이터가 데이터베이스에 없습니다.')
      console.log('❌ 데이터가 로컬스토리지에만 저장되고 있을 가능성이 높습니다.')
    }

  } catch (error) {
    console.log('💥 데이터베이스 연결 실패:', error)
  }
}

testDatabase() 