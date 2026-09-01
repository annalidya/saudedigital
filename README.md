# SAFEMED — Prontuário Digital de Saúde

> **Projeto Acadêmico:** Sistema de saúde digital full stack para armazenar exames, receitas, consultas, controle de medicamentos, diário de sintomas, agenda com compromissos e lembretes, e painel administrativo.

---

**Instituição:** Instituto Federal de Mato Grosso — IFMT, Campus de Barra do Garças/MT  
**Curso:** Informática — Segundo Ano, Turma A  
**Ano:** 2026  
**Disciplina:** Projeto Integrador e Programação Web I  
**Professores:** André Lobo e Carlos David Rocha de Souza

---

## 📋 Sobre o Projeto

O **SAFEMED** é um prontuário eletrônico de saúde desenvolvido para facilitar o acesso e gerenciamento de informações médicas. O sistema permite armazenar exames, receitas e consultas, controlar medicamentos com lembretes, registrar sintomas diários e acompanhar a evolução da saúde.

### Requisitos Funcionais (RF)

| RF | Descrição | Status |
|---|---|---|
| **RF1** | Cadastro e Login Seguro — autenticação por senha com hash bcrypt e JWT | ✅ Implementado |
| **RF2** | Gerenciamento de Informações Médicas — cadastro e listagem de exames, receitas e consultas | ✅ Implementado |
| **RF3** | Controle de Medicamentos — cadastro de medicamentos com horários e doses individuais | ✅ Implementado |
| **RF4** | Diário de Sintomas — registro diário com escala 1-10, tipo, descrição e gráfico de evolução | ✅ Implementado |
| **RF5** | Integração Externa — conexão com laboratórios e planos de saúde | 🔮 Futuro |
| **RF6** | Backup automático em nuvem | 🔮 Futuro |

### Requisitos Não Funcionais (RNF)

| RNF | Descrição | Status |
|---|---|---|
| **RNF1** | Usabilidade — interface intuitiva, linguagem simples, ícones claros, responsividade | ✅ Implementado |
| **RNF2** | Desempenho — resposta rápida, sincronização eficiente | ✅ Implementado |
| **RNF3** | Segurança — criptografia de dados sensíveis, proteção contra acessos não autorizados | ✅ Implementado |
| **RNF4** | Confiabilidade — integridade dos dados, recuperação automática em caso de falha | ✅ Implementado |
| **RNF5** | Portabilidade — disponível para Android e iOS, sincronização entre dispositivos | 🔮 Futuro |
| **RNF6** | Manutenibilidade — estrutura para facilitar atualizações, código documentado e escalável | ✅ Implementado |

### Funcionalidades Implementadas
1. **Cadastro e Login Seguro** — autenticação por senha com hash bcrypt e JWT
2. **Validação de Formulários** — botões de envio habilitados apenas quando todos os campos obrigatórios estão preenchidos
3. **Gerenciamento de Informações Médicas** — cadastro, listagem, edição e exclusão de exames, receitas e consultas
4. **Controle de Medicamentos** — cadastro de medicamentos com horários e doses individuais
5. **Diário de Sintomas** — registro diário com escala 1-10, tipo, descrição e gráfico de evolução
6. **Relatórios** — geração de relatórios de prontuário, sintomas e medicamentos com impressão
7. **Dashboard** — visão geral com contadores, próximas consultas e medicamentos do dia
8. **Agenda** — calendário mensal com compromissos e lembretes (incluindo recorrentes)
9. **Painel Administrativo** — estatísticas gerais do sistema, gestão de usuários e registros de login
10. **Perfil do Usuário** — visualização e atualização de dados pessoais

### Tipos de Usuário
- **Paciente** — usa o sistema para gerenciar sua saúde
- **Médico** — profissional de saúde com especialidade
- **Cuidador/Familiar** — cuida de um paciente
- **Administrador** — gerencia o sistema e os usuários

### Personas (Usuários-Alvo)

| Persona | Perfil | Necessidade Principal |
|---|---|---|
| **Valéria** | Mulher, 35-45a, contadora, mãe | Organizar exames e consultas da família |
| **Ricardo** | Homem, 40-50a, cuidador do pai | Acompanhar saúde do pai idoso |
| **Dr. Arnaldo** | Homem, 55a, cardiologista | Acessar histórico completo de pacientes |
| **Sr. Alfredo** | Homem, 72a, aposentado | Interface simples com letras grandes |

### Equipe
- Anderson Bruno
- Anna Lídya Santos
- Eloah Firmo
- Erick Duarte
- Isabelly Alves
- Marcos Stasczak

---

## 🖥️ Telas do Frontend (SPA)

| Tela | Rota | Descrição |
|---|---|---|
| **Login** | `#/login` | Formulário de autenticação com email e senha |
| **Cadastro** | `#/cadastro` | Formulário de cadastro com seleção de tipo (paciente/médico/cuidador) |
| **Dashboard** | `#/dashboard` | Visão geral com cards de resumo, consultas e medicamentos |
| **Prontuário** | `#/prontuario` | Abas de exames, receitas e consultas com modais de cadastro/edição |
| **Medicamentos** | `#/medicamentos` | Lista de medicamentos com gerenciamento de horários |
| **Sintomas** | `#/sintomas` | Diário de sintomas com escala 1-10 e gráfico de evolução |
| **Agenda** | `#/agenda` | Calendário mensal, compromissos e lembretes |
| **Relatórios** | `#/relatorios` | Geração e visualização de relatórios por tipo |
| **Administração** | `#/admin` | Painel com estatísticas do sistema (somente admin) |
| **Gestão de Usuários** | `#/admin/usuarios` | Listar, buscar, filtrar, ativar/desativar e excluir (somente admin) |

---

## 🛠️ Tecnologias Utilizadas

### **Backend (API RESTful)**
- **Node.js** — Ambiente de execução JavaScript no servidor
- **Express.js** — Framework web para rotas e middlewares
- **better-sqlite3** — Driver síncrono para banco SQLite
- **bcryptjs** — Hash de senhas com salt
- **jsonwebtoken** — Autenticação via JWT
- **Helmet** — Segurança HTTP
- **CORS** — Cross-Origin Resource Sharing
- **Validator** — Sanitização e validação de dados
- **Dotenv** — Variáveis de ambiente

### **Frontend (SPA)**
- **HTML5 Semântico** — Marcação acessível
- **Tailwind CSS** — Design responsivo
- **JavaScript ES6+ (Vanilla)** — Roteamento client-side e chamadas Fetch

---

## 📁 Estrutura do Projeto

```text
saudedigital/
├── api/                          # Backend Node.js
│   ├── db/                       # Banco SQLite (gerado em runtime)
│   │   └── safemed.db
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.js          # Variáveis de ambiente e configurações centralizadas
│   │   │   └── conexaoBanco.js   # Conexão SQLite
│   │   ├── controladores/
│   │   │   ├── usuarioControlador.js    # Registro, login, perfil
│   │   │   ├── prontuarioControlador.js # Exames, receitas, consultas
│   │   │   ├── medicamentoControlador.js # Medicamentos, horários, notificações
│   │   │   ├── sintomaControlador.js    # Diário de sintomas e relatório
│   │   │   ├── agendaControlador.js     # Compromissos e lembretes
│   │   │   └── adminControlador.js      # Estatísticas, gestão de usuários e registros de login
│   │   ├── rotas/
│   │   │   ├── usuarioRotas.js
│   │   │   ├── prontuarioRotas.js
│   │   │   ├── medicamentoRotas.js
│   │   │   ├── sintomaRotas.js
│   │   │   ├── agendaRotas.js
│   │   │   └── adminRotas.js
│   │   ├── utilitarios/
│   │   │   ├── validadores.js   # Sanitização e validação de dados
│   │   │   └── autenticacao.js  # JWT, hash bcrypt e middlewares
│   │   ├── app.js               # Configuração Express
│   │   └── server.js            # Servidor
│   ├── .env                     # Variáveis de ambiente (não versionar)
│   ├── iniciarBanco.js          # DDL do banco e seeds
│   └── package.json
│
├── frontend/                    # SPA Frontend
│   ├── css/
│   │   └── estilo.css           # Estilos globais
│   ├── js/
│   │   ├── app.js               # Orquestrador SPA e roteador
│   │   ├── api.js               # Cliente Fetch, autenticação e validação de formulários
│   │   ├── mascaras.js          # Máscaras de formulário
│   │   └── modulos/
│   │       ├── login.js         # Tela de login
│   │       ├── cadastro.js      # Tela de cadastro
│   │       ├── dashboard.js     # Dashboard principal
│   │       ├── prontuario.js    # Prontuário digital (exames, receitas, consultas)
│   │       ├── medicamentos.js  # Controle de medicamentos
│   │       ├── sintomas.js      # Diário de sintomas
│   │       ├── agenda.js        # Agenda, compromissos e lembretes
│   │       ├── relatorios.js    # Geração de relatórios
│   │       ├── admin.js         # Painel administrativo
│   │       └── adminUsuarios.js # Gestão de usuários (admin)
│   └── index.html               # Página principal SPA
│
├── doc/                         # Documentação
│   ├── doc_projeto/             # Documentação original
│   ├── plano_mudanca_projeto.md # Plano de mudança
│   ├── plano_frontend_safemed.md # Plano do frontend
│   ├── plano_implementacao_backend.md # Plano do backend
│   └── plano_area_administrativa.md   # Plano da área administrativa
│
├── .gitignore
└── README.md                    # Este arquivo
```

---

## 🗄️ Modelagem do Banco de Dados

```sql
-- Usuários (pacientes, médicos, cuidadores e administradores)
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

-- Exames
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

-- Receitas
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

-- Consultas
CREATE TABLE IF NOT EXISTS consultas (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    medico        TEXT,
    especialidade TEXT,
    data          TEXT,
    local         TEXT,
    observacoes   TEXT
);

-- Medicamentos
CREATE TABLE IF NOT EXISTS medicamentos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome        TEXT    NOT NULL,
    dosagem     TEXT,
    inicio      TEXT,
    fim         TEXT,
    ativo       INTEGER DEFAULT 1
);

-- Horários de medicamento
CREATE TABLE IF NOT EXISTS horarios_medicamento (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    medicamento_id INTEGER NOT NULL REFERENCES medicamentos(id) ON DELETE CASCADE,
    hora           TEXT    NOT NULL
);

-- Notificações
CREATE TABLE IF NOT EXISTS notificacoes (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id     INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    mensagem       TEXT    NOT NULL,
    categoria      TEXT,
    visualizada    INTEGER DEFAULT 0,
    data_hora      TEXT DEFAULT (datetime('now','localtime'))
);

-- Diário de sintomas
CREATE TABLE IF NOT EXISTS sintomas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data        TEXT    NOT NULL,
    tipo        TEXT,
    intensidade INTEGER CHECK(intensidade BETWEEN 1 AND 10),
    descricao   TEXT
);

-- Compromissos (Agenda)
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

-- Lembretes
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

-- Registros de Login
CREATE TABLE IF NOT EXISTS registros_login (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    email         TEXT    NOT NULL,
    sucesso       INTEGER NOT NULL DEFAULT 1,
    ip            TEXT,
    user_agent    TEXT,
    criado_em     TEXT DEFAULT (datetime('now','localtime'))
);
```

### Índices de Performance

```sql
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_exames_usuario ON exames(usuario_id);
CREATE INDEX IF NOT EXISTS idx_receitas_usuario ON receitas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_consultas_usuario ON consultas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_medicamentos_usuario ON medicamentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_horarios_medicamento ON horarios_medicamento(medicamento_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sintomas_usuario ON sintomas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_compromissos_usuario ON compromissos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_compromissos_data ON compromissos(data);
CREATE INDEX IF NOT EXISTS idx_lembretes_usuario ON lembretes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_lembretes_data ON lembretes(data);
CREATE INDEX IF NOT EXISTS idx_registros_login_usuario ON registros_login(usuario_id);
CREATE INDEX IF NOT EXISTS idx_registros_login_data ON registros_login(criado_em);
```

---

## 🚀 Endpoints da API

### Autenticação
| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/usuarios/registro` | Cadastrar novo usuário |
| `POST` | `/api/usuarios/login` | Login (retorna JWT) |
| `GET` | `/api/usuarios/perfil` | Obter perfil (requer auth) |
| `PUT` | `/api/usuarios/perfil` | Atualizar perfil (requer auth) |

### Prontuário
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/exames` | Listar exames do usuário |
| `POST` | `/api/exames` | Cadastrar exame |
| `GET` | `/api/exames/:id` | Obter exame específico |
| `PUT` | `/api/exames/:id` | Atualizar exame |
| `DELETE` | `/api/exames/:id` | Excluir exame |
| `GET` | `/api/receitas` | Listar receitas do usuário |
| `POST` | `/api/receitas` | Cadastrar receita |
| `PUT` | `/api/receitas/:id` | Atualizar receita |
| `DELETE` | `/api/receitas/:id` | Excluir receita |
| `GET` | `/api/consultas` | Listar consultas do usuário |
| `POST` | `/api/consultas` | Cadastrar consulta |
| `GET` | `/api/consultas/:id` | Obter consulta específica |
| `PUT` | `/api/consultas/:id` | Atualizar consulta |
| `DELETE` | `/api/consultas/:id` | Excluir consulta |

### Medicamentos
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/medicamentos` | Listar medicamentos |
| `POST` | `/api/medicamentos` | Cadastrar medicamento |
| `PUT` | `/api/medicamentos/:id` | Atualizar medicamento |
| `DELETE` | `/api/medicamentos/:id` | Excluir medicamento |
| `POST` | `/api/medicamentos/:id/horarios` | Adicionar horário |
| `GET` | `/api/medicamentos/:id/horarios` | Listar horários |
| `DELETE` | `/api/medicamentos/:id/horarios/:horarioId` | Excluir horário |
| `GET` | `/api/notificacoes` | Listar notificações |

### Sintomas
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/sintomas` | Listar sintomas |
| `POST` | `/api/sintomas` | Cadastrar sintoma |
| `PUT` | `/api/sintomas/:id` | Atualizar sintoma |
| `DELETE` | `/api/sintomas/:id` | Excluir sintoma |
| `GET` | `/api/sintomas/relatorio` | Relatório com estatísticas |

### Agenda (Compromissos e Lembretes)
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/compromissos` | Listar compromissos |
| `POST` | `/api/compromissos` | Cadastrar compromisso |
| `PUT` | `/api/compromissos/:id` | Atualizar compromisso |
| `DELETE` | `/api/compromissos/:id` | Excluir compromisso |
| `GET` | `/api/lembretes` | Listar lembretes |
| `POST` | `/api/lembretes` | Cadastrar lembrete |
| `PUT` | `/api/lembretes/:id` | Atualizar lembrete |
| `DELETE` | `/api/lembretes/:id` | Excluir lembrete |

### Administração (requer token de usuário `admin`)
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/admin/estatisticas` | Estatísticas gerais do sistema |
| `GET` | `/api/admin/usuarios` | Listar usuários (busca `?busca=` e filtro `?tipo=`) |
| `GET` | `/api/admin/usuarios/:id` | Obter detalhe de um usuário |
| `PUT` | `/api/admin/usuarios/:id/status` | Ativar/desativar usuário |
| `DELETE` | `/api/admin/usuarios/:id` | Excluir usuário |
| `GET` | `/api/admin/registros-login` | Listar registros de login (filtro `?sucesso=`) |

### Health Check
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/health` | Status da API |

---

## 🔧 Como Executar

### Pré-requisitos
- **Node.js** v18 ou superior
- **npm**

### Instalação

1. **Clonar o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd saudedigital
   ```

2. **Instalar dependências do backend:**
   ```bash
   cd api
   npm install
   ```

3. **Configurar variáveis de ambiente:**
   Crie um arquivo `.env` na pasta `api/` com as seguintes variáveis:
   ```env
   # Servidor
   PORT=3000
   ORIGEM_PERMITIDA=*
   BODY_SIZE_LIMIT=10kb
   FRONTEND_PATH=../../frontend

   # Autenticação
   JWT_SECRET=<sua-chave-secreta-forte>
   JWT_EXPIRA_EM=24h
   BCRYPT_SALT_ROUNDS=10

   # Banco de Dados
   DB_DRIVER=better-sqlite3
   DB_PATH=./db/safemed.db
   DB_WAL_MODE=on
   DB_FOREIGN_KEYS=on
   DB_SECRET_KEY=<chave-aleatoria-minimo-24-caracteres>

   # Administrador Inicial
   ADMIN_EMAIL=admin@safemed.com
   ADMIN_SENHA=<senha-forte-do-admin>
   ADMIN_NOME=Administrador SAFEMED
   ADMIN_ESPECIALIDADE=Administrador do Sistema

   # Paginação
   DEFAULT_PAGE_SIZE=20
   MAX_PAGE_SIZE=100

   # Notificações
   NOTIFICATION_LIMIT=50
   ```
   > **Importante:** Nunca compartilhe sua `JWT_SECRET` e `DB_SECRET_KEY`. Gere chaves fortes e únicas para cada ambiente. Para gerar `DB_SECRET_KEY`: `openssl rand -hex 32`.

4. **Inicializar o banco de dados:**
   ```bash
   npm run init-db
   ```

5. **Iniciar o servidor:**
   ```bash
   npm run dev
   ```

6. **Acessar a aplicação:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API Health: [http://localhost:3000/api/health](http://localhost:3000/api/health)

### Parar o Servidor
Pressione `Ctrl + C` no terminal.

### Comandos Disponíveis
```bash
cd api
npm install        # Instalar dependências
npm run dev        # Iniciar em modo desenvolvimento (com watch)
npm run init-db    # Reinicializar banco de dados
npm start          # Iniciar em modo produção
```

---

## 👥 Usuário Administrador

O sistema cria automaticamente um usuário administrador ao inicializar o banco de dados:

| Campo | Valor |
|---|---|
| **Tipo** | Administrador (`admin`) |
| **Nome** | Administrador SAFEMED |

> **Importante:** Ao primeiro acesso, altere a senha padrão do administrador por uma senha segura. O acesso ao painel administrativo é restrito a usuários com tipo `admin`.

---

## 📊 Dados Atuais do Sistema

Snapshot do banco de dados `safemed.db`:

| Módulo | Quantidade |
|---|---|
| Usuários cadastrados | 2 |
| Exames | 0 |
| Receitas | 0 |
| Consultas | 0 |
| Medicamentos | 2 |
| Horários de medicação | 0 |
| Sintomas registrados | 0 |
| Compromissos | 0 |
| Lembretes | 0 |
| Notificações | 0 |
| Registros de login | 4 |

---

## 🧪 Testes da API

Todos os endpoints foram testados e validados:

```bash
# Health Check
curl http://localhost:3000/api/health

# Cadastro de usuário
curl -X POST http://localhost:3000/api/usuarios/registro \
  -H "Content-Type: application/json" \
  -d '{"nome_completo":"João Silva","email":"joao@email.com","senha":"123456","tipo":"paciente"}'

# Login
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","senha":"123456"}'

# Cadastrar exame (requer token)
curl -X POST http://localhost:3000/api/exames \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"nome":"Hemograma","tipo":"sangue","data_exame":"2026-08-11"}'

# Cadastrar compromisso (requer token)
curl -X POST http://localhost:3000/api/compromissos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"titulo":"Consulta Cardiologista","data":"2026-09-15","hora":"14:00","tipo":"medico"}'

# Listar registros de login (requer token de admin)
curl http://localhost:3000/api/admin/registros-login \
  -H "Authorization: Bearer <TOKEN_ADMIN>"
```

---

## 🛡️ Segurança

- **Hash de Senhas:** bcryptjs com 10 salt rounds
- **Autenticação JWT:** Tokens com expiração configurável via variável de ambiente
- **Prepared Statements:** Proteção contra SQL Injection
- **Sanitização:** Limpeza de todos os inputs com validator (trim + escape)
- **Validação de Dados:** Validação obrigatória no backend para todos os endpoints de escrita
- **Validação de Formulários:** Botões de envio habilitados apenas quando campos obrigatórios estão preenchidos (frontend)
- **Controle de acesso:** endpoints `/api/admin/*` restritos a usuários `admin`; contas desativadas não logam nem usam a API
- **Helmet:** Cabeçalhos HTTP de segurança
- **CORS:** Controle de acesso cross-origin configurável
- **Payload Limit:** Limite de 10kb por requisição
- **Registro de Login:** Tentativas de login (sucesso e falha) são registradas com IP e user-agent
- **Proteção contra auto-exclusão:** Administrador não pode excluir ou desativar a própria conta

---

## 📱 Responsividade

O frontend é desenvolvido com design mobile-first usando Tailwind CSS, garantindo experiência em:
- Smartphones
- Tablets
- Desktops

### Acessibilidade
- Modo de alto contraste
- Letras grandes para idosos
- Navegação por teclado

---

## 📄 Documentação

- `doc/plano_mudanca_projeto.md` — Plano de mudança do projeto
- `doc/plano_frontend_safemed.md` — Plano de implementação do frontend
- `doc/plano_implementacao_backend.md` — Plano de implementação do backend
- `doc/plano_area_administrativa.md` — Plano da área administrativa
- `doc/doc_projeto/` — Documentação original da equipe

---

## 📜 Licença

Projeto desenvolvido para fins acadêmicos e educacionais.

---

**SAFEMED** — Prontuário Digital de Saúde  
Equipe SAFEMED | Projeto Integrador e Programação Web I
