import { Sparkles, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroProps {
  onStart: () => void
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-6 animate-fade-in">
          <Sparkles className="h-4 w-4" />
          Revisão literária com inteligência artificial
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 animate-fade-in-up">
          Revise seu livro gratuitamente com IA.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up">
          Receba sugestões de ortografia, gramática, coerência, estilo e narrativa em poucos
          segundos.
        </p>
        <Button size="lg" onClick={onStart} className="animate-fade-in-up">
          Começar a Revisar
          <ArrowDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}
