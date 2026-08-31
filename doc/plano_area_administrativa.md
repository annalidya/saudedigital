# Plano da Área Administrativa — SAFEMED

> **Referência:** `README.md` (endpoints, modelagem e estrutura)
> **Objetivo:** implementar a área administrativa do SAFEMED, permitindo que um usuário `admin` gerencie cadastros e visualize estatísticas do sistema.
> **Arquitetura:** segue o mesmo padrão do projeto — backend em camadas (`config/`, `controladores/`, `rotas/`, `utilitarios/`) com SQLite + Express e frontend SPA (JavaScript + Tailwind) com um módulo por tela em `frontend/js/modulos/`.
> **Padrão de respostas da API:** `{ sucesso, mensagem, erros, dados }`.
> **Data:** 18/08/2026

---

## 1. Escopo

Criar a área administrativa **restrita ao tipo `admin`**, com:

- **Painel administrativo** — estatísticas gerais do sistema (totais por módulo e tipos de usuário).
- **Gestão de usuários** — listar, pesquisar, filtrar, visualizar, ativar/desativar e excluir usuários.

**Regras de acesso:** apenas usuários com `tipo === 'admin'` e token JWT válido acessam os endpoints `/api/admin/*`. Contas **desativadas** (`ativo = 0`) não podem mais fazer login nem usar a API.

**Fora do escopo desta etapa:** chat entre usuários, permissões de compartilhamento de prontuário e recuperação de senha (mencionados no plano de backend, mas independentes da área administrativa).

---

## 2. Alterações no Banco de Dados

**Arquivo:** `api/iniciarBanco.js`

### 2.1. Novo tipo de usuário `admin`

Ampliar o `CHECK` da tabela `usuarios` para aceitar `admin` (a migração é feita recriando a tabela ou com `ALTER` para banco novo):

```sql
tipo TEXT NOT NULL DEFAULT 'paciente'
     CHECK(tipo IN ('paciente','medico','cuidador','admin'))
```

### 2.2. Coluna `ativo` na tabela `usuarios`

Permitir que o admin desative uma conta sem apagar os dados clínicos:

```sql
ativo INTEGER NOT NULL DEFAULT 1
```

> **Migração:** para bancos já existentes, executar `ALTER TABLE usuarios ADD COLUMN ativo INTEGER NOT NULL DEFAULT 1;` antes dos próximos passos.

### 2.3. Criação do usuário e senha do administrador

Ao subir o servidor (em `api/iniciarBanco.js`, logo após a criação das tabelas), o sistema deve verificar se o administrador já existe e, se não existir, criá-lo automaticamente. A senha **nunca é armazenada em texto puro** — ela passa pelo mesmo fluxo de hash bcrypt usado no cadastro normal (`criarHash` de `api/src/utilitarios/autenticacao.js`).

**Dados do administrador padrão:**

| Campo | Valor |
|---|---|
| **E-mail** | `admin@safemed.com` |
| **Tipo** | `admin` |
| **Nome** | Administrador SAFEMED |

> **Importante:** A senha do administrador deve ser definida via variável de ambiente ou alterada no primeiro acesso. Nunca exponha credenciais em documentação ou código fonte.

**Lógica do seed em `iniciarBanco.js`:**

```js
const { criarHash } = require('./src/utilitarios/autenticacao')

function criarAdministrador() {
  const email = 'admin@safemed.com'
  const existe = banco.prepare('SELECT id FROM usuarios WHERE email = ?').get(email)
  if (existe) return // já criado
  const senhaPadrao = process.env.ADMIN_SENHA || 'altere-estas-senha'
  banco.prepare(
    `INSERT INTO usuarios (nome_completo, email, senha_hash, tipo, especialidade)
     VALUES (?, ?, ?, 'admin', 'Administrador do Sistema')`
  ).run('Administrador SAFEMED', email, criarHash(senhaPadrao))
}
criarAdministrador()
```

**Considerações:**
- A senha padrão deve ser alterada depois pelo próprio administrador (troca de senha fica como melhoria futura).
- Para produção, as credenciais devem vir do `.env` (ex.: `ADMIN_EMAIL` e `ADMIN_SENHA`) em vez de ficarem fixas no código.
- Como o login do admin usa o endpoint público `POST /api/usuarios/login`, o hash é gerado com o mesmo `criarHash` e verificado com `verificarSenha`, sem nenhuma rota especial.

---

## 3. Backend — Novos Arquivos e Alterações

### 3.1. `api/src/utilitarios/autenticacao.js` (ALTERAR)

| Função | Ação |
|---|---|
| `autenticar` | Adicionar verificação de `ativo = 0` → responder `403` com `{ sucesso:false, mensagem:'Conta desativada.' }` |
| `autorizarAdmin` | **NOVO** — middleware que exige `req.usuario.tipo === 'admin'`, senão responde `403` |

Ordem de uso: `rotas.get('/...', autenticar, autorizarAdmin, handler)`.

> **Observação importante:** o middleware `autenticar` só injeta `req.usuario` a partir do **token JWT**. Como o `tipo` e o `id` ficam gravados no token, a consulta ao banco no `autorizarAdmin` e em todos os handlers administrativos deve SEMPRE ler o usuário atual do banco para evitar ação com dados antigos (ex.: usuário que virou `admin` não pode usar admin até relogar, e usuário que foi desativado tem o acesso negado imediatamente).

### 3.2. `api/src/controladores/adminControlador.js` (NOVO)

Padrão: cada função segue o estilo atual (`try/catch` → `res.status(...).json(...)`) e usa prepared statements.

| Função | Endpoint | Descrição |
|---|---|---|
| `estatisticasSistema` | `GET /api/admin/estatisticas` | Conta `usuarios` (total e por tipo), `exames`, `receitas`, `consultas`, `medicamentos`, `sintomas`, `notificacoes` + últimos 5 cadastros |
| `listarUsuarios` | `GET /api/admin/usuarios` | Lista paginada com busca por nome/email (`?busca=`) e filtro por tipo (`?tipo=`) |
| `obterUsuario` | `GET /api/admin/usuarios/:id` | Detalhe do usuário (id, nome, email, cpf, tipo, ativo, criado_em, especialidade) |
| `alterarStatusUsuario` | `PUT /api/admin/usuarios/:id/status` | Ativa (`ativo=1`) ou desativa (`ativo=0`) uma conta |
| `removerUsuario` | `DELETE /api/admin/usuarios/:id` | Exclui usuário (dependências apagam via `ON DELETE CASCADE`) |

Regras de negócio:
- O admin **não pode desativar/excluir a si mesmo** (evita remover o próprio acesso).
- Não existe edição de senha nem de email nesta versão (fica como melhoria futura).

### 3.3. `api/src/rotas/adminRotas.js` (NOVO)

Seguindo o padrão dos demais roteadores:

```js
const { Router } = require('express')
const { autenticar, autorizarAdmin } = require('../utilitarios/autenticacao')
const { estatisticasSistema, listarUsuarios, obterUsuario, alterarStatusUsuario, removerUsuario } = require('../controladores/adminControlador')

const rotas = Router()

rotas.use(autenticar, autorizarAdmin)

rotas.get('/admin/estatisticas', estatisticasSistema)
rotas.get('/admin/usuarios', listarUsuarios)
rotas.get('/admin/usuarios/:id', obterUsuario)
rotas.put('/admin/usuarios/:id/status', alterarStatusUsuario)
rotas.delete('/admin/usuarios/:id', removerUsuario)

module.exports = rotas
```

### 3.4. `api/src/app.js` (ALTERAR)

```js
const rotasAdmin = require('./rotas/adminRotas')
// ...
app.use('/api', rotasAdmin)
```

---

## 4. Frontend — Novos Arquivos e Alterações

### 4.1. `frontend/js/app.js` (ALTERAR)

**Novas rotas no roteador:**

```js
'/admin': { titulo: 'Administração', carregar: () => App.carregarTela('admin'), protegida: true, admin: true },
'/admin/usuarios': { titulo: 'Gestão de Usuários', carregar: () => App.carregarTela('adminUsuarios'), protegida: true, admin: true }
```

**Bloqueio de acesso** — em `navegar()`, se a rota tiver `admin: true` e o usuário logado não for admin, redirecionar para `#/dashboard`:

```js
const usuario = auth.obterUsuario()
if (config.admin && usuario?.tipo !== 'admin') {
  window.location.hash = '#/dashboard'
  return
}
```

**Sidebar condicional** — adicionar os itens do admin somente quando `usuario.tipo === 'admin'`:

```js
const itensAdmin = [
  { icone: '🛡️', texto: 'Administração', rota: '/admin' },
  { icone: '👥', texto: 'Usuários', rota: '/admin/usuarios' }
]
```

Colocar a seção admin na sidebar **após os itens do usuário**, separada por divisor.

### 4.2. `frontend/js/modulos/admin.js` (NOVO) — Painel Administrativo

- **Formato:** segue o padrão `export default function renderizarAdmin(usuario)` + `export async function inicializar()`.
- **Conteúdo:**
  - Cards de estatísticas: total de usuários, médicos, pacientes, cuidadores, exames, receitas, consultas, medicamentos, sintomas.
  - Lista dos últimos 5 cadastros (nome, tipo, data).
  - Botões de acesso rápido para `#/admin/usuarios` e demais telas.
  - `inicializar()` → `api.get('/admin/estatisticas')` e preenche os contadores (mesmo padrão do `dashboard.js`).

### 4.3. `frontend/js/modulos/adminUsuarios.js` (NOVO) — Gestão de Usuários

- **Busca/filtro:** campo de busca por nome/email + select de tipo (todos/paciente/médico/cuidador/admin), reconsultando `api.get('/admin/usuarios?busca=...&tipo=...')`.
- **Lista:** tabela com nome, e-mail, tipo (badge colorido), status (Ativo/Inativo), data de cadastro e ações.
- **Ações por usuário:**
  - Botão ativar/desativar → `PUT /admin/usuarios/:id/status` (com confirmação).
  - Botão excluir → `DELETE /admin/usuarios/:id` (com confirmação `confirm()`).
  - Não exibir as ações de desativar/excluir para o **próprio admin logado**.
- Todo resultado usa `App.toast(...)` (sucesso/vermelho) igual às demais telas.

---

## 5. Sequência de Implementação

1. **Banco** — `iniciarBanco.js`: tipo `admin`, coluna `ativo`, seed do admin. Rodar `node iniciarBanco.js`.
2. **Autenticação** — `autenticacao.js`: bloqueio de conta inativa + middleware `autorizarAdmin`.
3. **Admin no backend** — `adminControlador.js` + `adminRotas.js` + registro em `app.js`.
4. **Testes via curl** — login admin → `GET /api/admin/estatisticas` → listar usuários → desativar/ativar → tentar login do usuário desativado (deve falhar).
5. **Admin no frontend** — rotas e bloqueio em `app.js` + sidebar condicional.
6. **Modulos** — `admin.js` e `adminUsuarios.js`.
7. **Polimento** — badges de tipo, confirmações, responsividade (Tailwind) e revisão do `README.md`.

---

## 6. Testes (exemplos com `curl`)

```bash
# Login admin (substitua <EMAIL_ADMIN> e <SENHA_ADMIN> pelas credenciais reais)
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<EMAIL_ADMIN>","senha":"<SENHA_ADMIN>"}'
# → pegar o token da resposta

TOKEN="<token_admin>"

# Estatísticas do sistema
curl http://localhost:3000/api/admin/estatisticas -H "Authorization: Bearer $TOKEN"

# Listar usuários (busca e filtro opcionais)
curl "http://localhost:3000/api/admin/usuarios?busca=ana&tipo=paciente" -H "Authorization: Bearer $TOKEN"

# Desativar usuário 5
curl -X PUT http://localhost:3000/api/admin/usuarios/5/status \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"ativo":0}'

# Login do usuário desativado deve retornar 401/403
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<EMAIL_USUARIO>","senha":"<SENHA_USUARIO>"}'

# Acesso negado para não-admin
curl http://localhost:3000/api/admin/usuarios -H "Authorization: Bearer <token_nao_admin>"
# → 403
```

---

## 7. Critérios de Conclusão

- [ ] Banco com `tipo IN (... 'admin')`, coluna `ativo` e usuário admin criado.
- [ ] Conta desativada não consegue mais logar/usar a API.
- [ ] Endpoints `/api/admin/*` respondem `403` para usuários não-admin.
- [ ] Painel administrativo mostra todas as estatísticas.
- [ ] Gestão de usuários permite busca, filtro, visualizar, ativar/desativar e excluir.
- [ ] Admin não pode desativar/excluir a si mesmo.
- [ ] Sidebar exibe seção admin somente para `admin`.
- [ ] Rotas frontend `/admin` e `/admin/usuarios` bloqueadas para não-admin.
- [ ] `README.md` atualizado com a nova área.