import pb from '@/lib/pocketbase/client'
import type { AnalysisResult, RewriteResult } from '@/types/review'

export async function analyzeText(
  text: string,
  genre: string,
  style: string,
): Promise<AnalysisResult> {
  return await pb.send('/backend/v1/analyze', {
    method: 'POST',
    body: JSON.stringify({ text, genre, style }),
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function rewriteText(
  text: string,
  action: string,
  genre: string,
  style: string,
): Promise<RewriteResult> {
  return await pb.send('/backend/v1/rewrite', {
    method: 'POST',
    body: JSON.stringify({ text, action, genre, style }),
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function explainSuggestion(
  excerpt: string,
  suggestion: string,
  moduleName: string,
): Promise<string> {
  const result = await pb.send('/backend/v1/explain', {
    method: 'POST',
    body: JSON.stringify({ excerpt, suggestion, module: moduleName }),
    headers: { 'Content-Type': 'application/json' },
  })
  return result.explanation || ''
}
