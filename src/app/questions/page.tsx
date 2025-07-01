"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true)
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, content, author, created_at, answers:answers_count')
        .eq('message_type', 'question')
        .order('created_at', { ascending: false })
      if (!error && data) setQuestions(data)
      setLoading(false)
    }
    fetchQuestions()
  }, [])

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">💡 전체 질문 목록</h1>
      {loading ? (
        <div className="text-center text-gray-400 py-8">불러오는 중...</div>
      ) : (
        <ul className="space-y-4">
          {questions.map(q => (
            <li key={q.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="font-medium text-gray-900 mb-1">{q.content}</div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>작성자: {q.author || '익명'}</span>
                <span>{q.answers ?? 0}개 답변</span>
                <span>{q.created_at ? new Date(q.created_at).toLocaleString() : ''}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 