import { useState } from 'react'
import { Eye, HelpCircle, Loader2 } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { AnalysisResult, Suggestion } from '@/types/review'

interface AnalysisResultsProps {
  analysis: AnalysisResult | null
  isAnalyzing: boolean
  onVerNoTexto: (excerpt: string) => void
  onExplain: (suggestion: Suggestion, moduleName: string) => Promise<string>
}

const severityColor: Record<string, string> = {
  alta: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  média: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  baixa: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
}

export function AnalysisResults({
  analysis,
  isAnalyzing,
  onVerNoTexto,
  onExplain,
}: AnalysisResultsProps) {
  const [expanded, setExpanded] = useState<Record<string, string>>({})
  const [loadingExplain, setLoadingExplain] = useState<string | null>(null)

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span className="text-muted-foreground">Analisando seu texto...</span>
        </CardContent>
      </Card>
    )
  }

  if (!analysis || !analysis.modules) return null

  const handleExplain = async (sug: Suggestion, modName: string, key: string) => {
    if (expanded[key]) {
      setExpanded((prev) => {
        const n = { ...prev }
        delete n[key]
        return n
      })
      return
    }
    if (sug.explanation) {
      setExpanded((prev) => ({ ...prev, [key]: sug.explanation }))
      return
    }
    setLoadingExplain(key)
    const explanation = await onExplain(sug, modName)
    setExpanded((prev) => ({ ...prev, [key]: explanation }))
    setLoadingExplain(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados da Análise</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-2">
          {analysis.modules.map((mod, idx) => (
            <AccordionItem key={mod.name} value={mod.name} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="font-medium">{mod.name}</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'ml-auto',
                      mod.score >= 80
                        ? 'bg-green-500/10 text-green-600'
                        : mod.score >= 60
                          ? 'bg-yellow-500/10 text-yellow-600'
                          : 'bg-red-500/10 text-red-600',
                    )}
                  >
                    {mod.score}/100
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <p className="text-sm text-muted-foreground">{mod.summary}</p>
                {mod.suggestions?.length > 0 && (
                  <div className="space-y-2">
                    {mod.suggestions.map((sug, sIdx) => {
                      const key = `${mod.name}-${sIdx}`
                      return (
                        <div key={sIdx} className="rounded-lg border p-3 space-y-2">
                          <div className="flex items-start gap-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className={cn('capitalize', severityColor[sug.severity] || '')}
                            >
                              {sug.severity}
                            </Badge>
                            <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                              {sug.excerpt}
                            </code>
                            {sug.suggestion && (
                              <span className="text-sm text-muted-foreground">
                                →{' '}
                                <code className="bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded">
                                  {sug.suggestion}
                                </code>
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleExplain(sug, mod.name, key)}
                            >
                              {loadingExplain === key ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <HelpCircle className="h-3 w-3 mr-1" />
                              )}
                              Por quê?
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onVerNoTexto(sug.excerpt)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Ver no texto
                            </Button>
                          </div>
                          {expanded[key] && (
                            <p className="text-sm text-muted-foreground bg-muted/50 rounded p-2">
                              {expanded[key]}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
