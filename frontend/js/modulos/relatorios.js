// Módulo Relatórios
export default function renderizarRelatorios(usuario) {
  return `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Relatórios</h1>
      <p class="text-gray-600">Gere e exporte seus relatórios de saúde</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Relatório de Prontuário -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl mb-4">📋</div>
        <h2 class="text-lg font-semibold text-gray-900 mb-2">Prontuário Completo</h2>
        <p class="text-gray-600 text-sm mb-4">Exames, receitas e consultas</p>
        <button onclick="gerarRelatorio('prontuario')" class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
          Gerar Relatório
        </button>
      </div>
      
      <!-- Relatório de Sintomas -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl mb-4">📈</div>
        <h2 class="text-lg font-semibold text-gray-900 mb-2">Evolução de Sintomas</h2>
        <p class="text-gray-600 text-sm mb-4">Histórico e estatísticas</p>
        <button onclick="gerarRelatorio('sintomas')" class="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
          Gerar Relatório
        </button>
      </div>
      
      <!-- Relatório de Medicamentos -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl mb-4">💊</div>
        <h2 class="text-lg font-semibold text-gray-900 mb-2">Medicamentos</h2>
        <p class="text-gray-600 text-sm mb-4">Controle de medicação</p>
        <button onclick="gerarRelatorio('medicamentos')" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
          Gerar Relatório
        </button>
      </div>
    </div>
    
    <!-- Área de visualização do relatório -->
    <div id="areaRelatorio" class="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hidden">
      <div class="flex justify-between items-center mb-4">
        <h2 id="tituloRelatorio" class="text-lg font-semibold text-gray-900"></h2>
        <div class="flex gap-2">
          <button onclick="imprimirRelatorio()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            🖨️ Imprimir
          </button>
          <button onclick="fecharRelatorio()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            Fechar
          </button>
        </div>
      </div>
      <div id="conteudoRelatorio" class="prose max-w-none"></div>
    </div>
  `
}

export function inicializar() {
  window.gerarRelatorio = async (tipo) => {
    const area = document.getElementById('areaRelatorio')
    const titulo = document.getElementById('tituloRelatorio')
    const conteudo = document.getElementById('conteudoRelatorio')
    
    area.classList.remove('hidden')
    conteudo.innerHTML = '<p class="text-gray-500">Carregando...</p>'
    
    try {
      switch (tipo) {
        case 'prontuario': {
          const [exames, receitas, consultas] = await Promise.all([
            api.get('/exames'),
            api.get('/receitas'),
            api.get('/consultas')
          ])
          const dados = { exames: exames.dados, receitas: receitas.dados, consultas: consultas.dados }
          titulo.textContent = 'Relatório de Prontuário'
          conteudo.innerHTML = renderizarRelProntuario(dados)
          break
        }
        case 'sintomas': {
          const resultado = await api.get('/sintomas/relatorio')
          titulo.textContent = 'Relatório de Sintomas'
          conteudo.innerHTML = renderizarRelSintomas(resultado.dados)
          break
        }
        case 'medicamentos': {
          const resultado = await api.get('/medicamentos')
          titulo.textContent = 'Relatório de Medicamentos'
          conteudo.innerHTML = renderizarRelMedicamentos(resultado.dados)
          break
        }
      }
    } catch (erro) {
      conteudo.innerHTML = '<p class="text-red-500">Erro ao gerar relatório.</p>'
    }
  }
  
  window.imprimirRelatorio = () => {
    window.print()
  }
  
  window.fecharRelatorio = () => {
    document.getElementById('areaRelatorio').classList.add('hidden')
  }
}

function renderizarRelProntuario(dados) {
  let html = '<div class="space-y-6">'
  
  // Exames
  html += `
    <div>
      <h3 class="text-md font-semibold text-gray-900 mb-2">Exames</h3>
      ${dados.exames && dados.exames.length > 0
        ? dados.exames.map(e => `
          <div class="p-3 bg-gray-50 rounded-lg mb-2">
            <p class="font-medium">${e.nome}</p>
            <p class="text-sm text-gray-600">${e.tipo || ''} ${e.laboratorio ? `- ${e.laboratorio}` : ''}</p>
            ${e.resultado ? `<p class="text-sm text-gray-700 mt-1">Resultado: ${e.resultado}</p>` : ''}
          </div>
        `).join('')
        : '<p class="text-gray-500 text-sm">Nenhum exame registrado.</p>'
      }
    </div>
  `
  
  // Receitas
  html += `
    <div>
      <h3 class="text-md font-semibold text-gray-900 mb-2">Receitas</h3>
      ${dados.receitas && dados.receitas.length > 0
        ? dados.receitas.map(r => `
          <div class="p-3 bg-gray-50 rounded-lg mb-2">
            <p class="font-medium">${r.medicamento}</p>
            <p class="text-sm text-gray-600">${r.medico || ''} ${r.dosagem ? `- ${r.dosagem}` : ''}</p>
            ${r.instrucoes ? `<p class="text-sm text-gray-700 mt-1">${r.instrucoes}</p>` : ''}
          </div>
        `).join('')
        : '<p class="text-gray-500 text-sm">Nenhuma receita registrada.</p>'
      }
    </div>
  `
  
  // Consultas
  html += `
    <div>
      <h3 class="text-md font-semibold text-gray-900 mb-2">Consultas</h3>
      ${dados.consultas && dados.consultas.length > 0
        ? dados.consultas.map(c => `
          <div class="p-3 bg-gray-50 rounded-lg mb-2">
            <p class="font-medium">${c.medico || 'Não informado'}</p>
            <p class="text-sm text-gray-600">${c.especialidade || 'Geral'} ${c.data ? `- ${c.data}` : ''}</p>
            ${c.observacoes ? `<p class="text-sm text-gray-700 mt-1">${c.observacoes}</p>` : ''}
          </div>
        `).join('')
        : '<p class="text-gray-500 text-sm">Nenhuma consulta registrada.</p>'
      }
    </div>
  `
  
  html += '</div>'
  return html
}

function renderizarRelSintomas(dados) {
  if (!dados || !dados.sintomas || dados.sintomas.length === 0) {
    return '<p class="text-gray-500">Nenhum sintoma registrado.</p>'
  }
  
  let html = `
    <div class="mb-6">
      <h3 class="text-md font-semibold text-gray-900 mb-2">Estatísticas</h3>
      <div class="grid grid-cols-3 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg text-center">
          <p class="text-2xl font-bold text-indigo-600">${dados.estatisticas.total}</p>
          <p class="text-sm text-gray-600">Total de registros</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg text-center">
          <p class="text-2xl font-bold text-indigo-600">${dados.estatisticas.media_intensidade}</p>
          <p class="text-sm text-gray-600">Média de intensidade</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg text-center">
          <p class="text-2xl font-bold text-indigo-600">${Object.keys(dados.estatisticas.por_tipo).length}</p>
          <p class="text-sm text-gray-600">Tipos diferentes</p>
        </div>
      </div>
    </div>
    
    <div>
      <h3 class="text-md font-semibold text-gray-900 mb-2">Histórico</h3>
      ${dados.sintomas.map(s => `
        <div class="p-3 bg-gray-50 rounded-lg mb-2">
          <div class="flex justify-between">
            <p class="font-medium">${s.tipo || 'Não especificado'}</p>
            <span class="px-2 py-1 text-xs font-bold rounded ${
              s.intensidade <= 3 ? 'bg-green-100 text-green-700' :
              s.intensidade <= 6 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }">${s.intensidade}/10</span>
          </div>
          <p class="text-sm text-gray-600">${s.data}</p>
          ${s.descricao ? `<p class="text-sm text-gray-700 mt-1">${s.descricao}</p>` : ''}
        </div>
      `).join('')}
    </div>
  `
  
  return html
}

function renderizarRelMedicamentos(dados) {
  if (!dados || dados.length === 0) {
    return '<p class="text-gray-500">Nenhum medicamento registrado.</p>'
  }
  
  let html = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${dados.map(m => `
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium">${m.nome}</p>
              <p class="text-sm text-gray-600">${m.dosagem || 'Sem dosagem'}</p>
            </div>
            <span class="px-2 py-1 text-xs rounded ${m.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">
              ${m.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          ${m.inicio ? `<p class="text-xs text-gray-500 mt-2">Início: ${m.inicio}${m.fim ? ` | Fim: ${m.fim}` : ''}</p>` : ''}
        </div>
      `).join('')}
    </div>
  `
  
  return html
}
