const { banco } = require('../config/conexaoBanco')
const { sanitizar, validarExame, validarReceita, validarConsulta } = require('../utilitarios/validadores')

// === EXAMES ===

function listarExames(req, res) {
  try {
    const exames = banco.prepare(
      'SELECT * FROM exames WHERE usuario_id = ? ORDER BY data_exame DESC'
    ).all(req.usuarioId)

    res.json({ sucesso: true, dados: exames })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function cadastrarExame(req, res) {
  const { valido, erros, dados } = validarExame(req.body)
  if (!valido) return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })

  try {
    const inserir = banco.prepare(
      'INSERT INTO exames (usuario_id, nome, tipo, laboratorio, data_exame, resultado, arquivo) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    inserir.run(req.usuarioId, dados.nome, dados.tipo || null, dados.laboratorio || null, dados.data_exame || null, dados.resultado || null, dados.arquivo || null)

    res.status(201).json({ sucesso: true, mensagem: 'Exame cadastrado com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function obterExame(req, res) {
  try {
    const exame = banco.prepare(
      'SELECT * FROM exames WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!exame) {
      return res.status(404).json({ sucesso: false, mensagem: 'Exame não encontrado.' })
    }

    res.json({ sucesso: true, dados: exame })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// === RECEITAS ===

function listarReceitas(req, res) {
  try {
    const receitas = banco.prepare(
      'SELECT * FROM receitas WHERE usuario_id = ? ORDER BY data_emissao DESC'
    ).all(req.usuarioId)

    res.json({ sucesso: true, dados: receitas })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function cadastrarReceita(req, res) {
  const { valido, erros, dados } = validarReceita(req.body)
  if (!valido) return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })

  try {
    const inserir = banco.prepare(
      'INSERT INTO receitas (usuario_id, medico, medicamento, dosagem, instrucoes, data_emissao, validade) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    inserir.run(req.usuarioId, dados.medico || null, dados.medicamento, dados.dosagem || null, dados.instrucoes || null, dados.data_emissao || null, dados.validade || null)

    res.status(201).json({ sucesso: true, mensagem: 'Receita cadastrada com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// === CONSULTAS ===

function listarConsultas(req, res) {
  try {
    const consultas = banco.prepare(
      'SELECT * FROM consultas WHERE usuario_id = ? ORDER BY data DESC'
    ).all(req.usuarioId)

    res.json({ sucesso: true, dados: consultas })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function cadastrarConsulta(req, res) {
  const { valido, erros, dados } = validarConsulta(req.body)
  if (!valido) return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })

  try {
    const inserir = banco.prepare(
      'INSERT INTO consultas (usuario_id, medico, especialidade, data, local, observacoes) VALUES (?, ?, ?, ?, ?, ?)'
    )
    inserir.run(req.usuarioId, dados.medico || null, dados.especialidade || null, dados.data || null, dados.local || null, dados.observacoes || null)

    res.status(201).json({ sucesso: true, mensagem: 'Consulta cadastrada com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function obterConsulta(req, res) {
  try {
    const consulta = banco.prepare(
      'SELECT * FROM consultas WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!consulta) {
      return res.status(404).json({ sucesso: false, mensagem: 'Consulta não encontrada.' })
    }

    res.json({ sucesso: true, dados: consulta })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// === ATUALIZAR E EXCLUIR ===

function atualizarExame(req, res) {
  const { valido, erros, dados } = validarExame(req.body)
  if (!valido) return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })

  try {
    const exame = banco.prepare(
      'SELECT id FROM exames WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!exame) {
      return res.status(404).json({ sucesso: false, mensagem: 'Exame não encontrado.' })
    }

    banco.prepare(
      'UPDATE exames SET nome = ?, tipo = ?, laboratorio = ?, data_exame = ?, resultado = ? WHERE id = ? AND usuario_id = ?'
    ).run(dados.nome, dados.tipo || null, dados.laboratorio || null, dados.data_exame || null, dados.resultado || null, req.params.id, req.usuarioId)

    res.json({ sucesso: true, mensagem: 'Exame atualizado com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function excluirExame(req, res) {
  try {
    const exame = banco.prepare(
      'SELECT id FROM exames WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!exame) {
      return res.status(404).json({ sucesso: false, mensagem: 'Exame não encontrado.' })
    }

    banco.prepare('DELETE FROM exames WHERE id = ? AND usuario_id = ?').run(req.params.id, req.usuarioId)

    res.json({ sucesso: true, mensagem: 'Exame excluído com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function atualizarReceita(req, res) {
  const { valido, erros, dados } = validarReceita(req.body)
  if (!valido) return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })

  try {
    const receita = banco.prepare(
      'SELECT id FROM receitas WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!receita) {
      return res.status(404).json({ sucesso: false, mensagem: 'Receita não encontrada.' })
    }

    banco.prepare(
      'UPDATE receitas SET medico = ?, medicamento = ?, dosagem = ?, instrucoes = ? WHERE id = ? AND usuario_id = ?'
    ).run(dados.medico || null, dados.medicamento, dados.dosagem || null, dados.instrucoes || null, req.params.id, req.usuarioId)

    res.json({ sucesso: true, mensagem: 'Receita atualizada com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function excluirReceita(req, res) {
  try {
    const receita = banco.prepare(
      'SELECT id FROM receitas WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!receita) {
      return res.status(404).json({ sucesso: false, mensagem: 'Receita não encontrada.' })
    }

    banco.prepare('DELETE FROM receitas WHERE id = ? AND usuario_id = ?').run(req.params.id, req.usuarioId)

    res.json({ sucesso: true, mensagem: 'Receita excluída com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function atualizarConsulta(req, res) {
  const { valido, erros, dados } = validarConsulta(req.body)
  if (!valido) return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })

  try {
    const consulta = banco.prepare(
      'SELECT id FROM consultas WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!consulta) {
      return res.status(404).json({ sucesso: false, mensagem: 'Consulta não encontrada.' })
    }

    banco.prepare(
      'UPDATE consultas SET medico = ?, especialidade = ?, data = ?, local = ?, observacoes = ? WHERE id = ? AND usuario_id = ?'
    ).run(dados.medico || null, dados.especialidade || null, dados.data || null, dados.local || null, dados.observacoes || null, req.params.id, req.usuarioId)

    res.json({ sucesso: true, mensagem: 'Consulta atualizada com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

function excluirConsulta(req, res) {
  try {
    const consulta = banco.prepare(
      'SELECT id FROM consultas WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!consulta) {
      return res.status(404).json({ sucesso: false, mensagem: 'Consulta não encontrada.' })
    }

    banco.prepare('DELETE FROM consultas WHERE id = ? AND usuario_id = ?').run(req.params.id, req.usuarioId)

    res.json({ sucesso: true, mensagem: 'Consulta excluída com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

module.exports = {
  listarExames,
  cadastrarExame,
  obterExame,
  atualizarExame,
  excluirExame,
  listarReceitas,
  cadastrarReceita,
  atualizarReceita,
  excluirReceita,
  listarConsultas,
  cadastrarConsulta,
  obterConsulta,
  atualizarConsulta,
  excluirConsulta
}
