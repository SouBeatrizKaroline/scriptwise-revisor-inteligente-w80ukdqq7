import { useRef, useState, useCallback, useMemo } from 'react'
import { Hero } from '@/components/Hero'
import { EditorPanel } from '@/components/EditorPanel'
import { AnalysisResults } from '@/components/AnalysisResults'
import { ScorePanel } from '@/components/ScoreRings'
import { StatisticsPanel } from '@/components/StatisticsPanel'
import { RewritePanel } from '@/components/RewritePanel'
import { GenreStyleSelector } from '@/components/GenreStyleSelector'
import { ExportMenu } from '@/components/ExportMenu'
import { HistoryList } from '@/components/HistoryList'
import { useReview } from '@/hooks/use-review'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'
import { computeStats } from '@/lib/text-stats'
import type { Suggestion } from '@/types/review'

export default function Index() {
  const review = useReview()
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const editorSectionRef = useRef<HTMLDivElement>(null)
  const [selectedText, setSelectedText] = useState('')

  const { explain } = review

  const handleScrollToEditor = useCallback(() => {
    editorSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleSelectionChange = useCallback(() => {
    const ta = editorRef.current
    if (!ta) return
    const { selectionStart, selectionEnd } = ta
    if (selectionStart !== selectionEnd) {
      setSelectedText(ta.value.substring(selectionStart, selectionEnd))
    }
  }, [])

  const handleVerNoTexto = useCallback((excerpt: string) => {
    const ta = editorRef.current
    if (!ta) return
    const idx = ta.value.indexOf(excerpt)
    if (idx >= 0) {
      ta.focus()
      ta.setSelectionRange(idx, idx + excerpt.length)
      const ratio = idx / ta.value.length
      ta.scrollTop = ratio * ta.scrollHeight - ta.clientHeight / 2
    }
    editorSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleExplain = useCallback(
    async (sug: Suggestion, moduleName: string): Promise<string> => {
      return explain(sug.excerpt, sug.suggestion, moduleName)
    },
    [explain],
  )

  const stats = useMemo(() => computeStats(review.text), [review.text])

  return (
    <>
      <Hero onStart={handleScrollToEditor} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div ref={editorSectionRef} className="space-y-4 scroll-mt-20">
            <GenreStyleSelector
              genre={review.genre}
              style={review.style}
              onGenreChange={review.setGenre}
              onStyleChange={review.setStyle}
            />
            <EditorPanel
              text={review.text}
              onChangeText={review.setText}
              editorRef={editorRef}
              onSelectionChange={handleSelectionChange}
            />
            <div className="flex items-center justify-between gap-3">
              <ExportMenu text={review.text} analysis={review.analysis} />
              <Button size="lg" onClick={review.analyze} disabled={review.isAnalyzing}>
                {review.isAnalyzing ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                Analisar Texto
              </Button>
            </div>
            {review.error && (
              <Alert variant="destructive">
                <AlertDescription>{review.error}</AlertDescription>
              </Alert>
            )}
            <AnalysisResults
              analysis={review.analysis}
              isAnalyzing={review.isAnalyzing}
              onVerNoTexto={handleVerNoTexto}
              onExplain={handleExplain}
            />
            <RewritePanel selectedText={selectedText} onRewrite={review.rewrite} />
            <StatisticsPanel stats={stats} />
          </div>
          <div className="space-y-4">
            <ScorePanel scores={review.analysis?.scores ?? null} />
            <HistoryList history={review.history} />
          </div>
        </div>
      </main>
    </>
  )
}
