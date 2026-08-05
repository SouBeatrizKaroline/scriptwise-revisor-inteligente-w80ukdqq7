import { useState } from 'react'
import { Download, FileText, FileDown, FileCode, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { exportTxt, exportDocx, exportMarkdown, exportPdf } from '@/lib/file-utils'
import type { AnalysisResult } from '@/types/review'
import { toast } from 'sonner'

interface ExportMenuProps {
  text: string
  analysis: AnalysisResult | null
}

function formatComments(analysis: AnalysisResult | null): string {
  if (!analysis) return ''
  let out = '\n\n--- REVISÃO SCRIPTWISE ---\n\n'
  for (const mod of analysis.modules) {
    out += `## ${mod.name} (${mod.score}/100)\n${mod.summary}\n`
    if (mod.suggestions?.length) {
      out += '\nSugestões:\n'
      for (const s of mod.suggestions) {
        out += `  [${s.severity}] "${s.excerpt}"`
        if (s.suggestion) out += ` -> "${s.suggestion}"`
        out += '\n'
      }
    }
    out += '\n'
  }
  return out
}

export function ExportMenu({ text, analysis }: ExportMenuProps) {
  const [includeComments, setIncludeComments] = useState(false)

  const doExport = (format: 'txt' | 'docx' | 'md' | 'pdf') => {
    if (!text.trim()) {
      toast.error('Nada para exportar.')
      return
    }
    const content = includeComments ? text + formatComments(analysis) : text
    switch (format) {
      case 'txt':
        exportTxt('scriptwise', content)
        break
      case 'docx':
        exportDocx('scriptwise', content)
        break
      case 'md':
        exportMarkdown('scriptwise', content)
        break
      case 'pdf':
        exportPdf(content)
        break
    }
    toast.success('Exportado com sucesso!')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-1.5 h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Formatos</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => doExport('txt')}>
          <FileText className="mr-2 h-4 w-4" /> TXT
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => doExport('docx')}>
          <FileDown className="mr-2 h-4 w-4" /> DOCX
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => doExport('md')}>
          <FileCode className="mr-2 h-4 w-4" /> Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => doExport('pdf')}>
          <Printer className="mr-2 h-4 w-4" /> PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Switch
            id="inc-comments"
            checked={includeComments}
            onCheckedChange={setIncludeComments}
          />
          <Label htmlFor="inc-comments" className="text-xs cursor-pointer">
            Incluir comentários
          </Label>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
