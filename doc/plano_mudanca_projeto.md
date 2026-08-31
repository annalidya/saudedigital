# Plano de Mudança do Projeto — SAFEMED

> **Projeto:** Transformação da *Landing Page de Captura de Leads* em um **Prontuário Digital de Saúde (SAFEMED)**, mantendo a arquitetura full stack descrita no `README.md` e a linguagem **JavaScript** (Node.js + Express + SQLite no backend; HTML5 + Tailwind CSS + Vanilla JS no frontend).
>
> **Data de elaboração:** 11/08/2026

---

## 1. Contexto e Objetivo

O repositório atual contém uma **Landing Page de Alta Conversão para captura de leads**, com API RESTful em Node.js/Express e banco SQLite. Porém, toda a documentação acadêmica produzida pela equipe em `doc/doc_projeto/` descreve um produto completamente diferente: o **SAFEMED**, um sistema de saúde digital (prontuário eletrônico) para armazenar exames, receitas, consultas, controle de medicamentos, diário de sintomas e comunicação segura entre pacientes, médicos e cuidadores.

**Objetivo deste plano:** reorientar o projeto existente para implementar o SAFEMED conforme a documentação, **sem trocar a arquitetura nem a linguagem** já consolidadas no `README.md`.

---

## 2. Equipe do Projeto

Integrantes (conforme `Mapa de Empatia - NOMEGRUPO.docx` e `Problema e Solução - NOMEGRUPO.docx`):

- Anderson Bruno
- Anna Lídya Santos
- Eloah Firmo
- Erick Duarte
- Isabelly Alves
- Marcos Stasczak

**Disciplina:** Projeto Integrador e Programação Web I

**Professores:** André Lobo e Carlos David Rocha de Souza

---

## 3. Análise da Documentação Existente

Arquivos analisados em `doc/doc_projeto/`:

### 3.1. `protótipo.pdf` (6 páginas de wireframes)
- Protótipo visual das telas do aplicativo SAFEMED (identidade visual, telas de cadastro, agenda, medicamentos).
- ⚠️ O PDF é composto por imagens (sem texto extraível); as telas devem ser conferidas visualmente e posteriormente convertidas no frontend responsivo.

### 3.2. `Mapa de Empatia - NOMEGRUPO.docx`
Define 4 personas que orientam as decisões de UX:

| Persona | Perfil | Principais dores | Ganhos esperados |
|---|---|---|---|
| **Valéria** | Mulher, 35–45a, contadora, mãe de 2 filhos | Perde exames, esquece consultas, desorganização | Tudo em um só lugar, acesso rápido |
| **Ricardo** | Homem, 40–50a, cuida da saúde do pai idoso | Sobrecarga, conflito de informações entre médicos da família | Compartilhar dados, paz de espírito |
| **Dr. Arnaldo** | Homem, 55a, cardiologista | Históricos incompletos, tempo perdido organizando papéis | Dados estruturados, consultas assertivas |
| **Sr. Alfredo** | Homem, 72a, aposentado (diabetes e hipertensão) | Interface complexa, esquecimento de horários | Independência, interface adaptada (letras grandes) |

### 3.3. `Problema e Solução - NOMEGRUPO.docx`
Correlação problema → solução que define o escopo do produto:

| # | Problema | Solução (SAFEMED) |
|---|---|---|
| 1 | Falta de acesso rápido ao histórico médico | **Prontuário digital** (armazenamento de exames, acesso seguro para médicos e pacientes) |
| 2 | Responsáveis pela saúde de terceiros | **Sistema automatizado de agenda** (alertas, registros de medicação e tratamentos) |
| 3 | Falta de acompanhamento do paciente pós-consulta | **Lembretes de medicação** (acompanhamento do tratamento, notificações de retorno) |

### 3.4. `Requisitos-lista.docx`
Fonte principal dos requisitos que devem ser implementados.

**Funcionais (RF):**
1. **Cadastro e Login Seguro** — autenticação por senha (biometria fica como meta futura), recuperação de senha, verificação de identidade.
2. **Gerenciamento de Informações Médicas** — armazenar exames, receitas e consultas; ordenar por datas e especialidades.
3. **Controle de Medicamentos** — registrar horários e doses; alertas automáticos e notificações; sincronização com calendário do dispositivo.
4. **Diário de Sintomas e Saúde** — anotações sobre dores, febres e outros sintomas; gráficos de evolução; exportar relatórios para consultas.
5. **Integração Externa** — conexão com laboratórios e planos de saúde; backup automático em nuvem; inclusão de familiares ou cuidadores.
   - **Futuro:** IA para detectar padrões de sintomas.

**Não Funcionais (RNF):**
1. Usabilidade — interface intuitiva, linguagem simples, ícones claros, responsividade.
2. Desempenho — resposta rápida, sincronização eficiente.
3. Segurança — criptografia de dados sensíveis, proteção contra acessos não autorizados.
4. Confiabilidade — integridade dos dados, recuperação automática em caso de falha.
5. Portabilidade — disponível para Android e iOS, sincronização entre dispositivos.
6. Manutenibilidade — estrutura para facilitar atualizações, código documentado e escalável.

### 3.5. `Exemplo - Histórias de Usuário - Cooperativa - Ações principais_.docx`
Documento-exemplo (modelo de cooperação fornecido) que mostra o padrão a ser seguido para escrever as **histórias de usuário** do SAFEMED, no formato:
> "Como *[papel]* eu quero *[funcionalidade]*, para isso vou *[fluxo]*." + **REQUISITOS R1, R2, ...** e critérios por etapa.

Esse formato será replicado para cada módulo do SAFEMED (cadastro, prontuário, medicação, agenda, relatórios).

---

## 4. Diagnóstico — Estado Atual vs. Estado Desejado

| Aspecto | Estado atual (Landing de Leads) | Estado desejado (SAFEMED) |
|---|---|---|
| Produto | Captura de leads via formulário | Prontuário digital e gestão de saúde |
| Banco (SQLite) | Tabela `leads` | Múltiplas tabelas de domínio clínico |
| API | `POST/GET /api/leads` + health check | CRUDs de usuários, exames, receitas, consultas, medicamentos, sintomas |
| Frontend | 1 página (`index.html`) | SPA com múltiplas telas/seções (login, dashboard, prontuário, agenda, medicamentos, relatórios) |
| Segurança | Helmet + sanitização | + autenticação (hash de senha), dados sensíveis protegidos |
| Identidade | "MinhaMarca" | **SAFEMED** + créditos à equipe |

---

## 5. O Que Será MANTIDO (Arquitetura e Linguagem)

Decisão: **manter integralmente a arquitetura e a stack** do `README.md`.

- **Backend:** Node.js + Express + **better-sqlite3** + Helmet + CORS + Validator + Dotenv.
- **Frontend:** HTML5 Semântico + Tailwind CSS + JavaScript ES6+ (Vanilla), SPA-like via Fetch API.
- **Banco de dados:** SQLite local, inicialização automática via script `iniciarBanco.js`, WAL habilitado.
- **Padrões de código:** componentes por camada (`config/`, `controladores/`, `rotas/`, `utilitarios/`), responses padronizados (`{ sucesso, mensagem, erros, dados }`), prepared statements e sanitização.

---

## 6. Nova Estrutura de Pastas (proposta)

```text
saudedigital/
├── api/
│   ├── db/                         # Banco SQLite (gerado em runtime)
│   │   └── safemed.db
│   ├── src/
│   │   ├── config/
│   │   │   └── conexaoBanco.js     # mantido (aponta para safemed.db)
│   │   ├── controladores/
│   │   │   ├── usuarioControlador.js       # cadastro, login
│   │   │   ├── prontuarioControlador.js    # exames, receitas, consultas
│   │   │   ├── medicamentoControlador.js   # remédios, horários, lembretes
│   │   │   ├── sintomaControlador.js       # diário de sintomas
│   │   │   ├── mensagemControlador.js      # chat seguro
│   │   │   └── relatorioControlador.js     # relatórios/exportação
│   │   ├── rotas/
│   │   │   ├── usuarioRotas.js
│   │   │   ├── prontuarioRotas.js
│   │   │   ├── medicamentoRotas.js
│   │   │   ├── sintomaRotas.js
│   │   │   ├── mensagemRotas.js
│   │   │   └── relatorioRotas.js
│   │   ├── utilitarios/
│   │   │   ├── validadores.js      # mantido e ampliado
│   │   │   └── autenticacao.js     # NOVO: hash de senha (bcrypt) + JWT/sessão
│   │   ├── app.js                  # mantido (middlewares + estáticos)
│   │   └── server.js               # mantido
│   ├── .env                        # variáveis de ambiente
│   ├── iniciarBanco.js             # DDL de TODAS as tabelas do SAFEMED
│   └── package.json                # + bcryptjs e jsonwebtoken (ou sessões)
│
├── frontend/
│   ├── css/
│   │   └── estilo.css              # mantido
│   ├── js/
│   │   ├── app.js                  # orquestração da SPA (rotas/client-side)
│   │   ├── api.js                  # cliente Fetch genérico
│   │   ├── mascaras.js             # máscaras (CPF, telelefone, datas)
│   │   └── modulos/                # scripts por tela
│   │       ├── auth.js
│   │       ├── prontuario.js
│   │       ├── medicamentos.js
│   │       ├── sintomas.js
│   │       └── chat.js
│   └── index.html + telas (login, dashboard, prontuário, agenda, medicamentos, chat, relatórios) em SPA
│
├── doc/
│   ├── doc_projeto/                # documentação original da equipe
│   └── plano_mudanca_projeto.md    # este documento
│
├── .gitignore
└── README.md                       # será atualizado para descrever o SAFEMED
```

---

## 7. Modelagem do Banco de Dados (proposta para `iniciarBanco.js`)

```sql
-- Usuários (pacientes, médicos e cuidadores/familiares)
CREATE TABLE IF NOT EXISTS usuarios (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo     TEXT    NOT NULL,
    email             TEXT    NOT NULL UNIQUE,
    senha_hash        TEXT    NOT NULL,
    cpf               TEXT    UNIQUE,
    data_nascimento   TEXT,
    tipo              TEXT    NOT NULL DEFAULT 'paciente' -- paciente|medico|cuidador
                          CHECK(tipo IN ('paciente','medico','cuidador')),
    especialidade     TEXT,                              -- quando tipo = 'medico'
    criado_em         TEXT    DEFAULT (datetime('now','localtime'))
);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Exames (prontuário digital)
CREATE TABLE IF NOT EXISTS exames (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome          TEXT    NOT NULL,
    tipo          TEXT,
    laboratorio   TEXT,
    data_exame    TEXT,
    resultado     TEXT,
    arquivo       TEXT,   -- referência a arquivo local (upload)
    criado_em     TEXT DEFAULT (datetime('now','localtime'))
);
CREATE INDEX IF NOT EXISTS idx_exames_usuario ON exames(usuario_id);

-- Receitas (prescrições)
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
CREATE INDEX IF NOT EXISTS idx_consultas_usuario ON consultas(usuario_id);

-- Medicamentos e horários (controle de medicação → lembretes)
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
    hora           TEXT    NOT NULL  -- 'HH:MM'
);
CREATE INDEX IF NOT EXISTS idx_horarios_medicamento ON horarios_medicamento(medicamento_id);

-- Notificações/lembretes gerados
CREATE TABLE IF NOT EXISTS notificacoes (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id     INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    mensagem       TEXT    NOT NULL,
    categoria      TEXT,   -- medicamento|consulta|tratamento
    visualizada    INTEGER DEFAULT 0,
    data_hora      TEXT DEFAULT (datetime('now','localtime'))
);
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON notificacoes(usuario_id);

-- Diário de sintomas
CREATE TABLE IF NOT EXISTS sintomas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data        TEXT    NOT NULL,
    tipo        TEXT,   -- dor, febre, náusea, etc.
    intensidade INTEGER CHECK(intensidade BETWEEN 1 AND 10),
    descricao   TEXT
);
CREATE INDEX IF NOT EXISTS idx_sintomas_usuario ON sintomas(usuario_id);

-- Chat seguro (mensagens criptografadas)
CREATE TABLE IF NOT EXISTS mensagens (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    remetente_id   INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    destinatario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    conteudo       TEXT    NOT NULL,  -- armazenado de forma criptografada
    lida           INTEGER DEFAULT 0,
    enviado_em     TEXT DEFAULT (datetime('now','localtime'))
);
CREATE INDEX IF NOT EXISTS idx_mensagens_dupla ON mensagens(remetente_id, destinatario_id);

-- Compartilhamento/permissões (paciente → médico/cuidador)
CREATE TABLE IF NOT EXISTS permissao_acesso (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    dono_id     INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    acessor_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nivel       TEXT NOT NULL DEFAULT 'leitura' CHECK(nivel IN ('leitura','escrita')),
    expira_em   TEXT,
    criado_em   TEXT DEFAULT (datetime('now','localtime')),
    UNIQUE(dono_id, acessor_id)
);
CREATE INDEX IF NOT EXISTS idx_permissao_dono ON permissao_acesso(dono_id);
```

> ⚠️ A tabela `leads` existente será **removida** (migração opcional mantendo backup).
> Os lembretes de medicamento/consulta serão gerados no servidor ao subir (script que varre `horarios_medicamento`) e consultados pelo frontend.

---

## 8. Novos Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/usuarios/registro` | Cadastro de usuário (paciente/médico/cuidador) |
| `POST` | `/api/usuarios/login` | Login seguro (hash de senha) |
| `POST` | `/api/usuarios/recuperar-senha` | Recuperação de senha (RF1) |
| `GET` | `/api/usuarios/:id` | Dados do perfil |
| `PUT` | `/api/usuarios/:id` | Atualização do perfil |
| `GET` | `/api/exames` / `POST` `/api/exames` | Listar / cadastrar exames (RF2) |
| `GET/POST` | `/api/receitas` | Listar / cadastrar receitas (RF2) |
| `GET/POST` | `/api/consultas` | Listar / cadastrar consultas (RF2) |
| `GET/POST` | `/api/medicamentos` | Listar / cadastrar medicamentos (RF3) |
| `POST` | `/api/medicamentos/:id/horarios` | Registrar horários/doses (RF3) |
| `GET` | `/api/notificacoes` | Listar lembretes e alertas (RF3) |
| `GET/POST` | `/api/sintomas` | Diário de sintomas (RF4) |
| `GET` | `/api/sintomas/relatorio` | Relatório/exportação para consultas (RF4) |
| `GET` | `/api/health` | Health check (mantido) |

---

## 9. Reestruturação do Frontend (SPA)

1. **Login / Cadastro** — formulários com validação client-side, recuperação de senha; telas pensadas para os públicos Valéria, Ricardo, Dr. Arnaldo e Sr. Alfredo (modo "letras grandes" / alto contraste para idosos — RNF1).
2. **Dashboard** — visão geral: próximas consultas, medicamentos do dia, últimos exames e sintomas.
3. **Prontuário Digital** — abas de **exames**, **receitas** e **consultas**, ordenáveis por data e especialidade (RF2); botão de **exportar relatório** (RF4).
4. **Medicamentos** — cadastro de remédios com horários/doses e filtro de ativos; listagens de lembretes (RF3).
5. **Agenda** — alertas de medicação, consultas e tratamentos (RF3 + solução 3 das propostas).
6. **Diário de Sintomas** — registro diário com escala 1–10 e gráfico de evolução (RF4); base para futura IA.
7. **Rodapé / Sobre** — identidade **SAFEMED** com **nome da equipe e integrantes** (Anderson Bruno, Anna Lídya Santos, Eloah Firmo, Erick Duarte, Isabelly Alves e Marcos Stasczak) e disciplina.

---

## 10. Plano de Implementação (Fases)

### Fase 0 — Preparação (curto prazo)
- [ ] Confirmar dados da docência (André Lobo e Carlos David Rocha de Souza) para as entregas.
- [ ] Backup da base atual (`api/db/landing.db`) e dos logs (`server.log`, `server.err`).
- [ ] Renomear pacote no `package.json` para `api-safemed`.
- [ ] Atualizar `.env` e `README.md` com a descrição do SAFEMED + equipe.

### Fase 1 — Backend: base de dados e autenticação
- [ ] Reescrever `api/iniciarBanco.js` com o DDL da seção 7 (remover tabela `leads`).
- [ ] Renomear banco para `safemed.db` em `conexaoBanco.js`.
- [ ] Criar `utilitarios/autenticacao.js` (hash de senha + verificação, sessão/token).
- [ ] Adicionar dependências `bcryptjs` e `jsonwebtoken` (ou `express-session`).
- [ ] Criar `usuarioControlador.js` + `usuarioRotas.js` (registro, login, recuperação, perfil).

### Fase 2 — Backend: módulos de domínio (prontuário, medicação, sintomas)
- [ ] CRUD de exames, receitas e consultas (`prontuarioControlador.js`).
- [ ] CRUD de medicamentos + horários + geração de notificações (`medicamentoControlador.js`).
- [ ] Diário de sintomas + relatório (`sintomaControlador.js`).
- [ ] Registrar endpoints com validação/sanitização (reaproveitando `validadores.js`).

### Fase 3 — Backend: segurança
- [ ] Middleware de autorização nas rotas protegidas.
- [ ] Revisar Helmet/CORS/limite de payload (dados de saúde = dados sensíveis — RNF3).

### Fase 4 — Frontend: SPA SAFEMED
- [ ] Reestruturar `frontend/` em SPA (login, dashboard, prontuário, medicamentos, agenda, sintomas, chat, relatórios).
- [ ] Criar `js/api.js` (cliente Fetch genérico) e `js/mascaras.js`.
- [ ] Implementar telas com Tailwind + componentes; modo alto contraste/letras grandes (Sr. Alfredo).
- [ ] Integrar gráfico de evolução de sintomas (biblioteca leve ou Canvas puro).

### Fase 5 — Qualidade e entregas acadêmicas
- [ ] Escrever **histórias de usuário** no padrão do doc-exemplo (seção 3.5) para cada módulo, com requisitos R1, R2...
- [ ] Atualizar `README.md` (estrutura, endpoints, modelagem, equipe).
- [ ] Testes manuais dos fluxos (cadastro → login → prontuário → medicação → chat).
- [ ] RNFs: responsividade, desempenho, segurança, portabilidade web (preparação para PWA/mobile futuro).

### Fase 6 — Futuro (fora do escopo imediato)
- [ ] Integração com laboratórios/planos de saúde e backup em nuvem (RF6).
- [ ] Autenticação biométrica (RF1).
- [ ] IA para detectar padrões de sintomas.

---

## 11. Riscos e Observações

1. **Professores definidos como André Lobo e Carlos David Rocha de Souza** — conferir com a equipe antes da entrega final.
2. **Prototipo em PDF não possui texto extraível** — as telas precisam ser validadas visualmente pela equipe.
3. **Mudança de domínio** (leads → saúde) exige cuidado com **mais rigor de segurança/privacidade** (LGPD) tanto na documentação quanto na implementação.
4. **Documento-exemplo** de histórias de usuário refere-se a outro produto (cooperativa) — serve apenas como **modelo de formato**, não de conteúdo.
5. **Migração do banco**: a tabela `leads` deixará de existir; recomendam-se backups em cada fase.

---

## 12. Entregáveis Finais do Plano

- [ ] API RESTful SAFEMED completa (Node.js + Express + SQLite) cobrindo RF1–RF4.
- [ ] SPA frontend responsiva com identidade SAFEMED e créditos à equipe.
- [ ] Banco modelado conforme seção 7.
- [ ] `README.md` atualizado (arquitetura mantida + documentação nova).
- [ ] Histórias de usuário no padrão acadêmico.
- [ ] Suporte às personas (UX simples para idosos, dashboards claros para médicos/cuidadores).