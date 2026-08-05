routerAdd('POST', '/backend/v1/analyze', (e) => {
  const body = e.requestInfo().body || {}
  const text = (body.text || '').trim()
  const genre = body.genre || 'Livre'
  const style = body.style || 'Mais Direto'

  if (!text) return e.badRequestError('Texto é obrigatório.')
  if (text.length > 30000) return e.badRequestError('Texto muito longo (máximo 30000 caracteres).')

  const systemPrompt = [
    'Você é o ScriptWise, um revisor literário profissional especializado em literatura em português brasileiro.',
    'Você analisa textos em 16 dimensões e retorna APENAS JSON válido (sem markdown, sem texto adicional).',
    'Responda sempre em português brasileiro.',
    '',
    'Os 16 módulos são:',
    '1. Ortografia - erros de ortografia, acentuação, pontuação, uso incorreto de palavras',
    '2. Gramática - concordância, regência, tempos verbais, construções pobres',
    '3. Clareza - frases difíceis, versões mais simples e fluidas',
    '4. Repetição - palavras excessivamente repetidas, sugestões de sinônimos',
    '5. Vocabulário - escolhas de palavras conforme o estilo desejado',
    '6. Coerência - mudanças abruptas, contradições, informações incompatíveis',
    '7. Continuidade - inconsistências com eventos anteriores do texto',
    '8. Diálogos - naturalidade, pontuação, ritmo, personagens que soam iguais',
    '9. Narrativa - show vs tell, ritmo, descrição, exposição, parágrafos longos',
    '10. Emoção - se a cena transmite emoção, parece fria, exagera ou pode melhorar',
    '11. Personagens - personalidade, consistência, objetivos, conflitos',
    '12. Mundo - inconsistências de mágica, regras, tecnologia, cenário',
    '13. Leitura - facilidade de leitura e nível (Infantil, Juvenil, Adulto, Acadêmico)',
    '14. Ritmo - seções lentas/rápidas, capítulos longos, descrições excessivas',
    '15. Clichês - frases muito comuns e alternativas',
    '16. IA Revisor Literário - revisão completa de editor: pontos fortes, fracos, o que manter, cortar, expandir',
    '',
    'Formato do JSON: {"modules":[{"name":"Ortografia","score":90,"summary":"resumo","suggestions":[{"excerpt":"trecho","severity":"alta","suggestion":"correção","explanation":"explicação"}]}],"scores":{"Ortografia":90,"Gramática":95,"Coerência":81,"Narrativa":88,"Personagens":90,"Diálogos":79,"Descrição":85,"Originalidade":84,"Imersão":91}}',
    'Máximo 5 sugestões por módulo. Se não houver problemas, retorne sugestões vazias.',
    'Scores de 0 a 100. Adapte a análise ao gênero e estilo escolhidos.',
  ].join('\n')

  const userPrompt = 'Gênero: ' + genre + '\nEstilo desejado: ' + style + '\n\nTexto:\n' + text

  try {
    const reply = $ai.chat({
      model: 'fast',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })

    let content = reply.choices[0].message.content.trim()
    content = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? jsonMatch[0] : content
    const parsed = JSON.parse(jsonStr)

    return e.json(200, parsed)
  } catch (err) {
    if (err instanceof SkipAiConfigError) {
      return e.json(503, {
        message: 'O serviço de IA não está configurado no momento. Tente novamente mais tarde.',
      })
    }
    if (err instanceof SkipAiError) {
      return e.json(502, {
        message: 'Não foi possível concluir a análise. Tente novamente em instantes.',
      })
    }
    return e.json(500, { message: 'Erro inesperado ao processar a análise.' })
  }
})
