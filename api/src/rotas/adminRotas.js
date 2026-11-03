const { Router } = require('express')
const { autenticar, autorizarAdmin } = require('../utilitarios/autenticacao')
const {
  estatisticasSistema,
  listarUsuarios,
  obterUsuario,
  alterarStatusUsuario,
  removerUsuario,
  listarRegistrosLogin
} = require('../controladores/adminControlador')

const rotas = Router()

rotas.use(autenticar, autorizarAdmin)

rotas.get('/estatisticas', estatisticasSistema)
rotas.get('/usuarios', listarUsuarios)
rotas.get('/usuarios/:id', obterUsuario)
rotas.put('/usuarios/:id/status', alterarStatusUsuario)
rotas.delete('/usuarios/:id', removerUsuario)
rotas.get('/registros-login', listarRegistrosLogin)

module.exports = rotas