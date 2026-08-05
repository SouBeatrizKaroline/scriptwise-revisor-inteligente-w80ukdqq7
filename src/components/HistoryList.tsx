import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { History } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HistoryItem } from '@/types/review'

export function HistoryList({ history }: { history: HistoryItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4" />
          Histórico
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma análise ainda.</p>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {history.map((item) => (
              <div key={item.id} className="rounded-lg border p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleTimeString('pt-BR')}
                  </span>
                  <span
                    className={cn(
                      'text-sm font-bold',
                      item.overallScore >= 80
                        ? 'text-green-600 dark:text-green-400'
                        : item.overallScore >= 60
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400',
                    )}
                  >
                    {item.overallScore}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{item.textPreview}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.genre} · {item.style}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
