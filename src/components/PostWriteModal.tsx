'use client'

import { useState, useEffect } from 'react'
import { X, Send, User, Lock, FileText, MessageCircle, Image, Upload, Trash2 } from 'lucide-react'

interface PostWriteModalProps {
  category: string
  onClose: () => void
  onSubmit: (post: any) => void
  editMode?: boolean
  initialData?: {
    title: string
    content: string
    prefix: string
    tags: string[]
    images: string[]
  }
}

export default function PostWriteModal({ category, onClose, onSubmit, editMode = false, initialData }: PostWriteModalProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [prefix, setPrefix] = useState(initialData?.prefix || '')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || [])

  // 카테고리별 말머리 옵션
  const categoryPrefixOptions: { [key: string]: string[] } = {
    'credit-story': ['신용이야기', '면책후카드', '신용등급', '경험담'],
    'personal-recovery': ['경험담', '정보', '질문', '신청후기', '변제후기'],
    'corporate-recovery': ['법인회생', '기업회생', '사업재개', '성공후기', '정보'],
    'credit-workout': ['워크아웃', '자율협약', '사업정리', '경험담', '정보'],
    'loan-story': ['대출후기', '대출정보', '금리비교', '심사후기', '대출팁'],
    'loan-info': ['대출후기', '대출정보', '금리비교', '심사후기', '대출팁']
  }

  const prefixOptions = categoryPrefixOptions[category] || ['일반']

  // 말머리별 추천 태그
  const recommendedTags: { [key: string]: string[] } = {
    // 신용이야기 카테고리
    '신용이야기': [
      '신용관리', '신용회복', '신용점수', '신용등급', '신용정보', 
      '신용카드', '대출', '금융', '경험담', '팁', '질문', '상담'
    ],
    '면책후카드': [
      '면책완료', '체크카드', '신용카드', '카드발급', '카드신청',
      '우리카드', '하나카드', '새마을금고', '지역은행', '카드추천',
      '발급후기', '승인', '거절', '카드사', '발급조건'
    ],
    '신용등급': [
      '등급상승', '등급관리', '등급조회', 'CB점수', 'NICE', 'KCB',
      '신용점수', '등급개선', '신용관리', '점수올리기', '등급확인',
      '신용정보', '신용회복', '점수관리', '등급변화'
    ],
    '경험담': [
      '개인회생', '개인파산', '면책결정', '변제완료', '신용회복',
      '성공후기', '실패담', '과정', '절차', '팁', '조언',
      '법무사', '변호사', '법원', '채무정리', '재기', '새출발'
    ],
    
    // 개인회생 카테고리
    '정보': [
      '개인회생', '신청방법', '서류준비', '절차', '변제계획안',
      '법원', '변호사', '법무사', '비용', '기간', '조건'
    ],
    '질문': [
      '개인회생', '신청자격', '상담', '궁금한점', '도움요청',
      '조건', '절차', '서류', '비용', '변제금'
    ],
    '신청후기': [
      '개인회생', '신청완료', '진행과정', '법원', '변호사',
      '서류제출', '심사', '인가', '경험담'
    ],
    '변제후기': [
      '개인회생', '변제중', '변제완료', '납부', '생활',
      '어려움', '극복', '팁', '경험담'
    ],
    
    // 법인회생 카테고리
    '법인회생': [
      '기업회생', '법인', '사업재개', '구조조정', '법원',
      '변호사', '회계법인', '채권자', '절차'
    ],
    '기업회생': [
      '법인회생', '사업', '구조조정', '재무', '채무',
      '투자', '경영', '회복', '성공사례'
    ],
    '사업재개': [
      '법인회생', '기업회생', '재기', '신규사업', '투자',
      '자금', '경영', '성공', '노하우'
    ],
    '성공후기': [
      '법인회생', '기업회생', '사업재개', '성공', '회복',
      '경험담', '팁', '조언', '극복'
    ],
    
    // 워크아웃 카테고리
    '워크아웃': [
      '기업', '채무조정', '자율협약', '구조조정', '은행',
      '채권자', '협상', '절차', '조건'
    ],
    '자율협약': [
      '워크아웃', '채무조정', '은행', '협상', '조건',
      '이자', '상환', '기간', '절차'
    ],
    '사업정리': [
      '워크아웃', '구조조정', '사업', '정리', '매각',
      '청산', '절차', '방법', '조건'
    ],
    
    // 대출이야기 카테고리
    '대출후기': [
      '대출', '승인', '거절', '은행', '저축은행',
      '캐피탈', '심사', '조건', '경험담'
    ],
    '대출정보': [
      '대출', '상품', '조건', '금리', '한도',
      '서류', '자격', '비교', '추천'
    ],
    '금리비교': [
      '대출', '금리', '은행', '저축은행', '캐피탈',
      '비교', '최저금리', '우대금리', '조건'
    ],
    '심사후기': [
      '대출', '심사', '승인', '거절', '조건',
      '서류', '소득', '신용', '담보'
    ],
    '대출팁': [
      '대출', '노하우', '팁', '조건', '금리',
      '승인', '심사', '서류', '준비'
    ]
  }

  // 카테고리별 기본 말머리 설정
  useEffect(() => {
    if (!initialData?.prefix && prefixOptions.length > 0) {
      setPrefix(prefixOptions[0])
    }
  }, [category, prefixOptions, initialData])

  // 저장된 닉네임 불러오기
  useEffect(() => {
    const savedNickname = localStorage.getItem('user-nickname')
    if (savedNickname) {
      setNickname(savedNickname)
    }
    
    // 수정 모드에서는 비밀번호 필드 숨기기
    if (editMode) {
      const savedUser = localStorage.getItem('user-nickname')
      if (savedUser) {
        setNickname(savedUser)
      }
    }
  }, [editMode])

  // 태그 관련 함수들
  const addTag = (tag: string) => {
    if (selectedTags.length >= 5) {
      alert('태그는 최대 5개까지만 추가할 수 있습니다.')
      return
    }
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // 파일 개수 제한 (최대 5개)
    if (imagePreviews.length + files.length > 5) {
      alert('이미지는 최대 5개까지만 업로드 가능합니다.')
      return
    }

    files.forEach(file => {
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} 파일이 너무 큽니다. (5MB 이하만 가능)`)
        return
      }

      // 이미지 파일 형식 확인
      if (!file.type.startsWith('image/')) {
        alert(`${file.name}은 이미지 파일이 아닙니다.`)
        return
      }

      // 미리보기 생성
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        setImages(prev => [...prev, file])
        setImagePreviews(prev => [...prev, preview])
      }
      reader.readAsDataURL(file)
    })

    // input 초기화
    e.target.value = ''
  }

  // 이미지 삭제
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 수정 모드에서는 비밀번호 체크 안함
    if (editMode) {
      if (!title.trim() || !content.trim() || !nickname.trim()) {
        alert('제목, 내용, 닉네임을 모두 입력해주세요!')
        return
      }
    } else {
      if (!title.trim() || !content.trim() || !nickname.trim() || !password.trim()) {
        alert('모든 필드를 입력해주세요!')
        return
      }

      if (password.length !== 4 || !/^\d{4}$/.test(password)) {
        alert('비밀번호는 4자리 숫자로 입력해주세요!')
        return
      }
    }

    setIsSubmitting(true)

    try {
      if (editMode) {
        // 게시글 수정
        const updatedPost = {
          title: title.trim(),
          content: content.trim(),
          prefix: prefix,
          tags: selectedTags,
          images: imagePreviews,
          imageCount: imagePreviews.length
        }

        // 부모 컴포넌트에 수정된 게시글 전달
        onSubmit(updatedPost)
      } else {
        // 새 게시글 생성
        const newPost = {
          id: Date.now(),
          title: title.trim(),
          content: content.trim(),
          author: nickname.trim(),
          category: category,
          prefix: prefix,
          created_at: new Date().toISOString(),
          view_count: 0,
          like_count: 0,
          comment_count: 0,
          tags: selectedTags,
          images: imagePreviews, // 이미지 미리보기 URL들
          imageCount: imagePreviews.length
        }

        // 로컬 스토리지에 저장
        const existingPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
        existingPosts.unshift(newPost)
        localStorage.setItem('community-posts', JSON.stringify(existingPosts))

        // 닉네임 저장
        localStorage.setItem('user-nickname', nickname.trim())

        // 부모 컴포넌트에 새 게시글 전달
        onSubmit(newPost)

        // 성공 메시지
        alert('게시글이 성공적으로 작성되었습니다!')
      }
      
    } catch (error) {
      console.error(editMode ? '게시글 수정 실패:' : '게시글 작성 실패:', error)
      alert(editMode ? '게시글 수정에 실패했습니다.' : '게시글 작성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
            {editMode ? '글 수정' : '글쓰기'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              닉네임 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="사용하실 닉네임을 입력해주세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={10}
              disabled={editMode}
            />
          </div>

          {/* 비밀번호 - 새 글 작성시만 표시 */}
          {!editMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="4자리 숫자 (수정/삭제시 필요)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={4}
              />
            </div>
          )}

          {/* 말머리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              말머리
            </label>
            <select
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {prefixOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력해주세요..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              태그 ({selectedTags.length}/5)
            </label>
            
            {/* 선택된 태그들 */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 rounded-lg">
                {selectedTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* 추천 태그들 */}
            <div className="mb-2">
              <p className="text-xs text-gray-600 mb-1">추천 태그 (클릭하여 추가)</p>
              <div className="flex flex-wrap gap-2">
                {recommendedTags[prefix]?.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    disabled={selectedTags.includes(tag) || selectedTags.length >= 5}
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                    } ${selectedTags.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              • 태그는 최대 5개까지 선택할 수 있습니다
              • 추천 태그에서만 선택 가능합니다
            </p>
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image className="w-4 h-4 inline mr-1" />
              이미지 ({imagePreviews.length}/5)
            </label>
            
            {/* 이미지 업로드 버튼 */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={imagePreviews.length >= 5}
              />
              <label 
                htmlFor="image-upload" 
                className={`cursor-pointer ${imagePreviews.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {imagePreviews.length >= 5 ? '최대 5개까지 업로드 가능합니다' : '클릭하여 이미지를 선택하세요'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, GIF • 최대 5MB
                </p>
              </label>
            </div>

            {/* 이미지 미리보기 */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`미리보기 ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-4 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editMode ? '수정 중...' : '작성 중...'}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {editMode ? '수정하기' : '작성하기'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 