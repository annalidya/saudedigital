// Módulo Dashboard
export default function renderizarDashboard(usuario) {
  return `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600">Bem-vindo, ${usuario?.nome_completo || 'Usuário'}!</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">📋</div>
          <div>
            <p class="text-sm text-gray-600">Prontuário</p>
            <p class="text-2xl font-bold text-gray-900" id="totalExames">0</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">💊</div>
          <div>
            <p class="text-sm text-gray-600">Medicamentos</p>
            <p class="text-2xl font-bold text-gray-900" id="totalMedicamentos">0</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">📅</div>
          <div>
            <p class="text-sm text-gray-600">Consultas</p>
            <p class="text-2xl font-bold text-gray-900" id="totalConsultas">0</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">📈</div>
          <div>
            <p class="text-sm text-gray-600">Sintomas</p>
            <p class="text-2xl font-bold text-gray-900" id="totalSintomas">0</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Próximas Consultas</h2>
        <div id="listaConsultas" class="space-y-3">
          <p class="text-gray-500 text-sm">Nenhuma consulta agendada.</p>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Medicamentos do Dia</h2>
        <div id="listaMedicamentos" class="space-y-3">
          <p class="text-gray-500 text-sm">Nenhum medicamento registrado.</p>
        </div>
      </div>
    </div>
    
    <div class="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="#/prontuario" class="flex flex-col items-center p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition">
          <span class="text-2xl mb-2">📋</span>
          <span class="text-sm font-medium text-gray-700">Prontuário</span>
        </a>
        <a href="#/medicamentos" class="flex flex-col items-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition">
          <span class="text-2xl mb-2">💊</span>
          <span class="text-sm font-medium text-gray-700">Medicamentos</span>
        </a>
        <a href="#/sintomas" class="flex flex-col items-center p-4 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition">
          <span class="text-2xl mb-2">📈</span>
          <span class="text-sm font-medium text-gray-700">Sintomas</span>
        </a>
        <a href="#/relatorios" class="flex flex-col items-center p-4 rounded-lg bg-red-50 hover:bg-red-100 transition">
          <span class="text-2xl mb-2">📄</span>
          <span class="text-sm font-medium text-gray-700">Relatórios</span>
        </a>
      </div>
    </div>
  `
}

export async function inicializar() {
  try {
    // Carregar dados resumidos
    const [exames, medicamentos, consultas, sintomas] = await Promise.all([
      api.get('/exames'),
      api.get('/medicamentos'),
      api.get('/consultas'),
      api.get('/sintomas')
    ])
    
    // Atualizar contadores
    if (exames.sucesso) document.getElementById('totalExames').textContent = exames.dados.length
    if (medicamentos.sucesso) document.getElementById('totalMedicamentos').textContent = medicamentos.dados.length
    if (consultas.sucesso) document.getElementById('totalConsultas').textContent = consultas.dados.length
    if (sintomas.sucesso) document.getElementById('totalSintomas').textContent = sintomas.dados.length
    
    // Listar próximas consultas
    if (consultas.sucesso && consultas.dados.length > 0) {
      const listaConsultas = document.getElementById('listaConsultas')
      const proximas = consultas.dados.slice(0, 3)
      listaConsultas.innerHTML = proximas.map(c => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p class="font-medium text-gray-900">${c.medico || 'Não informado'}</p>
            <p class="text-sm text-gray-600">${c.especialidade || 'Geral'}</p>
          </div>
          <span class="text-sm text-indigo-600 font-medium">${c.data || 'Sem data'}</span>
        </div>
      `).join('')
    }
    
    // Listar medicamentos do dia
    if (medicamentos.sucesso && medicamentos.dados.length > 0) {
      const listaMedicamentos = document.getElementById('listaMedicamentos')
      const ativos = medicamentos.dados.filter(m => m.ativo).slice(0, 3)
      listaMedicamentos.innerHTML = ativos.map(m => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p class="font-medium text-gray-900">${m.nome}</p>
            <p class="text-sm text-gray-600">${m.dosagem || 'Sem dosagem'}</p>
          </div>
          <span class="text-sm text-green-600 font-medium">Ativo</span>
        </div>
      `).join('')
    }
  } catch (erro) {
    console.error('Erro ao carregar dashboard:', erro)
  }
}
