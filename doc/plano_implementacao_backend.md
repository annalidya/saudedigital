# Plano de Implementação do Backend — SAFEMED

> **Referência:** `doc/plano_mudanca_projeto.md` (seções 6, 7 e 8)
> **Objetivo:** implementar a API RESTful do SAFEMED em Node.js + Express + SQLite, mantendo a arquitetura em camadas (`config/`, `controladores/`, `rotas/`, `utilitarios/`) e o padrão de respostas `{ sucesso, mensagem, erros, dados }`.
> **Data:** 11/08/2026 | **Atualizado:** 31/08/2026

---

## 1. Escopo

Implementar o **backend** da API do SAFEMED:

- Base de dados SQLite (`safemed.db`) com todas as tabelas do domínio clínico.
- Autenticação segura (hash de senha + token JWT) e controle de permissões.
- CRUDs de usuários, exames, receitas, consultas, medicamentos, horários, notificações, sintomas, compromissos e lembretes.
- Painel administrativo com estatísticas e gestão de usuários.
- Registros de login para auditoria.

**Funcionalidades implementadas:**
- ✅ Autenticação JWT com hash bcrypt
- ✅ CRUD de exames, receitas e consultas (prontuário)
- ✅ CRUD de medicamentos com horários
- ✅ CRUD de sintomas com relatório estatístico
- ✅ CRUD de compromissos e lembretes (agenda)
- ✅ Painel administrativo com estatísticas
- ✅ Gestão de usuários (admin)
- ✅ Registros de login (auditoria)
- ✅ Validação e sanitização de dados

**Fora do escopo (melhorias futuras):** chat entre usuários, permissões de compartilhamento de prontuário, recuperação de senha, integração externa, biometria e IA.

---

## 2. Estrutura de Arquivos Implementados

### Arquivos Implementados
| Arquivo | Responsabilidade |
|---|---|
| `api/src/config/conexaoBanco.js` | Conexão com banco SQLite |
| `api/iniciarBanco.js` | DDL de todas as tabelas, migrações e seed do admin |
| `api/src/app.js` | Configuração Express com todas as rotas |
| `api/src/server.js` | Servidor HTTP |
| `api/package.json` | Dependências do projeto |
| `api/.env` | Variáveis de ambiente (não versionar) |
| `api/src/utilitarios/autenticacao.js` | Hash/verificação de senha, JWT e middlewares |
| `api/src/utilitarios/validadores.js` | Validadores por domínio com sanitização |
| `api/src/controladores/usuarioControlador.js` | Registro, login e perfil |
| `api/src/controladores/prontuarioControlador.js` | Exames, receitas e consultas |
| `api/src/controladores/medicamentoControlador.js` | Medicamentos, horários e notificações |
| `api/src/controladores/sintomaControlador.js` | Diário de sintomas e relatório |
| `api/src/controladores/agendaControlador.js` | Compromissos e lembretes |
| `api/src/controladores/adminControlador.js` | Estatísticas, gestão de usuários e registros de login |
| `api/src/rotas/usuarioRotas.js` | Endpoints de usuários |
| `api/src/rotas/prontuarioRotas.js` | Endpoints de exames/receitas/consultas |
| `api/src/rotas/medicamentoRotas.js` | Endpoints de medicamentos/horários/notificações |
| `api/src/rotas/sintomaRotas.js` | Endpoints de sintomas |
| `api/src/rotas/agendaRotas.js` | Endpoints de compromissos e lembretes |
| `api/src/rotas/adminRotas.js` | Endpoints administrativos |

---

## 3. Endpoints Implementados

### Usuários
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/api/usuarios/registro` | — | Cadastro (paciente/médico/cuidador) |
| POST | `/api/usuarios/login` | — | Login → retorna token JWT |
| GET | `/api/usuarios/perfil` | Sim | Obter perfil do usuário logado |
| PUT | `/api/usuarios/perfil` | Sim | Atualizar perfil |

### Prontuário (exames, receitas, consultas)
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| GET | `/api/exames` | Sim | Listar exames do usuário |
| POST | `/api/exames` | Sim | Cadastrar exame |
| GET | `/api/exames/:id` | Sim | Obter exame específico |
| PUT | `/api/exames/:id` | Sim | Atualizar exame |
| DELETE | `/api/exames/:id` | Sim | Excluir exame |
| GET | `/api/receitas` | Sim | Listar receitas do usuário |
| POST | `/api/receitas` | Sim | Cadastrar receita |
| PUT | `/api/receitas/:id` | Sim | Atualizar receita |
| DELETE | `/api/receitas/:id` | Sim | Excluir receita |
| GET | `/api/consultas` | Sim | Listar consultas do usuário |
| POST | `/api/consultas` | Sim | Cadastrar consulta |
| GET | `/api/consultas/:id` | Sim | Obter consulta específica |
| PUT | `/api/consultas/:id` | Sim | Atualizar consulta |
| DELETE | `/api/consultas/:id` | Sim | Excluir consulta |

### Medicamentos, horários e notificações
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| GET | `/api/medicamentos` | Sim | Listar medicamentos |
| POST | `/api/medicamentos` | Sim | Cadastrar medicamento |
| PUT | `/api/medicamentos/:id` | Sim | Atualizar medicamento |
| DELETE | `/api/medicamentos/:id` | Sim | Excluir medicamento |
| POST | `/api/medicamentos/:id/horarios` | Sim | Adicionar horário |
| GET | `/api/medicamentos/:id/horarios` | Sim | Listar horários |
| DELETE | `/api/medicamentos/:id/horarios/:horarioId` | Sim | Excluir horário |
| GET | `/api/notificacoes` | Sim | Listar notificações |

### Sintomas
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| GET | `/api/sintomas` | Sim | Listar sintomas |
| POST | `/api/sintomas` | Sim | Cadastrar sintoma |
| PUT | `/api/sintomas/:id` | Sim | Atualizar sintoma |
| DELETE | `/api/sintomas/:id` | Sim | Excluir sintoma |
| GET | `/api/sintomas/relatorio` | Sim | Relatório com estatísticas |

### Agenda (Compromissos e Lembretes)
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| GET | `/api/compromissos` | Sim | Listar compromissos |
| POST | `/api/compromissos` | Sim | Cadastrar compromisso |
| PUT | `/api/compromissos/:id` | Sim | Atualizar compromisso |
| DELETE | `/api/compromissos/:id` | Sim | Excluir compromisso |
| GET | `/api/lembretes` | Sim | Listar lembretes |
| POST | `/api/lembretes` | Sim | Cadastrar lembrete |
| PUT | `/api/lembretes/:id` | Sim | Atualizar lembrete |
| DELETE | `/api/lembretes/:id` | Sim | Excluir lembrete |

### Administração (requer token de admin)
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| GET | `/api/admin/estatisticas` | Admin | Estatísticas gerais do sistema |
| GET | `/api/admin/usuarios` | Admin | Listar usuários (busca e filtro) |
| GET | `/api/admin/usuarios/:id` | Admin | Obter detalhe de um usuário |
| PUT | `/api/admin/usuarios/:id/status` | Admin | Ativar/desativar usuário |
| DELETE | `/api/admin/usuarios/:id` | Admin | Excluir usuário |
| GET | `/api/admin/registros-login` | Admin | Listar registros de login |

### Infra
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Health check |

---

## 4. Sequência de Implementação

1. **Base e configuração** — `conexaoBanco.js`, `iniciarBanco.js`, `.env`, `package.json`.
2. **Utilitários** — `autenticacao.js`, `criptografia.js`, `validadores.js`.
3. **Controladores + rotas**, por domínio:
   - Usuários/permissões → validação de fluxo registro→login→perfil.
   - Prontuário (exames, receitas, consultas).
   - Medicamentos + horários + notificações + `gerarLembretes.js`.
   - Sintomas + relatório de sintomas.
   - Mensagens com criptografia.
   - Relatório consolidado.
4. **App/server** — montar rotas, proteger rotas por JWT, gerar lembretes na subida.
5. **Limpeza** — remover `leadControlador.js`, `leadRotas.js` e `landing.db`.
6. **Testes** — fluxo completo via `curl` (seção "Como testar").

---

## 5. Regras de Segurança Aplicadas

- Senhas armazenadas apenas como **hash (bcryptjs)** — nunca em texto plano.
- Token **JWT** em header `Authorization: Bearer <token>` para rotas protegidas.
- Middleware `autenticar` valida token, injeta `req.usuario` e verifica se a conta está ativa.
- Middleware `autorizarAdmin` restringe endpoints administrativos a usuários `admin`.
- Validação/sanitização de todas as entradas via `validator` (anti-XSS e SQL Injection).
- Prepared statements em todas as consultas ao banco.
- `helmet` ativo, `CORS` restrito a `ORIGEM_PERMITIDA`, payload limitado a 10kb.
- Registros de login (sucesso e falha) com IP e user-agent para auditoria.
- Conta desativada (`ativo = 0`) não consegue mais logar nem usar a API.
- Admin não pode desativar/excluir a própria conta.

---

## 6. Como Testar (exemplo com `curl`)

```bash
# Iniciar
cd api && npm install && npm run dev

# Registro
curl -X POST http://localhost:3000/api/usuarios/registro \
  -H "Content-Type: application/json" \
  -d '{"nome_completo":"Maria Silva","email":"maria@exemplo.com","senha":"123456","tipo":"paciente"}'

# Login (substitua pelas credenciais reais)
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@exemplo.com","senha":"123456"}'

# Cadastrar exame (usando TOKEN retornado no login)
curl -X POST http://localhost:3000/api/exames \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Hemograma","tipo":"sangue","laboratorio":"Lab Vida","data_exame":"2026-08-01","resultado":"Normal"}'
```

Fluxo completo testado na seção de verificação.

---

## 7. Critérios de Conclusão

- [x] `safemed.db` criado com todas as tabelas e índices.
- [x] Registro e login funcionando com hash bcrypt e JWT.
- [x] CRUDs de exames, receitas, consultas, medicamentos, horários e sintomas validando/sanitizando entradas.
- [x] CRUDs de compromissos e lembretes (agenda) funcionando.
- [x] Painel administrativo com estatísticas e gestão de usuários.
- [x] Registros de login para auditoria.
- [x] Conta desativada não consegue mais logar/usar a API.
- [x] Endpoints `/api/admin/*` respondem `403` para usuários não-admin.
- [x] `README.md` atualizado.