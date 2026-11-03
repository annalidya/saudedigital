const { Router } = require('express')
const {
  listarCompromissos,
  cadastrarCompromisso,
  atualizarCompromisso,
  excluirCompromisso,
  listarLembretes,
  cadastrarLembrete,
  atualizarLembrete,
  excluirLembrete
} = require('../controladores/agendaControlador')
const { autenticar } = require('../utilitarios/autenticacao')

const rotas = Router()

// Compromissos
rotas.get('/compromissos', autenticar, listarCompromissos)
rotas.post('/compromissos', autenticar, cadastrarCompromisso)
rotas.put('/compromissos/:id', autenticar, atualizarCompromisso)
rotas.delete('/compromissos/:id', autenticar, excluirCompromisso)

// Lembretes
rotas.get('/lembretes', autenticar, listarLembretes)
rotas.post('/lembretes', autenticar, cadastrarLembrete)
rotas.put('/lembretes/:id', autenticar, atualizarLembrete)
rotas.delete('/lembretes/:id', autenticar, excluirLembrete)

module.exports = rotas
