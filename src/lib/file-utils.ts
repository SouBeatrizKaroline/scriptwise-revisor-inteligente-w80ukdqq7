function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function importFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext === 'txt' || ext === 'md') return await file.text()
  if (ext === 'docx' || ext === 'doc') {
    const buffer = await file.arrayBuffer()
    const text = new TextDecoder('utf-8').decode(buffer)
    const matches = text.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || []
    if (matches.length > 0) {
      return matches.map((m) => m.replace(/<[^>]+>/g, '')).join(' ')
    }
    return text
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  return await file.text()
}

export function exportTxt(filename: string, content: string) {
  downloadBlob(new Blob([content], { type: 'text/plain;charset=utf-8' }), filename + '.txt')
}

export function exportDocx(filename: string, content: string) {
  const escaped = content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body><pre style="white-space:pre-wrap;font-family:Arial;">${escaped}</pre></body></html>`
  downloadBlob(new Blob([html], { type: 'application/msword' }), filename + '.doc')
}

export function exportMarkdown(filename: string, content: string) {
  downloadBlob(new Blob([content], { type: 'text/markdown;charset=utf-8' }), filename + '.md')
}

export function exportPdf(content: string) {
  const win = window.open('', '_blank')
  if (!win) return
  const escaped = content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  win.document.write(
    `<html><head><title>ScriptWise - Exportar</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;line-height:1.6;white-space:pre-wrap;padding:20px;}</style></head><body>${escaped}</body></html>`,
  )
  win.document.close()
  setTimeout(() => win.print(), 300)
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}
