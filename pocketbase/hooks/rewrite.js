routerAdd('POST', '/backend/v1/rewrite', (e) => {
  const body = e.requestInfo().body || {}
  const text = (body.text || '').trim()
  const action = body.action || 'Reescrever'
  const genre = body.genre || 'Livre'
  const style = body.style || 'Mais Direto'

  if (!text) return e.badRequestError('Texto é obrigatório.')

  const systemPrompt = [
    'Você é o ScriptWise, um especialista em reescrita criativa de textos literários em português brasileiro.',
    'Retorne APENAS JSON válido (sem markdown, sem texto adicional).',
    '',
    'Formato: {"rewritten":"texto reescrito","changes":[{"original":"trecho","rewritten":"trecho","reason":"motivo"}]}',
    'Inclua no máximo 10 mudanças significativas. Mantenha o sentido original.',
  ].join('\n')

  const userPrompt =
    'Ação: ' + action + '\nGênero: ' + genre + '\nEstilo: ' + style + '\n\nTexto:\n' + text

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

    parsed.original = text
    return e.json(200, parsed)
  } catch (err) {
    if (err instanceof SkipAiConfigError) {
      return e.json(503, { message: 'O serviço de IA não está configurado no momento.' })
    }
    if (err instanceof SkipAiError) {
      return e.json(502, { message: 'Não foi possível reescrever o texto. Tente novamente.' })
    }
    return e.json(500, { message: 'Erro inesperado ao processar a reescrita.' })
  }
})
