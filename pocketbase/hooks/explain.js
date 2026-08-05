routerAdd('POST', '/backend/v1/explain', (e) => {
  const body = e.requestInfo().body || {}
  const excerpt = (body.excerpt || '').trim()
  const suggestion = (body.suggestion || '').trim()
  const moduleName = body.module || ''

  if (!excerpt) return e.badRequestError('Trecho é obrigatório.')

  const systemPrompt =
    'Você é o ScriptWise, um revisor literário. Explique de forma clara e didática, em português brasileiro, por que uma sugestão de revisão foi feita. Seja conciso (máximo 3 parágrafos).'

  const userPrompt =
    'Módulo: ' +
    moduleName +
    '\nTrecho: "' +
    excerpt +
    '"\nSugestão: "' +
    suggestion +
    '"\n\nExplique o porquê desta sugestão.'

  try {
    const reply = $ai.chat({
      model: 'fast',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })

    return e.json(200, { explanation: reply.choices[0].message.content.trim() })
  } catch (err) {
    if (err instanceof SkipAiConfigError) {
      return e.json(503, { message: 'O serviço de IA não está configurado no momento.' })
    }
    if (err instanceof SkipAiError) {
      return e.json(502, { message: 'Não foi possível gerar a explicação.' })
    }
    return e.json(500, { message: 'Erro inesperado.' })
  }
})
