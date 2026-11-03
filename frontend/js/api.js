// Cliente Fetch genérico para comunicação com a API
const API_BASE = `${window.location.origin}/api`

// Armazenamento local do token
function obterToken() {
  return localStorage.getItem('safemed_token')
}

function salvarToken(token) {
  localStorage.setItem('safemed_token', token)
}

function removerToken() {
  localStorage.removeItem('safemed_token')
}

function obterUsuario() {
  const dados = localStorage.getItem('safemed_usuario')
  return dados ? JSON.parse(dados) : null
}

function salvarUsuario(usuario) {
  localStorage.setItem('safemed_usuario', JSON.stringify(usuario))
}

function removerUsuario() {
  localStorage.removeItem('safemed_usuario')
}

// Função genérica para chamadas à API
async function apiFetch(endpoint, opcoes = {}) {
  const token = obterToken()
  const headers = {
    'Content-Type': 'application/json',
    ...opcoes.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const resposta = await fetch(`${API_BASE}${endpoint}`, {
    ...opcoes,
    headers
  })

  const dados = await resposta.json()

  if (resposta.status === 401) {
    removerToken()
    removerUsuario()
    window.location.hash = '#/login'
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  return dados
}

// Métodos HTTP
const api = {
  get: (endpoint) => apiFetch(endpoint),
  post: (endpoint, body) => apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  }),
  put: (endpoint, body) => apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body)
  }),
  delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' })
}

// Autenticação
const auth = {
  login: async (email, senha) => {
    const resultado = await api.post('/usuarios/login', { email, senha })
    if (resultado.sucesso) {
      salvarToken(resultado.dados.token)
      salvarUsuario(resultado.dados.usuario)
    }
    return resultado
  },

  cadastrar: (dados) => api.post('/usuarios/registro', dados),

  logout: () => {
    removerToken()
    removerUsuario()
    window.location.hash = '#/login'
  },

  estaLogado: () => !!obterToken(),

  obterUsuario: () => obterUsuario()
}

// Validação de formulários - habilita/desabilita botão de envio
function configurarValidacaoFormulario(formId, campos, botaoId) {
  const form = document.getElementById(formId)
  const botao = document.getElementById(botaoId)
  if (!form || !botao) return

  function validar() {
    let valido = true
    for (const campo of campos) {
      const el = document.getElementById(campo.id)
      if (!el) continue
      if (el.offsetParent === null && !campo.condicional) continue
      if (campo.condicional && !campo.condicional()) continue
      const valor = el.value.trim()
      if (valor === '' || (el.tagName === 'SELECT' && valor === '')) {
        valido = false
        break
      }
    }
    botao.disabled = !valido
  }

  for (const campo of campos) {
    const el = document.getElementById(campo.id)
    if (el) {
      el.addEventListener('input', validar)
      el.addEventListener('change', validar)
    }
  }

  validar()
}

// Exportar
window.api = api
window.auth = auth
window.configurarValidacaoFormulario = configurarValidacaoFormulario
