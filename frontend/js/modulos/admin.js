// Módulo Painel Administrativo

if (!App.badgeTipo) {
  App.badgeTipo = (tipo) => ({
    admin: 'bg-purple-100 text-purple-700',
    medico: 'bg-blue-100 text-blue-700',
    cuidador: 'bg-teal-100 text-teal-700',
    paciente: 'bg-green-100 text-green-700'
  }[tipo] || 'bg-gray-100 text-gray-700')
}

export default function renderizarAdmin(usuario) {
  return `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Administração</h1>
      <p class="text-gray-600">Visão geral de estatísticas do sistema</p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">👥</div>
          <div>
            <p class="text-sm text-gray-600">Usuários</p>
            <p class="text-2xl font-bold text-gray-900" id="statUsuarios">0</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">✅</div>
          <div>
            <p class="text-sm text-gray-600">Ativos</p>
            <p class="text-2xl font-bold text-gray-900" id="statAtivos">0</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">🩺</div>
          <div>
            <p class="text-sm text-gray-600">Médicos</p>
            <p class="text-2xl font-bold text-gray-900" id="statMedicos">0</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">🧑</div>
          <div>
            <p class="text-sm text-gray-600">Pacientes</p>
            <p class="text-2xl font-bold text-gray-900" id="statPacientes">0</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">🛡️</div>
          <div>
            <p class="text-sm text-gray-600">Admins</p>
            <p class="text-2xl font-bold text-gray-900" id="statAdmins">0</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">📋</div>
          <div>
            <p class="text-sm text-gray-600">Exames</p>
            <p class="text-2xl font-bold text-gray-900" id="statExames">0</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-2xl">💊</div>
          <div>
            <p class="text-sm text-gray-600">Medicamentos</p>
            <p class="text-2xl font-bold text-gray-900" id="statMedicamentos">0</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">📈</div>
          <div>
            <p class="text-sm text-gray-600">Sintomas</p>
            <p class="text-2xl font-bold text-gray-900" id="statSintomas">0</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Últimos Cadastros</h2>
        <div id="listaUltimosCadastros" class="space-y-3">
          <p class="text-gray-500 text-sm">Carregando...</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Registros Totais</h2>
        <div class="space-y-3">
          <div class="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-700">Consultas</span>
            <span class="font-semibold text-gray-900" id="statConsultas">0</span>
          </div>
          <div class="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-700">Receitas</span>
            <span class="font-semibold text-gray-900" id="statReceitas">0</span>
          </div>
          <div class="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-700">Notificações</span>
            <span class="font-semibold text-gray-900" id="statNotificacoes">0</span>
          </div>
          <div class="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-700">Cuidadores</span>
            <span class="font-semibold text-gray-900" id="statCuidadores">0</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="#/admin/usuarios" class="flex flex-col items-center p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition">
          <span class="text-2xl mb-2">👥</span>
          <span class="text-sm font-medium text-gray-700">Gestão de Usuários</span>
        </a>
        <a href="#/relatorios" class="flex flex-col items-center p-4 rounded-lg bg-red-50 hover:bg-red-100 transition">
          <span class="text-2xl mb-2">📄</span>
          <span class="text-sm font-medium text-gray-700">Relatórios</span>
        </a>
        <a href="#/dashboard" class="flex flex-col items-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
          <span class="text-2xl mb-2">📊</span>
          <span class="text-sm font-medium text-gray-700">Dashboard</span>
        </a>
        <a href="#/medicamentos" class="flex flex-col items-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition">
          <span class="text-2xl mb-2">💊</span>
          <span class="text-sm font-medium text-gray-700">Medicamentos</span>
        </a>
      </div>
    </div>
  `
}

export async function inicializar() {
  try {
    const resultado = await api.get('/admin/estatisticas')
    if (!resultado.sucesso) {
      App.toast(resultado.mensagem || 'Erro ao carregar estatísticas.', 'erro')
      return
    }

    const { estatisticas, ultimos_cadastros } = resultado.dados

    document.getElementById('statUsuarios').textContent = estatisticas.usuarios
    document.getElementById('statAtivos').textContent = estatisticas.usuarios_ativos
    document.getElementById('statPacientes').textContent = estatisticas.usuarios_por_tipo.paciente || 0
    document.getElementById('statMedicos').textContent = estatisticas.usuarios_por_tipo.medico || 0
    document.getElementById('statCuidadores').textContent = estatisticas.usuarios_por_tipo.cuidador || 0
    document.getElementById('statAdmins').textContent = estatisticas.usuarios_por_tipo.admin || 0
    document.getElementById('statExames').textContent = estatisticas.exames
    document.getElementById('statReceitas').textContent = estatisticas.receitas
    document.getElementById('statConsultas').textContent = estatisticas.consultas
    document.getElementById('statMedicamentos').textContent = estatisticas.medicamentos
    document.getElementById('statSintomas').textContent = estatisticas.sintomas
    document.getElementById('statNotificacoes').textContent = estatisticas.notificacoes

    const container = document.getElementById('listaUltimosCadastros')
    if (ultimos_cadastros && ultimos_cadastros.length > 0) {
      container.innerHTML = ultimos_cadastros.map(u => `
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div>
            <p class="font-medium text-gray-900">${u.nome_completo}</p>
            <p class="text-sm text-gray-600">${u.email}</p>
          </div>
          <div class="text-right">
            <span class="px-2 py-1 text-xs rounded ${App.badgeTipo(u.tipo)}">${u.tipo}</span>
            <p class="text-xs text-gray-500 mt-1">${u.criado_em}</p>
          </div>
        </div>
      `).join('')
    } else {
      container.innerHTML = '<p class="text-gray-500 text-sm">Nenhum cadastro encontrado.</p>'
    }
  } catch (erro) {
    App.toast('Erro de conexão com o servidor.', 'erro')
  }
}