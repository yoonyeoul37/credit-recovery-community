// 환경변수 확인 (간단 버전)
const fs = require('fs')
const path = require('path')

console.log('🔍 환경변수 파일 확인 중...')

const envPath = path.join(__dirname, '.env.local')

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local 파일이 없습니다!')
  console.log('💡 해결방법: .env.local 파일을 생성하고 Supabase 정보를 입력하세요')
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf8')
console.log('📄 .env.local 파일 내용:')
console.log(envContent)

// 환경변수 분석
const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'))

let hasUrl = false
let hasKey = false
let hasPlaceholder = false

lines.forEach(line => {
  if (line.includes('NEXT_PUBLIC_SUPABASE_URL')) {
    hasUrl = true
    if (line.includes('your-project-id')) {
      hasPlaceholder = true
      console.log('❌ URL에 placeholder 값이 있습니다!')
    } else {
      console.log('✅ URL 설정됨')
    }
  }
  
  if (line.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
    hasKey = true
    if (line.includes('your-anon-key')) {
      hasPlaceholder = true
      console.log('❌ KEY에 placeholder 값이 있습니다!')
    } else {
      console.log('✅ KEY 설정됨')
    }
  }
})

console.log('\n📊 진단 결과:')
console.log('URL 있음:', hasUrl ? '✅' : '❌')
console.log('KEY 있음:', hasKey ? '✅' : '❌')
console.log('Placeholder 사용:', hasPlaceholder ? '❌' : '✅')

if (hasPlaceholder) {
  console.log('\n🚨 문제 발견!')
  console.log('placeholder 값을 실제 Supabase 값으로 교체해야 합니다.')
  console.log('\n📋 해결 방법:')
  console.log('1. Supabase 대시보드 → Settings → API')
  console.log('2. Project URL과 anon public key 복사')
  console.log('3. .env.local 파일에 실제 값 입력')
} else if (hasUrl && hasKey) {
  console.log('\n✅ 환경변수 설정이 올바른 것 같습니다!')
  console.log('다른 문제일 수 있습니다. (테이블 누락, RLS 정책 등)')
} 