import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Type, FileText, Clock, Repeat, AlignLeft } from 'lucide-react'
import type { TextStats } from '@/types/review'

export function StatisticsPanel({ stats }: { stats: TextStats }) {
  const items = [
    { label: 'Caracteres', value: stats.characters, icon: Type },
    { label: 'Palavras', value: stats.words, icon: FileText },
    { label: 'Frases', value: stats.sentences, icon: AlignLeft },
    { label: 'Parágrafos', value: stats.paragraphs, icon: AlignLeft },
    { label: 'Páginas', value: stats.pages, icon: FileText },
    { label: 'Leitura', value: `${stats.readingTime}min`, icon: Clock },
    { label: 'Div. lexical', value: `${stats.lexicalDiversity}%`, icon: BarChart3 },
    { label: 'Frases longas', value: stats.longSentences, icon: AlignLeft },
    { label: 'Frases curtas', value: stats.shortSentences, icon: AlignLeft },
    { label: 'Média p/f', value: stats.avgWordsPerSentence, icon: BarChart3 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Estatísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item) => (
            <div key={item.label} className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-1">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <span className="text-lg font-bold">{item.value}</span>
            </div>
          ))}
        </div>
        {stats.repeatedWords.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Repeat className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Palavras repetidas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.repeatedWords.map(([word, count]) => (
                <span key={word} className="rounded-full bg-muted px-2 py-1 text-xs">
                  {word} ({count}x)
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
