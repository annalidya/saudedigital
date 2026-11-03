const { banco } = require('../config/conexaoBanco')
const { sanitizar, validarUsuario, validarLogin } = require('../utilitarios/validadores')
const { criarHash, verificarSenha, criarToken } = require('../utilitarios/autenticacao')
const validator = require('validator')

// Cadastrar novo usuário
function registrar(req, res) {
  const { valido, erros, dados } = validarUsuario(req.body)
  if (!valido) return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })

  try {
    const existeUsuario = banco.prepare('SELECT id FROM usuarios WHERE email = ?').get(dados.email)
    if (existeUsuario) {
      return res.status(409).json({ sucesso: false, mensagem: 'E-mail já cadastrado.' })
    }

    const senhaHash = criarHash(dados.senha)
    const inserir = banco.prepare(
      'INSERT INTO usuarios (nome_completo, email, senha_hash, cpf, data_nascimento, tipo, especialidade) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    const resultado = inserir.run(
      dados.nome_completo,
      dados.email,
      senhaHash,
      dados.cpf || null,
      dados.data_nascimento || null,
      dados.tipo,
      dados.especialidade || null
    )

    const usuario = banco.prepare('SELECT id, nome_completo, email, tipo FROM usuarios WHERE id = ?').get(resultado.lastInsertRowid)
    const token = criarToken(usuario)

    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário cadastrado com sucesso!',
      dados: { token, usuario }
    })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Login
function login(req, res) {
  const { valido, erros, dados } = validarLogin(req.body)
  if (!valido) return res.status(422).json({ sucesso: false, mensagem: 'Dados inválidos.', erros })

  const ip = req.ip || req.connection?.remoteAddress || ''
  const userAgent = req.headers['user-agent'] || ''

  try {
    const usuario = banco.prepare('SELECT * FROM usuarios WHERE email = ?').get(dados.email)
    if (!usuario || !verificarSenha(dados.senha, usuario.senha_hash)) {
      // Registro de tentativa de login falhou
      banco.prepare(
        'INSERT INTO registros_login (usuario_id, email, sucesso, ip, user_agent) VALUES (?, ?, 0, ?, ?)'
      ).run(usuario ? usuario.id : 0, dados.email, ip, userAgent)
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas.' })
    }
    if (usuario.ativo === 0) {
      // Registro de tentativa com conta desativada
      banco.prepare(
        'INSERT INTO registros_login (usuario_id, email, sucesso, ip, user_agent) VALUES (?, ?, 0, ?, ?)'
      ).run(usuario.id, dados.email, ip, userAgent)
      return res.status(403).json({ sucesso: false, mensagem: 'Conta desativada. Entre em contato com o administrador.' })
    }

    // Registro de login bem-sucedido
    banco.prepare(
      'INSERT INTO registros_login (usuario_id, email, sucesso, ip, user_agent) VALUES (?, ?, 1, ?, ?)'
    ).run(usuario.id, dados.email, ip, userAgent)

    const token = criarToken(usuario)
    res.json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso!',
      dados: {
        token,
        usuario: { id: usuario.id, nome_completo: usuario.nome_completo, email: usuario.email, tipo: usuario.tipo }
      }
    })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Obter perfil do usuário (via query param id ou do token)
function obterPerfil(req, res) {
  try {
    const usuario = banco.prepare(
      'SELECT id, nome_completo, email, cpf, data_nascimento, tipo, especialidade, criado_em FROM usuarios WHERE id = ?'
    ).get(req.usuarioId)

    if (!usuario) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' })
    }

    res.json({ sucesso: true, dados: usuario })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

// Atualizar perfil
function atualizarPerfil(req, res) {
  try {
    const nome = sanitizar(req.body.nome_completo) || ''
    const especialidade = sanitizar(req.body.especialidade || '')
    const dataNascimento = sanitizar(req.body.data_nascimento || '')

    if (nome && nome.length < 3) {
      return res.status(422).json({ sucesso: false, mensagem: 'Nome deve ter no mínimo 3 caracteres.' })
    }

    const atualizar = banco.prepare(
      `UPDATE usuarios SET 
        nome_completo = COALESCE(NULLIF(?, ''), nome_completo), 
        especialidade = COALESCE(NULLIF(?, ''), especialidade), 
        data_nascimento = COALESCE(NULLIF(?, ''), data_nascimento) 
      WHERE id = ?`
    )
    atualizar.run(nome, especialidade, dataNascimento, req.usuarioId)

    const usuario = banco.prepare('SELECT id, nome_completo, email, tipo FROM usuarios WHERE id = ?').get(req.usuarioId)
    res.json({ sucesso: true, mensagem: 'Perfil atualizado com sucesso!', dados: usuario })
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' })
  }
}

module.exports = { registrar, login, obterPerfil, atualizarPerfil }
