const config = require('../config/config')
const banco = require('../config/conexaoBanco')

const TABELAS_PERMITIDAS = new Set(['usuarios', 'exames', 'receitas', 'consultas', 'medicamentos', 'sintomas', 'notificacoes', 'registros_login'])

function contar(tabela) {
  if (!TABELAS_PERMITIDAS.has(tabela)) return 0
  return banco.prepare(`SELECT COUNT(*) AS total FROM ${tabela}`).get().total
}

// Estatísticas gerais do sistema
function estatisticasSistema(req, res) {
  try {
    const tipos = ['paciente', 'medico', 'cuidador', 'admin']

    const estatisticas = {
      usuarios: contar('usuarios'),
      usuarios_por_tipo: tipos.reduce((acc, tipo) => {
        acc[tipo] = banco.prepare('SELECT COUNT(*) AS total FROM usuarios WHERE tipo = ?').get(tipo).total
        return acc
      }, {}),
      exames: contar('exames'),
      receitas: contar('receitas'),
      consultas: contar('consultas'),
      medicamentos: contar('medicamentos'),
      sintomas: contar('sintomas'),
      notificacoes: contar('notificacoes'),
      registros_login: contar('registros_login'),
      usuarios_ativos: banco.prepare('SELECT COUNT(*) AS total FROM usuarios WHERE ativo = 1').get().total
    }

    const ultimosCadastros = banco.prepare(
      'SELECT id, nome_completo, email, tipo, criado_em FROM usuarios ORDER BY id DESC LIMIT 5'
    ).all()

    res.json({ sucesso: true, dados: { estatisticas, ultimos_cadastros: ultimosCadastros } })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Listar usuários com busca e filtro por tipo
function listarUsuarios(req, res) {
  try {
    const busca = String(req.query.busca || '').trim()
    const tipo = String(req.query.tipo || '').trim()
    const pagina = Math.max(parseInt(req.query.pagina, 10) || 1, 1)
    const porPagina = Math.min(Math.max(parseInt(req.query.por_pagina, 10) || config.DEFAULT_PAGE_SIZE, 1), config.MAX_PAGE_SIZE)

    const clausulas = []
    const params = []

    if (busca) {
      clausulas.push('(nome_completo LIKE ? OR email LIKE ?)')
      params.push(`%${busca}%`, `%${busca}%`)
    }
    if (['paciente', 'medico', 'cuidador', 'admin'].includes(tipo)) {
      clausulas.push('tipo = ?')
      params.push(tipo)
    }

    const where = clausulas.length > 0 ? ` WHERE ${clausulas.join(' AND ')}` : ''

    const total = banco.prepare(`SELECT COUNT(*) AS total FROM usuarios${where}`).get(...params).total
    const deslocamento = (pagina - 1) * porPagina

    const usuarios = banco.prepare(
      `SELECT id, nome_completo, email, cpf, tipo, especialidade, ativo, criado_em
       FROM usuarios${where}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`
    ).all(...params, porPagina, deslocamento)

    res.json({
      sucesso: true,
      dados: usuarios,
      paginacao: {
        pagina,
        por_pagina: porPagina,
        total,
        total_paginas: Math.ceil(total / porPagina)
      }
    })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Obter detalhe de um usuário
function obterUsuario(req, res) {
  try {
    const usuario = banco.prepare(
      'SELECT id, nome_completo, email, cpf, data_nascimento, tipo, especialidade, ativo, criado_em FROM usuarios WHERE id = ?'
    ).get(req.params.id)

    if (!usuario) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' })
    }

    res.json({ sucesso: true, dados: usuario })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Ativar/desativar um usuário
function alterarStatusUsuario(req, res) {
  try {
    const id = parseInt(req.params.id, 10)
    if (!id) return res.status(422).json({ sucesso: false, mensagem: 'ID inválido.' })

    if (id === req.usuarioId) {
      return res.status(400).json({ sucesso: false, mensagem: 'O administrador não pode alterar o próprio status.' })
    }

    const ativo = req.body.ativo === 1 || req.body.ativo === true ? 1 : 0

    const resultado = banco.prepare(
      'UPDATE usuarios SET ativo = ? WHERE id = ?'
    ).run(ativo, id)

    if (resultado.changes === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' })
    }

    res.json({
      sucesso: true,
      mensagem: ativo ? 'Usuário ativado com sucesso!' : 'Usuário desativado com sucesso!'
    })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Excluir um usuário
function removerUsuario(req, res) {
  try {
    const id = parseInt(req.params.id, 10)
    if (!id) return res.status(422).json({ sucesso: false, mensagem: 'ID inválido.' })

    if (id === req.usuarioId) {
      return res.status(400).json({ sucesso: false, mensagem: 'O administrador não pode excluir a si mesmo.' })
    }

    const resultado = banco.prepare('DELETE FROM usuarios WHERE id = ?').run(id)

    if (resultado.changes === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' })
    }

    res.json({ sucesso: true, mensagem: 'Usuário excluído com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Listar registros de login
function listarRegistrosLogin(req, res) {
  try {
    const pagina = Math.max(parseInt(req.query.pagina, 10) || 1, 1)
    const porPagina = Math.min(Math.max(parseInt(req.query.por_pagina, 10) || config.DEFAULT_PAGE_SIZE, 1), config.MAX_PAGE_SIZE)
    const filtroSucesso = req.query.sucesso !== undefined ? parseInt(req.query.sucesso, 10) : null

    const clausulas = []
    const params = []

    if (filtroSucesso !== null && [0, 1].includes(filtroSucesso)) {
      clausulas.push('rl.sucesso = ?')
      params.push(filtroSucesso)
    }

    const where = clausulas.length > 0 ? ` WHERE ${clausulas.join(' AND ')}` : ''

    const total = banco.prepare(`SELECT COUNT(*) AS total FROM registros_login rl${where}`).get(...params).total
    const deslocamento = (pagina - 1) * porPagina

    const registros = banco.prepare(
      `SELECT rl.id, rl.usuario_id, rl.email, rl.sucesso, rl.ip, rl.user_agent, rl.criado_em,
              u.nome_completo
       FROM registros_login rl
       LEFT JOIN usuarios u ON u.id = rl.usuario_id
       ${where}
       ORDER BY rl.criado_em DESC
       LIMIT ? OFFSET ?`
    ).all(...params, porPagina, deslocamento)

    res.json({
      sucesso: true,
      dados: registros,
      paginacao: {
        pagina,
        por_pagina: porPagina,
        total,
        total_paginas: Math.ceil(total / porPagina)
      }
    })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

module.exports = {
  estatisticasSistema,
  listarUsuarios,
  obterUsuario,
  alterarStatusUsuario,
  removerUsuario,
  listarRegistrosLogin
}