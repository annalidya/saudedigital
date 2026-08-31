const banco = require('../config/conexaoBanco')
const { sanitizar } = require('../utilitarios/validadores')

// === COMPROMISSOS ===

function listarCompromissos(req, res) {
  try {
    const compromissos = banco.prepare(
      'SELECT * FROM compromissos WHERE usuario_id = ? ORDER BY data ASC, hora ASC'
    ).all(req.usuarioId)

    res.json({ sucesso: true, dados: compromissos })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function cadastrarCompromisso(req, res) {
  const erros = []
  const titulo = sanitizar(req.body.titulo)
  const descricao = sanitizar(req.body.descricao || '')
  const data = sanitizar(req.body.data || '')
  const hora = sanitizar(req.body.hora || '')
  const local = sanitizar(req.body.local || '')
  const tipo = sanitizar(req.body.tipo || 'compromisso')

  if (!titulo || titulo.length < 2) erros.push('Informe o título do compromisso.')
  if (!data) erros.push('Informe a data do compromisso.')

  if (erros.length > 0) {
    return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })
  }

  try {
    banco.prepare(
      'INSERT INTO compromissos (usuario_id, titulo, descricao, data, hora, local, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(req.usuarioId, titulo, descricao || null, data, hora || null, local || null, tipo)

    res.status(201).json({ sucesso: true, mensagem: 'Compromisso cadastrado com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function atualizarCompromisso(req, res) {
  const erros = []
  const titulo = sanitizar(req.body.titulo)
  const descricao = sanitizar(req.body.descricao || '')
  const data = sanitizar(req.body.data || '')
  const hora = sanitizar(req.body.hora || '')
  const local = sanitizar(req.body.local || '')
  const tipo = sanitizar(req.body.tipo || 'compromisso')

  if (!titulo || titulo.length < 2) erros.push('Informe o título do compromisso.')
  if (!data) erros.push('Informe a data do compromisso.')

  if (erros.length > 0) {
    return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })
  }

  try {
    const existe = banco.prepare(
      'SELECT id FROM compromissos WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!existe) {
      return res.status(404).json({ sucesso: false, mensagem: 'Compromisso não encontrado.' })
    }

    banco.prepare(
      'UPDATE compromissos SET titulo = ?, descricao = ?, data = ?, hora = ?, local = ?, tipo = ? WHERE id = ? AND usuario_id = ?'
    ).run(titulo, descricao || null, data, hora || null, local || null, tipo, req.params.id, req.usuarioId)

    res.json({ sucesso: true, mensagem: 'Compromisso atualizado com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function excluirCompromisso(req, res) {
  try {
    const existe = banco.prepare(
      'SELECT id FROM compromissos WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!existe) {
      return res.status(404).json({ sucesso: false, mensagem: 'Compromisso não encontrado.' })
    }

    banco.prepare('DELETE FROM compromissos WHERE id = ? AND usuario_id = ?').run(req.params.id, req.usuarioId)

    res.json({ sucesso: true, mensagem: 'Compromisso excluído com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// === LEMBRETES ===

function listarLembretes(req, res) {
  try {
    const lembretes = banco.prepare(
      'SELECT * FROM lembretes WHERE usuario_id = ? ORDER BY data ASC, hora ASC'
    ).all(req.usuarioId)

    res.json({ sucesso: true, dados: lembretes })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function cadastrarLembrete(req, res) {
  const erros = []
  const titulo = sanitizar(req.body.titulo)
  const mensagem = sanitizar(req.body.mensagem || '')
  const data = sanitizar(req.body.data || '')
  const hora = sanitizar(req.body.hora || '')
  const recorrente = parseInt(req.body.recorrente, 10) || 0

  if (!titulo || titulo.length < 2) erros.push('Informe o título do lembrete.')
  if (!data) erros.push('Informe a data do lembrete.')

  if (erros.length > 0) {
    return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })
  }

  try {
    banco.prepare(
      'INSERT INTO lembretes (usuario_id, titulo, mensagem, data, hora, recorrente) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(req.usuarioId, titulo, mensagem || null, data, hora || null, recorrente)

    res.status(201).json({ sucesso: true, mensagem: 'Lembrete cadastrado com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function atualizarLembrete(req, res) {
  const erros = []
  const titulo = sanitizar(req.body.titulo)
  const mensagem = sanitizar(req.body.mensagem || '')
  const data = sanitizar(req.body.data || '')
  const hora = sanitizar(req.body.hora || '')
  const recorrente = parseInt(req.body.recorrente, 10) || 0
  const concluido = parseInt(req.body.concluido, 10) || 0

  if (!titulo || titulo.length < 2) erros.push('Informe o título do lembrete.')
  if (!data) erros.push('Informe a data do lembrete.')

  if (erros.length > 0) {
    return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })
  }

  try {
    const existe = banco.prepare(
      'SELECT id FROM lembretes WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!existe) {
      return res.status(404).json({ sucesso: false, mensagem: 'Lembrete não encontrado.' })
    }

    banco.prepare(
      'UPDATE lembretes SET titulo = ?, mensagem = ?, data = ?, hora = ?, recorrente = ?, concluido = ? WHERE id = ? AND usuario_id = ?'
    ).run(titulo, mensagem || null, data, hora || null, recorrente, concluido, req.params.id, req.usuarioId)

    res.json({ sucesso: true, mensagem: 'Lembrete atualizado com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function excluirLembrete(req, res) {
  try {
    const existe = banco.prepare(
      'SELECT id FROM lembretes WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!existe) {
      return res.status(404).json({ sucesso: false, mensagem: 'Lembrete não encontrado.' })
    }

    banco.prepare('DELETE FROM lembretes WHERE id = ? AND usuario_id = ?').run(req.params.id, req.usuarioId)

    res.json({ sucesso: true, mensagem: 'Lembrete excluído com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

module.exports = {
  listarCompromissos,
  cadastrarCompromisso,
  atualizarCompromisso,
  excluirCompromisso,
  listarLembretes,
  cadastrarLembrete,
  atualizarLembrete,
  excluirLembrete
}
