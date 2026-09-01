# SAFEMED — Especificação de Requisitos de Software

> **Norma de Referência:** ISO/IEC/IEEE 29148:2024 (Requisitos de Software)  
> **Modelo de Qualidade:** ISO/IEC 25010:2023 (Qualidade de Produto de Software)  
> **Notação:** UML 2.5.1 / UML 2.6 (OMG 2024)  
> **Metodologia:** User Stories + Caso de Uso + Traceability Matrix

---

**Projeto:** SAFEMED — Prontuário Digital de Saúde  
**Instituição:** Instituto Federal de Mato Grosso — IFMT, Campus de Barra do Garças/MT  
**Curso:** Informática — Segundo Ano, Turma A  
**Ano:** 2026  
**Disciplina:** Projeto Integrador e Programação Web I  
**Professores:** André Lobo e Carlos David Rocha de Souza  
**Equipe:** Anderson Bruno, Anna Lídya Santos, Eloah Firmo, Erick Duarte, Isabelly Alves, Marcos Stasczak

---

## 1. Introdução e Escopo

### 1.1 Propósito

Este documento define os requisitos de software do sistema SAFEMED, seguindo as convenções da norma ISO/IEC/IEEE 29148:2024 e notação UML 2.5.1/2.6 (OMG 2024). Os requisitos são apresentados em múltiplas perspectivas: requisitos de usuário (User Stories), casos de uso (UML), requisitos funcionais e não funcionais (ISO/IEC 25010:2023), e matriz de rastreabilidade.

### 1.2 Definições, Acrônimos e Abreviações

| Termo | Definição |
|---|---|
| **JWT** | JSON Web Token — padrão de autenticação stateless (RFC 7519) |
| **SPA** | Single Page Application — aplicação de página única |
| **CRUD** | Create, Read, Update, Delete — operações básicas de persistência |
| **MVC** | Model-View-Controller — padrão arquitetural |
| **REST** | Representational State Transfer — estilo arquitetural de APIs |
| **ORM** | Object-Relational Mapping — mapeamento objeto-relacional |
| **RBAC** | Role-Based Access Control — controle de acesso baseado em papéis |
| **ON DELETE CASCADE** | Ação de integridade referencial que propagada exclusão em cascata |
| **WAL** | Write-Ahead Logging — modo de journaling do SQLite |
| **bcrypt** | Algoritmo de hash de senhas com salt adaptativo |

### 1.3 Visão Geral do Sistema

O SAFEMED é um prontuário eletrônico de saúde (PEP) desenvolvido como projeto acadêmico. O sistema é composto por:

- **Backend:** API RESTful (Node.js/Express.js) com banco SQLite
- **Frontend:** SPA (HTML5/Tailwind CSS/JavaScript ES6+)
- **Autenticação:** JWT com controle de acesso por papéis (RBAC)

### 1.4 Referências

| Documento | Descrição |
|---|---|
| README.md | Documentação principal do projeto |
| ISO/IEC/IEEE 29148:2024 | Engenharia de requisitos |
| ISO/IEC 25010:2023 | Modelo de qualidade de software |
| UML 2.5.1 / 2.6 (OMG 2024) | Linguagem de modelagem unificada |
| RFC 7519 | JSON Web Token |
| RFC 7231 | HTTP/1.1 Semantics and Content |

---

## 2. Glossário do Domínio

| Conceito | Definição | Atributos Relevantes |
|---|---|---|
| **Usuário** | Pessoa física que interage com o sistema | id, nome_completo, email, senha_hash, cpf, data_nascimento, tipo, especialidade, criado_em, ativo |
| **Exame** | Resultado de exame médico laboratorial ou de imagem | id, usuario_id, nome, tipo, laboratorio, data_exame, resultado, arquivo |
| **Receita** | Prescrição médica de medicamentos | id, usuario_id, medico, medicamento, dosagem, instrucoes, data_emissao, validade |
| **Consulta** | Agendamento de atendimento médico | id, usuario_id, medico, especialidade, data, local, observacoes |
| **Medicamento** | Substância farmacêutica em uso pelo paciente | id, usuario_id, nome, dosagem, inicio, fim, ativo |
| **Horário de Medicação** | Momento de administração de um medicamento | id, medicamento_id, hora |
| **Sintoma** | Manifestação clínica registrada pelo paciente | id, usuario_id, data, tipo, intensidade (1-10), descricao |
| **Compromisso** | Evento agendado na agenda do usuário | id, usuario_id, titulo, descricao, data, hora, local, tipo |
| **Lembrete** | Notificação pessoal recorrente ou pontual | id, usuario_id, titulo, mensagem, data, hora, recorrente, concluido |
| **Notificação** | Mensagem automática do sistema | id, usuario_id, mensagem, categoria, visualizada, data_hora |
| **Registro de Login** | Histórico de tentativas de autenticação | id, usuario_id, email, sucesso, ip, user_agent, criado_em |

---

## 3. Atores do Sistema (UML)

### 3.1 Diagrama de Atores

```
                        ┌─────────────────────────────────────┐
                        │            SAFEMED                   │
                        │                                      │
  ┌──────┐             │   ┌──────────┐                       │
  │ Pacie│─────────────┼──►│  Sistema │                       │
  │ nte  │             │   │          │                       │
  └──────┘             │   └──────────┘                       │
                        │      ▲ ▲ ▲                           │
  ┌──────┐             │      │ │ │                           │
  │ Médic│─────────────┼──────┘ │ │                           │
  │ o    │             │        │ │                           │
  └──────┘             │        │ │                           │
                        │        │ │                           │
  ┌──────┐             │        │ │                           │
  │Cuida-│─────────────┼────────┘ │                           │
  │dor   │             │          │                           │
  └──────┘             │          │                           │
                        │          │                           │
  ┌──────┐             │          ▼                           │
  │Admin │─────────────┼──────────┘                           │
  │      │             │                                      │
  └──────┘             └─────────────────────────────────────┘
```

### 3.2 Descrição dos Atores

| Ator | Tipo | Estereótipo | Descrição |
|---|---|---|---|
| **Paciente** | Primário | `<<pessoa>>` | Utiliza o sistema para gerenciar sua saúde: cadastra exames, receitas, consultas, medicamentos, sintomas e agenda |
| **Médico** | Primário | `<<pessoa>>` | Profissional de saúde que acessa prontuários e gerencia informações médicas dos pacientes |
| **Cuidador/Familiar** | Primário | `<<pessoa>>` | Cuida de um paciente e gerencia suas informações médicas em nome dele |
| **Administrador** | Primário | `<<pessoa>>` | Gerencia o sistema: visualiza estatísticas, administra usuários e monitora registros de login |
| **Sistema** | Secundário | `<<sistema>>` | Componente automatizado: autenticação JWT, validação de dados, geração de hashes, notificações |

---

## 4. Casos de Uso (UML 2.5.1)

### 4.1 Ator: Paciente / Médico / Cuidador

#### CU01 — Registrar Usuário

| Campo | Valor |
|---|---|
| **ID** | CU01 |
| **Nome** | Registrar Usuário |
| **Ator Primário** | Visitante (não autenticado) |
| **Pré-condição** | Usuário não possui conta no sistema |
| **Pós-condição (sucesso)** | Conta criada. Token JWT emitido. Usuário redirecionado ao Dashboard |
| **Pós-condição (falha)** | Conta não criada. Mensagem de erro exibida |
| **Frequência** | 1 vez por usuário |

**Fluxo Principal:**
1. O sistema exibe o formulário de cadastro (`#/cadastro`).
2. O visitante preenche: nome completo, e-mail, senha, tipo (paciente/médico/cuidador).
3. O visitante opcionalmente preenche: CPF, data de nascimento, especialidade.
4. O visitante submete o formulário.
5. O sistema valida os dados (nome 3-150 caracteres, e-mail válido e único, senha ≥ 6 caracteres).
6. O sistema gera hash da senha com bcrypt (10 salt rounds).
7. O sistema insere o registro na tabela `usuarios`.
8. O sistema gera token JWT com {id, email, tipo}.
9. O sistema redireciona o usuário para o Dashboard.

**Fluxos Alternativos:**
- **3a.** Campos obrigatórios não preenchidos → botão de envio desabilitado (validação client-side).
- **5a.** E-mail já cadastrado → HTTP 409 "E-mail já cadastrado."
- **5b.** Nome com menos de 3 caracteres → HTTP 422 "Nome deve ter entre 3 e 150 caracteres."
- **5c.** Senha com menos de 6 caracteres → HTTP 422 "Senha deve ter no mínimo 6 caracteres."
- **5d.** Senhas não conferem → HTTP 422 "As senhas não conferem."

**Regras de Negócio:**
- RN01: O tipo `admin` não pode ser selecionado no cadastro público.
- RN02: Senhas são armazenadas exclusivamente como hash bcrypt.

---

#### CU02 — Autenticar Usuário (Login)

| Campo | Valor |
|---|---|
| **ID** | CU02 |
| **Nome** | Autenticar Usuário |
| **Ator Primário** | Visitante ou Usuário não autenticado |
| **Pré-condição** | Usuário possui conta ativa |
| **Pós-condição (sucesso)** | Token JWT emitido. Usuário autenticado. Registro de login criado |
| **Pós-condição (falha)** | Autenticação falhou. Registro de tentativa criado |
| **Frequência** | Múltiplas vezes por sessão |

**Fluxo Principal:**
1. O sistema exibe o formulário de login (`#/login`).
2. O visitante informa e-mail e senha.
3. O visitante submete o formulário.
4. O sistema valida o formato do e-mail.
5. O sistema busca o usuário por e-mail na tabela `usuarios`.
6. O sistema verifica a senha com `bcrypt.compareSync()`.
7. O sistema verifica se a conta está ativa (`ativo = 1`).
8. O sistema registra a tentativa de login (sucesso, IP, user-agent) em `registros_login`.
9. O sistema gera token JWT com {id, email, tipo}.
10. O sistema redireciona para o Dashboard (`#/dashboard`).

**Fluxos Alternativos:**
- **5a.** Usuário não encontrado → registro de falha + HTTP 401 "Credenciais inválidas."
- **6a.** Senha incorreta → registro de falha + HTTP 401 "Credenciais inválidas."
- **7a.** Conta desativada (`ativo = 0`) → registro de falha + HTTP 403 "Conta desativada."

**Regras de Negócio:**
- RN03: Todas as tentativas de login são registradas (sucesso e falha) com IP e user-agent.
- RN04: Contas desativadas não podem autenticar.

---

#### CU03 — Visualizar e Atualizar Perfil

| Campo | Valor |
|---|---|
| **ID** | CU03 |
| **Nome** | Gerenciar Perfil |
| **Ator Primário** | Usuário autenticado |
| **Pré-condição** | Usuário autenticado com token JWT válido |
| **Pós-condição** | Dados pessoais atualizados |
| **Frequência** | Ocasional |

**Fluxo Principal:**
1. O usuário acessa a tela de perfil.
2. O sistema exibe os dados: nome_completo, email, cpf, data_nascimento, tipo, especialidade, criado_em.
3. O usuário edita nome_completo, especialidade e/ou data_nascimento.
4. O usuário submete as alterações.
5. O sistema valida: nome ≥ 3 caracteres.
6. O sistema atualiza apenas os campos não vazios (COALESCE).
7. O sistema exibe mensagem de sucesso.

**Fluxos Alternativos:**
- **5a.** Nome com menos de 3 caracteres → HTTP 422.
- **6a.** Campos vazios mantêm o valor anterior.

---

#### CU04 — Gerenciar Exames

| Campo | Valor |
|---|---|
| **ID** | CU04 |
| **Nome** | CRUD de Exames |
| **Ator Primário** | Usuário autenticado |
| **Pré-condição** | Usuário autenticado |
| **Pós-condição** | Exame criado/atualizado/excluído |
| **Frequência** | Regular |

**Fluxo Principal (Cadastro):**
1. O usuário acessa a aba "Exames" no Prontuário (`#/prontuario`).
2. O usuário clica em "Novo Exame".
3. O sistema exibe modal com campos: nome*, tipo, laboratório, data_exame, resultado, arquivo.
4. O usuário preenche o nome (obrigatório) e campos opcionais.
5. O usuário submete.
6. O sistema valida: nome ≥ 2 caracteres.
7. O sistema insere na tabela `exames` com `usuario_id` do token.
8. O sistema exibe mensagem de sucesso e atualiza a lista.

**Fluxos Alternativos (Listagem):**
- O sistema lista todos os exames do usuário ordenados por `data_exame DESC`.

**Fluxos Alternativos (Edição):**
- O usuário seleciona um exame → modal pré-preenchido → submete → sistema atualiza.

**Fluxos Alternativos (Exclusão):**
- O usuário confirma exclusão → sistema remove registro permanentemente.

**Regras de Negócio:**
- RN05: Cada usuário só acessa seus próprios exames (filtro por `usuario_id`).
- RN06: Exclusão é permanente (sem soft delete).

---

#### CU05 — Gerenciar Receitas

| Campo | Valor |
|---|---|
| **ID** | CU05 |
| **Nome** | CRUD de Receitas |
| **Ator Primário** | Usuário autenticado |
| **Pré-condição** | Usuário autenticado |
| **Pós-condição** | Receita criada/atualizada/excluída |

**Fluxo Principal (Cadastro):**
1. O usuário acessa a aba "Receitas" no Prontuário.
2. O usuário clica em "Nova Receita".
3. O sistema exibe modal com campos: médico, medicamento*, dosagem, instruções, data_emissão, validade.
4. O usuário preenche o medicamento (obrigatório).
5. O sistema valida: medicamento ≥ 2 caracteres.
6. O sistema insere na tabela `receitas`.

**Regras de Negócio:**
- RN07: Receitas são listadas por `data_emissao DESC`.

---

#### CU06 — Gerenciar Consultas

| Campo | Valor |
|---|---|
| **ID** | CU06 |
| **Nome** | CRUD de Consultas |
| **Ator Primário** | Usuário autenticado |
| **Pré-condição** | Usuário autenticado |
| **Pós-condição** | Consulta criada/atualizada/excluída |

**Fluxo Principal (Cadastro):**
1. O usuário acessa a aba "Consultas" no Prontuário.
2. O sistema exibe modal com campos: médico, especialidade, data*, local, observações.
3. O usuário preenche a data (obrigatória, formato AAAA-MM-DD).
4. O sistema valida: data é uma data válida.
5. O sistema insere na tabela `consultas`.

**Regras de Negócio:**
- RN08: Consultas são listadas por `data DESC`.

---

#### CU07 — Gerenciar Medicamentos e Horários

| Campo | Valor |
|---|---|
| **ID** | CU07 |
| **Nome** | CRUD de Medicamentos |
| **Ator Primário** | Usuário autenticado |
| **Pré-condição** | Usuário autenticado |
| **Pós-condição** | Medicamento e horários gerenciados |

**Fluxo Principal (Cadastro de Medicamento):**
1. O usuário acessa a tela Medicamentos (`#/medicamentos`).
2. O usuário clica em "Novo Medicamento".
3. O sistema exibe formulário: nome*, dosagem, início, fim.
4. O usuário preenche o nome (obrigatório).
5. O sistema valida: nome ≥ 2 caracteres.
6. O sistema insere na tabela `medicamentos`.
7. O sistema retorna o ID do medicamento criado.

**Fluxo Principal (Adicionar Horário):**
1. O usuário seleciona um medicamento.
2. O usuário clica em "Adicionar Horário".
3. O sistema exibe campo: hora* (formato HH:MM).
4. O usuário informa o horário.
5. O sistema valida: formato /^([01]\d|2[0-3]):([0-5]\d)$/ .
6. O sistema insere na tabela `horarios_medicamento`.

**Fluxos Alternativos:**
- **Listar Horários:** GET `/api/medicamentos/:id/horarios` retorna horários ordenados por `hora ASC`.
- **Excluir Horário:** DELETE `/api/medicamentos/:id/horarios/:horarioId`.
- **Excluir Medicamento:** DELETE em cascata remove horários associados.

---

#### CU08 — Registrar Sintomas

| Campo | Valor |
|---|---|
| **ID** | CU08 |
| **Nome** | Diário de Sintomas |
| **Ator Primário** | Usuário autenticado |
| **Pré-condição** | Usuário autenticado |
| **Pós-condição** | Sintoma registrado |

**Fluxo Principal:**
1. O usuário acessa a tela Sintomas (`#/sintomas`).
2. O usuário clica em "Novo Sintoma".
3. O sistema exibe formulário: data*, tipo, intensidade* (1-10), descrição.
4. O sistema pré-preenche a data com o dia atual.
5. O usuário seleciona a intensidade e preenche os campos.
6. O sistema valida: data é válida, intensidade é inteiro entre 1 e 10.
7. O sistema insere na tabela `sintomas`.

**Fluxo Alternativo (Relatório):**
1. O usuário acessa o relatório de sintomas.
2. O sistema calcula: total, média de intensidade, agrupamento por tipo.
3. O sistema exibe gráfico de evolução.

---

#### CU09 — Gerenciar Agenda (Compromissos e Lembretes)

| Campo | Valor |
|---|---|
| **ID** | CU09 |
| **Nome** | Agenda Completa |
| **Ator Primário** | Usuário autenticado |
| **Pré-condição** | Usuário autenticado |
| **Pós-condição** | Compromisso ou lembrete gerenciado |

**Sub-Casos de Uso:**

| Sub-CU | Descrição |
|---|---|
| CU09.1 | Cadastrar Compromisso (título*, data*, hora, local, tipo) |
| CU09.2 | Editar Compromisso |
| CU09.3 | Excluir Compromisso |
| CU09.4 | Cadastrar Lembrete (título*, data*, hora, mensagem, recorrente) |
| CU09.5 | Editar Lembrete (incluindo marcar como concluído) |
| CU09.6 | Excluir Lembrete |

**Regras de Negócio:**
- RN09: Título deve ter no mínimo 2 caracteres.
- RN10: Lembretes recorrentes têm `recorrente = 1`.
- RN11: Compromissos são listados por `data ASC, hora ASC`.

---

#### CU10 — Visualizar Dashboard

| Campo | Valor |
|---|---|
| **ID** | CU10 |
| **Nome** | Dashboard Principal |
| **Ator Primário** | Usuário autenticado |
| **Pré-condição** | Usuário autenticado |
| **Pós-condição** | Dados exibidos |

**Fluxo Principal:**
1. O usuário acessa `#/dashboard` (após login automático).
2. O sistema consulta: total de exames, receitas, consultas, medicamentos ativos, sintomas.
3. O sistema consulta: próximas consultas (data ≥ hoje).
4. O sistema consulta: medicamentos com horários do dia atual.
5. O sistema renderiza cards de resumo.

---

#### CU11 — Gerar Relatórios

| Campo | Valor |
|---|---|
| **ID** | CU11 |
| **Nome** | Relatórios |
| **Ator Primário** | Usuário autenticado |
| **Pré-condição** | Usuário autenticado |
| **Pós-condição** | Relatório gerado |

**Tipos de Relatório:**

| Tipo | Conteúdo |
|---|---|
| Prontuário | Exames, receitas e consultas consolidados |
| Sintomas | Estatísticas, média de intensidade, evolução temporal |
| Medicamentos | Lista de medicamentos com horários |

---

### 4.2 Ator: Administrador

#### CU12 — Visualizar Estatísticas do Sistema

| Campo | Valor |
|---|---|
| **ID** | CU12 |
| **Nome** | Painel Administrativo |
| **Ator Primário** | Administrador |
| **Pré-condição** | Usuário autenticado com `tipo = 'admin'` |
| **Pós-condição** | Estatísticas exibidas |

**Fluxo Principal:**
1. O admin acessa `#/admin`.
2. O sistema verifica `tipo === 'admin'` no token JWT.
3. O sistema consulta: total de usuários (por tipo), exames, receitas, consultas, medicamentos, sintomas, notificações, registros_login.
4. O sistema consulta: últimos 5 cadastros.
5. O sistema consulta: usuários ativos vs inativos.
6. O sistema renderiza o painel com estatísticas.

**Fluxos Alternativos:**
- **2a.** Usuário não é admin → redirecionado para `#/dashboard`.

---

#### CU13 — Gerenciar Usuários

| Campo | Valor |
|---|---|
| **ID** | CU13 |
| **Nome** | Gestão de Usuários |
| **Ator Primário** | Administrador |
| **Pré-condição** | Admin autenticado |
| **Pós-condição** | Usuário gerenciado |

**Sub-Casos de Uso:**

| Sub-CU | Descrição |
|---|---|
| CU13.1 | Listar Usuários (com busca, filtro por tipo, paginação) |
| CU13.2 | Visualizar Detalhes do Usuário |
| CU13.3 | Ativar/Desativar Usuário |
| CU13.4 | Excluir Usuário |

**Fluxo Principal (CU13.1 — Listar):**
1. O admin acessa `#/admin/usuarios`.
2. O sistema lista usuários com paginação (20/página, máx 100).
3. O admin pode buscar por nome ou e-mail.
4. O admin pode filtrar por tipo (paciente, médico, cuidador, admin).

**Fluxo Principal (CU13.3 — Ativar/Desativar):**
1. O admin clica no toggle de status de um usuário.
2. O sistema envia PUT `/api/admin/usuarios/:id/status` com `{ativo: 0|1}`.
3. O sistema verifica: admin não pode alterar o próprio status.
4. O sistema atualiza o campo `ativo`.

**Fluxo Principal (CU13.4 — Excluir):**
1. O admin confirma a exclusão.
2. O sistema verifica: admin não pode excluir a si mesmo.
3. O sistema remove o registro (ON DELETE CASCADE remove dados dependentes).

**Regras de Negócio:**
- RN12: Administrador não pode desativar ou excluir a própria conta.
- RN13: Exclusão em cascata remove todos os dados do usuário.

---

#### CU14 — Monitorar Registros de Login

| Campo | Valor |
|---|---|
| **ID** | CU14 |
| **Nome** | Registros de Login |
| **Ator Primário** | Administrador |
| **Pré-condição** | Admin autenticado |
| **Pós-condição** | Registros exibidos |

**Fluxo Principal:**
1. O admin acessa a seção de registros de login.
2. O sistema lista registros com paginação.
3. O admin pode filtrar por sucesso (0 = falha, 1 = sucesso).
4. O sistema exibe: usuário, email, sucesso, IP, user-agent, data/hora.

---

## 5. Requisitos Funcionais Detalhados (RF)

### 5.1 Rastreabilidade: Requisito → Caso de Uso → User Story

| ID Requisito | Caso de Uso | User Story |
|---|---|---|
| RF01 | CU01 | Como visitante, quero me cadastrar para acessar o sistema |
| RF02 | CU02 | Como visitante, quero fazer login para autenticar minha sessão |
| RF03 | CU03 | Como usuário, quero ver e atualizar meus dados pessoais |
| RF04 | CU04 | Como usuário, quero cadastrar/listar/editar/excluir exames |
| RF05 | CU05 | Como usuário, quero cadastrar/listar/editar/excluir receitas |
| RF06 | CU06 | Como usuário, quero cadastrar/listar/editar/excluir consultas |
| RF07 | CU07 | Como usuário, quero cadastrar medicamentos e seus horários |
| RF08 | CU08 | Como usuário, quero registrar sintomas diários e ver relatórios |
| RF09 | CU09 | Como usuário, quero gerenciar compromissos e lembretes na agenda |
| RF10 | CU10 | Como usuário, quero ver um dashboard com resumo da minha saúde |
| RF11 | CU11 | Como usuário, quero gerar relatórios imprimíveis |
| RF12 | CU12 | Como admin, quero ver estatísticas gerais do sistema |
| RF13 | CU13 | Como admin, quero gerenciar (listar/buscar/ativar/excluir) usuários |
| RF14 | CU14 | Como admin, quero monitorar tentativas de login |
| RF15 | CU01-CU14 | Como sistema, quero validar formulários client-side |

### 5.2 Especificação dos Requisitos Funcionais

#### RF01 — Cadastro de Usuário

| Campo | Valor |
|---|---|
| **ID** | RF01 |
| **Título** | Cadastro de Novo Usuário |
| **Prioridade** | Alta |
| **Complexidade** | Média |
| **Casos de Uso** | CU01 |
| **Entrada** | nome_completo, email, senha, tipo, cpf (opcional), data_nascimento (opcional), especialidade (opcional) |
| **Saída** | Token JWT + dados do usuário |
| **API** | `POST /api/usuarios/registro` |
| **Validação** | Nome: 3-150 chars. Email: válido e único. Senha: ≥ 6 chars. Tipo: paciente\|medico\|cuidador |

#### RF02 — Login

| Campo | Valor |
|---|---|
| **ID** | RF02 |
| **Título** | Autenticação de Usuário |
| **Prioridade** | Alta |
| **Complexidade** | Baixa |
| **Casos de Uso** | CU02 |
| **Entrada** | email, senha |
| **Saída** | Token JWT |
| **API** | `POST /api/usuarios/login` |

#### RF03 — Perfil

| Campo | Valor |
|---|---|
| **ID** | RF03 |
| **Título** | Gerenciamento de Perfil |
| **Prioridade** | Média |
| **Casos de Uso** | CU03 |
| **Entrada** | nome_completo, especialidade, data_nascimento |
| **Saída** | Dados atualizados |
| **API** | `GET /api/usuarios/perfil` (leitura), `PUT /api/usuarios/perfil` (escrita) |

#### RF04 — Exames

| Campo | Valor |
|---|---|
| **ID** | RF04 |
| **Título** | CRUD de Exames |
| **Prioridade** | Alta |
| **Complexidade** | Média |
| **Casos de Uso** | CU04 |
| **Operações** | CREATE, READ (list + by id), UPDATE, DELETE |
| **API** | `GET/POST/PUT/DELETE /api/exames[/:id]` |
| **Campos** | nome*, tipo, laboratorio, data_exame, resultado, arquivo |

#### RF05 — Receitas

| Campo | Valor |
|---|---|
| **ID** | RF05 |
| **Título** | CRUD de Receitas |
| **Prioridade** | Alta |
| **Casos de Uso** | CU05 |
| **Operações** | CREATE, READ (list), UPDATE, DELETE |
| **API** | `GET/POST/PUT/DELETE /api/receitas[/:id]` |
| **Campos** | medico, medicamento*, dosagem, instrucoes, data_emissao, validade |

#### RF06 — Consultas

| Campo | Valor |
|---|---|
| **ID** | RF06 |
| **Título** | CRUD de Consultas |
| **Prioridade** | Alta |
| **Casos de Uso** | CU06 |
| **Operações** | CREATE, READ (list + by id), UPDATE, DELETE |
| **API** | `GET/POST/PUT/DELETE /api/consultas[/:id]` |
| **Campos** | medico, especialidade, data*, local, observacoes |

#### RF07 — Medicamentos

| Campo | Valor |
|---|---|
| **ID** | RF07 |
| **Título** | CRUD de Medicamentos e Horários |
| **Prioridade** | Alta |
| **Complexidade** | Alta |
| **Casos de Uso** | CU07 |
| **Operações** | CREATE, READ, UPDATE, DELETE (medicamentos + horários) |
| **API** | `GET/POST/PUT/DELETE /api/medicamentos[/:id]` + `GET/POST/DELETE /api/medicamentos/:id/horarios[/:horarioId]` |
| **Campos** | nome*, dosagem, inicio, fim, ativo |

#### RF08 — Sintomas

| Campo | Valor |
|---|---|
| **ID** | RF08 |
| **Título** | Diário de Sintomas + Relatório |
| **Prioridade** | Alta |
| **Casos de Uso** | CU08 |
| **Operações** | CREATE, READ, UPDATE, DELETE + relatório |
| **API** | `GET/POST/PUT/DELETE /api/sintomas[/:id]` + `GET /api/sintomas/relatorio` |
| **Campos** | data*, tipo, intensidade* (1-10), descricao |

#### RF09 — Agenda

| Campo | Valor |
|---|---|
| **ID** | RF09 |
| **Título** | Compromissos e Lembretes |
| **Prioridade** | Alta |
| **Complexidade** | Alta |
| **Casos de Uso** | CU09 |
| **Operações** | CRUD completo para compromissos e lembretes |
| **API** | `GET/POST/PUT/DELETE /api/compromissos[/:id]` + `GET/POST/PUT/DELETE /api/lembretes[/:id]` |

#### RF10 — Dashboard

| Campo | Valor |
|---|---|
| **ID** | RF10 |
| **Título** | Painel de Visão Geral |
| **Prioridade** | Alta |
| **Casos de Uso** | CU10 |
| **Dados** | Contadores, próximas consultas, medicamentos do dia |

#### RF11 — Relatórios

| Campo | Valor |
|---|---|
| **ID** | RF11 |
| **Título** | Geração de Relatórios |
| **Prioridade** | Média |
| **Casos de Uso** | CU11 |
| **Tipos** | Prontuário, Sintomas, Medicamentos |

#### RF12 — Painel Admin

| Campo | Valor |
|---|---|
| **ID** | RF12 |
| **Título** | Estatísticas do Sistema |
| **Prioridade** | Alta |
| **Casos de Uso** | CU12 |
| **API** | `GET /api/admin/estatisticas` |
| **Restrição** | `tipo === 'admin'` |

#### RF13 — Gestão de Usuários

| Campo | Valor |
|---|---|
| **ID** | RF13 |
| **Título** | Administração de Usuários |
| **Prioridade** | Alta |
| **Complexidade** | Alta |
| **Casos de Uso** | CU13 |
| **Operações** | Listar (com busca/filtro/paginação), Detalhar, Ativar/Desativar, Excluir |
| **API** | `GET/PUT/DELETE /api/admin/usuarios[/:id]` + `PUT /api/admin/usuarios/:id/status` |

#### RF14 — Registros de Login

| Campo | Valor |
|---|---|
| **ID** | RF14 |
| **Título** | Auditoria de Login |
| **Prioridade** | Média |
| **Casos de Uso** | CU14 |
| **API** | `GET /api/admin/registros-login?sucesso=0\|1` |

#### RF15 — Validação Client-Side

| Campo | Valor |
|---|---|
| **ID** | RF15 |
| **Título** | Validação de Formulários |
| **Prioridade** | Alta |
| **Casos de Uso** | Todos |
| **Comportamento** | Botões de envio habilitados apenas quando campos obrigatórios estão preenchidos |

---

## 6. Requisitos Não Funcionais (ISO/IEC 25010:2023)

### 6.1 Modelo de Qualidade

```
┌─────────────────────────────────────────────────────────┐
│                    QUALIDADE DO SOFTWARE                │
│                    (ISO/IEC 25010:2023)                  │
├─────────────────┬───────────────────────────────────────┤
│ Adequação Func. │ RNF01, RNF02, RNF03                  │
├─────────────────┼───────────────────────────────────────┤
│ Desempenho      │ RNF04                                 │
├─────────────────┼───────────────────────────────────────┤
│ Compatibilidade │ RNF05                                 │
├─────────────────┼───────────────────────────────────────┤
│ Usabilidade     │ RNF06, RNF07, RNF08                  │
├─────────────────┼───────────────────────────────────────┤
│ Confiabilidade  │ RNF09, RNF10, RNF11                  │
├─────────────────┼───────────────────────────────────────┤
│ Segurança       │ RNF12, RNF13, RNF14, RNF15, RNF16    │
├─────────────────┼───────────────────────────────────────┤
│ Manutensibilidade│ RNF17, RNF18, RNF19                  │
├─────────────────┼───────────────────────────────────────┤
│ Portabilidade   │ RNF20                                 │
└─────────────────┴───────────────────────────────────────┘
```

### 6.2 Especificação dos Requisitos Não Funcionais

#### Adequação Funcional

| ID | Subcaracterística | Descrição | Métrica |
|---|---|---|---|
| **RNF01** | Completude funcional | Todas as funcionalidades RF01-RF15 implementadas | 100% dos casos de uso cobertos |
| **RNF02** | Correção funcional | Operações CRUD produzem resultados corretos | Zero dados corrompidos em testes |
| **RNF03** | Apropriabilidade | Interface adequada para cada persona | Taxa de sucesso em tarefas ≥ 90% |

#### Desempenho

| ID | Subcaracterística | Descrição | Métrica |
|---|---|---|---|
| **RNF04** | Comportamento temporal | Tempo de resposta da API | Latência p95 < 200ms para operações CRUD |

#### Compatibilidade

| ID | Subcaracterística | Descrição | Métrica |
|---|---|---|---|
| **RNF05** | Coexistência | Funciona em ambientes com Node.js v18+ | Compatível com Linux, Windows, macOS |

#### Usabilidade

| ID | Subcaracterística | Descrição | Métrica |
|---|---|---|---|
| **RNF06** | Reconhecimento de adequação | Interface intuitiva com linguagem simples | Zero treinamento necessário para personas |
| **RNF07** | Aprendizabilidade | Design consistente com Tailwind CSS | Nova funcionalidade aprendida em < 2 minutos |
| **RNF08** | Acessibilidade | Modo alto contraste, letras grandes, navegação por teclado | WCAG 2.1 nível A |

#### Confiabilidade

| ID | Subcaracterística | Descrição | Métrica |
|---|---|---|---|
| **RNF09** | Maturidade | Uso regular sem falhas | Zero exceptions não tratadas em produção |
| **RNF10** | Tolerância a falhas | Recuperação automática via WAL e transações | Dados preservados após crash do servidor |
| **RNF11** | Capacidade de recuperação | Backup e restauração do banco SQLite | Recuperação em < 30 segundos |

#### Segurança

| ID | Subcaracterística | Descrição | Métrica |
|---|---|---|---|
| **RNF12** | Confidencialidade | Senhas hash bcrypt, dados isolados por usuário | Zero vazamento de dados entre usuários |
| **RNF13** | Integridade | Prepared Statements, sanitização de inputs | Zero SQL Injection em testes de segurança |
| **RNF14** | Não-repúdio | Registro de login com IP e user-agent | 100% das tentativas auditadas |
| **RNF15** | Responsabilidade | Autenticação JWT com expiração | Tokens expiram em 24h (configurável) |
| **RNF16** | Controle de acesso | RBAC (admin, paciente, médico, cuidador) | 100% dos endpoints protegidos |

#### Manutenibilidade

| ID | Subcaracterística | Descrição | Métrica |
|---|---|---|---|
| **RNF17** | Modularidade | Arquitetura MVC com separação backend/frontend | Modificação em 1 módulo não afeta outros |
| **RNF18** | Reusabilidade | Funções utilitárias (validadores, autenticação) | Mínimo de duplicação de código |
| **RNF19** | Analisabilidade | Código documentado com estrutura clara | Novo desenvolvedor entende em < 1 hora |

#### Portabilidade

| ID | Subcaracterística | Descrição | Métrica |
|---|---|---|---|
| **RNF20** | Adaptabilidade | Design mobile-first com Tailwind CSS | Funcional em smartphones, tablets e desktops |

---

## 7. User Stories (Formato Moderno 2026)

### 7.1 Épico: Autenticação

```
US-01 [Prioridade: Alta] [Estimativa: 3 pontos]
COMO visitante
QUERO me cadastrar no sistema
PARA acessar funcionalidades de gerenciamento de saúde

Critérios de Aceite:
  ✓ Formulário com campos: nome*, email*, senha*, tipo*, cpf, data_nascimento
  ✓ Validação client-side: botão habilitado apenas com campos obrigatórios
  ✓ Validação server-side: nome 3-150 chars, email válido único, senha ≥ 6
  ✓ Senha armazenada como hash bcrypt (10 salt rounds)
  ✓ Token JWT retornado no sucesso
  ✓ Redirecionamento para Dashboard
  ✓ Tipo 'admin' indisponível no cadastro público
```

```
US-02 [Prioridade: Alta] [Estimativa: 2 pontos]
COMO visitante
QUERO fazer login com e-mail e senha
PARA acessar minha conta autenticada

Critérios de Aceite:
  ✓ Formulário com email* e senha*
  ✓ Token JWT retornado no sucesso
  ✓ Registro da tentativa (sucesso/falha, IP, user-agent)
  ✓ Conta desativada retorna erro 403
  ✓ Credenciais inválidas retornam erro 401
```

### 7.2 Épico: Prontuário

```
US-03 [Prioridade: Alta] [Estimativa: 3 pontos]
COMO usuário autenticado
QUERO cadastrar exames médicos
PARA manter meu histórico de saúde organizado

Critérios de Aceite:
  ✓ Modal com campos: nome*, tipo, laboratório, data_exame, resultado, arquivo
  ✓ Nome obrigatório ≥ 2 caracteres
  ✓ Exame vinculado ao usuario_id do token
  ✓ Lista ordenada por data_exame DESC
```

```
US-04 [Prioridade: Alta] [Estimativa: 2 pontos]
COMO usuário autenticado
QUERO editar exames existentes
PARA corrigir ou atualizar informações

Critérios de Aceite:
  ✓ Modal pré-preenchido com dados do exame
  ✓ Apenas o proprietário pode editar
  ✓ Mensagem de sucesso após atualização
```

```
US-05 [Prioridade: Alta] [Estimativa: 1 ponto]
COMO usuário autenticado
QUERO excluir exames
PARA remover registros desnecessários

Critérios de Aceite:
  ✓ Confirmação antes de excluir
  ✓ Exclusão permanente (sem soft delete)
  ✓ Apenas o proprietário pode excluir
```

```
US-06 [Prioridade: Alta] [Estimativa: 3 pontos]
COMO usuário autenticado
QUERO cadastrar receitas médicas
PARA registrar prescrições de médicos

Critérios de Aceite:
  ✓ Modal com campos: médico, medicamento*, dosagem, instruções, data_emissão, validade
  ✓ Medicamento obrigatório ≥ 2 caracteres
  ✓ Lista ordenada por data_emissao DESC
```

```
US-07 [Prioridade: Alta] [Estimativa: 3 pontos]
COMO usuário autenticado
QUERO cadastrar consultas médicas
PARA agendar e acompanhar atendimentos

Critérios de Aceite:
  ✓ Modal com campos: médico, especialidade, data*, local, observações
  ✓ Data obrigatória e válida (formato AAAA-MM-DD)
  ✓ Lista ordenada por data DESC
```

### 7.3 Épico: Medicamentos

```
US-08 [Prioridade: Alta] [Estimativa: 5 pontos]
COMO usuário autenticado
QUERO cadastrar medicamentos com horários
PARA controlar minha medicação diária

Critérios de Aceite:
  ✓ Formulário: nome*, dosagem, início, fim
  ✓ Adição de múltiplos horários por medicamento (formato HH:MM)
  ✓ Validação de horário: /^([01]\d|2[0-3]):([0-5]\d)$/
  ✓ Exclusão em cascata: remover medicamento remove seus horários
```

### 7.4 Épico: Sintomas

```
US-09 [Prioridade: Alta] [Estimativa: 4 pontos]
COMO usuário autenticado
QUERO registrar sintomas diários
PARA acompanhar a evolução da minha saúde

Critérios de Aceite:
  ✓ Formulário: data* (default = hoje), tipo, intensidade* (1-10), descrição
  ✓ Validação: data válida, intensidade inteiro 1-10
  ✓ Lista ordenada por data DESC
  ✓ Relatório com total, média de intensidade e agrupamento por tipo
  ✓ Gráfico de evolução temporal
```

### 7.5 Épico: Agenda

```
US-10 [Prioridade: Alta] [Estimativa: 5 pontos]
COMO usuário autenticado
QUERO gerenciar compromissos e lembretes
PARA organizar minha agenda de saúde

Critérios de Aceite:
  ✓ Compromisso: título* (≥ 2 chars), data*, hora, local, tipo (compromisso|médico|exame|outro)
  ✓ Lembrete: título* (≥ 2 chars), data*, hora, mensagem, recorrente (0|1), concluído (0|1)
  ✓ Lista de compromissos ordenada por data ASC, hora ASC
  ✓ Lista de lembretes ordenada por data ASC, hora ASC
```

### 7.6 Épico: Visualização

```
US-11 [Prioridade: Alta] [Estimativa: 3 pontos]
COMO usuário autenticado
QUERO ver um dashboard com resumo
PARA ter visão geral da minha saúde

Critérios de Aceite:
  ✓ Cards: total de exames, receitas, consultas, medicamentos ativos, sintomas
  ✓ Próximas consultas (data ≥ hoje)
  ✓ Medicamentos com horários do dia
```

```
US-12 [Prioridade: Média] [Estimativa: 3 pontos]
COMO usuário autenticado
QUERO gerar relatórios imprimíveis
PARA compartilhar informações com médicos

Critérios de Aceite:
  ✓ Relatório de Prontuário (exames + receitas + consultas)
  ✓ Relatório de Sintomas (estatísticas + evolução)
  ✓ Relatório de Medicamentos (lista + horários)
  ✓ Botão de impressão
```

### 7.7 Épico: Administração

```
US-13 [Prioridade: Alta] [Estimativa: 3 pontos]
COMO administrador
QUERO ver estatísticas do sistema
PARA monitorar o uso do SAFEMED

Critérios de Aceite:
  ✓ Total de usuários por tipo (paciente, médico, cuidador, admin)
  ✓ Totais: exames, receitas, consultas, medicamentos, sintomas, notificações, registros_login
  ✓ Últimos 5 cadastros
  ✓ Usuários ativos vs inativos
  ✓ Acesso restrito a tipo 'admin'
```

```
US-14 [Prioridade: Alta] [Estimativa: 5 pontos]
COMO administrador
QUERO gerenciar usuários (listar, buscar, filtrar, ativar/desativar, excluir)
PARA administrar as contas do sistema

Critérios de Aceite:
  ✓ Lista paginada (20/página, máx 100)
  ✓ Busca por nome ou e-mail
  ✓ Filtro por tipo
  ✓ Ativar/desativar (toggle)
  ✓ Excluir com confirmação
  ✓ Admin não pode alterar/excluir a própria conta
  ✓ Exclusão em cascata
```

```
US-15 [Prioridade: Média] [Estimativa: 2 pontos]
COMO administrador
QUERO monitorar registros de login
PARA detectar acessos suspeitos

Critérios de Aceite:
  ✓ Lista paginada com dados: usuário, email, sucesso, IP, user-agent, data/hora
  ✓ Filtro por sucesso (0 = falha, 1 = sucesso)
```

---

## 8. Matriz de Rastreabilidade

### 8.1 Requisito → Caso de Uso → User Story → Entidade

| RF | CU | US | Entidade Principal | API Endpoint |
|---|---|---|---|---|
| RF01 | CU01 | US-01 | usuarios | POST /api/usuarios/registro |
| RF02 | CU02 | US-02 | usuarios, registros_login | POST /api/usuarios/login |
| RF03 | CU03 | — | usuarios | GET/PUT /api/usuarios/perfil |
| RF04 | CU04 | US-03, US-04, US-05 | exames | GET/POST/PUT/DELETE /api/exames[/:id] |
| RF05 | CU05 | US-06 | receitas | GET/POST/PUT/DELETE /api/receitas[/:id] |
| RF06 | CU06 | US-07 | consultas | GET/POST/PUT/DELETE /api/consultas[/:id] |
| RF07 | CU07 | US-08 | medicamentos, horarios_medicamento | GET/POST/PUT/DELETE /api/medicamentos + horarios |
| RF08 | CU08 | US-09 | sintomas | GET/POST/PUT/DELETE /api/sintomas + relatorio |
| RF09 | CU09 | US-10 | compromissos, lembretes | GET/POST/PUT/DELETE /api/compromissos + lembretes |
| RF10 | CU10 | US-11 | (consulta múltiplas tabelas) | Dashboard |
| RF11 | CU11 | US-12 | (consulta múltiplas tabelas) | Relatórios |
| RF12 | CU12 | US-13 | (consulta múltiplas tabelas) | GET /api/admin/estatisticas |
| RF13 | CU13 | US-14 | usuarios | GET/PUT/DELETE /api/admin/usuarios[/:id] |
| RF14 | CU14 | US-15 | registros_login | GET /api/admin/registros-login |

### 8.2 User Story → Requisito Não Funcional

| US | RNF01 | RNF04 | RNF06 | RNF08 | RNF12 | RNF13 | RNF16 |
|---|---|---|---|---|---|---|---|
| US-01 | ✓ | | ✓ | ✓ | ✓ | ✓ | ✓ |
| US-02 | ✓ | | ✓ | | ✓ | ✓ | ✓ |
| US-03 a US-05 | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ |
| US-06 | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ |
| US-07 | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ |
| US-08 | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ |
| US-09 | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ |
| US-10 | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ |
| US-11 | ✓ | | ✓ | | | | |
| US-12 | ✓ | | ✓ | | | | |
| US-13 | ✓ | ✓ | | | ✓ | ✓ | ✓ |
| US-14 | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ |
| US-15 | ✓ | | ✓ | | ✓ | ✓ | ✓ |

---

## 9. Diagrama de Classes (Conceitual UML 2.5.1)

```
┌──────────────────────────────────────────────────────────────────┐
│                        <<entity>>                                │
│                         Usuario                                  │
├──────────────────────────────────────────────────────────────────┤
│ - id: Integer {PK, autoincrement}                               │
│ - nome_completo: String {NOT NULL, 3-150 chars}                 │
│ - email: String {NOT NULL, UNIQUE}                               │
│ - senha_hash: String {NOT NULL}                                  │
│ - cpf: String {UNIQUE, opcional}                                 │
│ - data_nascimento: String {opcional}                             │
│ - tipo: Enum {'paciente','medico','cuidador','admin'}            │
│ - especialidade: String {opcional}                               │
│ - criado_em: DateTime {DEFAULT = now}                            │
│ - ativo: Boolean {DEFAULT = true}                                │
├──────────────────────────────────────────────────────────────────┤
│ + registrar(dados): Token JWT                                    │
│ + login(credenciais): Token JWT                                  │
│ + obterPerfil(): Usuario                                        │
│ + atualizarPerfil(dados): Usuario                               │
└──────────┬───────────────────────────────────────────────────────┘
           │
           │ 1
           │
           │ *
┌──────────┴───────────────────────────────────────────────────────┐
│                        <<entity>>                                │
│                         Exame                                    │
├──────────────────────────────────────────────────────────────────┤
│ - id: Integer {PK}                                               │
│ - usuario_id: Integer {FK → Usuario.id, ON DELETE CASCADE}       │
│ - nome: String {NOT NULL}                                        │
│ - tipo: String                                                   │
│ - laboratorio: String                                            │
│ - data_exame: String                                             │
│ - resultado: String                                              │
│ - arquivo: String                                                │
│ - criado_em: DateTime                                            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        <<entity>>                                │
│                         Receita                                  │
├──────────────────────────────────────────────────────────────────┤
│ - id: Integer {PK}                                               │
│ - usuario_id: Integer {FK → Usuario.id, ON DELETE CASCADE}       │
│ - medico: String                                                 │
│ - medicamento: String {NOT NULL}                                 │
│ - dosagem: String                                                │
│ - instrucoes: String                                             │
│ - data_emissao: String                                           │
│ - validade: String                                               │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        <<entity>>                                │
│                         Consulta                                 │
├──────────────────────────────────────────────────────────────────┤
│ - id: Integer {PK}                                               │
│ - usuario_id: Integer {FK → Usuario.id, ON DELETE CASCADE}       │
│ - medico: String                                                 │
│ - especialidade: String                                          │
│ - data: String                                                   │
│ - local: String                                                  │
│ - observacoes: String                                            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        <<entity>>                                │
│                        Medicamento                               │
├──────────────────────────────────────────────────────────────────┤
│ - id: Integer {PK}                                               │
│ - usuario_id: Integer {FK → Usuario.id, ON DELETE CASCADE}       │
│ - nome: String {NOT NULL}                                        │
│ - dosagem: String                                                │
│ - inicio: String                                                 │
│ - fim: String                                                    │
│ - ativo: Boolean {DEFAULT = true}                                │
├──────────────────────────────────────────────────────────────────┤
│  1                                                               │
│  │                                                               │
│  │ *                                                             │
├──┴───────────────────────────────────────────────────────────────┤
│                        <<entity>>                                │
│                    HorarioMedicamento                             │
├──────────────────────────────────────────────────────────────────┤
│ - id: Integer {PK}                                               │
│ - medicamento_id: Integer {FK → Medicamento.id, ON DELETE CASCADE}│
│ - hora: String {NOT NULL, formato HH:MM}                         │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        <<entity>>                                │
│                         Sintoma                                  │
├──────────────────────────────────────────────────────────────────┤
│ - id: Integer {PK}                                               │
│ - usuario_id: Integer {FK → Usuario.id, ON DELETE CASCADE}       │
│ - data: String {NOT NULL}                                        │
│ - tipo: String                                                   │
│ - intensidade: Integer {CHECK 1-10}                              │
│ - descricao: String                                              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        <<entity>>                                │
│                        Compromisso                               │
├──────────────────────────────────────────────────────────────────┤
│ - id: Integer {PK}                                               │
│ - usuario_id: Integer {FK → Usuario.id, ON DELETE CASCADE}       │
│ - titulo: String {NOT NULL}                                      │
│ - descricao: String                                              │
│ - data: String {NOT NULL}                                        │
│ - hora: String                                                   │
│ - local: String                                                  │
│ - tipo: Enum {'compromisso','medico','exame','outro'}            │
│ - criado_em: DateTime                                            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        <<entity>>                                │
│                         Lembrete                                 │
├──────────────────────────────────────────────────────────────────┤
│ - id: Integer {PK}                                               │
│ - usuario_id: Integer {FK → Usuario.id, ON DELETE CASCADE}       │
│ - titulo: String {NOT NULL}                                      │
│ - mensagem: String                                               │
│ - data: String {NOT NULL}                                        │
│ - hora: String                                                   │
│ - recorrente: Boolean {DEFAULT = false}                          │
│ - concluido: Boolean {DEFAULT = false}                           │
│ - criado_em: DateTime                                            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        <<entity>>                                │
│                       Notificacao                                │
├──────────────────────────────────────────────────────────────────┤
│ - id: Integer {PK}                                               │
│ - usuario_id: Integer {FK → Usuario.id, ON DELETE CASCADE}       │
│ - mensagem: String {NOT NULL}                                    │
│ - categoria: String                                              │
│ - visualizada: Boolean {DEFAULT = false}                         │
│ - data_hora: DateTime {DEFAULT = now}                            │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        <<entity>>                                │
│                     RegistroLogin                                │
├──────────────────────────────────────────────────────────────────┤
│ - id: Integer {PK}                                               │
│ - usuario_id: Integer {FK → Usuario.id, ON DELETE CASCADE}       │
│ - email: String {NOT NULL}                                       │
│ - sucesso: Boolean {NOT NULL, DEFAULT = true}                    │
│ - ip: String                                                     │
│ - user_agent: String                                             │
│ - criado_em: DateTime {DEFAULT = now}                            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 10. Diagrama de Sequência — Fluxo de Autenticação (UML 2.5.1)

```
 Visitante         Frontend          API/Express        bcrypt         SQLite          JWT
     │                │                  │                │              │              │
     │  1. Preenche   │                  │                │              │              │
     │  formulário    │                  │                │              │              │
     │───────────────►│                  │                │              │              │
     │                │  2. POST         │                │              │              │
     │                │  /usuarios/login │                │              │              │
     │                │─────────────────►│                │              │              │
     │                │                  │ 3. SELECT      │              │              │
     │                │                  │ usuario by     │              │              │
     │                │                  │ email          │              │              │
     │                │                  │──────────────────────────────►│              │
     │                │                  │                │              │              │
     │                │                  │ 4. Resultado   │              │              │
     │                │                  │◄──────────────────────────────│              │
     │                │                  │                │              │              │
     │                │                  │ 5. compare     │              │              │
     │                │                  │ senha vs hash  │              │              │
     │                │                  │───────────────►│              │              │
     │                │                  │                │              │              │
     │                │                  │ 6. true/false  │              │              │
     │                │                  │◄───────────────│              │              │
     │                │                  │                │              │              │
     │                │                  │ 7. INSERT      │              │              │
     │                │                  │ registro_login │              │              │
     │                │                  │──────────────────────────────►│              │
     │                │                  │                │              │              │
     │                │                  │ 8. sign        │              │              │
     │                │                  │ (id,email,     │              │              │
     │                │                  │  tipo)         │              │              │
     │                │                  │─────────────────────────────────────────────►│
     │                │                  │                │              │              │
     │                │                  │ 9. token JWT   │              │              │
     │                │                  │◄─────────────────────────────────────────────│
     │                │                  │                │              │              │
     │                │  10. {token,     │                │              │              │
     │                │   usuario}       │                │              │              │
     │                │◄─────────────────│                │              │              │
     │  11. Redirec.  │                  │                │              │              │
     │  Dashboard     │                  │                │              │              │
     │◄───────────────│                  │                │              │              │
```

---

## 11. Estados e Ciclo de Vida

### 11.1 Diagrama de Estados — Usuário

```
                    ┌───────────────┐
                    │   Criado     │
                    │  (novo cadastro)│
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
              ┌─────│   Ativo      │◄─────┐
              │     │  (login OK)  │      │
              │     └───────┬───────┘      │
              │             │              │
              │             ▼              │
              │     ┌───────────────┐      │
              │     │  Desativado  │──────┘
              │     │  (admin toggle)│  Reativado
              │     └───────┬───────┘
              │             │
              │             ▼
              │     ┌───────────────┐
              │     │  Excluído    │
              │     │  (permanente)│
              │     └───────────────┘
              │
              │ Reativado
              └───────────────────────────
```

### 11.2 Diagrama de Estados — Lembrete

```
                    ┌───────────────┐
                    │   Criado     │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
              ┌─────│  Pendente    │◄─────┐
              │     │ (concluido=0)│      │
              │     └───────┬───────┘      │
              │             │              │
              │             ▼              │
              │     ┌───────────────┐      │
              │     │  Concluído   │──────┘
              │     │ (concluido=1) │  Desmarcar
              │     └───────┬───────┘
              │             │
              │             ▼
              │     ┌───────────────┐
              │     │  Excluído    │
              │     └───────────────┘
```

---

## 12. Diagrama de Pacotes

```
┌─────────────────────────────────────────────────────────┐
│                    <<package>>                          │
│                     SAFEMED                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │   <<package>>        │  │   <<package>>        │    │
│  │   api/src/           │  │   frontend/          │    │
│  ├──────────────────────┤  ├──────────────────────┤    │
│  │ ┌──────────────────┐ │  │ ┌──────────────────┐ │    │
│  │ │ config/          │ │  │ │ js/modulos/      │ │    │
│  │ │ - config.js      │ │  │ │ - login.js       │ │    │
│  │ │ - conexaoBanco.js│ │  │ │ - cadastro.js    │ │    │
│  │ └──────────────────┘ │  │ │ - dashboard.js   │ │    │
│  │ ┌──────────────────┐ │  │ │ - prontuario.js  │ │    │
│  │ │ controladores/   │ │  │ │ - medicamentos.js│ │    │
│  │ │ - usuarioCtrl    │ │  │ │ - sintomas.js    │ │    │
│  │ │ - prontuarioCtrl │ │  │ │ - agenda.js      │ │    │
│  │ │ - medicamentoCtrl│ │  │ │ - relatorios.js  │ │    │
│  │ │ - sintomaCtrl    │ │  │ │ - admin.js       │ │    │
│  │ │ - agendaCtrl     │ │  │ │ - adminUsuarios │ │    │
│  │ │ - adminCtrl      │ │  │ └──────────────────┘ │    │
│  │ └──────────────────┘ │  │ ┌──────────────────┐ │    │
│  │ ┌──────────────────┐ │  │ │ js/              │ │    │
│  │ │ rotas/           │ │  │ │ - app.js         │ │    │
│  │ │ - usuarioRotas   │ │  │ │ - api.js         │ │    │
│  │ │ - prontuarioRotas│ │  │ │ - mascaras.js    │ │    │
│  │ │ - medicamentoRota│ │  │ └──────────────────┘ │    │
│  │ │ - sintomaRotas   │ │  └──────────────────────┘    │
│  │ │ - agendaRotas    │ │                              │
│  │ │ - adminRotas     │ │                              │
│  │ └──────────────────┘ │                              │
│  │ ┌──────────────────┐ │                              │
│  │ │ utilitarios/     │ │                              │
│  │ │ - validadores.js │ │                              │
│  │ │ - autenticacao.js│ │                              │
│  │ └──────────────────┘ │                              │
│  └──────────────────────┘                              │
└─────────────────────────────────────────────────────────┘
```

---

## 13. Matriz de Acesso (RBAC)

| Endpoint | Paciente | Médico | Cuidador | Admin | Não Autenticado |
|---|---|---|---|---|---|
| POST /api/usuarios/registro | — | — | — | — | ✓ |
| POST /api/usuarios/login | — | — | — | — | ✓ |
| GET /api/usuarios/perfil | ✓ | ✓ | ✓ | ✓ | — |
| PUT /api/usuarios/perfil | ✓ | ✓ | ✓ | ✓ | — |
| GET/POST/PUT/DELETE /api/exames | ✓ | ✓ | ✓ | ✓ | — |
| GET/POST/PUT/DELETE /api/receitas | ✓ | ✓ | ✓ | ✓ | — |
| GET/POST/PUT/DELETE /api/consultas | ✓ | ✓ | ✓ | ✓ | — |
| GET/POST/PUT/DELETE /api/medicamentos | ✓ | ✓ | ✓ | ✓ | — |
| GET/POST/DELETE /api/medicamentos/:id/horarios | ✓ | ✓ | ✓ | ✓ | — |
| GET /api/notificacoes | ✓ | ✓ | ✓ | ✓ | — |
| GET/POST/PUT/DELETE /api/sintomas | ✓ | ✓ | ✓ | ✓ | — |
| GET /api/sintomas/relatorio | ✓ | ✓ | ✓ | ✓ | — |
| GET/POST/PUT/DELETE /api/compromissos | ✓ | ✓ | ✓ | ✓ | — |
| GET/POST/PUT/DELETE /api/lembretes | ✓ | ✓ | ✓ | ✓ | — |
| GET /api/admin/estatisticas | — | — | — | ✓ | — |
| GET/PUT/DELETE /api/admin/usuarios | — | — | — | ✓ | — |
| GET /api/admin/registros-login | — | — | — | ✓ | — |
| GET /api/health | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## 14. Cenários de Teste (Exemplos)

### TC01 — Cadastro com sucesso

| Passo | Ação | Resultado Esperado |
|---|---|---|
| 1 | Acessar `#/cadastro` | Formulário exibido |
| 2 | Preencher nome="João Silva" | Campo válido |
| 3 | Preencher email="joao@email.com" | Campo válido |
| 4 | Preencher senha="123456" | Campo válido |
| 5 | Selecionar tipo="paciente" | Tipo selecionado |
| 6 | Clicar "Cadastrar" | Botão habilitado |
| 7 | Aguardar resposta | HTTP 201 + token JWT + redirecionamento ao Dashboard |

### TC02 — Cadastro com e-mail duplicado

| Passo | Ação | Resultado Esperado |
|---|---|---|
| 1 | Acessar `#/cadastro` | Formulário exibido |
| 2 | Preencher email existente | — |
| 3 | Submeter formulário | HTTP 409 "E-mail já cadastrado." |

### TC03 — Login com credenciais inválidas

| Passo | Ação | Resultado Esperado |
|---|---|---|
| 1 | Acessar `#/login` | Formulário exibido |
| 2 | Preencher email e senha incorretos | — |
| 3 | Submeter | HTTP 401 "Credenciais inválidas." |
| 4 | Verificar registros_login | Registro de falha com IP e user-agent |

### TC04 — Tentativa de acesso admin por usuário comum

| Passo | Ação | Resultado Esperado |
|---|---|---|
| 1 | Login como paciente | Token com tipo='paciente' |
| 2 | Acessar `#/admin` | Redirecionado para `#/dashboard` |

---

## 15. Premissas e Restrições

### 15.1 Premissas

| ID | Premissa |
|---|---|
| P01 | Node.js v18+ está disponível no ambiente de execução |
| P02 | O banco SQLite é adequado para o volume de dados esperado |
| P03 | A aplicação é acessada via navegador web moderno (Chrome, Firefox, Safari, Edge) |
| P04 | A rede está disponível para comunicação frontend-backend |

### 15.2 Restrições

| ID | Restrição |
|---|---|
| R01 | Limite de 10kb por requisição HTTP |
| R02 | Paginação máxima de 100 itens por consulta |
| R03 | Senhas devem ter no mínimo 6 caracteres |
| R04 | Token JWT expira em 24h (configurável) |
| R05 | O tipo 'admin' não pode ser criado via cadastro público |
| R06 | Administrador não pode excluir ou desativar a própria conta |

---

## 16. Aprovação

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
