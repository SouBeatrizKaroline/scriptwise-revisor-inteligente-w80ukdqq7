import { PenLine, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PenLine className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">ScriptWise</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleTheme} aria-label="Alternar tema">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  )
}
