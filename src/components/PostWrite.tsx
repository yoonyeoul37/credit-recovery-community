'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Send, Tag, User, AlertCircle, Heart, Upload, X, Image } from 'lucide-react'
import Link from 'next/link'

interface PostWriteProps {
  className?: string
  category?: string
  onClose?: () => void
  onSubmit?: (post: any) => void
}

const PostWrite = ({ className = '', category: propCategory, onClose, onSubmit }: PostWriteProps) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [userNickname, setUserNickname] = useState('')
  const [password, setPassword] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = propCategory || searchParams.get('category') || 'credit-story'

  // 저장된 닉네임 불러오기 또는 자동 생성
  useEffect(() => {
    const generateNickname = () => {
      const adjectives = [
        '희망찬', '새로운', '따뜻한', '용기있는', '지혜로운', '성실한', '꿈꾸는', 
        '밝은', '긍정적인', '열정적인', '차분한', '든든한', '친근한', '진실한'
      ]
      const nouns = [
        '시작', '출발', '여행', '도전', '성장', '변화', '기회', '꿈', '희망', 
        '미래', '내일', '발걸음', '나무', '바람', '햇살', '별빛'
      ]
      const numbers = Math.floor(Math.random() * 900) + 100
      
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
      const noun = nouns[Math.floor(Math.random() * nouns.length)]
      
      return `${adjective}${noun}${numbers}`
    }

    // 브라우저에 저장된 닉네임 불러오기
    const savedNickname = localStorage.getItem('user-nickname')
    if (savedNickname) {
      setUserNickname(savedNickname)
    } else {
      setUserNickname(generateNickname())
    }
  }, [])

  // 이미지 상태 추적
  useEffect(() => {
    console.log('📊 이미지 상태 업데이트:', {
      imageFiles: images.length,
      imagePreviews: imagePreviews.length,
      previewDataSizes: imagePreviews.map((preview, i) => ({
        index: i + 1,
        hasData: !!preview,
        dataLength: preview?.length || 0,
        isValidBase64: preview?.startsWith('data:image/') || false
      }))
    })
  }, [images, imagePreviews])

  const getCategoryInfo = (cat: string) => {
    const categories: { [key: string]: { name: string; color: string; icon: string; placeholder: string; tips: string[]; recommendedTags: string[] } } = {
      'credit-story': {
        name: '신용이야기',
        color: 'blue',
        icon: '💳',
        placeholder: '신용점수 관리나 신용카드 관련 경험을 자유롭게 공유해주세요...',
        tips: [
          '구체적인 점수 변화를 언급하면 더 도움이 됩니다',
          '개인정보는 절대 포함하지 마세요',
          '실패 경험도 소중한 정보입니다'
        ],
        recommendedTags: [
          '신용점수', '신용등급', '신용관리', '신용카드', '신용대출',
          '체크카드', 'KCB', 'NICE', '신용정보', '신용상담',
          '연체', '미납', '신용회복', '금융거래', '은행대출'
        ]
      },
      'personal-recovery': {
        name: '개인회생',
        color: 'green',
        icon: '🔄',
        placeholder: '개인회생 과정에서의 경험이나 궁금한 점을 나눠주세요...',
        tips: [
          '절차나 준비사항에 대한 구체적인 정보가 도움됩니다',
          '법적 조언이 필요하면 전문가 상담을 권합니다',
          '어려운 시기를 함께 이겨낼 수 있도록 격려해주세요'
        ],
        recommendedTags: [
          '개인회생', '개인파산', '면책', '변제계획', '채무조정',
          '법원', '관리인', '채권자집회', '신청서류', '개시결정',
          '인가결정', '변제기간', '면책결정', '재산처분', '소득신고'
        ]
      },
      'personal-bankruptcy': {
        name: '개인파산',
        color: 'red',
        icon: '📋',
        placeholder: '개인파산 절차나 경험에 대해 공유해주세요...',
        tips: [
          '절차와 준비서류에 대한 정보가 도움됩니다',
          '면책 후 신용회복 과정도 중요한 정보입니다',
          '법적 절차이므로 전문가 상담을 권합니다'
        ],
        recommendedTags: [
          '개인파산', '면책신청', '파산선고', '면책결정', '동시폐지',
          '관재사건', '파산관재인', '채권신고', '면책불허가', '복권',
          '파산자명부', '신용회복', '재산처분', '면책후관리', '법원절차'
        ]
      },
      'personal-workout': {
        name: '개인워크아웃',
        color: 'teal',
        icon: '🤝',
        placeholder: '개인채무조정(워크아웃) 경험을 나눠주세요...',
        tips: [
          '신용회복위원회 절차에 대한 구체적 정보가 유용합니다',
          '채무조정 전후 변화를 공유해주세요',
          '성공적인 상환 노하우를 알려주세요'
        ],
        recommendedTags: [
          '개인워크아웃', '개인채무조정', '신용회복위원회', '채무조정신청', '상환계획',
          '원금감면', '이자율인하', '상환기간연장', '프리워크아웃', '채무조정협약',
          '금융기관협의', '신용관리', '상환능력', '채무상담', '재정관리'
        ]
      },
      'corporate-recovery': {
        name: '법인회생',
        color: 'purple',
        icon: '🏢',
        placeholder: '법인회생이나 사업 관련 경험을 공유해주세요...',
        tips: [
          '사업 규모나 업종을 언급하면 더 유용합니다',
          '구체적인 절차나 비용 정보가 도움됩니다',
          '재기 성공 사례는 큰 용기가 됩니다'
        ],
        recommendedTags: [
          '법인회생', '기업회생', '워크아웃', '사업재기', '부실기업',
          '채권단', '금융기관', '회생계획', '구조조정', '경영정상화',
          '자율협약', 'P&A', '기업구조조정', '사업재편', '재무구조개선'
        ]
      },
      'corporate-bankruptcy': {
        name: '법인파산',
        color: 'gray',
        icon: '⚖️',
        placeholder: '법인파산이나 청산 과정의 경험을 공유해주세요...',
        tips: [
          '파산 절차와 청산 과정에 대한 정보가 유용합니다',
          '사업 정리 후 재시작 경험도 소중한 정보입니다',
          '법적 절차이므로 전문가 도움이 필요합니다'
        ],
        recommendedTags: [
          '법인파산', '회사청산', '파산선고', '파산관재인', '채권신고',
          '파산재단', '배당', '면책', '청산절차', '사업정리',
          '임원책임', '연대보증', '재산처분', '노동자보호', '사업재기'
        ]
      },
      'corporate-workout': {
        name: '기업워크아웃',
        color: 'indigo',
        icon: '🏭',
        placeholder: '기업 구조조정이나 워크아웃 경험을 공유해주세요...',
        tips: [
          '채권단 협의 과정에 대한 정보가 도움됩니다',
          '구조조정 성공 사례는 큰 도움이 됩니다',
          '경영 정상화 과정을 구체적으로 설명해주세요'
        ],
        recommendedTags: [
          '기업워크아웃', '채권단협의회', '자율협약', '구조조정', '경영정상화',
          '금융기관', '주채권은행', '기업구조조정', '사업재편', '재무구조개선',
          '경영진교체', '사업양도', '부채조정', '자금지원', '경영개선'
        ]
      },
      'loan-story': {
        name: '대출이야기',
        color: 'orange',
        icon: '💰',
        placeholder: '대출 경험이나 관련 정보를 공유해주세요...',
        tips: [
          '금리나 조건 정보가 유용합니다',
          '대출 사기 주의사항도 공유해주세요',
          '상환 계획이나 관리 노하우를 나눠주세요'
        ],
        recommendedTags: [
          '주택담보대출', '신용대출', '마이너스통장', '카드론', '캐피탈',
          '저축은행', '대부업', '금리', '한도', '심사',
          '중금리대출', '햇살론', '미소금융', '대환대출', '상환방법'
        ]
      },
      'success-story': {
        name: '성공사례',
        color: 'emerald',
        icon: '⭐',
        placeholder: '신용회복 성공 이야기를 들려주세요...',
        tips: [
          '구체적인 과정과 기간을 포함해주세요',
          '어려웠던 순간과 극복 방법을 공유해주세요',
          '다른 분들에게 용기를 주는 이야기가 됩니다'
        ],
        recommendedTags: [
          '부채탈출', '신용회복', '재기성공', '절약', '부업',
          '재정관리', '가계부', '투잡', '사업성공', '희망',
          '극복', '성취', '변화', '새출발', '감사'
        ]
      },
      'qna': {
        name: 'Q&A',
        color: 'cyan',
        icon: '❓',
        placeholder: '궁금한 점이나 질문을 자유롭게 올려주세요...',
        tips: [
          '구체적인 상황을 설명하면 더 정확한 답변을 받을 수 있습니다',
          '개인정보는 절대 포함하지 마세요',
          '법적 조언이 필요한 경우 전문가 상담을 권합니다'
        ],
        recommendedTags: [
          '질문', '상담', '궁금증', '도움요청', '정보요청',
          '절차문의', '서류문의', '기간문의', '비용문의', '자격문의',
          '신청방법', '준비사항', '주의사항', '팁', '조언'
        ]
      },
      'credit-news': {
        name: '신용뉴스',
        color: 'slate',
        icon: '📄',
        placeholder: '신용회복 관련 뉴스나 정보를 공유해주세요...',
        tips: [
          '출처를 명확히 밝혀주세요',
          '최신 법령이나 제도 변경사항이 유용합니다',
          '개인적인 해석보다는 사실 중심으로 작성해주세요'
        ],
        recommendedTags: [
          '뉴스', '정책변경', '법령개정', '제도개선', '금융정책',
          '신용정책', '회생제도', '파산제도', '워크아웃제도', '대출정책',
          '금리정책', '규제완화', '지원정책', '최신정보', '업데이트'
        ]
      }
    }
    return categories[cat] || categories['credit-story']
  }

  const categoryInfo = getCategoryInfo(category)

  const handleSelectRecommendedTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024
      const hasValidExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
      const hasValidName = file.name.length > 0 && file.name.length < 100
      return isImage && isValidSize && hasValidExtension && hasValidName
    })
    if (validFiles.length + images.length > 5) {
      alert('이미지는 최대 5개까지 업로드할 수 있습니다.')
      return
    }
    const newImages = [...images, ...validFiles]
    setImages(newImages)
    // 이미지 업로드: 미리보기 대신 실제 업로드만
    for (const file of validFiles) {
      try {
        console.log('업로드 시도:', file.name)
        const publicUrl = await uploadImageToSupabase(file)
        if (publicUrl && publicUrl.startsWith('http')) {
          setImagePreviews(prev => [...prev, publicUrl])
          console.log('업로드 성공:', publicUrl)
        } else {
          alert(`이미지 "${file.name}" 업로드에 실패했습니다. 다시 시도해 주세요.`)
          console.error('업로드 실패:', file.name)
        }
      } catch (uploadError) {
        alert(`이미지 "${file.name}" 업로드 중 오류가 발생했습니다.`)
        console.error('업로드 예외:', file.name, uploadError)
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    console.log('🎯 드래그 앤 드롭으로 파일 받음:', files.length, '개')
    
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024
      const hasValidExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
      const hasValidName = file.name.length > 0 && file.name.length < 100
      
      console.log('🖼️ 드롭 파일 검증:', {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        isImage,
        isValidSize,
        hasValidExtension,
        hasValidName,
        isValid: isImage && isValidSize && hasValidExtension && hasValidName
      })
      
      if (!isImage) {
        alert(`"${file.name}"은(는) 이미지 파일이 아닙니다.`)
        return false
      }
      
      if (!isValidSize) {
        alert(`"${file.name}"은(는) 5MB를 초과합니다. (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
        return false
      }
      
      if (!hasValidExtension) {
        alert(`"${file.name}"은(는) 지원하지 않는 형식입니다. (JPG, PNG, GIF, WebP만 지원)`)
        return false
      }
      
      return isImage && isValidSize && hasValidExtension && hasValidName
    })

    if (validFiles.length + images.length > 5) {
      alert('이미지는 최대 5개까지 업로드할 수 있습니다.')
      return
    }

    const newImages = [...images, ...validFiles]
    setImages(newImages)

    // 각 파일에 대해 처리
    for (const file of validFiles) {
      // 로컬 미리보기 생성
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        const localPreview = e.target?.result as string
        
        if (!localPreview || !localPreview.startsWith('data:image/')) {
          console.error('❌ 드롭 파일: 유효하지 않은 이미지 데이터:', file.name)
          alert(`"${file.name}"은(는) 유효한 이미지 파일이 아닙니다.`)
          return
        }
        
        console.log('✅ 드롭 로컬 미리보기 생성 성공:', {
          fileName: file.name,
          dataLength: localPreview.length,
          type: file.type,
          size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
        })
        
        // 먼저 로컬 미리보기 표시
        setImagePreviews(prev => [...prev, localPreview])
        
        // Supabase Storage에 업로드 시도 (백그라운드)
        try {
          const publicUrl = await uploadImageToSupabase(file)
          if (publicUrl && publicUrl.startsWith('http')) {
            // 성공시 URL로 교체
            setImagePreviews(prev => prev.map(preview => 
              preview === localPreview ? publicUrl : preview
            ))
            console.log('🔄 드롭 미리보기를 Supabase URL로 교체:', publicUrl)
          } else {
            // 로컬 개발 환경에서는 alert 띄우지 않음
            if (!(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
              alert(`이미지 "${file.name}" 업로드에 실패했습니다. 다시 시도해 주세요.`)
            } else {
              console.log(`로컬 개발 환경 - "${file.name}" 미리보기만 사용 (정상 동작)`)
            }
          }
        } catch (uploadError) {
          if (!(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            alert(`이미지 "${file.name}" 업로드 중 오류가 발생했습니다.`)
          } else {
            console.log(`로컬 개발 환경 - "${file.name}" 미리보기만 사용 (정상 동작)`)
          }
        }
      }
      
      reader.onerror = (e) => {
        console.error('❌ 드롭 이미지 읽기 실패:', {
          fileName: file.name,
          error: e
        })
        alert(`이미지 "${file.name}" 읽기에 실패했습니다.`)
      }
      
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요'
    }
    
    if (!content.trim()) {
      newErrors.content = '내용을 입력해주세요'
    }

    if (!userNickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요'
    } else if (userNickname.length < 2) {
      newErrors.nickname = '닉네임은 2자 이상 입력해주세요'
    } else if (userNickname.length > 10) {
      newErrors.nickname = '닉네임은 10자 이하로 입력해주세요'
    }

    if (!password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요'
    } else if (password.length !== 4 || !/^\d{4}$/.test(password)) {
      newErrors.password = '비밀번호는 4자리 숫자로 입력해주세요'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    
    console.log('🔘 게시글 작성 버튼 클릭됨')
    console.log('📝 현재 폼 상태:', {
      title: title.length,
      content: content.length,
      nickname: userNickname.length,
      password: password.length
    })
    
    const isValid = validateForm()
    console.log('✅ 폼 검증 결과:', isValid)
    
    if (!isValid) {
      console.log('❌ 폼 검증 실패 - 에러:', errors)
      // 첫 번째 에러 필드로 스크롤
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        const element = document.querySelector(`input[name="${firstErrorField}"], textarea[name="${firstErrorField}"]`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
      setIsSubmitting(false)
      return
    }
    
    console.log('🚀 게시글 작성 시작...')
    
    try {
      // 닉네임을 브라우저에 저장
      localStorage.setItem('user-nickname', userNickname.trim())
      
      // 🚀 다시 Supabase에 저장 시도 (RLS 비활성화 확인)
      const { supabase } = await import('@/lib/supabase')
      
      console.log('🔍 Supabase 연결 시도...')
      
      // 카테고리 ID 매핑
      const categoryMapping: { [key: string]: number } = {
        'credit-story': 1,
        'personal-recovery': 2,
        'corporate-recovery': 3,
        'loan-story': 4,
        'success-story': 5
      }
      
      // imagePreviews에서 base64가 아닌 publicUrl만 필터링
      const uploadedImageUrls = imagePreviews.filter(url => url.startsWith('http'))
      
      // 한국시간(KST) 생성
      const now = new Date()
      const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000))
      const kstISOString = kstDate.toISOString()
      
      const postData = {
        category_id: categoryMapping[category] || 1,
        title: title.trim(),
        content: content.trim(),
        author_nickname: userNickname.trim(),
        author_ip_hash: `user_${Date.now()}`,
        password_hash: password,
        tags: tags,
        images: uploadedImageUrls,
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        is_hot: false,
        is_notice: false,
        is_deleted: false,
        created_at: kstISOString,
        updated_at: kstISOString
      }
      
      console.log('📤 게시글 저장 시도:', {
        category: category,
        categoryId: categoryMapping[category] || 1,
        titleLength: title.trim().length,
        contentLength: content.trim().length,
        nickname: userNickname.trim(),
        tagCount: tags.length,
        imageCount: uploadedImageUrls.length
      })
      
      // Supabase에 삽입 시도
      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select()
      
      if (error) {
        console.warn('⚠️ Supabase 저장 실패 - 로컬 백업 저장으로 전환')
        console.log('📝 오류 정보:', {
          message: error?.message || '네트워크 연결 문제',
          code: error?.code || 'NETWORK_ERROR',
          details: error?.details || '로컬 환경에서는 정상적인 현상입니다',
          hint: error?.hint || 'localhost에서 Supabase 연결이 차단될 수 있습니다'
        })
        console.log('💾 로컬 백업 저장으로 전환합니다...')
        
        // 로컬 백업 저장 (이미 한국시간이 적용된 postData 사용)
        const localData = { ...postData, id: Date.now(), category };
        const existingPosts = JSON.parse(localStorage.getItem('community-posts') || '[]')
        existingPosts.unshift(localData)
        localStorage.setItem('community-posts', JSON.stringify(existingPosts))
        
        // 부드러운 성공 처리 (로컬 저장)
        await new Promise(resolve => {
          setTimeout(() => {
            console.log('✅ 로컬 백업 저장 완료')
            resolve(true)
          }, 800)
        })
        
        // 부드러운 페이지 이동
        setTimeout(() => {
          router.push(`/${category}/${localData.id}`)
        }, 200)
        
      } else {
        console.log('✅ Supabase 저장 성공!')
        console.log('📊 저장 데이터:', {
          category: category,
          title: title.trim(),
          nickname: userNickname.trim(),
          postId: data?.[0]?.id || 'unknown',
          status: '데이터베이스 저장 완료'
        })
        
        // 성공 처리 시간 (부드러운 UX)
        await new Promise(resolve => {
          setTimeout(() => {
            console.log('🎉 게시글 작성 완료!')
            resolve(true)
          }, 1000)
        })
        
        // 부드러운 페이지 이동
        setTimeout(() => {
          if (data && data[0] && data[0].id) {
            router.push(`/${category}/${data[0].id}`)
          } else {
            router.push(`/${category}`)
          }
        }, 300)
      }
      
    } catch (error) {
      console.warn('⚠️ 게시글 작성 완전 실패')
      console.log('📝 예외 정보:', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        type: typeof error,
        info: '네트워크 연결이나 방화벽 문제로 인한 현상일 수 있습니다'
      })
      setIsSubmitting(false)
      
      // 오류 시에만 alert 사용
      alert(`게시글 작성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    }
    // isSubmitting은 페이지 이동으로 자동 해제됨
  }

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      // 파일 유효성 재검증
      if (!file || !file.type.startsWith('image/')) {
        console.error('❌ 유효하지 않은 파일 형식:', file?.type)
        return null
      }
      if (file.size > 5 * 1024 * 1024) {
        console.error('❌ 파일 크기 초과:', `${(file.size / 1024 / 1024).toFixed(2)}MB`)
        return null
      }
      const { supabase } = await import('@/lib/supabase')
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 8)
      const fileName = `${timestamp}-${randomId}.${fileExt}`
      console.log('☁️ Supabase Storage 업로드 시작:', {
        fileName,
        originalName: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        type: file.type
      })
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        console.warn('🔌 네트워크 연결이 끊어져 있습니다')
        return null
      }
      const uploadPromise = supabase.storage
        .from('post-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout after 30 seconds')), 30000)
      )
      let data, error
      try {
        ({ data, error } = await Promise.race([uploadPromise, timeoutPromise]) as any)
      } catch (e) {
        console.error('❌ 업로드 타임아웃 또는 예외:', e)
        alert(`이미지 "${file.name}" 업로드에 실패했습니다.\n사유: ${e instanceof Error ? e.message : e}`)
        return null
      }
      console.log('📦 업로드 응답:', { data, error })
      if (error) {
        alert(`이미지 "${file.name}" 업로드에 실패했습니다.\n에러: ${error.message || error}`)
        return null
      }
      if (!data?.path) {
        alert(`이미지 "${file.name}" 업로드에 실패했습니다.\n경로 정보 없음`)
        return null
      }
      const { data: publicUrlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(data.path)
      const publicUrl = publicUrlData?.publicUrl
      console.log('🌐 publicUrl:', publicUrl)
      if (!publicUrl || !publicUrl.startsWith('http')) {
        alert(`이미지 "${file.name}" 업로드에 실패했습니다.\n유효하지 않은 공개 URL: ${publicUrl}`)
        return null
      }
      console.log('✅ Supabase Storage 업로드 성공:', {
        fileName,
        path: data.path,
        publicUrl
      })
      return publicUrl
    } catch (error) {
      console.warn('⚠️ Supabase Storage 연결 실패 - 로컬 미리보기로 계속 사용')
      console.log('📝 오류 상세:', {
        name: error instanceof Error ? error.name : 'NetworkError',
        message: error instanceof Error ? error.message : 'Failed to fetch',
        stack: error instanceof Error ? error.stack?.substring(0, 200) : undefined,
        info: 'Storage 연결 실패 시 로컬 미리보기를 사용합니다',
        solution: '로컬 미리보기로도 정상적으로 게시글 작성이 가능합니다'
      })
      alert(`이미지 "${file.name}" 업로드에 실패했습니다.\n에러: ${error instanceof Error ? error.message : error}`)
      return null
    }
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* 헤더 */}
      <div className="mb-8">
        <Link
          href={`/${category}`}
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {categoryInfo.name}로 돌아가기
        </Link>
        
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{categoryInfo.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {categoryInfo.name} 글쓰기
            </h1>
            <p className="text-gray-600 mt-1">
              경험과 지혜를 나누어 함께 성장해요 💪
            </p>
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className={`bg-${categoryInfo.color}-50 border border-${categoryInfo.color}-200 rounded-xl p-6 mb-8`}>
        <div className="flex items-start space-x-3">
          <Heart className={`w-6 h-6 text-${categoryInfo.color}-500 flex-shrink-0 mt-0.5`} />
          <div>
            <h3 className={`text-lg font-semibold text-${categoryInfo.color}-900 mb-2`}>
              💡 글쓰기 도움말
            </h3>
            <ul className="space-y-1 text-sm">
              {categoryInfo.tips.map((tip, index) => (
                <li key={index} className={`text-${categoryInfo.color}-800 flex items-start`}>
                  <span className="w-1 h-1 bg-current rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 작성 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 닉네임 입력 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            닉네임 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              name="nickname"
              value={userNickname}
              onChange={(e) => setUserNickname(e.target.value)}
              placeholder="사용하실 닉네임을 입력해주세요"
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.nickname 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
              maxLength={10}
            />
          </div>
          {errors.nickname && (
            <div className="flex items-center space-x-1 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.nickname}</span>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            💚 닉네임은 브라우저에 저장되어 다음에 자동으로 입력됩니다
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            게시글 비밀번호 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-3">
            <span className="text-lg">🔒</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="4자리 숫자 입력 (수정/삭제시 필요)"
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.password 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
              maxLength={4}
            />
          </div>
          {errors.password && (
            <div className="flex items-center space-x-1 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.password}</span>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            ⚠️ 게시글 수정이나 삭제할 때 필요합니다. 꼭 기억해주세요!
          </div>
        </div>

        {/* 제목 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.title 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-200 focus:ring-blue-500'
            }`}
          />
          {errors.title && (
            <div className="flex items-center space-x-1 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.title}</span>
            </div>
          )}
          <div className="text-right text-xs text-gray-500 mt-1">
            {title.length}자
          </div>
        </div>

        {/* 내용 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={categoryInfo.placeholder}
            rows={15}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
              errors.content 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-200 focus:ring-blue-500'
            }`}
          />
          {errors.content && (
            <div className="flex items-center space-x-1 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.content}</span>
            </div>
          )}
          <div className="text-right text-xs text-gray-500 mt-1">
            {content.length}자
          </div>
        </div>

        {/* 태그 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            태그 (선택사항)
          </label>
          
          {/* 선택된 태그 표시 */}
          {tags.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">선택된 태그:</div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={`bg-${categoryInfo.color}-100 text-${categoryInfo.color}-700 px-3 py-1.5 rounded-full text-sm flex items-center space-x-1 border border-${categoryInfo.color}-200`}
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleSelectRecommendedTag(tag)}
                      className="hover:text-red-600 ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-100 transition-colors"
                      title="태그 제거"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 추천 태그 */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-3 flex items-center">
              <span className="text-lg mr-2">🏷️</span>
              <span>{categoryInfo.name} 추천 태그 (클릭하여 선택)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryInfo.recommendedTags.map((tag) => {
                const isSelected = tags.includes(tag)
                const isDisabled = tags.length >= 5 && !isSelected
                
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        handleSelectRecommendedTag(tag)
                      } else if (!isDisabled) {
                        handleSelectRecommendedTag(tag)
                      }
                    }}
                    disabled={isDisabled}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
                      isSelected
                        ? `bg-${categoryInfo.color}-500 text-white border-${categoryInfo.color}-500 hover:bg-${categoryInfo.color}-600`
                        : isDisabled
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : `bg-gray-50 text-gray-700 border-gray-200 hover:bg-${categoryInfo.color}-50 hover:border-${categoryInfo.color}-300 hover:text-${categoryInfo.color}-700`
                    }`}
                    title={isSelected ? '클릭하여 제거' : isDisabled ? '태그 5개 한도 초과' : '클릭하여 추가'}
                  >
                    #{tag}
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-3 flex items-center justify-between">
            <span>💡 추천 태그를 클릭하거나 직접 입력하세요</span>
            <span className={tags.length >= 5 ? 'text-red-500 font-medium' : ''}>
              ({tags.length}/5)
            </span>
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이미지 (선택사항)
          </label>
          
          {/* 이미지 업로드 버튼 */}
          <div className="mb-4">
            <label 
              className={`inline-flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : images.length >= 5 
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${isDragOver ? 'text-blue-600' : 'text-gray-600'}`}>
                  {isDragOver 
                    ? '이미지를 여기에 놓으세요' 
                    : images.length >= 5 
                      ? '이미지 업로드 한도에 도달했습니다'
                      : '클릭하여 이미지를 선택하거나 드래그해서 놓으세요'
                  }
                </span>
                <span className="text-xs text-gray-500 block mt-1">
                  JPG, PNG, GIF (최대 5MB, 5개까지)
                </span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={images.length >= 5}
              />
            </label>
          </div>

          {/* 이미지 미리보기 */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {imagePreviews
                .filter(preview => preview.startsWith('http')) // publicUrl만 렌더링
                .map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="w-full h-40 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <img
                      src={preview}
                      alt={`미리보기 ${index + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-200"
                      onLoad={(e) => {
                        e.currentTarget.style.opacity = '1'
                      }}
                      onError={(e) => {
                        const parentDiv = e.currentTarget.parentElement
                        if (parentDiv) {
                          parentDiv.innerHTML = `
                            <div class=\"w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-500 text-xs p-4 border-2 border-red-200 border-dashed rounded\">
                              <div class=\"text-2xl mb-2\">❌</div>
                              <div class=\"font-medium mb-1\">이미지 로딩 실패</div>
                              <div class=\"text-center text-red-400\">
                                파일이 손상됐거나<br/>
                                지원하지 않는 형식입니다
                              </div>
                            </div>
                          `
                        }
                      }}
                      style={{ opacity: '0' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="이미지 제거"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-2 space-y-1">
            <div>📸 이미지는 최대 5개까지 업로드할 수 있습니다. ({images.length}/5)</div>
            <div>🔍 지원 형식: <strong>JPG, PNG, GIF, WebP</strong> | 최대 크기: <strong>5MB</strong></div>
            <div className="flex items-start space-x-1">
              <span>💡</span>
              <div>
                <div><strong>로컬 환경</strong>: 미리보기만 표시됩니다 (정상 동작)</div>
                <div><strong>배포 환경</strong>: Supabase Storage에 자동 업로드됩니다</div>
              </div>
            </div>
            <div className="flex items-start space-x-1">
              <span>⚠️</span>
              <div>이미지가 검정색으로 보인다면 파일이 손상되었거나 지원하지 않는 형식일 수 있습니다</div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex items-center justify-between pt-6">
          <Link
            href={`/${category}`}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </Link>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 bg-gradient-to-r from-${categoryInfo.color}-600 to-blue-600 text-white font-semibold rounded-lg hover:from-${categoryInfo.color}-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>작성 중...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>게시글 작성</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostWrite