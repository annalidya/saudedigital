const app = require('./app')
const config = require('./config/config')

require('../iniciarBanco')

app.listen(config.PORT, () => console.log(`Servidor SAFEMED rodando na porta ${config.PORT}`))
