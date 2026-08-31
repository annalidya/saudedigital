const { Router } = require('express')
const {
  listarExames,
  cadastrarExame,
  obterExame,
  atualizarExame,
  excluirExame,
  listarReceitas,
  cadastrarReceita,
  atualizarReceita,
  excluirReceita,
  listarConsultas,
  cadastrarConsulta,
  obterConsulta,
  atualizarConsulta,
  excluirConsulta
} = require('../controladores/prontuarioControlador')
const { autenticar } = require('../utilitarios/autenticacao')

const rotas = Router()

// Exames
rotas.get('/exames', autenticar, listarExames)
rotas.post('/exames', autenticar, cadastrarExame)
rotas.get('/exames/:id', autenticar, obterExame)
rotas.put('/exames/:id', autenticar, atualizarExame)
rotas.delete('/exames/:id', autenticar, excluirExame)

// Receitas
rotas.get('/receitas', autenticar, listarReceitas)
rotas.post('/receitas', autenticar, cadastrarReceita)
rotas.put('/receitas/:id', autenticar, atualizarReceita)
rotas.delete('/receitas/:id', autenticar, excluirReceita)

// Consultas
rotas.get('/consultas', autenticar, listarConsultas)
rotas.post('/consultas', autenticar, cadastrarConsulta)
rotas.get('/consultas/:id', autenticar, obterConsulta)
rotas.put('/consultas/:id', autenticar, atualizarConsulta)
rotas.delete('/consultas/:id', autenticar, excluirConsulta)

module.exports = rotas
