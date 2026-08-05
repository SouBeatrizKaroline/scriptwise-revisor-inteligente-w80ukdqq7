import type { TextStats } from '@/types/review'

export function computeStats(text: string): TextStats {
  const characters = text.length
  const trimmed = text.trim()
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  const sentenceMatches = text.match(/[^.!?]+[.!?]+/g) || []
  const sentences = sentenceMatches.length || (trimmed ? 1 : 0)
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0
  const readingTime = Math.max(1, Math.ceil(words / 200))
  const pages = Math.max(1, Math.ceil(words / 300))

  const wordList = text.toLowerCase().match(/\b[a-zà-ú]+\b/g) || []
  const uniqueWords = new Set(wordList)
  const lexicalDiversity =
    wordList.length > 0 ? Math.round((uniqueWords.size / wordList.length) * 100) : 0

  const wordFreq: Record<string, number> = {}
  for (const w of wordList) {
    if (w.length > 3) wordFreq[w] = (wordFreq[w] || 0) + 1
  }
  const repeatedWords = Object.entries(wordFreq)
    .filter(([, c]) => c > 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) as Array<[string, number]>

  const sentenceLengths = sentenceMatches.map((s) => s.trim().split(/\s+/).length)
  const longSentences = sentenceLengths.filter((l) => l > 25).length
  const shortSentences = sentenceLengths.filter((l) => l < 5).length
  const avgWordsPerSentence = sentences > 0 ? Math.round(words / sentences) : 0

  return {
    characters,
    words,
    sentences,
    paragraphs,
    pages,
    readingTime,
    lexicalDiversity,
    repeatedWords,
    longSentences,
    shortSentences,
    avgWordsPerSentence,
  }
}
