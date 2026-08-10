'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AnalysisResult } from '@/lib/analysis'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function MistakeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [mistakeData, setMistakeData] = useState<any>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMistake = async () => {
      const id = params.id
      if (!id) {
        setError('未获取到错题ID')
        setLoading(false)
        return
      }
      
      // 直接查，不做任何用户验证
      const { data, error: fetchError } = await supabase
        .from('mistakes')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        setError('查询失败: ' + fetchError.message)
        setLoading(false)
        return
      }
      
      if (!data) {
        setError('未找到 ID 为 ' + id + ' 的错题')
        setLoading(false)
        return
      }

      setMistakeData(data)
      if (data.analysis_cache) {
        setAnalysis(data.analysis_cache)
      }
      setLoading(false)
    }
    fetchMistake()
  }, [params.id])

  if (loading) return <div className="p-8 text-center">加载中...</div>
  
  if (error) return (
    <div className="p-8 text-center space-y-4">
      <p className="text-red-500">❌ {error}</p>
      <Button onClick={() => router.push('/mistakes-list')}>返回错题本</Button>
    </div>
  )

  if (!mistakeData) return <div className="p-8 text-center">未找到该错题</div>

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 pb-24">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h1 className="text-xl font-bold">错题详情</h1>
          <p><strong>题干：</strong>{mistakeData.question_text}</p>
          <div className="flex gap-4">
            <p className="text-red-500"><strong>你的答案：</strong>{mistakeData.user_answer}</p>
            <p className="text-green-500"><strong>正确答案：</strong>{mistakeData.correct_answer}</p>
          </div>
          <p><strong>语法点：</strong>{mistakeData.grammar_points?.join(', ')}</p>
        </CardContent>
      </Card>

      {analysis ? (
        <>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-2">📘 语法讲解：{analysis.grammar.point}</h2>
              <p><strong>定义：</strong>{analysis.grammar.definition}</p>
              <p><strong>结构：</strong>{analysis.grammar.structure}</p>
              <p className="text-red-500"><strong>⚠️ 常见错误：</strong>{analysis.grammar.common_mistake}</p>
              <p><strong>例句：</strong>{analysis.grammar.example}</p>
            </CardContent>
          </Card>
          {analysis.longSentence && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-bold mb-2">🧩 长难句分析</h2>
                <p><strong>原句：</strong>{analysis.longSentence.original}</p>
                <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded text-sm">{analysis.longSentence.analysis}</pre>
                <p><strong>直译：</strong>{analysis.longSentence.literalTranslation}</p>
                <p><strong>意译：</strong>{analysis.longSentence.freeTranslation}</p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-2">📚 词汇辨析</h2>
              <p><strong>重点词汇：</strong>{analysis.vocabulary.words.join('、')}</p>
              <p>{analysis.vocabulary.comparison}</p>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center text-gray-400">
            暂无 AI 分析结果，请先在 lib/analysis.ts 中配置 DEEPSEEK_API_KEY
          </CardContent>
        </Card>
      )}

      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <Button
          onClick={() => router.push('/mistakes-list')}
          className="w-3/4 max-w-md text-lg py-6"
        >
          返回错题本
        </Button>
      </div>
    </div>
  )
}