// Módulo Diário de Sintomas
export default function renderizarSintomas(usuario) {
  return `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Diário de Sintomas</h1>
      <p class="text-gray-600">Registre e acompanhe seus sintomas</p>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Formulário de registro -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Novo Registro</h2>
        <form id="formSintoma" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input type="date" id="dataSintoma" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Sintoma</label>
            <select id="tipoSintoma" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Selecione...</option>
              <option value="dor">Dor</option>
              <option value="febre">Febre</option>
              <option value="nausea">Náusea</option>
              <option value="cansaço">Cansaço</option>
              <option value="tontura">Tontura</option>
              <option value="dor_de_cabeca">Dor de cabeça</option>
              <option value="dor_no_peito">Dor no peito</option>
              <option value="falta_de_ar">Falta de ar</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Intensidade (1-10)</label>
            <div class="flex items-center gap-4">
              <input type="range" id="intensidadeSintoma" min="1" max="10" value="5" class="flex-1">
              <span id="valorIntensidade" class="text-lg font-bold text-indigo-600 w-8 text-center">5</span>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea id="descricaoSintoma" rows="3" placeholder="Descreva seus sintomas..." class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
          </div>
          
          <button type="submit" id="btnRegistrarSintoma" disabled class="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition">
            Registrar Sintoma
          </button>
        </form>
      </div>
      
      <!-- Lista de registros -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Histórico</h2>
        <div id="listaSintomas" class="space-y-3">
          <p class="text-gray-500">Nenhum sintoma registrado.</p>
        </div>
      </div>
    </div>
    
    <!-- Gráfico de evolução -->
    <div class="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Evolução da Intensidade</h2>
      <div id="graficoEvolucao" class="h-72">
        <p class="text-gray-500 text-center pt-8">Registre sintomas para ver o gráfico.</p>
      </div>
    </div>
    
    <!-- Modal Editar Sintoma -->
    <div id="modalEditarSintoma" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Editar Sintoma</h3>
        <form id="formEditarSintoma" class="space-y-4">
          <input type="hidden" id="editarSintomaId">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input type="date" id="editarDataSintoma" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Sintoma</label>
            <select id="editarTipoSintoma" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Selecione...</option>
              <option value="dor">Dor</option>
              <option value="febre">Febre</option>
              <option value="nausea">Náusea</option>
              <option value="cansaço">Cansaço</option>
              <option value="tontura">Tontura</option>
              <option value="dor_de_cabeca">Dor de cabeça</option>
              <option value="dor_no_peito">Dor no peito</option>
              <option value="falta_de_ar">Falta de ar</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Intensidade (1-10)</label>
            <div class="flex items-center gap-4">
              <input type="range" id="editarIntensidadeSintoma" min="1" max="10" value="5" class="flex-1">
              <span id="editarValorIntensidade" class="text-lg font-bold text-indigo-600 w-8 text-center">5</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea id="editarDescricaoSintoma" rows="3" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
          </div>
          <div class="flex gap-2">
            <button type="button" onclick="document.getElementById('modalEditarSintoma').classList.add('hidden')" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  `
}

export async function inicializar() {
  document.getElementById('dataSintoma').valueAsDate = new Date()
  
  configurarValidacaoFormulario('formSintoma', [
    { id: 'dataSintoma' }
  ], 'btnRegistrarSintoma')
  
  const intensidadeInput = document.getElementById('intensidadeSintoma')
  const valorIntensidade = document.getElementById('valorIntensidade')
  intensidadeInput.addEventListener('input', () => {
    valorIntensidade.textContent = intensidadeInput.value
  })
  
  const editarIntensidadeInput = document.getElementById('editarIntensidadeSintoma')
  const editarValorIntensidade = document.getElementById('editarValorIntensidade')
  editarIntensidadeInput.addEventListener('input', () => {
    editarValorIntensidade.textContent = editarIntensidadeInput.value
  })
  
  await carregarSintomas()
  
  document.getElementById('formSintoma').addEventListener('submit', async (e) => {
    e.preventDefault()
    const dados = {
      data: document.getElementById('dataSintoma').value,
      tipo: document.getElementById('tipoSintoma').value,
      intensidade: parseInt(document.getElementById('intensidadeSintoma').value),
      descricao: document.getElementById('descricaoSintoma').value.trim()
    }
    
    const resultado = await api.post('/sintomas', dados)
    if (resultado.sucesso) {
      App.toast('Sintoma registrado com sucesso!')
      document.getElementById('formSintoma').reset()
      document.getElementById('dataSintoma').valueAsDate = new Date()
      document.getElementById('intensidadeSintoma').value = 5
      document.getElementById('valorIntensidade').textContent = '5'
      await carregarSintomas()
    } else {
      App.toast(resultado.mensagem || 'Erro ao registrar sintoma.', 'erro')
    }
  })
  
  document.getElementById('formEditarSintoma').addEventListener('submit', async (e) => {
    e.preventDefault()
    const id = document.getElementById('editarSintomaId').value
    const dados = {
      data: document.getElementById('editarDataSintoma').value,
      tipo: document.getElementById('editarTipoSintoma').value,
      intensidade: parseInt(document.getElementById('editarIntensidadeSintoma').value),
      descricao: document.getElementById('editarDescricaoSintoma').value.trim()
    }
    
    const resultado = await api.put(`/sintomas/${id}`, dados)
    if (resultado.sucesso) {
      App.toast('Sintoma atualizado com sucesso!')
      document.getElementById('modalEditarSintoma').classList.add('hidden')
      await carregarSintomas()
    } else {
      App.toast(resultado.mensagem || 'Erro ao atualizar sintoma.', 'erro')
    }
  })
}

async function carregarSintomas() {
  const resultado = await api.get('/sintomas')
  if (resultado.sucesso && resultado.dados.length > 0) {
    const lista = document.getElementById('listaSintomas')
    lista.innerHTML = resultado.dados.slice(0, 10).map(s => `
      <div class="p-4 bg-gray-50 rounded-lg">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">${s.tipo || 'Não especificado'}</h3>
            <p class="text-sm text-gray-600">${s.descricao || 'Sem descrição'}</p>
          </div>
          <div class="text-right ml-3">
            <span class="inline-block px-2 py-1 text-xs font-bold rounded ${
              s.intensidade <= 3 ? 'bg-green-100 text-green-700' :
              s.intensidade <= 6 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }">
              ${s.intensidade}/10
            </span>
            <p class="text-xs text-gray-500 mt-1">${s.data}</p>
          </div>
        </div>
        <div class="flex gap-2 mt-3 pt-3 border-t border-gray-200">
          <button onclick="editarSintoma(${s.id}, '${s.data}', '${s.tipo || ''}', ${s.intensidade}, '${(s.descricao || '').replace(/'/g, "\\'")}')" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Editar</button>
          <button onclick="excluirSintoma(${s.id})" class="text-sm text-red-600 hover:text-red-800 font-medium">Excluir</button>
        </div>
      </div>
    `).join('')
    
    renderizarGrafico(resultado.dados)
  } else {
    document.getElementById('listaSintomas').innerHTML = '<p class="text-gray-500">Nenhum sintoma registrado.</p>'
    document.getElementById('graficoEvolucao').innerHTML = '<p class="text-gray-500 text-center pt-8">Registre sintomas para ver o gráfico.</p>'
  }
}

window.editarSintoma = function(id, data, tipo, intensidade, descricao) {
  document.getElementById('editarSintomaId').value = id
  document.getElementById('editarDataSintoma').value = data
  document.getElementById('editarTipoSintoma').value = tipo
  document.getElementById('editarIntensidadeSintoma').value = intensidade
  document.getElementById('editarValorIntensidade').textContent = intensidade
  document.getElementById('editarDescricaoSintoma').value = descricao
  document.getElementById('modalEditarSintoma').classList.remove('hidden')
}

window.excluirSintoma = async function(id) {
  if (!confirm('Tem certeza que deseja excluir este sintoma?')) return
  const resultado = await api.delete(`/sintomas/${id}`)
  if (resultado.sucesso) {
    App.toast('Sintoma excluído com sucesso!')
    await carregarSintomas()
  } else {
    App.toast(resultado.mensagem || 'Erro ao excluir sintoma.', 'erro')
  }
}

function renderizarGrafico(dados) {
  const container = document.getElementById('graficoEvolucao')
  if (dados.length < 1) {
    container.innerHTML = '<p class="text-gray-500 text-center pt-8">Registre sintomas para ver o gráfico.</p>'
    return
  }
  
  const dadosOrdenados = [...dados].sort((a, b) => new Date(a.data) - new Date(b.data))
  
  container.innerHTML = '<canvas id="canvasGraficoSintomas" class="w-full h-full"></canvas>'
  const canvas = document.getElementById('canvasGraficoSintomas')
  const ctx = canvas.getContext('2d')
  
  const rect = container.getBoundingClientRect()
  canvas.width = rect.width * 2
  canvas.height = rect.height * 2
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'
  ctx.scale(2, 2)
  
  const largura = rect.width
  const altura = rect.height
  const padding = { topo: 30, dir: 20, fundo: 50, esq: 45 }
  const grafLargura = largura - padding.esq - padding.dir
  const grafAltura = altura - padding.topo - padding.fundo
  
  ctx.clearRect(0, 0, largura, altura)
  
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  for (let i = 1; i <= 10; i++) {
    const y = padding.topo + grafAltura - (i / 10) * grafAltura
    ctx.beginPath()
    ctx.moveTo(padding.esq, y)
    ctx.lineTo(largura - padding.dir, y)
    ctx.stroke()
    
    ctx.fillStyle = '#9ca3af'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(i.toString(), padding.esq - 8, y + 4)
  }
  
  const passo = dadosOrdenados.length === 1 ? 0 : grafLargura / (dadosOrdenados.length - 1)
  
  ctx.beginPath()
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  
  dadosOrdenados.forEach((s, i) => {
    const x = padding.esq + i * passo
    const y = padding.topo + grafAltura - (s.intensidade / 10) * grafAltura
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()
  
  ctx.beginPath()
  ctx.fillStyle = 'rgba(99, 102, 241, 0.1)'
  ctx.moveTo(padding.esq, padding.topo + grafAltura)
  dadosOrdenados.forEach((s, i) => {
    const x = padding.esq + i * passo
    const y = padding.topo + grafAltura - (s.intensidade / 10) * grafAltura
    ctx.lineTo(x, y)
  })
  ctx.lineTo(padding.esq + (dadosOrdenados.length - 1) * passo, padding.topo + grafAltura)
  ctx.closePath()
  ctx.fill()
  
  dadosOrdenados.forEach((s, i) => {
    const x = padding.esq + i * passo
    const y = padding.topo + grafAltura - (s.intensidade / 10) * grafAltura
    
    const cor = s.intensidade <= 3 ? '#22c55e' :
                s.intensidade <= 6 ? '#eab308' : '#ef4444'
    
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fillStyle = cor
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()
    
    ctx.fillStyle = '#374151'
    ctx.font = 'bold 10px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(s.intensidade.toString(), x, y - 10)
    
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px sans-serif'
    const label = s.data.split('-').slice(1).join('/')
    ctx.fillText(label, x, padding.topo + grafAltura + 18)
    
    if (s.tipo) {
      ctx.save()
      ctx.translate(x, padding.topo + grafAltura + 35)
      ctx.rotate(-Math.PI / 6)
      ctx.fillStyle = '#9ca3af'
      ctx.font = '9px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(s.tipo.substring(0, 8), 0, 0)
      ctx.restore()
    }
  })
  
  ctx.fillStyle = '#6b7280'
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Data', largura / 2, altura - 5)
  
  ctx.save()
  ctx.translate(12, altura / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('Intensidade', 0, 0)
  ctx.restore()
}
