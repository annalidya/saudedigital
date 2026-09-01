# SAFEMED — Escopo do Projeto

> **Norma de Referência:** PMI PMBOK 7ª Edição (2021) + ISO/IEC/IEEE 29148:2024  
> **Modelo de Qualidade:** ISO/IEC 25010:2023  
> **Notação:** UML 2.5.1 / UML 2.6 (OMG 2024)  
> **Metodologia:** Planejamento por Escopo + Decomposição em Entregáveis + Matriz de Rastreabilidade

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

Este documento define o escopo completo do projeto SAFEMED, estabelecendo os limites do que será desenvolvido, os entregáveis previstos, os critérios de aceite, as entregas fora do escopo e as premissas do projeto. O escopo é derivado dos documentos de Requisitos de Usuário (`requisitos_usuario.md`) e Requisitos de Sistema (`requisitos_sistema.md`).

### 1.2 Referências

| Documento | Descrição |
|---|---|
| `requisitos_usuario.md` | Requisitos de Usuário (RF01–RF15, RNF01–RNF20, US-01 a US-15) |
| `requisitos_sistema.md` | Requisitos de Sistema (SR01–SR35, IR01–IR12, DR01–DR14) |
| `README.md` | Documentação principal do projeto |
| PMBOK 7ª Edição | Guia do Corpo de Conhecimento em Gerenciamento de Projetos |
| ISO/IEC/IEEE 29148:2024 | Engenharia de requisitos |

### 1.3 Definições

| Termo | Definição |
|---|---|
| **Escopo do Produto** | Funcionalidades e características que o sistema SAFEMED deve conter |
| **Escopo do Projeto** | Trabalho necessário para entregar o produto dentro do prazo e recursos |
| **Entregável** | Resultado tangível produzido durante o projeto |
| **Marco (Milestone)** | Ponto de controle que marca a conclusão de uma fase ou entregável |
| **Critério de Aceite** | Condições que devem ser atendidas para que uma entrega seja aceita |

---

## 2. Visão Geral do Projeto

### 2.1 Objetivo do Projeto

Desenvolver um prontuário eletrônico de saúde (PEP) full stack que permita o gerenciamento de informações médicas (exames, receitas, consultas), controle de medicamentos com horários, registro de sintomas diários, agenda com compromissos e lembretes, e painel administrativo — atendendo a quatro tipos de usuário: paciente, médico, cuidador e administrador.

### 2.2 Resultados Esperados

| Resultado | Descrição |
|---|---|
| **Sistema Web Funcional** | Aplicação full stack acessível via navegador |
| **API RESTful** | Backend com 36 endpoints documentados e testados |
| **Frontend SPA** | 10 telas responsivas com roteamento client-side |
| **Banco de Dados** | 11 tabelas com 14 indexes de performance |
| **Documentação** | Requisitos de usuário, requisitos de sistema, escopo |

### 2.3 Fases do Projeto

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CRONOGRAMA DO PROJETO                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  FASE 1: Planejamento        ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│  (Requisitos e Escopo)       Semanas 1-2                                │
│                                                                         │
│  FASE 2: Design              ░░░░░░░░████████░░░░░░░░░░░░░░░░░░░░░░░   │
│  (Arquitetura e BD)          Semanas 3-4                                │
│                                                                         │
│  FASE 3: Backend             ░░░░░░░░░░░░░░░░████████████░░░░░░░░░░░   │
│  (API e Controladores)       Semanas 5-8                                │
│                                                                         │
│  FASE 4: Frontend            ░░░░░░░░░░░░░░░░░░░░░░░░████████████░░░   │
│  (SPA e Telas)               Semanas 7-10                               │
│                                                                         │
│  FASE 5: Testes e Deploy     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████  │
│  (Validação Final)           Semanas 11-12                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Escopo do Produto

### 3.1 Funcionalidades Incluídas no Escopo

As funcionalidades abaixo foram extraídas dos Requisitos de Usuário (RF01–RF15) e estão validadas nos Requisitos de Sistema (SR01–SR35):

#### 3.1.1 Módulo de Autenticação

| ID | Funcionalidade | Requisito | User Story | Entregue |
|---|---|---|---|---|
| F01 | Cadastro de Usuário (paciente/médico/cuidador) | RF01 | US-01 | Sim |
| F02 | Login com JWT | RF02 | US-02 | Sim |
| F03 | Visualização e atualização de perfil | RF03 | — | Sim |

#### 3.1.2 Módulo de Prontuário

| ID | Funcionalidade | Requisito | User Story | Entregue |
|---|---|---|---|---|
| F04 | CRUD de Exames (nome, tipo, laboratório, data, resultado) | RF04 | US-03, US-04, US-05 | Sim |
| F05 | CRUD de Receitas (médico, medicamento, dosagem, instruções) | RF05 | US-06 | Sim |
| F06 | CRUD de Consultas (médico, especialidade, data, local) | RF06 | US-07 | Sim |

#### 3.1.3 Módulo de Medicamentos

| ID | Funcionalidade | Requisito | User Story | Entregue |
|---|---|---|---|---|
| F07 | CRUD de Medicamentos (nome, dosagem, início, fim) | RF07 | US-08 | Sim |
| F08 | Gerenciamento de Horários de Medicação (HH:MM) | RF07 | US-08 | Sim |
| F09 | Sistema de Notificações | RF08 | — | Sim |

#### 3.1.4 Módulo de Sintomas

| ID | Funcionalidade | Requisito | User Story | Entregue |
|---|---|---|---|---|
| F10 | Diário de Sintomas (data, tipo, intensidade 1-10, descrição) | RF08 | US-09 | Sim |
| F11 | Relatório de Sintomas (estatísticas, média, agrupamento) | RF08 | US-09 | Sim |

#### 3.1.5 Módulo de Agenda

| ID | Funcionalidade | Requisito | User Story | Entregue |
|---|---|---|---|---|
| F12 | CRUD de Compromissos (título, data, hora, local, tipo) | RF09 | US-10 | Sim |
| F13 | CRUD de Lembretes (título, data, hora, recorrência) | RF09 | US-10 | Sim |

#### 3.1.6 Módulo de Visualização

| ID | Funcionalidade | Requisito | User Story | Entregue |
|---|---|---|---|---|
| F14 | Dashboard (contadores, próximas consultas, medicações do dia) | RF10 | US-11 | Sim |
| F15 | Relatórios (Prontuário, Sintomas, Medicamentos) | RF11 | US-12 | Sim |

#### 3.1.7 Módulo Administrativo

| ID | Funcionalidade | Requisito | User Story | Entregue |
|---|---|---|---|---|
| F16 | Painel de Estatísticas do Sistema | RF12 | US-13 | Sim |
| F17 | Gestão de Usuários (listar, buscar, filtrar, ativar/desativar, excluir) | RF13 | US-14 | Sim |
| F18 | Monitoramento de Registros de Login | RF14 | US-15 | Sim |

#### 3.1.8 Cross-Cutting Concerns

| ID | Funcionalidade | Requisito | User Story | Entregue |
|---|---|---|---|---|
| F19 | Validação de Formulários (client-side) | RF15 | Todos | Sim |
| F20 | Design Responsivo (mobile-first) | RNF06, RNF20 | — | Sim |
| F21 | Acessibilidade (alto contraste, letras grandes) | RNF08 | — | Sim |

### 3.2 Funcionalidades FORA do Escopo

As funcionalidades abaixo foram identificadas como futuras no `requisitos_usuario.md` e NÃO serão entregues nesta versão:

| ID | Funcionalidade | Motivo | Status |
|---|---|---|---|
| FE01 | Integração com laboratórios externos | Requer API de terceiros | 🔮 Futuro |
| FE02 | Integração com planos de saúde | Requer API de terceiros | 🔮 Futuro |
| FE03 | Backup automático em nuvem | Requer infraestrutura cloud | 🔮 Futuro |
| FE04 | Aplicativo mobile nativo (Android/iOS) | Requer framework mobile (React Native/Flutter) | 🔮 Futuro |
| FE05 | Sincronização entre dispositivos | Requer backend cloud + conflitos de dados | 🔮 Futuro |
| FE06 | Chat médico-paciente | Requer WebSockets + moderação | 🔮 Futuro |
| FE07 | Prescrição digital com assinatura eletrônica | Requer PKI e regulamentação | 🔮 Futuro |
| FE08 | Integração com farmácias | Requer API de terceiros | 🔮 Futuro |

---

## 4. Escopo do Projeto (Entregáveis)

### 4.1 Entregáveis Principais

| # | Entregável | Descrição | Documento de Referência | Status |
|---|---|---|---|---|
| E01 | Documento de Requisitos de Usuário | Especificação completa com RF, RNF, User Stories, Casos de Uso | `requisitos_usuario.md` | ✅ Concluído |
| E02 | Documento de Requisitos de Sistema | Especificação técnica com SR, IR, DR, diagramas | `requisitos_sistema.md` | ✅ Concluído |
| E03 | Escopo do Projeto | Este documento | `escopo_projeto.md` | ✅ Concluído |
| E04 | Backend API RESTful | API com 36 endpoints, 6 controladores, middlewares | `api/src/` | ✅ Concluído |
| E05 | Banco de Dados | 11 tabelas, 14 indexes, script de migração | `api/iniciarBanco.js` | ✅ Concluído |
| E06 | Frontend SPA | 10 telas responsivas com roteamento hash | `frontend/` | ✅ Concluído |
| E07 | Documentação da API | Endpoints documentados no README | `README.md` | ✅ Concluído |
| E08 | Configuração do Ambiente | Arquivo `.env` e instruções de setup | `api/.env` | ✅ Concluído |

### 4.2 Entregáveis de Documentação

| # | Entregável | Caminho | Status |
|---|---|---|---|
| D01 | Requisitos de Usuário | `doc/requisitos_usuario.md` | ✅ |
| D02 | Requisitos de Sistema | `doc/requisitos_sistema.md` | ✅ |
| D03 | Escopo do Projeto | `doc/escopo_projeto.md` | ✅ |
| D04 | Plano de Mudança | `doc/plano_mudanca_projeto.md` | ✅ |
| D05 | Plano do Frontend | `doc/plano_frontend_safemed.md` | ✅ |
| D06 | Plano do Backend | `doc/plano_implementacao_backend.md` | ✅ |
| D07 | Plano Área Administrativa | `doc/plano_area_administrativa.md` | ✅ |
| D08 | Documentação Original | `doc/doc_projeto/` | ✅ |

### 4.3 Entregáveis de Código

| # | Entregável | Caminho | Arquivos | Status |
|---|---|---|---|---|
| C01 | Configuração | `api/src/config/` | `config.js`, `conexaoBanco.js` | ✅ |
| C02 | Autenticação | `api/src/utilitarios/` | `autenticacao.js`, `validadores.js` | ✅ |
| C03 | Controladores | `api/src/controladores/` | 6 arquivos (usuario, prontuario, medicamento, sintoma, agenda, admin) | ✅ |
| C04 | Rotas | `api/src/rotas/` | 6 arquivos (usuario, prontuario, medicamento, sintoma, agenda, admin) | ✅ |
| C05 | App e Server | `api/src/` | `app.js`, `server.js` | ✅ |
| C06 | Inicialização DB | `api/` | `iniciarBanco.js` | ✅ |
| C07 | Orquestrador SPA | `frontend/js/` | `app.js`, `api.js`, `mascaras.js` | ✅ |
| C08 | Módulos Frontend | `frontend/js/modulos/` | 10 arquivos (login, cadastro, dashboard, prontuario, medicamentos, sintomas, agenda, relatorios, admin, adminUsuarios) | ✅ |
| C09 | Estilos | `frontend/css/` | `estilo.css` | ✅ |
| C10 | Página Principal | `frontend/` | `index.html` | ✅ |

---

## 5. Decomposição em Pacotes de Trabalho (WBS)

### 5.1 Estrutura Analítica do Projeto (WBS)

```
SAFEMED
│
├── 1. Planejamento e Requisitos
│   ├── 1.1 Levantamento de Requisitos
│   │   ├── 1.1.1 Análise de Personas
│   │   ├── 1.1.2 User Stories
│   │   └── 1.1.3 Requisitos Funcionais e Não Funcionais
│   ├── 1.2 Documentação de Requisitos
│   │   ├── 1.2.1 Requisitos de Usuário (requisitos_usuario.md)
│   │   └── 1.2.2 Requisitos de Sistema (requisitos_sistema.md)
│   └── 1.3 Definição de Escopo
│       ├── 1.3.1 Escopo do Projeto (este documento)
│       └── 1.3.2 Matriz de Rastreabilidade
│
├── 2. Design e Arquitetura
│   ├── 2.1 Arquitetura do Sistema
│   │   ├── 2.1.1 Diagrama de Componentes
│   │   ├── 2.1.2 Diagrama de Pacotes
│   │   └── 2.1.3 Definição de Camadas
│   ├── 2.2 Modelagem de Dados
│   │   ├── 2.2.1 Diagrama Entidade-Relacionamento
│   │   ├── 2.2.2 DDL do Banco (11 tabelas)
│   │   └── 2.2.3 Indexes de Performance (14 indexes)
│   └── 2.3 Design de Interface
│       ├── 2.3.1 Wireframes das 10 Telas
│       ├── 2.3.2 Diagrama de Navegação SPA
│       └── 2.3.3 Paleta de Cores e Tipografia
│
├── 3. Desenvolvimento do Backend
│   ├── 3.1 Infraestrutura
│   │   ├── 3.1.1 Configuração do Express
│   │   ├── 3.1.2 Middlewares (Helmet, CORS, JSON limit)
│   │   └── 3.1.3 Variáveis de Ambiente (config.js)
│   ├── 3.2 Camada de Persistência
│   │   ├── 3.2.1 Conexão SQLite (conexaoBanco.js)
│   │   ├── 3.2.2 Script de Inicialização (iniciarBanco.js)
│   │   └── 3.2.3 Migrações de Banco
│   ├── 3.3 Camada de Segurança
│   │   ├── 3.3.1 Hash de Senhas (bcryptjs)
│   │   ├── 3.3.2 Autenticação JWT
│   │   ├── 3.3.3 Middleware de Autorização (RBAC)
│   │   └── 3.3.4 Sanitização de Inputs
│   ├── 3.4 Camada de Validação
│   │   ├── 3.4.1 Validadores (9 funções)
│   │   └── 3.4.2 Sanitização (função sanitizar)
│   ├── 3.5 Controladores (6 módulos)
│   │   ├── 3.5.1 usuarioControlador.js (4 funções)
│   │   ├── 3.5.2 prontuarioControlador.js (14 funções)
│   │   ├── 3.5.3 medicamentoControlador.js (8 funções)
│   │   ├── 3.5.4 sintomaControlador.js (5 funções)
│   │   ├── 3.5.5 agendaControlador.js (8 funções)
│   │   └── 3.5.6 adminControlador.js (6 funções)
│   ├── 3.6 Rotas (6 módulos)
│   │   ├── 3.6.1 usuarioRotas.js (4 endpoints)
│   │   ├── 3.6.2 prontuarioRotas.js (14 endpoints)
│   │   ├── 3.6.3 medicamentoRotas.js (8 endpoints)
│   │   ├── 3.6.4 sintomaRotas.js (5 endpoints)
│   │   ├── 3.6.5 agendaRotas.js (8 endpoints)
│   │   └── 3.6.6 adminRotas.js (6 endpoints)
│   └── 3.7 Endpoint de Health Check
│
├── 4. Desenvolvimento do Frontend
│   ├── 4.1 Infraestrutura SPA
│   │   ├── 4.1.1 index.html (página principal)
│   │   ├── 4.1.2 app.js (roteador e orquestrador)
│   │   ├── 4.1.3 api.js (cliente Fetch)
│   │   └── 4.1.4 mascaras.js (máscaras de formulário)
│   ├── 4.2 Módulos de Autenticação
│   │   ├── 4.2.1 login.js
│   │   └── 4.2.2 cadastro.js
│   ├── 4.3 Módulos Principais
│   │   ├── 4.3.1 dashboard.js
│   │   ├── 4.3.2 prontuario.js (exames, receitas, consultas)
│   │   ├── 4.3.3 medicamentos.js
│   │   ├── 4.3.4 sintomas.js
│   │   ├── 4.3.5 agenda.js (compromissos e lembretes)
│   │   └── 4.3.6 relatorios.js
│   ├── 4.4 Módulos Administrativos
│   │   ├── 4.4.1 admin.js (estatísticas)
│   │   └── 4.4.2 adminUsuarios.js (gestão de usuários)
│   └── 4.5 Estilo e Design
│       ├── 4.5.1 Tailwind CSS (design responsivo)
│       └── 4.5.2 estilo.css (estilos globais)
│
└── 5. Testes e Validação
    ├── 5.1 Testes de API
    │   ├── 5.1.1 Testes de Autenticação
    │   ├── 5.1.2 Testes de CRUD
    │   └── 5.1.3 Testes de Segurança
    ├── 5.2 Testes de Frontend
    │   ├── 5.2.1 Testes de Navegação
    │   └── 5.2.2 Testes de Formulários
    └── 5.3 Validação dos Requisitos
        ├── 5.3.1 Cobertura de RF (RF01–RF15)
        └── 5.3.2 Cobertura de RNF (RNF01–RNF20)
```

---

## 6. Critérios de Aceite

### 6.1 Critérios Gerais

| # | Critério | Método de Verificação |
|---|---|---|
| CA01 | Todos os 15 RF implementados e funcionais | Teste manual de cada funcionalidade |
| CA02 | Todos os 36 endpoints da API respondendo corretamente | Teste com curl/Postman |
| CA03 | Frontend acessível em smartphone, tablet e desktop | Teste em 3 dispositivos |
| CA04 | Autenticação JWT funcionando com expiração | Teste de login + aguardar expiração |
| CA05 | Banco de dados com todas as 11 tabelas criadas | Verificação via SQLite |
| CA06 | Usuário administrador criado automaticamente | Teste de login admin |
| CA07 | Zero exceptions não tratadas no console | Verificação durante uso |

### 6.2 Critérios por Módulo

#### Autenticação

| # | Critério | RF |
|---|---|---|
| CA-A01 | Cadastro com nome ≥ 3 chars, email válido, senha ≥ 6 | RF01 |
| CA-A02 | Login com credenciais válidas retorna token JWT | RF02 |
| CA-A03 | Login com credenciais inválidas retorna 401 | RF02 |
| CA-A04 | Login com conta desativada retorna 403 | RF02 |
| CA-A05 | Todas as tentativas de login são registradas | RF02 |
| CA-A06 | Tipo 'admin' indisponível no cadastro público | RF01 |

#### Prontuário

| # | Critério | RF |
|---|---|---|
| CA-P01 | Exame cadastrado aparece na lista ordenado por data DESC | RF04 |
| CA-P02 | Receita cadastrada aparece na lista | RF05 |
| CA-P03 | Consulta cadastrada aparece na lista ordenada por data DESC | RF06 |
| CA-P04 | Edição de registro existente atualiza os dados | RF04–RF06 |
| CA-P05 | Exclusão remove o registro permanentemente | RF04–RF06 |
| CA-P06 | Cada usuário só vê seus próprios registros | RF04–RF06 |

#### Medicamentos

| # | Critério | RF |
|---|---|---|
| CA-M01 | Medicamento cadastrado com nome ≥ 2 chars | RF07 |
| CA-M02 | Horário cadastrado com formato HH:MM válido | RF07 |
| CA-M03 | Exclusão de medicamento remove seus horários (cascata) | RF07 |

#### Sintomas

| # | Critério | RF |
|---|---|---|
| CA-S01 | Sintoma com intensidade 1-10 cadastrado com sucesso | RF08 |
| CA-S02 | Relatório retorna total, média e agrupamento por tipo | RF08 |

#### Agenda

| # | Critério | RF |
|---|---|---|
| CA-AG01 | Compromisso com título ≥ 2 e data obrigatória | RF09 |
| CA-AG02 | Lembrete recorrente com flag recorrente=1 | RF09 |
| CA-AG03 | Lista ordenada por data ASC, hora ASC | RF09 |

#### Administrativo

| # | Critério | RF |
|---|---|---|
| CA-AD01 | Estatísticas mostram totais por entidade | RF12 |
| CA-AD02 | Admin pode listar/buscar/filtrar usuários | RF13 |
| CA-AD03 | Admin não pode auto-excluir ou auto-desativar | RF13 |
| CA-AD04 | Registros de login filtrados por sucesso | RF14 |

---

## 7. Restrições do Projeto

### 7.1 Restrições de Escopo

| ID | Restrição | Consequência |
|---|---|---|
| RE01 | Projeto acadêmico (sem fins lucrativos) | Sem deploy em produção comercial |
| RE02 | Equipe de 6 estudantes (2º ano Informática) | Escopo limitado ao que é viável no tempo da disciplina |
| RE03 | Disciplina: Projeto Integrador e Programação Web I | Foco em web full stack (não mobile nativo) |
| RE04 | Duração: 1 semestre letivo | 12 semanas de desenvolvimento |

### 7.2 Restrições Técnicas

| ID | Restrição | Origem |
|---|---|---|
| RT01 | Node.js v18+ obrigatório | `requisitos_sistema.md` SR32 |
| RT02 | SQLite como banco de dados | `requisitos_sistema.md` SR33 |
| RT03 | Limite de 10kb por requisição | `requisitos_usuario.md` R01 |
| RT04 | JWT expira em 24h | `requisitos_usuario.md` R04 |
| RT05 | Tipo 'admin' não pode ser criado via cadastro público | `requisitos_usuario.md` R05 |

### 7.3 Restrições de Recursos

| ID | Restrição | Mitigação |
|---|---|---|
| RR01 | Sem servidor de produção dedicado | Deploy local via `npm run dev` |
| RR02 | Sem banco de dados externo | SQLite local (arquivo `safemed.db`) |
| RR03 | Sem domínio próprio | Acesso via `localhost:3000` |

---

## 8. Premissas do Projeto

| ID | Premissa | Risco se Não Atendida |
|---|---|---|
| P01 | Node.js v18+ disponível nos computadores da equipe | Impossível executar o backend |
| P02 | Navegadores modernos disponíveis (Chrome/Firefox) | Frontend pode não funcionar |
| P03 | Conexão de rede estável para testes | APIs podem falhar |
| P04 | Equipe com conhecimento básico de JavaScript | Atraso no desenvolvimento |
| P05 | Professores disponíveis para orientação | Direcionamento incorreto |
| P06 | Escopo aprovado não sofre alterações significativas | Scope creep |

---

## 9. Marcos do Projeto (Milestones)

| # | Marco | Descrição | Entregável | Semana |
|---|---|---|---|---|
| M01 | Requisitos Aprovados | Documentos de requisitos aprovados pela equipe e professores | `requisitos_usuario.md`, `requisitos_sistema.md` | 2 |
| M02 | Escopo Definido | Este documento aprovado | `escopo_projeto.md` | 2 |
| M03 | Arquitetura Definida | Diagramas de componentes e banco de dados prontos | Diagramas UML | 4 |
| M04 | Backend Funcional | API RESTful com todos os endpoints operacionais | `api/src/` | 8 |
| M05 | Frontend Funcional | SPA com todas as 10 telas | `frontend/` | 10 |
| M06 | Integração Completa | Frontend comunicando com Backend | Sistema funcional | 11 |
| M07 | Projeto Entregue | Todos os documentados e código-fonte | Todos os arquivos | 12 |

### 9.1 Diagrama de Marcos

```
Semana:  1    2    3    4    5    6    7    8    9   10   11   12
         │    │    │    │    │    │    │    │    │    │    │    │
M01 ─────●────┘    │    │    │    │    │    │    │    │    │    │
M02 ─────●────┘    │    │    │    │    │    │    │    │    │    │
M03 ──────────────●────┘    │    │    │    │    │    │    │    │
M04 ────────────────────────────────────●────┘    │    │    │    │
M05 ───────────────────────────────────────────────────●────┘    │
M06 ────────────────────────────────────────────────────────────●────┘
M07 ──────────────────────────────────────────────────────────────────●
```

---

## 10. Matriz de Rastreabilidade: Escopo → Requisitos → Entregáveis

### 10.1 Funcionalidade → Requisito → Entregável

| Funcionalidade | RF | SR | Entregável (Código) | Entregável (Doc) |
|---|---|---|---|---|
| F01 Cadastro | RF01 | SR06, SR15 | `controladores/usuarioControlador.js` | `requisitos_usuario.md` US-01 |
| F02 Login | RF02 | SR04, SR14, SR15 | `controladores/usuarioControlador.js` | `requisitos_usuario.md` US-02 |
| F03 Perfil | RF03 | — | `controladores/usuarioControlador.js` | `requisitos_usuario.md` CU03 |
| F04 Exames | RF04 | SR03 | `controladores/prontuarioControlador.js` | `requisitos_usuario.md` US-03/04/05 |
| F05 Receitas | RF05 | SR03 | `controladores/prontuarioControlador.js` | `requisitos_usuario.md` US-06 |
| F06 Consultas | RF06 | SR03 | `controladores/prontuarioControlador.js` | `requisitos_usuario.md` US-07 |
| F07 Medicamentos | RF07 | SR03 | `controladores/medicamentoControlador.js` | `requisitos_usuario.md` US-08 |
| F08 Horários | RF07 | SR03 | `controladores/medicamentoControlador.js` | `requisitos_usuario.md` US-08 |
| F09 Notificações | RF08 | SR23 | `controladores/medicamentoControlador.js` | `requisitos_usuario.md` CU08 |
| F10 Diário Sintomas | RF08 | SR06 | `controladores/sintomaControlador.js` | `requisitos_usuario.md` US-09 |
| F11 Relatório Sintomas | RF08 | — | `controladores/sintomaControlador.js` | `requisitos_usuario.md` US-09 |
| F12 Compromissos | RF09 | SR03 | `controladores/agendaControlador.js` | `requisitos_usuario.md` US-10 |
| F13 Lembretes | RF09 | SR03 | `controladores/agendaControlador.js` | `requisitos_usuario.md` US-10 |
| F14 Dashboard | RF10 | — | `frontend/js/modulos/dashboard.js` | `requisitos_usuario.md` US-11 |
| F15 Relatórios | RF11 | — | `frontend/js/modulos/relatorios.js` | `requisitos_usuario.md` US-12 |
| F16 Estatísticas Admin | RF12 | SR05 | `controladores/adminControlador.js` | `requisitos_usuario.md` US-13 |
| F17 Gestão Usuários | RF13 | SR05, SR17 | `controladores/adminControlador.js` | `requisitos_usuario.md` US-14 |
| F18 Registros Login | RF14 | SR18 | `controladores/adminControlador.js` | `requisitos_usuario.md` US-15 |
| F19 Validação Forms | RF15 | SR06, SR20 | `frontend/js/api.js` | `requisitos_usuario.md` RF15 |
| F20 Design Responsivo | RNF06, RNF20 | SR02 | `frontend/css/estilo.css` | `requisitos_sistema.md` SR02 |
| F21 Acessibilidade | RNF08 | — | `frontend/css/estilo.css` | `requisitos_usuario.md` RNF08 |

### 10.2 Requisito Não Funcional → Implementação

| RNF | Implementação Técnica | Componente |
|---|---|---|
| RNF01 Completude | 100% dos RF implementados | Todos os controladores |
| RNF02 Correção | Zero dados corrompidos | Prepared Statements |
| RNF03 Apropriabilidade | Interface intuitiva por persona | `frontend/js/modulos/*.js` |
| RNF04 Desempenho | Latência p95 < 200ms | better-sqlite3 (síncrono) |
| RNF05 Coexistência | Node.js v18+ multiplataforma | `package.json` |
| RNF06 Usabilidade | Interface simples, ícones claros | Tailwind CSS |
| RNF07 Aprendizabilidade | Design consistente | Componentes reutilizáveis |
| RNF08 Acessibilidade | Alto contraste, letras grandes | `estilo.css` |
| RNF09 Maturidade | Zero exceptions não tratadas | try/catch em todos os controladores |
| RNF10 Tolerância | WAL + foreign keys | `conexaoBanco.js`, `iniciarBanco.js` |
| RNF11 Recuperação | Arquivo SQLite portátil | `db/safemed.db` |
| RNF12 Confidencialidade | bcrypt + JWT + isolamento | `autenticacao.js` |
| RNF13 Integridade | Prepared Statements + sanitização | `validadores.js`, `conexaoBanco.js` |
| RNF14 Não-repúdio | Registro de login | `registros_login` |
| RNF15 Responsabilidade | JWT com expiração | `autenticacao.js` |
| RNF16 Controle Acesso | RBAC (4 papéis) | `autenticacao.js` (autorizarAdmin) |
| RNF17 Modularidade | MVC + separação backend/frontend | Estrutura de diretórios |
| RNF18 Reusabilidade | Funções utilitárias compartilhadas | `validadores.js`, `autenticacao.js` |
| RNF19 Analisabilidade | Código documentado | `README.md` |
| RNF20 Portabilidade | Mobile-first + SQLite portátil | Tailwind CSS + better-sqlite3 |

---

## 11. Análise de Riscos do Escopo

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R01 | Scope creep (adição de funcionalidades fora do escopo) | Alta | Alto | Documento de escopo aprovado, controle de mudanças |
| R02 | Atraso no desenvolvimento do backend | Média | Alto | Priorização de funcionalidades MVP, paralelismo backend/frontend |
| R03 | Dificuldade de integração frontend-backend | Média | Médio | Contrato da API definido antecipadamente (IR01–IR08) |
| R04 | Problemas de performance com SQLite | Baixa | Médio | WAL mode + indexes de performance |
| R05 | Perda de dados do banco | Baixa | Alto | Arquivo SQLite portátil + backup manual |
| R06 | Incompatibilidade de navegador | Baixa | Baixo | Design mobile-first + testes em 3 navegadores |
| R07 | Saída de membro da equipe | Média | Médio | Documentação completa, código versionado no Git |

### 11.1 Matriz de Risco

```
         Impacto
         Alto    │  R01     R02
                 │
         Médio   │  R03     R04
                 │
         Baixo   │  R06     R07
                 │
                 └──────────────────
                   Baixo  Médio  Alta
                        Probabilidade
```

---

## 12. Controle de Mudanças

### 12.1 Processo de Solicitação de Mudança

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Solicitação │────►│  Análise de  │────►│  Aprovação   │
│  de Mudança  │     │  Impacto     │     │  (Professores)│
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                          ┌───────▼───────┐
                                          │  Implementação │
                                          │  ou Rejeição   │
                                          └───────────────┘
```

### 12.2 Critérios para Aceitação de Mudanças

| Critério | Descrição |
|---|---|
| Impacto no Prazo | A mudança não pode atrasar a entrega final |
| Impacto no Escopo | A mudança é uma correção, não uma nova funcionalidade |
| Impacto na Qualidade | A mudança melhora ou mantém a qualidade atual |
| Aprovação | Professores aprovam a mudança |

---

## 13. Exclusões Explícitas do Escopo

As funcionalidades abaixo foram formalmente excluídas do escopo desta versão:

| # | Exclusão | Motivo Técnico | Versão Futura |
|---|---|---|---|
| EX01 | App mobile nativo (Android/iOS) | Requer React Native/Flutter | v2.0 |
| EX02 | Integração com laboratórios | Requer API HL7/FHIR | v2.0 |
| EX03 | Integração com planos de saúde | Requer API de terceiros | v2.0 |
| EX04 | Backup automático em nuvem | Requer AWS/GCP/Azure | v2.0 |
| EX05 | Chat médico-paciente | Requer WebSockets + moderação | v3.0 |
| EX06 | Prescrição digital | Requer PKI + regulamentação ANVISA | v3.0 |
| EX07 | Multi-idioma (internacionalização) | Requer i18n framework | v2.0 |
| EX08 | Testes automatizados (unitários/e2e) | Requer Jest/Cypress + CI/CD | v1.1 |

---

## 14. Aprovação do Escopo

### 14.1 Termos de Aceite

O escopo descrito neste documento é aprovado pela equipe e pelos professores orientadores. Qualquer alteração deve seguir o processo de Controle de Mudanças (Seção 12).

### 14.2 Assinaturas

| Nome | Função | Assinatura | Data |
|---|---|---|---|
| André Lobo | Professor Orientador | | |
| Carlos David Rocha de Souza | Professor Orientador | | |
| Anderson Bruno | Equipe SAFEMED | | |
| Anna Lídya Santos | Equipe SAFEMED | | |
| Eloah Firmo | Equipe SAFEMED | | |
| Erick Duarte | Equipe SAFEMED | | |
| Isabelly Alves | Equipe SAFEMED | | |
| Marcos Stasczak | Equipe SAFEMED | | |

---

**SAFEMED** — Prontuário Digital de Saúde  
Equipe SAFEMED | Projeto Integrador e Programação Web I
