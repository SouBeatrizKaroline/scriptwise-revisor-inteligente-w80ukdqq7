import { useState, useCallback } from 'react'
import { analyzeText, rewriteText, explainSuggestion } from '@/services/review'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import type { AnalysisResult, RewriteResult, HistoryItem } from '@/types/review'
import { DEFAULT_SCORES } from '@/types/review'

export function useReview(initialText = '') {
  const [text, setText] = useState(initialText)
  const [genre, setGenre] = useState('Livre')
  const [style, setStyle] = useState('Mais Direto')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])

  const analyze = useCallback(async () => {
    if (!text.trim()) {
      setError('Digite ou cole um texto para analisar.')
      return
    }
    setIsAnalyzing(true)
    setError(null)
    try {
      const result = await analyzeText(text, genre, style)
      setAnalysis(result)
      const scores = result.scores || DEFAULT_SCORES
      const overall = Math.round(
        Object.values(scores).reduce((a, b) => a + b, 0) / Math.max(Object.keys(scores).length, 1),
      )
      setHistory((prev) =>
        [
          {
            id: Date.now().toString(),
            timestamp: Date.now(),
            genre,
            style,
            textPreview: text.slice(0, 80),
            overallScore: overall,
            scores,
          },
          ...prev,
        ].slice(0, 10),
      )
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsAnalyzing(false)
    }
  }, [text, genre, style])

  const rewrite = useCallback(
    async (excerpt: string, action: string): Promise<RewriteResult | null> => {
      try {
        return await rewriteText(excerpt, action, genre, style)
      } catch (err) {
        setError(getErrorMessage(err))
        return null
      }
    },
    [genre, style],
  )

  const explain = useCallback(
    async (excerpt: string, suggestion: string, moduleName: string): Promise<string> => {
      try {
        return await explainSuggestion(excerpt, suggestion, moduleName)
      } catch (err) {
        return getErrorMessage(err)
      }
    },
    [],
  )

  return {
    text,
    setText,
    genre,
    setGenre,
    style,
    setStyle,
    analysis,
    isAnalyzing,
    error,
    history,
    analyze,
    rewrite,
    explain,
    setError,
  }
}
