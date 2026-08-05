export type Severity = 'alta' | 'média' | 'baixa'

export interface Suggestion {
  excerpt: string
  severity: Severity
  explanation: string
  suggestion: string
}

export interface AnalysisModule {
  name: string
  score: number
  summary: string
  suggestions: Suggestion[]
}

export interface AnalysisResult {
  modules: AnalysisModule[]
  scores: Record<string, number>
}

export interface RewriteChange {
  original: string
  rewritten: string
  reason: string
}

export interface RewriteResult {
  original: string
  rewritten: string
  changes: RewriteChange[]
}

export interface HistoryItem {
  id: string
  timestamp: number
  genre: string
  style: string
  textPreview: string
  overallScore: number
  scores: Record<string, number>
}

export interface TextStats {
  characters: number
  words: number
  sentences: number
  paragraphs: number
  pages: number
  readingTime: number
  lexicalDiversity: number
  repeatedWords: Array<[string, number]>
  longSentences: number
  shortSentences: number
  avgWordsPerSentence: number
}

export const GENRES = [
  'Romance',
  'Fantasia',
  'Sci-fi',
  'Terror',
  'Drama',
  'Mistério',
  'Thriller',
  'Fanfic',
  'Infantil',
  'Light Novel',
  'Visual Novel',
  'Mangá',
  'HQ',
  'RPG',
  'Acadêmico',
  'Livre',
] as const

export const STYLES = [
  'Mais Formal',
  'Mais Literário',
  'Mais Simples',
  'Mais Comercial',
  'Mais Jovem',
  'Mais Clássico',
  'Mais Poético',
  'Mais Direto',
] as const

export const REWRITE_ACTIONS = [
  'Reescrever',
  'Expandir',
  'Resumir',
  'Melhorar diálogos',
  'Melhorar descrições',
  'Criar tensão',
  'Criar suspense',
  'Adicionar emoção',
  'Deixar engraçado',
  'Deixar sombrio',
  'Deixar romântico',
] as const

export const DEFAULT_SCORES: Record<string, number> = {
  Ortografia: 92,
  Gramática: 95,
  Coerência: 81,
  Narrativa: 88,
  Personagens: 90,
  Diálogos: 79,
  Descrição: 85,
  Originalidade: 84,
  Imersão: 91,
}
