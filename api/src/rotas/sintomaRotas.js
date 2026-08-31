const { Router } = require('express')
const {
  listarSintomas,
  cadastrarSintoma,
  relatorioSintomas,
  atualizarSintoma,
  excluirSintoma
} = require('../controladores/sintomaControlador')
const { autenticar } = require('../utilitarios/autenticacao')

const rotas = Router()

rotas.get('/sintomas', autenticar, listarSintomas)
rotas.post('/sintomas', autenticar, cadastrarSintoma)
rotas.get('/sintomas/relatorio', autenticar, relatorioSintomas)
rotas.put('/sintomas/:id', autenticar, atualizarSintoma)
rotas.delete('/sintomas/:id', autenticar, excluirSintoma)

module.exports = rotas
