const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
const config = require('./config')

const pastaDb = path.dirname(config.DB_PATH)
if (!fs.existsSync(pastaDb)) fs.mkdirSync(pastaDb, { recursive: true })

const banco = new Database(config.DB_PATH)

if (config.DB_WAL_MODE) {
  banco.pragma('journal_mode = WAL')
}
if (config.DB_FOREIGN_KEYS) {
  banco.pragma('foreign_keys = ON')
}

const PADROES_INJECAO = [
  /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
  /(UNION\s+(ALL\s+)?SELECT)/i,
  /(;\s*(DROP|DELETE|UPDATE|INSERT|ALTER|TRUNCATE|CREATE|EXEC)\b)/i,
  /(\/\*[\s\S]*?\*\/)/,
  /(--\s)/,
  /(0x[0-9a-fA-F]+)/,
  /(CHAR\s*\(|CONCAT\s*\()/i,
  /(BENCHMARK\s*\()/i,
  /(SLEEP\s*\()/i,
  /(LOAD_FILE\s*\()/i,
  /(INTO\s+(OUTFILE|DUMPFILE))/i
]

function sanitizarEntrada(valor) {
  if (typeof valor !== 'string') return valor
  for (const padrao of PADROES_INJECAO) {
    if (padrao.test(valor)) {
      throw new Error('Entrada rejeitada: padrao suspeito detectado')
    }
  }
  return valor
}

module.exports = banco
module.exports.DB_SECRET_KEY = config.DB_SECRET_KEY
module.exports.sanitizarEntrada = sanitizarEntrada
