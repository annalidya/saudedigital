const config = require('../config/config')
const banco = require('../config/conexaoBanco')
const { sanitizar, validarMedicamento, validarHorario } = require('../utilitarios/validadores')

// Listar medicamentos
function listarMedicamentos(req, res) {
  try {
    const medicamentos = banco.prepare(
      'SELECT * FROM medicamentos WHERE usuario_id = ? ORDER BY nome'
    ).all(req.usuarioId)

    res.json({ sucesso: true, dados: medicamentos })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Cadastrar medicamento
function cadastrarMedicamento(req, res) {
  const { valido, erros, dados } = validarMedicamento(req.body)
  if (!valido) return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })

  try {
    const inserir = banco.prepare(
      'INSERT INTO medicamentos (usuario_id, nome, dosagem, inicio, fim) VALUES (?, ?, ?, ?, ?)'
    )
    const resultado = inserir.run(req.usuarioId, dados.nome, dados.dosagem || null, dados.inicio || null, dados.fim || null)

    res.status(201).json({
      sucesso: true,
      mensagem: 'Medicamento cadastrado com sucesso!',
      dados: { id: resultado.lastInsertRowid }
    })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Adicionar horário ao medicamento
function adicionarHorario(req, res) {
  const { valido, erros, dados } = validarHorario(req.body)
  if (!valido) return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })

  try {
    const medicamento = banco.prepare(
      'SELECT id FROM medicamentos WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!medicamento) {
      return res.status(404).json({ sucesso: false, mensagem: 'Medicamento não encontrado.' })
    }

    const inserir = banco.prepare(
      'INSERT INTO horarios_medicamento (medicamento_id, hora) VALUES (?, ?)'
    )
    inserir.run(req.params.id, dados.hora)

    res.status(201).json({ sucesso: true, mensagem: 'Horário adicionado com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Listar horários do medicamento
function listarHorarios(req, res) {
  try {
    const medicamento = banco.prepare(
      'SELECT id FROM medicamentos WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!medicamento) {
      return res.status(404).json({ sucesso: false, mensagem: 'Medicamento não encontrado.' })
    }

    const horarios = banco.prepare(
      'SELECT * FROM horarios_medicamento WHERE medicamento_id = ? ORDER BY hora'
    ).all(req.params.id)

    res.json({ sucesso: true, dados: horarios })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Listar notificações
function listarNotificacoes(req, res) {
  try {
    const notificacoes = banco.prepare(
      `SELECT * FROM notificacoes WHERE usuario_id = ? ORDER BY data_hora DESC LIMIT ${config.NOTIFICATION_LIMIT}`
    ).all(req.usuarioId)

    res.json({ sucesso: true, dados: notificacoes })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Atualizar medicamento
function atualizarMedicamento(req, res) {
  const { valido, erros, dados } = validarMedicamento(req.body)
  if (!valido) return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })

  try {
    const medicamento = banco.prepare(
      'SELECT id FROM medicamentos WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!medicamento) {
      return res.status(404).json({ sucesso: false, mensagem: 'Medicamento não encontrado.' })
    }

    banco.prepare(
      'UPDATE medicamentos SET nome = ?, dosagem = ?, inicio = ?, fim = ? WHERE id = ? AND usuario_id = ?'
    ).run(dados.nome, dados.dosagem || null, dados.inicio || null, dados.fim || null, req.params.id, req.usuarioId)

    res.json({ sucesso: true, mensagem: 'Medicamento atualizado com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Excluir medicamento
function excluirMedicamento(req, res) {
  try {
    const medicamento = banco.prepare(
      'SELECT id FROM medicamentos WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!medicamento) {
      return res.status(404).json({ sucesso: false, mensagem: 'Medicamento não encontrado.' })
    }

    banco.prepare('DELETE FROM medicamentos WHERE id = ? AND usuario_id = ?').run(req.params.id, req.usuarioId)

    res.json({ sucesso: true, mensagem: 'Medicamento excluído com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Excluir horário
function excluirHorario(req, res) {
  try {
    const medicamento = banco.prepare(
      'SELECT id FROM medicamentos WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!medicamento) {
      return res.status(404).json({ sucesso: false, mensagem: 'Medicamento não encontrado.' })
    }

    const horario = banco.prepare(
      'SELECT id FROM horarios_medicamento WHERE id = ? AND medicamento_id = ?'
    ).get(req.params.horarioId, req.params.id)

    if (!horario) {
      return res.status(404).json({ sucesso: false, mensagem: 'Horário não encontrado.' })
    }

    banco.prepare('DELETE FROM horarios_medicamento WHERE id = ? AND medicamento_id = ?').run(req.params.horarioId, req.params.id)

    res.json({ sucesso: true, mensagem: 'Horário excluído com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

module.exports = {
  listarMedicamentos,
  cadastrarMedicamento,
  adicionarHorario,
  listarHorarios,
  listarNotificacoes,
  atualizarMedicamento,
  excluirMedicamento,
  excluirHorario
}
