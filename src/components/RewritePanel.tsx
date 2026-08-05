import { useState, useEffect } from 'react'
import { Wand2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { REWRITE_ACTIONS, type RewriteResult } from '@/types/review'

interface RewritePanelProps {
  selectedText: string
  onRewrite: (excerpt: string, action: string) => Promise<RewriteResult | null>
}

export function RewritePanel({ selectedText, onRewrite }: RewritePanelProps) {
  const [action, setAction] = useState('Reescrever')
  const [result, setResult] = useState<RewriteResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedText) setResult(null)
  }, [selectedText])

  const handleRewrite = async () => {
    if (!selectedText.trim()) return
    setLoading(true)
    const res = await onRewrite(selectedText, action)
    setResult(res)
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Reescrita Inteligente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REWRITE_ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedText ? (
          <div className="rounded-lg border p-3 bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Texto selecionado:</p>
            <p className="text-sm line-clamp-3">{selectedText}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Selecione um trecho do texto para reescrever.
          </p>
        )}
        <Button
          onClick={handleRewrite}
          disabled={!selectedText.trim() || loading}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Reescrever
        </Button>
        {result && (
          <div className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">Antes</p>
                <p className="text-sm whitespace-pre-wrap">{result.original}</p>
              </div>
              <div className="rounded-lg border p-3 bg-primary/5">
                <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">
                  Depois
                </p>
                <p className="text-sm whitespace-pre-wrap">{result.rewritten}</p>
              </div>
            </div>
            {result.changes?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Mudanças:</p>
                {result.changes.map((c, i) => (
                  <div key={i} className="rounded-lg border p-2 text-sm">
                    <div className="flex flex-wrap gap-2 items-start">
                      <code className="bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-xs">
                        {c.original}
                      </code>
                      <span className="text-muted-foreground">→</span>
                      <code className="bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded text-xs">
                        {c.rewritten}
                      </code>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{c.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
