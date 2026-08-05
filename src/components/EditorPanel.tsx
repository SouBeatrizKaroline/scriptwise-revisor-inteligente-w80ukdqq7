import { useRef, useMemo, type RefObject, type ChangeEvent } from 'react'
import { Clipboard, Trash2, FileUp, FileText, FileDown, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { computeStats } from '@/lib/text-stats'
import { importFile, exportTxt, exportDocx, copyToClipboard } from '@/lib/file-utils'
import { toast } from 'sonner'

interface EditorPanelProps {
  text: string
  onChangeText: (text: string) => void
  editorRef: RefObject<HTMLTextAreaElement | null>
  onSelectionChange: () => void
}

export function EditorPanel({
  text,
  onChangeText,
  editorRef,
  onSelectionChange,
}: EditorPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const stats = useMemo(() => computeStats(text), [text])

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText()
      onChangeText(text + clipText)
      toast.success('Texto colado!')
    } catch {
      toast.error('Não foi possível colar o texto.')
    }
  }

  const handleClear = () => {
    onChangeText('')
    toast.success('Editor limpo.')
  }

  const handleImport = () => fileInputRef.current?.click()

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const content = await importFile(file)
      onChangeText(content)
      toast.success(`Arquivo "${file.name}" importado!`)
    } catch {
      toast.error('Erro ao importar arquivo.')
    }
    e.target.value = ''
  }

  const handleExportTxt = () => {
    exportTxt('scriptwise-texto', text)
    toast.success('TXT exportado!')
  }

  const handleExportDocx = () => {
    exportDocx('scriptwise-texto', text)
    toast.success('DOCX exportado!')
  }

  const handleCopy = async () => {
    try {
      await copyToClipboard(text)
      toast.success('Texto copiado!')
    } catch {
      toast.error('Erro ao copiar.')
    }
  }

  const counters = [
    { label: 'Caracteres', value: stats.characters },
    { label: 'Palavras', value: stats.words },
    { label: 'Páginas', value: stats.pages },
    { label: 'Leitura', value: `${stats.readingTime}min` },
  ]

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={handlePaste}>
          <Clipboard className="mr-1.5 h-4 w-4" />
          Colar Texto
        </Button>
        <Button variant="outline" size="sm" onClick={handleClear}>
          <Trash2 className="mr-1.5 h-4 w-4" />
          Limpar
        </Button>
        <Button variant="outline" size="sm" onClick={handleImport}>
          <FileUp className="mr-1.5 h-4 w-4" />
          Importar TXT/DOCX
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportTxt}>
          <FileText className="mr-1.5 h-4 w-4" />
          Exportar TXT
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportDocx}>
          <FileDown className="mr-1.5 h-4 w-4" />
          Exportar DOCX
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="mr-1.5 h-4 w-4" />
          Copiar
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.docx,.doc,.md"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <Textarea
        ref={editorRef}
        value={text}
        onChange={(e) => onChangeText(e.target.value)}
        onSelect={onSelectionChange}
        placeholder="Cole ou digite seu texto aqui..."
        className="min-h-[400px] md:min-h-[500px] resize-y text-base leading-relaxed"
      />
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {counters.map((item) => (
          <span key={item.label}>
            <strong className="text-foreground">{item.value}</strong> {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
