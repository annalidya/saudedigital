const { Router } = require('express')
const {
  listarMedicamentos,
  cadastrarMedicamento,
  adicionarHorario,
  listarHorarios,
  listarNotificacoes,
  atualizarMedicamento,
  excluirMedicamento,
  excluirHorario
} = require('../controladores/medicamentoControlador')
const { autenticar } = require('../utilitarios/autenticacao')

const rotas = Router()

rotas.get('/medicamentos', autenticar, listarMedicamentos)
rotas.post('/medicamentos', autenticar, cadastrarMedicamento)
rotas.put('/medicamentos/:id', autenticar, atualizarMedicamento)
rotas.delete('/medicamentos/:id', autenticar, excluirMedicamento)
rotas.post('/medicamentos/:id/horarios', autenticar, adicionarHorario)
rotas.get('/medicamentos/:id/horarios', autenticar, listarHorarios)
rotas.delete('/medicamentos/:id/horarios/:horarioId', autenticar, excluirHorario)
rotas.get('/notificacoes', autenticar, listarNotificacoes)

module.exports = rotas
