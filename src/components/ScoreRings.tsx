import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SCORE_KEYS = [
  'Ortografia',
  'Gramática',
  'Coerência',
  'Narrativa',
  'Personagens',
  'Diálogos',
  'Descrição',
  'Originalidade',
  'Imersão',
]

function ScoreRing({ label, score, delay }: { label: string; score: number; delay: number }) {
  const [display, setDisplay] = useState(0)
  const radius = 26
  const circ = 2 * Math.PI * radius

  useEffect(() => {
    const t = setTimeout(() => setDisplay(score), delay)
    return () => clearTimeout(t)
  }, [score, delay])

  const offset = circ - (display / 100) * circ
  const color =
    score >= 80 ? 'hsl(142 71% 45%)' : score >= 60 ? 'hsl(38 92% 50%)' : 'hsl(0 84% 60%)'

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-16 w-16">
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
          {display}
        </span>
      </div>
      <span className="text-xs text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  )
}

export function ScorePanel({ scores }: { scores: Record<string, number> | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pontuações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {SCORE_KEYS.map((key, i) => (
            <ScoreRing key={key} label={key} score={scores?.[key] ?? 0} delay={i * 80} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
