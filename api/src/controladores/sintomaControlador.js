const banco = require('../config/conexaoBanco')
const { sanitizar, validarSintoma } = require('../utilitarios/validadores')

// Listar sintomas
function listarSintomas(req, res) {
  try {
    const sintomas = banco.prepare(
      'SELECT * FROM sintomas WHERE usuario_id = ? ORDER BY data DESC'
    ).all(req.usuarioId)

    res.json({ sucesso: true, dados: sintomas })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Cadastrar sintoma
function cadastrarSintoma(req, res) {
  const { valido, erros, dados } = validarSintoma(req.body)
  if (!valido) return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })

  try {
    const inserir = banco.prepare(
      'INSERT INTO sintomas (usuario_id, data, tipo, intensidade, descricao) VALUES (?, ?, ?, ?, ?)'
    )
    inserir.run(req.usuarioId, dados.data, dados.tipo || null, dados.intensidade, dados.descricao || null)

    res.status(201).json({ sucesso: true, mensagem: 'Sintoma cadastrado com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Relatório de sintomas
function relatorioSintomas(req, res) {
  try {
    const sintomas = banco.prepare(
      'SELECT * FROM sintomas WHERE usuario_id = ? ORDER BY data DESC'
    ).all(req.usuarioId)

    const total = sintomas.length
    const mediaIntensidade = total > 0
      ? (sintomas.reduce((acc, s) => acc + s.intensidade, 0) / total).toFixed(1)
      : 0

    const porTipo = sintomas.reduce((acc, s) => {
      if (s.tipo) {
        acc[s.tipo] = (acc[s.tipo] || 0) + 1
      }
      return acc
    }, {})

    res.json({
      sucesso: true,
      dados: {
        sintomas,
        estatisticas: {
          total,
          media_intensidade: parseFloat(mediaIntensidade),
          por_tipo: porTipo
        }
      }
    })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Atualizar sintoma
function atualizarSintoma(req, res) {
  const { valido, erros, dados } = validarSintoma(req.body)
  if (!valido) return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })

  try {
    const sintoma = banco.prepare(
      'SELECT id FROM sintomas WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!sintoma) {
      return res.status(404).json({ sucesso: false, mensagem: 'Sintoma não encontrado.' })
    }

    banco.prepare(
      'UPDATE sintomas SET data = ?, tipo = ?, intensidade = ?, descricao = ? WHERE id = ? AND usuario_id = ?'
    ).run(dados.data, dados.tipo || null, dados.intensidade, dados.descricao || null, req.params.id, req.usuarioId)

    res.json({ sucesso: true, mensagem: 'Sintoma atualizado com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Excluir sintoma
function excluirSintoma(req, res) {
  try {
    const sintoma = banco.prepare(
      'SELECT id FROM sintomas WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.usuarioId)

    if (!sintoma) {
      return res.status(404).json({ sucesso: false, mensagem: 'Sintoma não encontrado.' })
    }

    banco.prepare('DELETE FROM sintomas WHERE id = ? AND usuario_id = ?').run(req.params.id, req.usuarioId)

    res.json({ sucesso: true, mensagem: 'Sintoma excluído com sucesso!' })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

module.exports = {
  listarSintomas,
  cadastrarSintoma,
  relatorioSintomas,
  atualizarSintoma,
  excluirSintoma
}
