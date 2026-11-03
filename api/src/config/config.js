const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const obrigatorio = [
  'PORT', 'JWT_SECRET', 'JWT_EXPIRA_EM', 'ORIGEM_PERMITIDA',
  'DB_DRIVER', 'DB_PATH', 'DB_WAL_MODE', 'DB_FOREIGN_KEYS', 'DB_SECRET_KEY',
  'ADMIN_EMAIL', 'ADMIN_SENHA', 'ADMIN_NOME', 'ADMIN_ESPECIALIDADE',
  'BCRYPT_SALT_ROUNDS', 'BODY_SIZE_LIMIT', 'FRONTEND_PATH',
  'DEFAULT_PAGE_SIZE', 'MAX_PAGE_SIZE', 'NOTIFICATION_LIMIT'
]

const ausentes = obrigatorio.filter(v => !process.env[v])
if (ausentes.length > 0) {
  throw new Error(`Variaveis de ambiente obrigatorias ausentes no .env: ${ausentes.join(', ')}`)
}

if (process.env.DB_SECRET_KEY.length < 24) {
  throw new Error('DB_SECRET_KEY deve ter no minimo 24 caracteres. Gere com: openssl rand -hex 32')
}

const config = {
  PORT: parseInt(process.env.PORT, 10),
  ORIGEM_PERMITIDA: process.env.ORIGEM_PERMITIDA,
  BODY_SIZE_LIMIT: process.env.BODY_SIZE_LIMIT,
  FRONTEND_PATH: path.resolve(__dirname, '../..', process.env.FRONTEND_PATH),

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRA_EM: process.env.JWT_EXPIRA_EM,
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10),

  DB_DRIVER: process.env.DB_DRIVER,
  DB_PATH: path.resolve(__dirname, '../..', process.env.DB_PATH),
  DB_WAL_MODE: process.env.DB_WAL_MODE === 'on',
  DB_FOREIGN_KEYS: process.env.DB_FOREIGN_KEYS === 'on',
  DB_SECRET_KEY: process.env.DB_SECRET_KEY,

  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_SENHA: process.env.ADMIN_SENHA,
  ADMIN_NOME: process.env.ADMIN_NOME,
  ADMIN_ESPECIALIDADE: process.env.ADMIN_ESPECIALIDADE,

  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE, 10),
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE, 10),
  NOTIFICATION_LIMIT: parseInt(process.env.NOTIFICATION_LIMIT, 10)
}

module.exports = config
