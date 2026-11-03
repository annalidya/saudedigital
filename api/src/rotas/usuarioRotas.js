const { Router } = require('express')
const { registrar, login, obterPerfil, atualizarPerfil } = require('../controladores/usuarioControlador')
const { autenticar } = require('../utilitarios/autenticacao')

const rotas = Router()

rotas.post('/usuarios/registro', registrar)
rotas.post('/usuarios/login', login)
rotas.get('/usuarios/perfil', autenticar, obterPerfil)
rotas.put('/usuarios/perfil', autenticar, atualizarPerfil)

module.exports = rotas
