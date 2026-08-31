// Orquestrador principal da SPA - SAFEMED
const App = {
  // Roteador de rotas
  rotas: {
    '/login': { titulo: 'Login', carregar: () => App.carregarTela('login') },
    '/cadastro': { titulo: 'Cadastro', carregar: () => App.carregarTela('cadastro') },
    '/dashboard': { titulo: 'Dashboard', carregar: () => App.carregarTela('dashboard'), protegida: true },
    '/prontuario': { titulo: 'Prontuário', carregar: () => App.carregarTela('prontuario'), protegida: true },
    '/medicamentos': { titulo: 'Medicamentos', carregar: () => App.carregarTela('medicamentos'), protegida: true },
    '/sintomas': { titulo: 'Sintomas', carregar: () => App.carregarTela('sintomas'), protegida: true },
    '/agenda': { titulo: 'Agenda', carregar: () => App.carregarTela('agenda'), protegida: true },
    '/relatorios': { titulo: 'Relatórios', carregar: () => App.carregarTela('relatorios'), protegida: true },
    '/admin': { titulo: 'Administração', carregar: () => App.carregarTela('admin'), protegida: true, admin: true },
    '/admin/usuarios': { titulo: 'Gestão de Usuários', carregar: () => App.carregarTela('adminUsuarios'), protegida: true, admin: true }
  },

  // Inicializar aplicação
  init() {
    window.addEventListener('hashchange', () => App.navegar())
    App.navegar()
  },

  // Navegar para a rota atual
  navegar() {
    const hash = window.location.hash || '#/login'
    const rota = hash.replace('#', '')
    const config = App.rotas[rota]

    if (!config) {
      window.location.hash = '#/login'
      return
    }

    // Verificar se rota é protegida
    if (config.protegida && !auth.estaLogado()) {
      window.location.hash = '#/login'
      return
    }

    // Verificar se rota é restrita ao administrador
    if (config.admin) {
      const usuario = auth.obterUsuario()
      if (!usuario || usuario.tipo !== 'admin') {
        window.location.hash = '#/dashboard'
        return
      }
    }

    // Se logado e tentando acessar login/cadastro, redirecionar para dashboard
    if (auth.estaLogado() && (rota === '/login' || rota === '/cadastro')) {
      window.location.hash = '#/dashboard'
      return
    }

    document.title = `${config.titulo} - SAFEMED`
    config.carregar()
  },

  // Carregar tela
  async carregarTela(nome) {
    const container = document.getElementById('app')
    const usuario = auth.obterUsuario()

    // Carregar módulo da tela
    let modulo
    try {
      modulo = await import(`./modulos/${nome}.js`)
    } catch (erro) {
      console.error(`Erro ao carregar módulo "${nome}":`, erro)
      container.innerHTML = '<div class="min-h-screen flex items-center justify-center"><p class="text-red-500">Erro ao carregar a página.</p></div>'
      return
    }
    const conteudo = modulo.default(usuario)

    // Se usuário está logado, mostrar sidebar
    if (auth.estaLogado()) {
      container.innerHTML = `
        <div class="flex h-screen">
          ${App.renderSidebar(usuario)}
          <main class="flex-1 overflow-auto bg-gray-50">
            <div class="p-6">
              ${conteudo}
            </div>
          </main>
        </div>
      `
      App.eventosSidebar()
    } else {
      container.innerHTML = conteudo
    }

    // Inicializar eventos da tela
    if (modulo.inicializar) {
      modulo.inicializar(usuario)
    }
  },

  // Renderizar sidebar
  renderSidebar(usuario) {
    const itens = [
      { icone: '📊', texto: 'Dashboard', rota: '/dashboard' },
      { icone: '📋', texto: 'Prontuário', rota: '/prontuario' },
      { icone: '💊', texto: 'Medicamentos', rota: '/medicamentos' },
      { icone: '📈', texto: 'Sintomas', rota: '/sintomas' },
      { icone: '📅', texto: 'Agenda', rota: '/agenda' },
      { icone: '📄', texto: 'Relatórios', rota: '/relatorios' }
    ]

    const itensAdmin = [
      { icone: '🛡️', texto: 'Administração', rota: '/admin' },
      { icone: '👥', texto: 'Usuários', rota: '/admin/usuarios' }
    ]

    const itensSidebar = usuario?.tipo === 'admin'
      ? [...itens, { separador: true }, ...itensAdmin]
      : itens

    return `
      <aside class="w-64 bg-indigo-700 text-white flex flex-col">
        <div class="p-4 border-b border-indigo-600">
          <h1 class="text-xl font-bold">SAFEMED</h1>
          <p class="text-indigo-200 text-sm">${usuario?.nome_completo || 'Usuário'}</p>
        </div>
        <nav class="flex-1 p-4 overflow-y-auto">
          ${itensSidebar.map(item => {
            if (item.separador) {
              return `<div class="mt-4 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-indigo-300">Área administrativa</div>`
            }
            return `
            <a href="#${item.rota}" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-600 transition mb-1 sidebar-item" data-rota="${item.rota}">
              <span>${item.icone}</span>
              <span>${item.texto}</span>
            </a>
          `
          }).join('')}
        </nav>
        <div class="p-4 border-t border-indigo-600">
          <button onclick="auth.logout()" class="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-600 transition">
            <span>🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>
    `
  },

  // Eventos da sidebar
  eventosSidebar() {
    const hash = window.location.hash.replace('#', '')
    document.querySelectorAll('.sidebar-item').forEach(item => {
      if (item.dataset.rota === hash) {
        item.classList.add('bg-indigo-600')
      }
    })
  },

  // Toast de notificação
  toast(mensagem, tipo = 'sucesso') {
    const toast = document.createElement('div')
    toast.className = `fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white font-semibold z-50 transition-all duration-300 ${tipo === 'sucesso' ? 'bg-green-600' : 'bg-red-600'}`
    toast.textContent = mensagem
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.opacity = '0'
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => App.init())

window.App = App
