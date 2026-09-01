# SAFEMED — Especificação de Requisitos de Sistema

> **Norma de Referência:** ISO/IEC/IEEE 29148:2024 (Requisitos de Software)  
> **Modelo de Qualidade:** ISO/IEC 25010:2023 (Qualidade de Produto de Software)  
> **Notação:** UML 2.5.1 / UML 2.6 (OMG 2024)  
> **Tipo de Documento:** Requisitos de Sistema (Software System Requirements Specification — SRS)  
> **Complementa:** `requisitos_usuario.md` (Requisitos de Usuário)

---

**Projeto:** SAFEMED — Prontuário Digital de Saúde  
**Instituição:** Instituto Federal de Mato Grosso — IFMT, Campus de Barra do Garças/MT  
**Curso:** Informática — Segundo Ano, Turma A  
**Ano:** 2026  
**Disciplina:** Projeto Integrador e Programação Web I  
**Professores:** André Lobo e Carlos David Rocha de Souza  
**Equipe:** Anderson Bruno, Anna Lídya Santos, Eloah Firmo, Erick Duarte, Isabelly Alves, Marcos Stasczak

---

## 1. Introdução

### 1.1 Propósito

Este documento especifica os requisitos de nível de sistema do SAFEMED, traduzindo os requisitos de usuário (`requisitos_usuario.md`) em especificações técnicas de implementação. Enquanto os requisitos de usuário descrevem O QUE o sistema deve fazer, este documento descreve COM O SISTEMA deve ser construído.

### 1.2 Escopo do Documento

| Tipo de Requisito | Documento de Origem | Quantidade |
|---|---|---|
| Requisitos de Usuário (RF) | `requisitos_usuario.md` | RF01–RF15 |
| Requisitos de Usuário (RNF) | `requisitos_usuario.md` | RNF01–RNF20 |
| Requisitos de Sistema (SR) | Este documento | SR01–SR35 |
| Requisitos de Interface (IR) | Este documento | IR01–IR12 |
| Requisitos de Dados (DR) | Este documento | DR01–DR14 |

### 1.3 Referências

| Documento | Descrição |
|---|---|
| `requisitos_usuario.md` | Requisitos de usuário do SAFEMED |
| `README.md` | Documentação principal do projeto |
| ISO/IEC/IEEE 29148:2024 | Engenharia de requisitos |
| ISO/IEC 25010:2023 | Modelo de qualidade de software |
| UML 2.5.1 / 2.6 (OMG 2024) | Linguagem de modelagem unificada |
| RFC 7519 | JSON Web Token |
| RFC 7231 | HTTP/1.1 Semantics and Content |
| RFC 7617 | Basic HTTP Authentication |

---

## 2. Arquitetura do Sistema

### 2.1 Visão Geral Arquitetural

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          <<system>>                                     │
│                           SAFEMED                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    <<layer>>                                     │    │
│  │                 Apresentação (Frontend)                          │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │    │
│  │  │  HTML5   │ │ Tailwind │ │ JS ES6+  │ │ Roteador SPA     │   │    │
│  │  │Semântico │ │   CSS    │ │ Vanilla  │ │ (Hash-based)     │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │    │
│  └─────────────────────────┬───────────────────────────────────────┘    │
│                            │ HTTP/HTTPS (Fetch API)                     │
│                            ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    <<layer>>                                     │    │
│  │                 Aplicação (Backend API)                          │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │    │
│  │  │ Express  │ │ Middlewares│ │ Rotas   │ │ Controladores    │   │    │
│  │  │  Router  │ │(Auth,CORS)│ │ REST    │ │ (Business Logic) │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────────────────┐    │    │
│  │  │Validadores│ │Autenticação│ │ Config (ENV)              │    │    │
│  │  │Sanitização│ │JWT/bcrypt │ │ Variáveis de ambiente     │    │    │
│  │  └──────────┘ └──────────┘ └──────────────────────────────┘    │    │
│  └─────────────────────────┬───────────────────────────────────────┘    │
│                            │ better-sqlite3 (síncrono)                  │
│                            ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    <<layer>>                                     │    │
│  │                 Persistência (Database)                          │    │
│  │  ┌──────────────────────────────────────────────────────────┐   │    │
│  │  │                  SQLite (WAL Mode)                        │   │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │   │    │
│  │  │  │ usuarios │ │  exames  │ │ receitas │ │consultas │    │   │    │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │   │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │   │    │
│  │  │  │medicament│ │horarios  │ │sintomas  │ │compromiss│    │   │    │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │   │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐     │   │    │
│  │  │  │lembretes │ │notificac │ │registros_login       │     │   │    │
│  │  │  └──────────┘ └──────────┘ └──────────────────────┘     │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Padrão Arquitetural

| Aspecto | Especificação |
|---|---|
| **Padrão** | MVC (Model-View-Controller) adaptado para SPA + API RESTful |
| **Estilo da API** | REST (Representational State Transfer) |
| **Comunicação** | HTTP/1.1 com JSON como formato de dados |
| **Autenticação** | JWT (JSON Web Token) — stateless |
| **Controle de Acesso** | RBAC (Role-Based Access Control) — 4 papéis |
| **Banco de Dados** | SQLite com better-sqlite3 (síncrono) |
| **Modo de Journaling** | WAL (Write-Ahead Logging) |

### 2.3 Decomposição em Camadas

```
┌─────────────────────────────────────────────────────────────┐
│ Camada              │ Tecnologia        │ Responsabilidade  │
├─────────────────────┼───────────────────┼───────────────────┤
│ Apresentação        │ HTML5/Tailwind/JS │ UI/UX, Roteamento │
│ Aplicação           │ Express.js        │ API, Middlewares  │
│ Negócio             │ Controladores     │ Regras de Negócio │
│ Persistência        │ better-sqlite3    │ CRUD, Transações  │
│ Infraestrutura      │ Node.js           │ Runtime, FS       │
└─────────────────────┴───────────────────┴───────────────────┘
```

---

## 3. Requisitos de Arquitetura (SR)

### SR01 — Arquitetura Backend

| Campo | Valor |
|---|---|
| **ID** | SR01 |
| **Título** | Arquitetura da Camada de Aplicação |
| **Prioridade** | Alta |
| **RF/RNF de Origem** | RNF17 (Modularidade), RNF18 (Reusabilidade) |
| **Descrição** | O backend deve seguir o padrão MVC com separação em: config (configurações), controladores (lógica de negócio), rotas (definição de endpoints), utilitários (funções compartilhadas) |
| **Componentes** | `config/`, `controladores/`, `rotas/`, `utilitarios/` |
| **Dependências** | express, cors, helmet, better-sqlite3, bcryptjs, jsonwebtoken, validator, dotenv |

### SR02 — Arquitetura Frontend

| Campo | Valor |
|---|---|
| **ID** | SR02 |
| **Título** | Arquitetura da Camada de Apresentação |
| **Prioridade** | Alta |
| **RF/RNF de Origem** | RNF06 (Usabilidade), RNF20 (Portabilidade) |
| **Descrição** | O frontend deve ser uma SPA (Single Page Application) com roteamento client-side baseado em hash (`#/rota`). Cada tela deve ser um módulo JavaScript independente carregado dinamicamente via `import()` |
| **Componentes** | `app.js` (orquestrador), `api.js` (cliente HTTP), `mascaras.js`, `modulos/*.js` (10 telas) |
| **Padrão de Módulos** | Cada módulo exporta `default(usuario)` para renderização e `inicializar(usuario)` para eventos |

### SR03 — Padrão de Rotas REST

| Campo | Valor |
|---|---|
| **ID** | SR03 |
| **Título** | Convenção de Endpoints da API |
| **Prioridade** | Alta |
| **RF/RNF de Origem** | Todos os RF |
| **Descrição** | Todos os endpoints devem seguir o padrão RESTful com prefixo `/api` |
| **Convenção** | `GET /api/{recurso}` (listar), `GET /api/{recurso}/:id` (obter), `POST /api/{recurso}` (criar), `PUT /api/{recurso}/:id` (atualizar), `DELETE /api/{recurso}/:id` (excluir) |
| **Exceção** | Recursos aninhados: `POST /api/medicamentos/:id/horarios` |

### SR04 — Middleware de Autenticação

| Campo | Valor |
|---|---|
| **ID** | SR04 |
| **Título** | Middleware JWT |
| **Prioridade** | Alta |
| **RF/RNF de Origem** | RF02, RNF15 (Responsabilidade), RNF16 (Controle de Acesso) |
| **Descrição** | O middleware `autenticar` deve: (1) extrair token do header `Authorization: Bearer <token>`, (2) verificar validade com `jwt.verify()`, (3) buscar usuário no banco, (4) verificar se está ativo, (5) popular `req.usuario` e `req.usuarioId` |
| **Rejeição** | Token ausente → 401. Token inválido/expirado → 401. Conta desativada → 403 |

### SR05 — Middleware de Autorização Admin

| Campo | Valor |
|---|---|
| **ID** | SR05 |
| **Título** | Middleware RBAC Admin |
| **Prioridade** | Alta |
| **RF/RNF de Origem** | RF12, RF13, RF14, RNF16 (Controle de Acesso) |
| **Descrição** | O middleware `autorizarAdmin` deve verificar se `req.usuario.tipo === 'admin'`. Deve ser encadeado após `autenticar` nos endpoints administrativos |
| **Rejeição** | Usuário não é admin → 403 "Acesso restrito ao administrador." |

### SR06 — Padrão de Validação e Sanitização

| Campo | Valor |
|---|---|
| **ID** | SR06 |
| **Título** | Validação de Entrada |
| **Prioridade** | Alta |
| **RF/RNF de Origem** | RF15, RNF13 (Integridade) |
| **Descrição** | Todos os dados de entrada devem passar por sanitização (trim + escape via `validator`) e validação (regras de negócio). Funções utilitárias: `sanitizar()`, `validarUsuario()`, `validarLogin()`, `validarExame()`, `validarReceita()`, `validarConsulta()`, `validarMedicamento()`, `validarHorario()`, `validarSintoma()` |
| **Retorno** | `{ valido: boolean, erros: string[], dados: object }` |

### SR07 — Padrão de Respostas da API

| Campo | Valor |
|---|---|
| **ID** | SR07 |
| **Título** | Formato de Respostas HTTP |
| **Prioridade** | Alta |
| **RF/RNF de Origem** | RNF04 (Desempenho) |
| **Descrição** | Todas as respostas devem seguir o formato JSON padronizado |
| **Formato Sucesso** | `{ sucesso: true, mensagem: string, dados: object }` |
| **Formato Erro** | `{ sucesso: false, mensagem: string, erros?: string[] }` |
| **Formato Lista** | `{ sucesso: true, dados: object[], paginacao?: { pagina, por_pagina, total, total_paginas } }` |

### SR08 — Padrão de Erros HTTP

| Campo | Valor |
|---|---|
| **ID** | SR08 |
| **Título** | Mapeamento de Códigos HTTP |
| **Prioridade** | Média |
| **RF/RNF de Origem** | Todos os RF |
| **Descrição** | O sistema deve retornar os códigos HTTP conforme a situação |

| Código | Uso |
|---|---|
| `200` | Operação bem-sucedida (GET, PUT, DELETE) |
| `201` | Recurso criado com sucesso (POST) |
| `401` | Não autenticado (token ausente, inválido ou expirado) |
| `403` | Não autorizado (conta desativada, tipo de usuário insuficiente) |
| `404` | Recurso não encontrado |
| `409` | Conflito (ex: e-mail já cadastrado) |
| `422` | Dados de entrada inválidos (validação) |
| `404` (rota) | Rota da API não encontrada |
| `500` | Erro interno do servidor |

### SR09 — Configuração via Variáveis de Ambiente

| Campo | Valor |
|---|---|
| **ID** | SR09 |
| **Título** | Centralização de Configuração |
| **Prioridade** | Alta |
| **RF/RNF de Origem** | RNF17 (Modularidade) |
| **Descrição** | Todas as configurações devem ser carregadas de variáveis de ambiente via `dotenv`. O arquivo `config.js` deve centralizar e validar todas as variáveis obrigatórias |
| **Variáveis Obrigatórias** | PORT, JWT_SECRET, JWT_EXPIRA_EM, ORIGEM_PERMITIDA, DB_DRIVER, DB_PATH, DB_WAL_MODE, DB_FOREIGN_KEYS, DB_SECRET_KEY, ADMIN_EMAIL, ADMIN_SENHA, ADMIN_NOME, ADMIN_ESPECIALIDADE, BCRYPT_SALT_ROUNDS, BODY_SIZE_LIMIT, FRONTEND_PATH, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, NOTIFICATION_LIMIT |
| **Validação** | Lançar erro no startup se qualquer variável obrigatória estiver ausente |

### SR10 — Configuração do Banco de Dados

| Campo | Valor |
|---|---|
| **ID** | SR10 |
| **Título** | Inicialização e Migração do SQLite |
| **Prioridade** | Alta |
| **RF/RNF de Origem** | RNF10 (Tolerância a Falhas), RNF11 (Recuperação) |
| **Descrição** | O script `iniciarBanco.js` deve: (1) criar todas as tabelas com `CREATE TABLE IF NOT EXISTS`, (2) criar indexes de performance, (3) executar migrações de bancos existentes (coluna `ativo`, tipo `admin`), (4) criar usuário administrador padrão |
| **Modo WAL** | Habilitar `PRAGMA journal_mode = WAL` para recuperação automática |
| **Foreign Keys** | Habilitar `PRAGMA foreign_keys = ON` para integridade referencial |

### SR11 — Segurança da Camada de Rede

| Campo | Valor |
|---|---|
| **ID** | SR11 |
| **Título** | Middlewares de Segurança HTTP |
| **Prioridade** | Alta |
| **RF/RNF de Origem** | RNF12 (Confidencialidade), RNF13 (Integridade) |
| **Descrição** | O Express deve utilizar: Helmet (cabeçalhos HTTP de segurança), CORS (controle de origem), limit de payload (10kb) |
| **Configuração Helmet** | `contentSecurityPolicy: false` (SPA com inline scripts) |
| **Configuração CORS** | `origin: config.ORIGEM_PERMITIDA` |

### SR12 — Proteção contra SQL Injection

| Campo | Valor |
|---|---|
| **ID** | SR12 |
| **Título** | Defesa contra Injeção SQL |
| **Prioridade** | Alta |
| **RF/RNF de Origem** | RNF13 (Integridade) |
| **Descrição** | O sistema deve implementar duas camadas de proteção: (1) Prepared Statements em todas as queries (better-sqlite3), (2) Detecção de padrões suspeitos no nível de conexão |
| **Padrões Detectados** | `OR/AND 1=1`, `UNION SELECT`, `DROP/DELETE/UPDATE/INSERT`, `/* */`, `--`, `0x...`, `CHAR()/CONCAT()`, `BENCHMARK()`, `SLEEP()`, `LOAD_FILE()`, `INTO OUTFILE/DUMPFILE` |

### SR13 — Controle de Tamanho de Payload

| Campo | Valor |
|---|---|
| **ID** | SR13 |
| **Título** | Limite de Requisições |
| **Prioridade** | Média |
| **RF/RNF de Origem** | RNF04 (Desempenho) |
| **Descrição** | O Express deve limitar o tamanho do corpo das requisições a 10kb (configurável via `BODY_SIZE_LIMIT`) |

---

## 4. Requisitos de Interface (IR)

### IR01 — Interface da API REST

| Campo | Valor |
|---|---|
| **ID** | IR01 |
| **Título** | Contrato da API RESTful |
| **Prioridade** | Alta |
| **RF de Origem** | RF01–RF14 |
| **Formato** | JSON (`Content-Type: application/json`) |
| **Autenticação** | Header `Authorization: Bearer <JWT>` |
| **Prefixo** | `/api` |

### IR02 — Endpoints de Autenticação

| Método | Endpoint | Body/Query | Sucesso | Erro |
|---|---|---|---|---|
| `POST` | `/api/usuarios/registro` | `{nome_completo, email, senha, tipo, cpf?, data_nascimento?, especialidade?}` | 201 + `{token, usuario}` | 409/422 |
| `POST` | `/api/usuarios/login` | `{email, senha}` | 200 + `{token, usuario}` | 401/403 |
| `GET` | `/api/usuarios/perfil` | — | 200 + `usuario` | 401/404 |
| `PUT` | `/api/usuarios/perfil` | `{nome_completo?, especialidade?, data_nascimento?}` | 200 + `usuario` | 401/422 |

### IR03 — Endpoints de Prontuário

| Método | Endpoint | Body/Query | Sucesso | Erro |
|---|---|---|---|---|
| `GET` | `/api/exames` | — | 200 + `[exames]` | 401 |
| `POST` | `/api/exames` | `{nome, tipo?, laboratorio?, data_exame?, resultado?, arquivo?}` | 201 | 401/422 |
| `GET` | `/api/exames/:id` | — | 200 + `exame` | 401/404 |
| `PUT` | `/api/exames/:id` | `{nome, tipo?, laboratorio?, data_exame?, resultado?}` | 200 | 401/404/422 |
| `DELETE` | `/api/exames/:id` | — | 200 | 401/404 |
| `GET` | `/api/receitas` | — | 200 + `[receitas]` | 401 |
| `POST` | `/api/receitas` | `{medico?, medicamento, dosagem?, instrucoes?, data_emissao?, validade?}` | 201 | 401/422 |
| `PUT` | `/api/receitas/:id` | `{medico?, medicamento, dosagem?, instrucoes?}` | 200 | 401/404/422 |
| `DELETE` | `/api/receitas/:id` | — | 200 | 401/404 |
| `GET` | `/api/consultas` | — | 200 + `[consultas]` | 401 |
| `POST` | `/api/consultas` | `{medico?, especialidade?, data, local?, observacoes?}` | 201 | 401/422 |
| `GET` | `/api/consultas/:id` | — | 200 + `consulta` | 401/404 |
| `PUT` | `/api/consultas/:id` | `{medico?, especialidade?, data, local?, observacoes?}` | 200 | 401/404/422 |
| `DELETE` | `/api/consultas/:id` | — | 200 | 401/404 |

### IR04 — Endpoints de Medicamentos

| Método | Endpoint | Body/Query | Sucesso | Erro |
|---|---|---|---|---|
| `GET` | `/api/medicamentos` | — | 200 + `[medicamentos]` | 401 |
| `POST` | `/api/medicamentos` | `{nome, dosagem?, inicio?, fim?}` | 201 + `{id}` | 401/422 |
| `PUT` | `/api/medicamentos/:id` | `{nome, dosagem?, inicio?, fim?}` | 200 | 401/404/422 |
| `DELETE` | `/api/medicamentos/:id` | — | 200 | 401/404 |
| `POST` | `/api/medicamentos/:id/horarios` | `{hora}` | 201 | 401/404/422 |
| `GET` | `/api/medicamentos/:id/horarios` | — | 200 + `[horarios]` | 401/404 |
| `DELETE` | `/api/medicamentos/:id/horarios/:horarioId` | — | 200 | 401/404 |
| `GET` | `/api/notificacoes` | — | 200 + `[notificacoes]` | 401 |

### IR05 — Endpoints de Sintomas

| Método | Endpoint | Body/Query | Sucesso | Erro |
|---|---|---|---|---|
| `GET` | `/api/sintomas` | — | 200 + `[sintomas]` | 401 |
| `POST` | `/api/sintomas` | `{data, tipo?, intensidade, descricao?}` | 201 | 401/422 |
| `GET` | `/api/sintomas/relatorio` | — | 200 + `{sintomas, estatisticas}` | 401 |
| `PUT` | `/api/sintomas/:id` | `{data, tipo?, intensidade, descricao?}` | 200 | 401/404/422 |
| `DELETE` | `/api/sintomas/:id` | — | 200 | 401/404 |

### IR06 — Endpoints de Agenda

| Método | Endpoint | Body/Query | Sucesso | Erro |
|---|---|---|---|---|
| `GET` | `/api/compromissos` | — | 200 + `[compromissos]` | 401 |
| `POST` | `/api/compromissos` | `{titulo, descricao?, data, hora?, local?, tipo?}` | 201 | 401/422 |
| `PUT` | `/api/compromissos/:id` | `{titulo, descricao?, data, hora?, local?, tipo?}` | 200 | 401/404/422 |
| `DELETE` | `/api/compromissos/:id` | — | 200 | 401/404 |
| `GET` | `/api/lembretes` | — | 200 + `[lembretes]` | 401 |
| `POST` | `/api/lembretes` | `{titulo, mensagem?, data, hora?, recorrente?}` | 201 | 401/422 |
| `PUT` | `/api/lembretes/:id` | `{titulo, mensagem?, data, hora?, recorrente?, concluido?}` | 200 | 401/404/422 |
| `DELETE` | `/api/lembretes/:id` | — | 200 | 401/404 |

### IR07 — Endpoints Administrativos

| Método | Endpoint | Query | Sucesso | Erro |
|---|---|---|---|---|
| `GET` | `/api/admin/estatisticas` | — | 200 + `{estatisticas, ultimos_cadastros}` | 401/403 |
| `GET` | `/api/admin/usuarios` | `?busca=&tipo=&pagina=&por_pagina=` | 200 + `{dados, paginacao}` | 401/403 |
| `GET` | `/api/admin/usuarios/:id` | — | 200 + `usuario` | 401/403/404 |
| `PUT` | `/api/admin/usuarios/:id/status` | `{ativo: 0\|1}` | 200 | 400/401/403/404 |
| `DELETE` | `/api/admin/usuarios/:id` | — | 200 | 400/401/403/404 |
| `GET` | `/api/admin/registros-login` | `?sucesso=0\|1&pagina=&por_pagina=` | 200 + `{dados, paginacao}` | 401/403 |

### IR08 — Endpoint de Health Check

| Método | Endpoint | Sucesso |
|---|---|---|
| `GET` | `/api/health` | 200 `{sucesso: true, mensagem: "API SAFEMED funcionando!"}` |

### IR09 — Roteamento SPA (Frontend)

| Rota | Módulo | Protegida | Admin |
|---|---|---|---|
| `#/login` | `login.js` | Não | Não |
| `#/cadastro` | `cadastro.js` | Não | Não |
| `#/dashboard` | `dashboard.js` | Sim | Não |
| `#/prontuario` | `prontuario.js` | Sim | Não |
| `#/medicamentos` | `medicamentos.js` | Sim | Não |
| `#/sintomas` | `sintomas.js` | Sim | Não |
| `#/agenda` | `agenda.js` | Sim | Não |
| `#/relatorios` | `relatorios.js` | Sim | Não |
| `#/admin` | `admin.js` | Sim | Sim |
| `#/admin/usuarios` | `adminUsuarios.js` | Sim | Sim |

### IR10 — Interação Frontend-Backend

| Componente | Responsabilidade |
|---|---|
| `api.js` | Cliente Fetch centralizado. Funções: `api.get()`, `api.post()`, `api.put()`, `api.delete()`. Inclui header `Authorization` automaticamente. Trata erros 401 (logout automático) |
| `mascaras.js` | Máscaras de formulário (CPF, data, telefone) |
| `app.js` | Roteador SPA. Verifica autenticação e permissão admin antes de carregar módulos |
| Validação Client-Side | Botões de envio habilitados apenas quando campos obrigatórios estão preenchidos |

### IR11 — Formato de Dados do Token JWT

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | Integer | ID do usuário |
| `email` | String | E-mail do usuário |
| `tipo` | String | Tipo: paciente, medico, cuidador, admin |
| `iat` | Integer | Data de emissão (auto) |
| `exp` | Integer | Data de expiração (configurável, padrão 24h) |

### IR12 — Navegação e Sidebar

| Elemento | Comportamento |
|---|---|
| Sidebar | Exibida apenas para usuários autenticados |
| Itens | Dashboard, Prontuário, Medicamentos, Sintomas, Agenda, Relatórios |
| Itens Admin | Se `tipo === 'admin'`: Adiciona separador "Área administrativa" + Administração + Usuários |
| Item Ativo | Highlight com `bg-indigo-600` na rota atual |
| Botão Sair | Chama `auth.logout()` (remove token do localStorage) |
| Toast | Notificação flutuante no canto inferior direito (sucesso = verde, erro = vermelho) |

---

## 5. Requisitos de Dados (DR)

### DR01 — Tabela `usuarios`

| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| `id` | INTEGER | PK, AUTOINCREMENT | Identificador único |
| `nome_completo` | TEXT | NOT NULL | Nome completo do usuário |
| `email` | TEXT | NOT NULL, UNIQUE | E-mail (usado como login) |
| `senha_hash` | TEXT | NOT NULL | Hash bcrypt da senha |
| `cpf` | TEXT | UNIQUE | CPF (opcional, sem formatação) |
| `data_nascimento` | TEXT | — | Data no formato AAAA-MM-DD |
| `tipo` | TEXT | NOT NULL, DEFAULT 'paciente', CHECK IN ('paciente','medico','cuidador','admin') | Papel do usuário |
| `especialidade` | TEXT | — | Especialidade médica (se aplicável) |
| `criado_em` | TEXT | DEFAULT datetime('now','localtime') | Data de criação |
| `ativo` | INTEGER | NOT NULL, DEFAULT 1 | Status da conta (1=ativa, 0=desativada) |
| **Índice** | `idx_usuarios_email` ON `usuarios(email)` | | |

### DR02 — Tabela `exames`

| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| `id` | INTEGER | PK, AUTOINCREMENT | Identificador único |
| `usuario_id` | INTEGER | NOT NULL, FK → usuarios(id) ON DELETE CASCADE | Proprietário |
| `nome` | TEXT | NOT NULL | Nome do exame |
| `tipo` | TEXT | — | Tipo do exame |
| `laboratorio` | TEXT | — | Nome do laboratório |
| `data_exame` | TEXT | — | Data no formato AAAA-MM-DD |
| `resultado` | TEXT | — | Texto do resultado |
| `arquivo` | TEXT | — | Referência a arquivo anexo |
| `criado_em` | TEXT | DEFAULT datetime('now','localtime') | Data de criação |
| **Índice** | `idx_exames_usuario` ON `exames(usuario_id)` | | |

### DR03 — Tabela `receitas`

| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| `id` | INTEGER | PK, AUTOINCREMENT | Identificador único |
| `usuario_id` | INTEGER | NOT NULL, FK → usuarios(id) ON DELETE CASCADE | Proprietário |
| `medico` | TEXT | — | Nome do médico prescrito |
| `medicamento` | TEXT | NOT NULL | Nome do medicamento |
| `dosagem` | TEXT | — | Dosagem (ex: "500mg") |
| `instrucoes` | TEXT | — | Instruções de uso |
| `data_emissao` | TEXT | — | Data de emissão |
| `validade` | TEXT | — | Data de validade |
| **Índice** | `idx_receitas_usuario` ON `receitas(usuario_id)` | | |

### DR04 — Tabela `consultas`

| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| `id` | INTEGER | PK, AUTOINCREMENT | Identificador único |
| `usuario_id` | INTEGER | NOT NULL, FK → usuarios(id) ON DELETE CASCADE | Proprietário |
| `medico` | TEXT | — | Nome do médico |
| `especialidade` | TEXT | — | Especialidade médica |
| `data` | TEXT | — | Data da consulta |
| `local` | TEXT | — | Local/endereço |
| `observacoes` | TEXT | — | Observações adicionais |
| **Índice** | `idx_consultas_usuario` ON `consultas(usuario_id)` | | |

### DR05 — Tabela `medicamentos`

| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| `id` | INTEGER | PK, AUTOINCREMENT | Identificador único |
| `usuario_id` | INTEGER | NOT NULL, FK → usuarios(id) ON DELETE CASCADE | Proprietário |
| `nome` | TEXT | NOT NULL | Nome do medicamento |
| `dosagem` | TEXT | — | Dosagem |
| `inicio` | TEXT | — | Data de início |
| `fim` | TEXT | — | Data de término |
| `ativo` | INTEGER | DEFAULT 1 | Status (1=ativo, 0=inativo) |
| **Índice** | `idx_medicamentos_usuario` ON `medicamentos(usuario_id)` | | |

### DR06 — Tabela `horarios_medicamento`

| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| `id` | INTEGER | PK, AUTOINCREMENT | Identificador único |
| `medicamento_id` | INTEGER | NOT NULL, FK → medicamentos(id) ON DELETE CASCADE | Medicamento pai |
| `hora` | TEXT | NOT NULL | Horário no formato HH:MM |
| **Índice** | `idx_horarios_medicamento` ON `horarios_medicamento(medicamento_id)` | | |

### DR07 — Tabela `sintomas`

| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| `id` | INTEGER | PK, AUTOINCREMENT | Identificador único |
| `usuario_id` | INTEGER | NOT NULL, FK → usuarios(id) ON DELETE CASCADE | Proprietário |
| `data` | TEXT | NOT NULL | Data do registro |
| `tipo` | TEXT | — | Tipo/descrição curta do sintoma |
| `intensidade` | INTEGER | CHECK(intensidade BETWEEN 1 AND 10) | Escala de 1 a 10 |
| `descricao` | TEXT | — | Descrição detalhada |
| **Índice** | `idx_sintomas_usuario` ON `sintomas(usuario_id)` | | |

### DR08 — Tabela `compromissos`

| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| `id` | INTEGER | PK, AUTOINCREMENT | Identificador único |
| `usuario_id` | INTEGER | NOT NULL, FK → usuarios(id) ON DELETE CASCADE | Proprietário |
| `titulo` | TEXT | NOT NULL | Título do compromisso |
| `descricao` | TEXT | — | Descrição detalhada |
| `data` | TEXT | NOT NULL | Data do compromisso |
| `hora` | TEXT | — | Horário |
| `local` | TEXT | — | Local/endereço |
| `tipo` | TEXT | DEFAULT 'compromisso', CHECK IN ('compromisso','medico','exame','outro') | Categoria |
| `criado_em` | TEXT | DEFAULT datetime('now','localtime') | Data de criação |
| **Índices** | `idx_compromissos_usuario` ON `(usuario_id)`, `idx_compromissos_data` ON `(data)` | | |

### DR09 — Tabela `lembretes`

| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| `id` | INTEGER | PK, AUTOINCREMENT | Identificador único |
| `usuario_id` | INTEGER | NOT NULL, FK → usuarios(id) ON DELETE CASCADE | Proprietário |
| `titulo` | TEXT | NOT NULL | Título do lembrete |
| `mensagem` | TEXT | — | Mensagem detalhada |
| `data` | TEXT | NOT NULL | Data do lembrete |
| `hora` | TEXT | — | Horário |
| `recorrente` | INTEGER | DEFAULT 0, CHECK IN (0, 1) | 0=pontual, 1=recorrente |
| `concluido` | INTEGER | DEFAULT 0, CHECK IN (0, 1) | 0=pendente, 1=concluído |
| `criado_em` | TEXT | DEFAULT datetime('now','localtime') | Data de criação |
| **Índices** | `idx_lembretes_usuario` ON `(usuario_id)`, `idx_lembretes_data` ON `(data)` | | |

### DR10 — Tabela `notificacoes`

| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| `id` | INTEGER | PK, AUTOINCREMENT | Identificador único |
| `usuario_id` | INTEGER | NOT NULL, FK → usuarios(id) ON DELETE CASCADE | Destinatário |
| `mensagem` | TEXT | NOT NULL | Texto da notificação |
| `categoria` | TEXT | — | Categoria (ex: "medicamento", "compromisso") |
| `visualizada` | INTEGER | DEFAULT 0 | 0=não lida, 1=lida |
| `data_hora` | TEXT | DEFAULT datetime('now','localtime') | Data/hora de criação |
| **Índice** | `idx_notificacoes_usuario` ON `notificacoes(usuario_id)` | | |

### DR11 — Tabela `registros_login`

| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| `id` | INTEGER | PK, AUTOINCREMENT | Identificador único |
| `usuario_id` | INTEGER | NOT NULL, FK → usuarios(id) ON DELETE CASCADE | Usuário (0 se não encontrado) |
| `email` | TEXT | NOT NULL | E-mail informado na tentativa |
| `sucesso` | INTEGER | NOT NULL, DEFAULT 1 | 0=falha, 1=sucesso |
| `ip` | TEXT | — | Endereço IP do cliente |
| `user_agent` | TEXT | — | User-Agent do navegador |
| `criado_em` | TEXT | DEFAULT datetime('now','localtime') | Data/hora da tentativa |
| **Índices** | `idx_registros_login_usuario` ON `(usuario_id)`, `idx_registros_login_data` ON `(criado_em)` | | |

### DR12 — Diagrama de Relacionamentos (ER)

```
┌──────────────┐     1:N     ┌──────────────┐
│   usuarios   │────────────►│    exames    │
│              │             └──────────────┘
│              │     1:N     ┌──────────────┐
│              │────────────►│   receitas   │
│              │             └──────────────┘
│              │     1:N     ┌──────────────┐
│              │────────────►│   consultas  │
│              │             └──────────────┘
│              │     1:N     ┌──────────────┐
│              │────────────►│ medicamentos │
│              │             └──────┬───────┘
│              │                    │ 1:N
│              │             ┌──────▼───────┐
│              │             │  horarios_   │
│              │             │ medicamento  │
│              │             └──────────────┘
│              │     1:N     ┌──────────────┐
│              │────────────►│  sintomas    │
│              │             └──────────────┘
│              │     1:N     ┌──────────────┐
│              │────────────►│ compromissos │
│              │             └──────────────┘
│              │     1:N     ┌──────────────┐
│              │────────────►│  lembretes   │
│              │             └──────────────┘
│              │     1:N     ┌──────────────┐
│              │────────────►│ notificacoes │
│              │             └──────────────┘
│              │     1:N     ┌──────────────────┐
│              │────────────►│ registros_login  │
└──────────────┘             └──────────────────┘

Todas as relações são 1:N com ON DELETE CASCADE
```

### DR13 — Regras de Integridade

| Regra | Tipo | Implementação |
|---|---|---|
| Email único | UNIQUE | `CREATE UNIQUE INDEX idx_usuarios_email` |
| CPF único | UNIQUE | Constraint na tabela |
| Tipo de usuário | CHECK | `CHECK(tipo IN ('paciente','medico','cuidador','admin'))` |
| Intensidade | CHECK | `CHECK(intensidade BETWEEN 1 AND 10)` |
| Recorrência | CHECK | `CHECK(recorrente IN (0, 1))` |
| Concluído | CHECK | `CHECK(concluido IN (0, 1))` |
| Tipo compromisso | CHECK | `CHECK(tipo IN ('compromisso','medico','exame','outro'))` |
| FK Cascata | ON DELETE CASCADE | Todas as tabelas dependentes propagam exclusão |

### DR14 — Mapeamento Objeto-Relacional (Interface de Acesso)

| Modelo (Classe) | Tabela | Operações |
|---|---|---|
| `usuarioControlador.js` | `usuarios`, `registros_login` | registrar, login, obterPerfil, atualizarPerfil |
| `prontuarioControlador.js` | `exames`, `receitas`, `consultas` | CRUD completo para cada entidade |
| `medicamentoControlador.js` | `medicamentos`, `horarios_medicamento`, `notificacoes` | CRUD + horários + notificações |
| `sintomaControlador.js` | `sintomas` | CRUD + relatório |
| `agendaControlador.js` | `compromissos`, `lembretes` | CRUD completo para cada entidade |
| `adminControlador.js` | `usuarios`, `registros_login` + múltiplas tabelas | estatisticasSistema, listarUsuarios, obterUsuario, alterarStatusUsuario, removerUsuario, listarRegistrosLogin |

---

## 6. Requisitos de Segurança do Sistema

### SR14 — Autenticação e Sessão

| Campo | Valor |
|---|---|
| **ID** | SR14 |
| **Título** | Gestão de Sessão via JWT |
| **Prioridade** | Alta |
| **Componentes** | `autenticacao.js` → `criarToken()`, `autenticar()` |
| **Algoritmo** | HMAC-SHA256 (padrão JWT) |
| **Payload** | `{id, email, tipo, iat, exp}` |
| **Expiração** | Configurável via `JWT_EXPIRA_EM` (padrão: 24h) |
| **Armazenamento (Frontend)** | `localStorage` do navegador |
| **Logout** | Remove token do `localStorage` |

### SR15 — Hash de Senhas

| Campo | Valor |
|---|---|
| **ID** | SR15 |
| **Título** | Proteção de Credenciais |
| **Prioridade** | Alta |
| **Componentes** | `autenticacao.js` → `criarHash()`, `verificarSenha()` |
| **Algoritmo** | bcrypt (bcryptjs) |
| **Salt Rounds** | 10 (configurável via `BCRYPT_SALT_ROUNDS`) |
| **Armazenamento** | Apenas hash na coluna `senha_hash` — senha em texto plano NUNCA é persistida |

### SR16 — Controle de Acesso Baseado em Papéis (RBAC)

| Campo | Valor |
|---|---|
| **ID** | SR16 |
| **Título** | RBAC — Role-Based Access Control |
| **Prioridade** | Alta |
| **Papéis** | `paciente`, `medico`, `cuidador`, `admin` |
| **Endpoints Padrão** | Acessíveis por todos os autenticados (paciente, medico, cuidador, admin) |
| **Endpoints Admin** | Acessíveis apenas por `admin` (middleware `autorizarAdmin`) |
| **Isolamento de Dados** | Cada usuário só acessa seus próprios registros (filtro por `usuario_id` em todas as queries) |

### SR17 — Proteção contra Auto-Exclusão do Admin

| Campo | Valor |
|---|---|
| **ID** | SR17 |
| **Título** | Regra de Proteção do Administrador |
| **Prioridade** | Alta |
| **Descrição** | O administrador logado não pode: (1) alterar o próprio status de ativo/inativo, (2) excluir a própria conta |
| **Implementação** | Verificar `id === req.usuarioId` antes de executar a operação |

### SR18 — Auditoria de Login

| Campo | Valor |
|---|---|
| **ID** | SR18 |
| **Título** | Registro de Tentativas de Autenticação |
| **Prioridade** | Média |
| **Descrição** | Todo endpoint de login deve registrar: usuario_id (ou 0 se não encontrado), email, sucesso (0/1), IP, user-agent |
| **Tabela** | `registros_login` |
| **Finalidade** | Detecção de acessos suspeitos e auditoria de segurança |

### SR19 — Sanitização de Entrada

| Campo | Valor |
|---|---|
| **ID** | SR19 |
| **Título** | Limpeza de Dados de Entrada |
| **Prioridade** | Alta |
| **Descrição** | Todos os inputs de texto devem passar por `sanitizar()` que aplica `validator.trim()` + `validator.escape()` |
| **Finalidade** | Prevenir XSS e outros ataques de injeção |

### SR20 — Validação Server-Side

| Campo | Valor |
|---|---|
| **ID** | SR20 |
| **Título** | Validação Obligatória no Backend |
| **Prioridade** | Alta |
| **Descrição** | Todos os endpoints de escrita (POST, PUT) devem validar os dados de entrada antes de persistir |
| **Validadores** | `validarUsuario()`, `validarLogin()`, `validarExame()`, `validarReceita()`, `validarConsulta()`, `validarMedicamento()`, `validarHorario()`, `validarSintoma()` |
| **Retorno em caso de erro** | HTTP 422 com `{sucesso: false, mensagem: 'Dados inválidos.', erros: [...]}` |

---

## 7. Requisitos de Desempenho do Sistema

### SR21 — Latência da API

| Campo | Valor |
|---|---|
| **ID** | SR21 |
| **Título** | Tempo de Resposta |
| **Prioridade** | Alta |
| **Métrica** | Latência p95 < 200ms para operações CRUD |
| **Implementação** | better-sqlite3 (síncrono, sem overhead de async), indexes de performance |

### SR22 — Paginação

| Campo | Valor |
|---|---|
| **ID** | SR22 |
| **Título** | Paginação de Listagens |
| **Prioridade** | Média |
| **Parâmetros** | `?pagina=1&por_pagina=20` |
| **Limites** | Página mínima: 1. Itens por página: 20 (padrão), máximo 100 |
| **Resposta** | `{dados: [...], paginacao: {pagina, por_pagina, total, total_paginas}}` |

### SR23 — Limite de Notificações

| Campo | Valor |
|---|---|
| **ID** | SR23 |
| **Título** | Limitação de Consultas de Notificações |
| **Prioridade** | Baixa |
| **Parâmetro** | `NOTIFICATION_LIMIT` (padrão: 50) |
| **Descrição** | A listagem de notificações deve retornar no máximo `NOTIFICATION_LIMIT` registros |

### SR24 — Modo WAL do SQLite

| Campo | Valor |
|---|---|
| **ID** | SR24 |
| **Título** | Write-Ahead Logging |
| **Prioridade** | Média |
| **Descrição** | Habilitar `PRAGMA journal_mode = WAL` para melhorar performance de leitura e permitir recuperação automática em caso de falha |

---

## 8. Requisitos de Confiabilidade do Sistema

### SR25 — Integridade Referencial

| Campo | Valor |
|---|---|
| **ID** | SR25 |
| **Título** | Chaves Estrangeiras com Cascata |
| **Prioridade** | Alta |
| **Descrição** | Todas as tabelas dependentes devem usar `FOREIGN KEY ... ON DELETE CASCADE` para propagar exclusões |
| **Tabelas Afetadas** | exames, receitas, consultas, medicamentos, horarios_medicamento, sintomas, compromissos, lembretes, notificacoes, registros_login |

### SR26 — Transações Síncronas

| Campo | Valor |
|---|---|
| **ID** | SR26 |
| **Título** | Atomicidade de Operações |
| **Prioridade** | Alta |
| **Descrição** | better-sqlite3 executa operações de forma síncrona e transacional. Cada `run()` é atômica por padrão |

### SR27 — Migração Automática

| Campo | Valor |
|---|---|
| **ID** | SR27 |
| **Título** | Compatibilidade com Bancos Existentes |
| **Prioridade** | Média |
| **Descrição** | O script `iniciarBanco.js` deve detectar e migrar bancos de versões anteriores (ex: adicionar coluna `ativo`, adicionar tipo `admin`) |

### SR28 — Seed do Administrador

| Campo | Valor |
|---|---|
| **ID** | SR28 |
| **Título** | Inicialização do Usuário Admin |
| **Prioridade** | Alta |
| **Descrição** | O sistema deve criar automaticamente o usuário administrador padrão ao inicializar o banco (se não existir). Se existir mas não for admin, promover para tipo `admin` |

---

## 9. Requisitos de Manutenibilidade do Sistema

### SR29 — Separação de Responsabilidades

| Campo | Valor |
|---|---|
| **ID** | SR29 |
| **Título** | Princípio Single Responsibility |
| **Prioridade** | Alta |
| **Componente** | `config.js` (configuração), `conexaoBanco.js` (conexão), `validadores.js` (validação), `autenticacao.js` (segurança), `controladores/*.js` (lógica de negócio), `rotas/*.js` (definição de endpoints) |

### SR30 — Reutilização de Funções Utilitárias

| Campo | Valor |
|---|---|
| **ID** | SR30 |
| **Título** | Biblioteca Compartilhada |
| **Prioridade** | Média |
| **Componentes** | `sanitizar()`, todas as funções `validar*()`, `criarHash()`, `verificarSenha()`, `criarToken()`, `autenticar()`, `autorizarAdmin()` |

### SR31 — Estrutura de Diretórios

| Campo | Valor |
|---|---|
| **ID** | SR31 |
| **Título** | Organização do Código |
| **Prioridade** | Média |
| **Descrição** | O projeto deve seguir a estrutura documentada no README.md com separação clara entre `api/` (backend) e `frontend/` |

---

## 10. Requisitos de Portabilidade do Sistema

### SR32 — Compatibilidade de Runtime

| Campo | Valor |
|---|---|
| **ID** | SR32 |
| **Título** | Ambiente de Execução |
| **Prioridade** | Alta |
| **Requisito** | Node.js v18 ou superior |
| **Dependências** | `better-sqlite3` (nativo, compila no install) |

### SR33 — Compatibilidade de Banco

| Campo | Valor |
|---|---|
| **ID** | SR33 |
| **Título** | Portabilidade do SQLite |
| **Prioridade** | Média |
| **Descrição** | O banco SQLite (`safemed.db`) é um arquivo único portátil entre sistemas operacionais |

### SR34 — Compatibilidade de Frontend

| Campo | Valor |
|---|---|
| **ID** | SR34 |
| **Título** | Navegadores Suportados |
| **Prioridade** | Média |
| **Navegadores** | Chrome, Firefox, Safari, Edge (versões recentes com suporte a ES6+, Fetch API, `import()` dinâmico) |
| **Design** | Mobile-first com Tailwind CSS |

### SR35 — Compatibilidade de Deploy

| Campo | Valor |
|---|---|
| **ID** | SR35 |
| **Título** | Flexibilidade de Hospedagem |
| **Prioridade** | Média |
| **Descrição** | O sistema deve funcionar em qualquer ambiente que suporte Node.js: Linux, Windows, macOS. Deploy via `npm run dev` (desenvolvimento) ou `npm start` (produção) |

---

## 11. Matriz de Rastreabilidade: Requisitos de Sistema → Requisitos de Usuário

| Requisito de Sistema | Requisito de Usuário | Descrição |
|---|---|---|
| **SR01** | RNF17, RNF18 | Arquitetura MVC |
| **SR02** | RNF06, RNF20 | SPA com roteamento hash |
| **SR03** | RF01–RF14 | Padrão RESTful |
| **SR04** | RF02, RNF15, RNF16 | Middleware JWT |
| **SR05** | RF12, RF13, RF14, RNF16 | Middleware Admin |
| **SR06** | RF15, RNF13 | Validação e sanitização |
| **SR07** | RNF04 | Formato de respostas |
| **SR08** | Todos os RF | Códigos HTTP |
| **SR09** | RNF17 | Config via ENV |
| **SR10** | RNF10, RNF11 | Inicialização do SQLite |
| **SR11** | RNF12, RNF13 | Helmet, CORS, payload limit |
| **SR12** | RNF13 | Proteção SQL Injection |
| **SR13** | RNF04 | Limite de payload |
| **SR14** | RF02, RNF15 | JWT |
| **SR15** | RNF12 | bcrypt |
| **SR16** | RNF16 | RBAC |
| **SR17** | RF13 (RN12) | Anti auto-exclusão admin |
| **SR18** | RF14, RNF14 | Auditoria de login |
| **SR19** | RNF13 | Sanitização |
| **SR20** | RF15, RNF13 | Validação server-side |
| **SR21** | RNF04 | Latência < 200ms |
| **SR22** | RF13 | Paginação |
| **SR23** | RF08 | Limite de notificações |
| **SR24** | RNF10 | WAL mode |
| **SR25** | RNF09, RNF10 | FK cascata |
| **SR26** | RNF09 | Transações síncronas |
| **SR27** | RNF10 | Migração automática |
| **SR28** | — | Seed admin |
| **SR29** | RNF17 | Single Responsibility |
| **SR30** | RNF18 | Funções reutilizáveis |
| **SR31** | RNF17, RNF19 | Estrutura de diretórios |
| **SR32** | RNF05 | Node.js v18+ |
| **SR33** | RNF05 | SQLite portável |
| **SR34** | RNF08, RNF20 | Navegadores modernos |
| **SR35** | RNF05, RNF20 | Deploy multiplataforma |

---

## 12. Matriz de Rastreabilidade: Requisitos de Sistema → Casos de Uso

| Requisito de Sistema | Casos de Uso | Funcionalidade Implementada |
|---|---|---|
| SR04 | CU02 | Autenticação JWT |
| SR05 | CU12, CU13, CU14 | Controle de acesso admin |
| SR06 | CU01–CU14 | Validação em todos os endpoints |
| SR14 | CU02 | Sessão via JWT |
| SR15 | CU01, CU02 | Hash de senhas |
| SR16 | CU01–CU14 | RBAC |
| SR17 | CU13 | Proteção do admin |
| SR18 | CU02 | Auditoria |
| SR19 | CU01–CU14 | Sanitização |
| SR20 | CU01–CU14 | Validação server-side |
| SR22 | CU13, CU14 | Paginação |
| SR25 | CU04–CU09 | Cascata de exclusão |
| SR28 | — | Seed admin |

---

## 13. Diagrama de Componentes Detalhado

```
┌─────────────────────────────────────────────────────────────────────┐
│                        <<component>>                                │
│                    api/src/config/config.js                         │
├─────────────────────────────────────────────────────────────────────┤
│  - Leitura de variáveis de ambiente via dotenv                      │
│  - Validação de variáveis obrigatórias                              │
│  - Exportação de objeto config centralizado                         │
│  - Validação de DB_SECRET_KEY (mínimo 24 caracteres)                │
├─────────────────────────────────────────────────────────────────────┤
│  Depends On: dotenv, path                                           │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        <<component>>                                │
│                api/src/config/conexaoBanco.js                       │
├─────────────────────────────────────────────────────────────────────┤
│  - Criação de instância better-sqlite3                              │
│  - Configuração de WAL mode                                         │
│  - Configuração de foreign_keys                                     │
│  - Função sanitizarEntrada() com detecção de padrões suspeitos      │
│  - Exportação: banco, DB_SECRET_KEY, sanitizarEntrada               │
├─────────────────────────────────────────────────────────────────────┤
│  Depends On: config.js, better-sqlite3, fs                          │
│  Provides: banco, sanitizarEntrada                                  │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        <<component>>                                │
│              api/src/utilitarios/autenticacao.js                     │
├─────────────────────────────────────────────────────────────────────┤
│  - criarHash(senha): bcrypt.hashSync com salt rounds                │
│  - verificarSenha(senha, hash): bcrypt.compareSync                  │
│  - criarToken(usuario): jwt.sign com payload {id, email, tipo}      │
│  - autenticar(req, res, next): middleware JWT                       │
│  - autorizarAdmin(req, res, next): middleware RBAC                  │
├─────────────────────────────────────────────────────────────────────┤
│  Depends On: bcryptjs, jsonwebtoken, config.js, conexaoBanco.js     │
│  Provides: criarHash, verificarSenha, criarToken, autenticar,       │
│            autorizarAdmin                                           │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        <<component>>                                │
│              api/src/utilitarios/validadores.js                      │
├─────────────────────────────────────────────────────────────────────┤
│  - sanitizar(texto): trim + escape via validator                    │
│  - validarUsuario(dados): nome 3-150, email válido, senha ≥ 6       │
│  - validarLogin(dados): email válido, senha obrigatória             │
│  - validarExame(dados): nome ≥ 2                                    │
│  - validarReceita(dados): medicamento ≥ 2                           │
│  - validarConsulta(dados): data válida                              │
│  - validarMedicamento(dados): nome ≥ 2                              │
│  - validarHorario(dados): formato HH:MM (regex)                     │
│  - validarSintoma(dados): data válida, intensidade 1-10             │
├─────────────────────────────────────────────────────────────────────┤
│  Depends On: validator                                              │
│  Provides: sanitizar, validarUsuario, validarLogin, validarExame,   │
│            validarReceita, validarConsulta, validarMedicamento,     │
│            validarHorario, validarSintoma                            │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        <<component>>                                │
│              api/src/controladores/*.js (6 módulos)                  │
├─────────────────────────────────────────────────────────────────────┤
│  - usuarioControlador.js: registrar, login, obterPerfil,           │
│                           atualizarPerfil                           │
│  - prontuarioControlador.js: CRUD exames, receitas, consultas       │
│  - medicamentoControlador.js: CRUD medicamentos, horários,         │
│                               notificações                          │
│  - sintomaControlador.js: CRUD sintomas + relatório                 │
│  - agendaControlador.js: CRUD compromissos, lembretes              │
│  - adminControlador.js: estatísticas, gestão usuários, registros   │
├─────────────────────────────────────────────────────────────────────┤
│  Depends On: conexaoBanco.js, validadores.js, autenticacao.js,      │
│              config.js                                              │
│  Provides: Todas as funções de negócio                              │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        <<component>>                                │
│              api/src/rotas/*.js (6 módulos)                         │
├─────────────────────────────────────────────────────────────────────┤
│  - Mapeamento de endpoints HTTP para funções dos controladores      │
│  - Encadeamento de middlewares (autenticar, autorizarAdmin)         │
│  - Validação de rotas dinâmicas (:id, :horarioId)                   │
├─────────────────────────────────────────────────────────────────────┤
│  Depends On: controladores/*.js, autenticacao.js                    │
│  Provides: Rotas HTTP                                               │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        <<component>>                                │
│              api/src/app.js                                          │
├─────────────────────────────────────────────────────────────────────┤
│  - Configuração do Express (helmet, cors, json limit)               │
│  - Registro de todas as rotas com prefixo /api                      │
│  - Endpoint de health check                                         │
│  - Handler de 404 para rotas da API                                 │
│  - Fallback SPA (serve index.html para rotas não-API)               │
├─────────────────────────────────────────────────────────────────────┤
│  Depends On: rotas/*.js, config.js, express, cors, helmet           │
│  Provides: app Express                                              │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        <<component>>                                │
│              api/src/server.js                                       │
├─────────────────────────────────────────────────────────────────────┤
│  - Inicialização do servidor HTTP                                   │
│  - Escuta na porta configurada (PORT)                               │
├─────────────────────────────────────────────────────────────────────┤
│  Depends On: app.js                                                 │
│  Provides: Servidor HTTP                                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 14. Premissas e Restrições Técnicas

### 14.1 Premissas Técnicas

| ID | Premissa |
|---|---|
| TP01 | Node.js v18+ disponível no ambiente de produção |
| TP02 | better-sqlite3 compila nativamente no sistema alvo |
| TP03 | SQLite é adequado para o volume esperado (< 10.000 usuários) |
| TP04 | Navegadores do usuário suportam ES6+ e Fetch API |
| TP05 | Conexão de rede estável entre frontend e backend |

### 14.2 Restrições Técnicas

| ID | Restrição | Justificativa |
|---|---|---|
| TR01 | Limite de 10kb por requisição | Prevenir abuso de memória |
| TR02 | Máximo 100 itens por página | Performance de renderização |
| TR03 | Senha mínima de 6 caracteres | Segurança básica |
| TR04 | JWT expira em 24h | Limitar janela de ataque |
| TR05 | Tipo 'admin' indisponível no cadastro público | Segurança do sistema |
| TR06 | Admin não pode auto-excluir | Prevenir perda de acesso admin |
| TR07 | DB_SECRET_KEY mínimo 24 caracteres | Criptografia adequada |
| TR08 | BCRYPT_SALT_ROUNDS mínimo 10 | Resistência a brute force |

---

## 15. Aprovação

| Nome | Função | Assinatura | Data |
|---|---|---|---|
| André Lobo | Professor | | |
| Carlos David Rocha de Souza | Professor | | |
| Anderson Bruno | Equipe SAFEMED | | |
| Anna Lídya Santos | Equipe SAFEMED | | |
| Eloah Firmo | Equipe SAFEMED | | |
| Erick Duarte | Equipe SAFEMED | | |
| Isabelly Alves | Equipe SAFEMED | | |
| Marcos Stasczak | Equipe SAFEMED | | |

---

**SAFEMED** — Prontuário Digital de Saúde  
Equipe SAFEMED | Projeto Integrador e Programação Web I
