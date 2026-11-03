const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { banco } = require('../config/conexaoBanco')

function criarHash(senha) {
  return bcrypt.hashSync(senha, config.BCRYPT_SALT_ROUNDS)
}

function verificarSenha(senha, hash) {
  return bcrypt.compareSync(senha, hash)
}

function criarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRA_EM }
  )
}

function autenticar(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ sucesso: false, mensagem: 'Token de autenticacao nao informado.' })
  }

  try {
    const dados = jwt.verify(token, config.JWT_SECRET)
    const usuario = banco.prepare(
      'SELECT id, nome_completo, email, tipo, ativo FROM usuarios WHERE id = ?'
    ).get(dados.id)

    if (!usuario || usuario.ativo === 0) {
      return res.status(403).json({ sucesso: false, mensagem: 'Conta desativada ou nao encontrada.' })
    }

    req.usuario = usuario
    req.usuarioId = usuario.id
    next()
  } catch {
    return res.status(401).json({ sucesso: false, mensagem: 'Token invalido ou expirado.' })
  }
}

function autorizarAdmin(req, res, next) {
  if (!req.usuario || req.usuario.tipo !== 'admin') {
    return res.status(403).json({ sucesso: false, mensagem: 'Acesso restrito ao administrador.' })
  }
  next()
}

module.exports = { criarHash, verificarSenha, criarToken, autenticar, autorizarAdmin }
