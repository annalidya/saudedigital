const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const config = require('./config/config')

const rotasUsuarios = require('./rotas/usuarioRotas')
const rotasProntuario = require('./rotas/prontuarioRotas')
const rotasMedicamentos = require('./rotas/medicamentoRotas')
const rotasSintomas = require('./rotas/sintomaRotas')
const rotasAgenda = require('./rotas/agendaRotas')
const rotasAdmin = require('./rotas/adminRotas')

const app = express()

app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(cors({ origin: config.ORIGEM_PERMITIDA }))
app.use(express.json({ limit: config.BODY_SIZE_LIMIT }))

app.use(express.static(config.FRONTEND_PATH))

app.use('/api', rotasUsuarios)
app.use('/api', rotasProntuario)
app.use('/api', rotasMedicamentos)
app.use('/api', rotasSintomas)
app.use('/api', rotasAgenda)
app.use('/api/admin', rotasAdmin)

app.get('/api/health', (_, res) => res.json({ sucesso: true, mensagem: 'API SAFEMED funcionando!' }))

app.use('/api', (req, res) => {
  res.status(404).json({ sucesso: false, mensagem: 'Rota nao encontrada.' })
})

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile('index.html', { root: config.FRONTEND_PATH })
})

module.exports = app
