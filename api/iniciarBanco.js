const config = require('./src/config/config')
const banco = require('./src/config/conexaoBanco')
const { criarHash } = require('./src/utilitarios/autenticacao')

banco.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo     TEXT    NOT NULL,
    email             TEXT    NOT NULL UNIQUE,
    senha_hash        TEXT    NOT NULL,
    cpf               TEXT    UNIQUE,
    data_nascimento   TEXT,
    tipo              TEXT    NOT NULL DEFAULT 'paciente'
                          CHECK(tipo IN ('paciente','medico','cuidador','admin')),
    especialidade     TEXT,
    criado_em         TEXT    DEFAULT (datetime('now','localtime')),
    ativo             INTEGER NOT NULL DEFAULT 1
  );
  CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

  CREATE TABLE IF NOT EXISTS exames (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome          TEXT    NOT NULL,
    tipo          TEXT,
    laboratorio   TEXT,
    data_exame    TEXT,
    resultado     TEXT,
    arquivo       TEXT,
    criado_em     TEXT DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_exames_usuario ON exames(usuario_id);

  CREATE TABLE IF NOT EXISTS receitas (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id   INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    medico       TEXT,
    medicamento  TEXT    NOT NULL,
    dosagem      TEXT,
    instrucoes   TEXT,
    data_emissao TEXT,
    validade     TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_receitas_usuario ON receitas(usuario_id);

  CREATE TABLE IF NOT EXISTS consultas (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    medico        TEXT,
    especialidade TEXT,
    data          TEXT,
    local         TEXT,
    observacoes   TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_consultas_usuario ON consultas(usuario_id);

  CREATE TABLE IF NOT EXISTS medicamentos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome        TEXT    NOT NULL,
    dosagem     TEXT,
    inicio      TEXT,
    fim         TEXT,
    ativo       INTEGER DEFAULT 1
  );
  CREATE INDEX IF NOT EXISTS idx_medicamentos_usuario ON medicamentos(usuario_id);

  CREATE TABLE IF NOT EXISTS horarios_medicamento (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    medicamento_id INTEGER NOT NULL REFERENCES medicamentos(id) ON DELETE CASCADE,
    hora           TEXT    NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_horarios_medicamento ON horarios_medicamento(medicamento_id);

  CREATE TABLE IF NOT EXISTS notificacoes (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id     INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    mensagem       TEXT    NOT NULL,
    categoria      TEXT,
    visualizada    INTEGER DEFAULT 0,
    data_hora      TEXT DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON notificacoes(usuario_id);

  CREATE TABLE IF NOT EXISTS sintomas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data        TEXT    NOT NULL,
    tipo        TEXT,
    intensidade INTEGER CHECK(intensidade BETWEEN 1 AND 10),
    descricao   TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_sintomas_usuario ON sintomas(usuario_id);

  CREATE TABLE IF NOT EXISTS compromissos (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo        TEXT    NOT NULL,
    descricao     TEXT,
    data          TEXT    NOT NULL,
    hora          TEXT,
    local         TEXT,
    tipo          TEXT    DEFAULT 'compromisso'
                      CHECK(tipo IN ('compromisso','medico','exame','outro')),
    criado_em     TEXT DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_compromissos_usuario ON compromissos(usuario_id);
  CREATE INDEX IF NOT EXISTS idx_compromissos_data ON compromissos(data);

  CREATE TABLE IF NOT EXISTS lembretes (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo        TEXT    NOT NULL,
    mensagem      TEXT,
    data          TEXT    NOT NULL,
    hora          TEXT,
    recorrente    INTEGER DEFAULT 0
                    CHECK(recorrente IN (0, 1)),
    concluido     INTEGER DEFAULT 0,
    criado_em     TEXT DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_lembretes_usuario ON lembretes(usuario_id);
  CREATE INDEX IF NOT EXISTS idx_lembretes_data ON lembretes(data);

  CREATE TABLE IF NOT EXISTS registros_login (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    email         TEXT    NOT NULL,
    sucesso       INTEGER NOT NULL DEFAULT 1,
    ip            TEXT,
    user_agent    TEXT,
    criado_em     TEXT DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_registros_login_usuario ON registros_login(usuario_id);
  CREATE INDEX IF NOT EXISTS idx_registros_login_data ON registros_login(criado_em);
`)

// Migração de bancos existentes: adiciona coluna 'ativo' e tipo 'admin'
function migrarUsuarios() {
  const colunas = banco.prepare("PRAGMA table_info(usuarios)").all().map(c => c.name)
  const ddl = banco.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='usuarios'").get()

  const temAtivo = colunas.includes('ativo')
  const temAdmin = ddl && ddl.sql.includes("'admin'")

  if (temAtivo && temAdmin) return

  if (!temAdmin) {
    banco.pragma('foreign_keys = OFF')
    banco.prepare(`
      CREATE TABLE IF NOT EXISTS usuarios_novo (
        id                INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_completo     TEXT    NOT NULL,
        email             TEXT    NOT NULL UNIQUE,
        senha_hash        TEXT    NOT NULL,
        cpf               TEXT    UNIQUE,
        data_nascimento   TEXT,
        tipo              TEXT    NOT NULL DEFAULT 'paciente'
                              CHECK(tipo IN ('paciente','medico','cuidador','admin')),
        especialidade     TEXT,
        criado_em         TEXT    DEFAULT (datetime('now','localtime')),
        ativo             INTEGER NOT NULL DEFAULT 1
      )
    `).run()
    banco.prepare(`
      INSERT INTO usuarios_novo (id, nome_completo, email, senha_hash, cpf, data_nascimento, tipo, especialidade, criado_em, ativo)
      SELECT id, nome_completo, email, senha_hash, cpf, data_nascimento, tipo, especialidade, criado_em, COALESCE(${temAtivo ? 'ativo' : '1'}, 1) FROM usuarios
    `).run()
    banco.prepare('DROP TABLE usuarios').run()
    banco.prepare('ALTER TABLE usuarios_novo RENAME TO usuarios').run()
    banco.prepare('CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)').run()
    banco.pragma('foreign_keys = ON')
  } else {
    banco.prepare('ALTER TABLE usuarios ADD COLUMN ativo INTEGER NOT NULL DEFAULT 1').run()
  }
}

// Seed do administrador do sistema
function criarAdministrador() {
  const email = config.ADMIN_EMAIL
  const existe = banco.prepare('SELECT id, tipo FROM usuarios WHERE email = ?').get(email)
  if (existe) {
    if (existe.tipo !== 'admin') {
      banco.prepare("UPDATE usuarios SET tipo = 'admin' WHERE id = ?").run(existe.id)
      console.log('Administrador existente promovido para tipo admin.')
    }
    return
  }

  banco.prepare(
    `INSERT INTO usuarios (nome_completo, email, senha_hash, tipo, especialidade)
     VALUES (?, ?, ?, 'admin', ?)`
  ).run(config.ADMIN_NOME, email, criarHash(config.ADMIN_SENHA), config.ADMIN_ESPECIALIDADE)
}

migrarUsuarios()
criarAdministrador()

console.log('Banco SAFEMED criado/verificado com sucesso.')
module.exports = banco
