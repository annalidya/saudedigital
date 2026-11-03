// Módulo Agenda
export default function renderizarAgenda(usuario) {
  return `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Agenda</h1>
      <p class="text-gray-600">Gerencie seus compromissos e lembretes</p>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Calendário -->
      <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-center mb-4">
          <button onclick="mesAnterior()" class="p-2 hover:bg-gray-100 rounded-lg">←</button>
          <h2 id="mesAtual" class="text-lg font-semibold text-gray-900"></h2>
          <button onclick="proximoMes()" class="p-2 hover:bg-gray-100 rounded-lg">→</button>
        </div>
        <div id="calendario" class="grid grid-cols-7 gap-1"></div>
      </div>
      
      <!-- Botões de ação -->
      <div class="space-y-4">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Ações</h2>
          <div class="space-y-3">
            <button onclick="document.getElementById('modalCompromisso').classList.remove('hidden')" class="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition font-medium">
              + Novo Compromisso
            </button>
            <button onclick="document.getElementById('modalLembrete').classList.remove('hidden')" class="w-full bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600 transition font-medium">
              + Novo Lembrete
            </button>
          </div>
        </div>
        
        <!-- Próximos compromissos -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Próximos Compromissos</h2>
          <div id="listaCompromissos" class="space-y-3">
            <p class="text-gray-500 text-sm">Nenhum compromisso agendado.</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Lembretes -->
    <div class="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Lembretes</h2>
      <div id="listaLembretes" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <p class="text-gray-500 text-sm">Nenhum lembrete pendente.</p>
      </div>
    </div>
    
    <!-- Modal Novo Compromisso -->
    <div id="modalCompromisso" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Novo Compromisso</h3>
        <form id="formCompromisso" class="space-y-4">
          <input type="text" id="tituloCompromisso" placeholder="Título do compromisso" required class="w-full border rounded-lg px-4 py-2">
          <textarea id="descricaoCompromisso" placeholder="Descrição (opcional)" rows="2" class="w-full border rounded-lg px-4 py-2"></textarea>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Data</label>
              <input type="date" id="dataCompromisso" required class="w-full border rounded-lg px-4 py-2">
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Hora</label>
              <input type="time" id="horaCompromisso" class="w-full border rounded-lg px-4 py-2">
            </div>
          </div>
          <input type="text" id="localCompromisso" placeholder="Local (opcional)" class="w-full border rounded-lg px-4 py-2">
          <select id="tipoCompromisso" class="w-full border rounded-lg px-4 py-2">
            <option value="compromisso">Compromisso</option>
            <option value="medico">Médico</option>
            <option value="exame">Exame</option>
            <option value="outro">Outro</option>
          </select>
          <div class="flex gap-2">
            <button type="button" onclick="document.getElementById('modalCompromisso').classList.add('hidden')" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" id="btnSalvarCompromisso" disabled class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Editar Compromisso -->
    <div id="modalEditarCompromisso" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Editar Compromisso</h3>
        <form id="formEditarCompromisso" class="space-y-4">
          <input type="hidden" id="editarCompromissoId">
          <input type="text" id="editarTituloCompromisso" placeholder="Título do compromisso" required class="w-full border rounded-lg px-4 py-2">
          <textarea id="editarDescricaoCompromisso" placeholder="Descrição (opcional)" rows="2" class="w-full border rounded-lg px-4 py-2"></textarea>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Data</label>
              <input type="date" id="editarDataCompromisso" required class="w-full border rounded-lg px-4 py-2">
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Hora</label>
              <input type="time" id="editarHoraCompromisso" class="w-full border rounded-lg px-4 py-2">
            </div>
          </div>
          <input type="text" id="editarLocalCompromisso" placeholder="Local (opcional)" class="w-full border rounded-lg px-4 py-2">
          <select id="editarTipoCompromisso" class="w-full border rounded-lg px-4 py-2">
            <option value="compromisso">Compromisso</option>
            <option value="medico">Médico</option>
            <option value="exame">Exame</option>
            <option value="outro">Outro</option>
          </select>
          <div class="flex gap-2">
            <button type="button" onclick="document.getElementById('modalEditarCompromisso').classList.add('hidden')" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Novo Lembrete -->
    <div id="modalLembrete" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Novo Lembrete</h3>
        <form id="formLembrete" class="space-y-4">
          <input type="text" id="tituloLembrete" placeholder="Título do lembrete" required class="w-full border rounded-lg px-4 py-2">
          <textarea id="mensagemLembrete" placeholder="Mensagem (opcional)" rows="2" class="w-full border rounded-lg px-4 py-2"></textarea>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Data</label>
              <input type="date" id="dataLembrete" required class="w-full border rounded-lg px-4 py-2">
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Hora</label>
              <input type="time" id="horaLembrete" class="w-full border rounded-lg px-4 py-2">
            </div>
          </div>
          <label class="flex items-center gap-2">
            <input type="checkbox" id="recorrenteLembrete" class="rounded">
            <span class="text-sm text-gray-700">Recorrente (diariamente)</span>
          </label>
          <div class="flex gap-2">
            <button type="button" onclick="document.getElementById('modalLembrete').classList.add('hidden')" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" id="btnSalvarLembrete" disabled class="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600">Salvar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Editar Lembrete -->
    <div id="modalEditarLembrete" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Editar Lembrete</h3>
        <form id="formEditarLembrete" class="space-y-4">
          <input type="hidden" id="editarLembreteId">
          <input type="text" id="editarTituloLembrete" placeholder="Título do lembrete" required class="w-full border rounded-lg px-4 py-2">
          <textarea id="editarMensagemLembrete" placeholder="Mensagem (opcional)" rows="2" class="w-full border rounded-lg px-4 py-2"></textarea>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Data</label>
              <input type="date" id="editarDataLembrete" required class="w-full border rounded-lg px-4 py-2">
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Hora</label>
              <input type="time" id="editarHoraLembrete" class="w-full border rounded-lg px-4 py-2">
            </div>
          </div>
          <label class="flex items-center gap-2">
            <input type="checkbox" id="editarRecorrenteLembrete" class="rounded">
            <span class="text-sm text-gray-700">Recorrente (diariamente)</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" id="editarConcluidoLembrete" class="rounded">
            <span class="text-sm text-gray-700">Marcar como concluído</span>
          </label>
          <div class="flex gap-2">
            <button type="button" onclick="document.getElementById('modalEditarLembrete').classList.add('hidden')" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" class="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  `
}

let dataAtual = new Date()
let todosCompromissos = []

export async function inicializar() {
  renderizarCalendario()
  await carregarCompromissos()
  await carregarLembretes()
  
  window.mesAnterior = () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1)
    renderizarCalendario()
  }
  
  window.proximoMes = () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1)
    renderizarCalendario()
  }
  
  configurarValidacaoFormulario('formCompromisso', [
    { id: 'tituloCompromisso' },
    { id: 'dataCompromisso' }
  ], 'btnSalvarCompromisso')
  
  configurarValidacaoFormulario('formLembrete', [
    { id: 'tituloLembrete' },
    { id: 'dataLembrete' }
  ], 'btnSalvarLembrete')
  
  // Criar compromisso
  document.getElementById('formCompromisso').addEventListener('submit', async (e) => {
    e.preventDefault()
    const dados = {
      titulo: document.getElementById('tituloCompromisso').value.trim(),
      descricao: document.getElementById('descricaoCompromisso').value.trim(),
      data: document.getElementById('dataCompromisso').value,
      hora: document.getElementById('horaCompromisso').value,
      local: document.getElementById('localCompromisso').value.trim(),
      tipo: document.getElementById('tipoCompromisso').value
    }
    
    const resultado = await api.post('/compromissos', dados)
    if (resultado.sucesso) {
      App.toast('Compromisso cadastrado com sucesso!')
      document.getElementById('modalCompromisso').classList.add('hidden')
      document.getElementById('formCompromisso').reset()
      await carregarCompromissos()
      renderizarCalendario()
    } else {
      App.toast(resultado.mensagem || 'Erro ao cadastrar compromisso.', 'erro')
    }
  })
  
  // Editar compromisso
  document.getElementById('formEditarCompromisso').addEventListener('submit', async (e) => {
    e.preventDefault()
    const id = document.getElementById('editarCompromissoId').value
    const dados = {
      titulo: document.getElementById('editarTituloCompromisso').value.trim(),
      descricao: document.getElementById('editarDescricaoCompromisso').value.trim(),
      data: document.getElementById('editarDataCompromisso').value,
      hora: document.getElementById('editarHoraCompromisso').value,
      local: document.getElementById('editarLocalCompromisso').value.trim(),
      tipo: document.getElementById('editarTipoCompromisso').value
    }
    
    const resultado = await api.put(`/compromissos/${id}`, dados)
    if (resultado.sucesso) {
      App.toast('Compromisso atualizado com sucesso!')
      document.getElementById('modalEditarCompromisso').classList.add('hidden')
      await carregarCompromissos()
      renderizarCalendario()
    } else {
      App.toast(resultado.mensagem || 'Erro ao atualizar compromisso.', 'erro')
    }
  })
  
  // Criar lembrete
  document.getElementById('formLembrete').addEventListener('submit', async (e) => {
    e.preventDefault()
    const dados = {
      titulo: document.getElementById('tituloLembrete').value.trim(),
      mensagem: document.getElementById('mensagemLembrete').value.trim(),
      data: document.getElementById('dataLembrete').value,
      hora: document.getElementById('horaLembrete').value,
      recorrente: document.getElementById('recorrenteLembrete').checked ? 1 : 0
    }
    
    const resultado = await api.post('/lembretes', dados)
    if (resultado.sucesso) {
      App.toast('Lembrete cadastrado com sucesso!')
      document.getElementById('modalLembrete').classList.add('hidden')
      document.getElementById('formLembrete').reset()
      await carregarLembretes()
      renderizarCalendario()
    } else {
      App.toast(resultado.mensagem || 'Erro ao cadastrar lembrete.', 'erro')
    }
  })
  
  // Editar lembrete
  document.getElementById('formEditarLembrete').addEventListener('submit', async (e) => {
    e.preventDefault()
    const id = document.getElementById('editarLembreteId').value
    const dados = {
      titulo: document.getElementById('editarTituloLembrete').value.trim(),
      mensagem: document.getElementById('editarMensagemLembrete').value.trim(),
      data: document.getElementById('editarDataLembrete').value,
      hora: document.getElementById('editarHoraLembrete').value,
      recorrente: document.getElementById('editarRecorrenteLembrete').checked ? 1 : 0,
      concluido: document.getElementById('editarConcluidoLembrete').checked ? 1 : 0
    }
    
    const resultado = await api.put(`/lembretes/${id}`, dados)
    if (resultado.sucesso) {
      App.toast('Lembrete atualizado com sucesso!')
      document.getElementById('modalEditarLembrete').classList.add('hidden')
      await carregarLembretes()
      renderizarCalendario()
    } else {
      App.toast(resultado.mensagem || 'Erro ao atualizar lembrete.', 'erro')
    }
  })
}

function renderizarCalendario() {
  const container = document.getElementById('calendario')
  const titulo = document.getElementById('mesAtual')
  
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  
  titulo.textContent = `${meses[dataAtual.getMonth()]} ${dataAtual.getFullYear()}`
  
  const primeiroDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1)
  const ultimoDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0)
  const diaInicio = primeiroDia.getDay()
  
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  
  let html = diasSemana.map(d => `<div class="text-center text-xs font-medium text-gray-500 py-2">${d}</div>`).join('')
  
  for (let i = 0; i < diaInicio; i++) {
    html += '<div></div>'
  }
  
  const hoje = new Date()
  const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
  
  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    const dataStr = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    const ehHoje = dataStr === hojeStr
    
    const temCompromisso = todosCompromissos.some(c => c.data === dataStr)
    
    let classes = 'text-center py-2 rounded-lg cursor-pointer hover:bg-indigo-50 relative '
    if (ehHoje) classes += 'bg-indigo-600 text-white '
    if (temCompromisso && !ehHoje) classes += 'bg-indigo-100 '
    
    html += `
      <div class="${classes}" onclick="filtrarPorData('${dataStr}')" title="${temCompromisso ? 'Tem compromisso' : ''}">
        ${dia}
        ${temCompromisso ? `<span class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${ehHoje ? 'bg-white' : 'bg-indigo-500'}"></span>` : ''}
      </div>
    `
  }
  
  container.innerHTML = html
}

window.filtrarPorData = function(data) {
  const compromissosFiltrados = todosCompromissos.filter(c => c.data === data)
  const container = document.getElementById('listaCompromissos')
  
  if (compromissosFiltrados.length > 0) {
    container.innerHTML = compromissosFiltrados.map(c => `
      <div class="p-3 bg-gray-50 rounded-lg">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <p class="font-medium text-gray-900">${c.titulo}</p>
            <p class="text-sm text-gray-600">${c.local || c.descricao || c.tipo}</p>
            ${c.hora ? `<p class="text-xs text-gray-500">${c.hora}</p>` : ''}
          </div>
          <div class="flex gap-1">
            <button onclick="editarCompromisso(${c.id}, '${c.titulo.replace(/'/g, "\\'")}', '${(c.descricao || '').replace(/'/g, "\\'")}', '${c.data}', '${c.hora || ''}', '${(c.local || '').replace(/'/g, "\\'")}', '${c.tipo}')" class="text-xs text-indigo-600 hover:text-indigo-800">Editar</button>
            <button onclick="excluirCompromisso(${c.id})" class="text-xs text-red-600 hover:text-red-800">Excluir</button>
          </div>
        </div>
      </div>
    `).join('')
  } else {
    container.innerHTML = `<p class="text-gray-500 text-sm">Nenhum compromisso em ${data.split('-').reverse().join('/')}</p>`
  }
}

async function carregarCompromissos() {
  try {
    const resultado = await api.get('/compromissos')
    if (resultado.sucesso) {
      todosCompromissos = resultado.dados
      renderizarListaCompromissos()
    }
  } catch (erro) {
    console.error('Erro ao carregar compromissos:', erro)
  }
}

function renderizarListaCompromissos() {
  const container = document.getElementById('listaCompromissos')
  const hoje = new Date()
  const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
  
  const proximos = todosCompromissos
    .filter(c => c.data >= hojeStr)
    .slice(0, 5)
  
  if (proximos.length > 0) {
    container.innerHTML = proximos.map(c => {
      const icone = c.tipo === 'medico' ? '🩺' : c.tipo === 'exame' ? '🔬' : '📅'
      return `
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <span class="text-xl">${icone}</span>
          <div class="flex-1">
            <p class="font-medium text-gray-900">${c.titulo}</p>
            <p class="text-sm text-gray-600">${c.local || c.descricao || c.tipo}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">${c.data.split('-').reverse().join('/')}</p>
            ${c.hora ? `<p class="text-xs text-gray-500">${c.hora}</p>` : ''}
          </div>
        </div>
      `
    }).join('')
  } else {
    container.innerHTML = '<p class="text-gray-500 text-sm">Nenhum compromisso futuro.</p>'
  }
}

window.editarCompromisso = function(id, titulo, descricao, data, hora, local, tipo) {
  document.getElementById('editarCompromissoId').value = id
  document.getElementById('editarTituloCompromisso').value = titulo
  document.getElementById('editarDescricaoCompromisso').value = descricao
  document.getElementById('editarDataCompromisso').value = data
  document.getElementById('editarHoraCompromisso').value = hora
  document.getElementById('editarLocalCompromisso').value = local
  document.getElementById('editarTipoCompromisso').value = tipo
  document.getElementById('modalEditarCompromisso').classList.remove('hidden')
}

window.excluirCompromisso = async function(id) {
  if (!confirm('Tem certeza que deseja excluir este compromisso?')) return
  const resultado = await api.delete(`/compromissos/${id}`)
  if (resultado.sucesso) {
    App.toast('Compromisso excluído com sucesso!')
    await carregarCompromissos()
    renderizarCalendario()
  } else {
    App.toast(resultado.mensagem || 'Erro ao excluir compromisso.', 'erro')
  }
}

async function carregarLembretes() {
  try {
    const resultado = await api.get('/lembretes')
    const container = document.getElementById('listaLembretes')
    
    if (resultado.sucesso && resultado.dados.length > 0) {
      const lembretes = resultado.dados.filter(l => !l.concluido)
      
      if (lembretes.length > 0) {
        container.innerHTML = lembretes.map(l => `
          <div class="p-4 ${l.recorrente ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'} rounded-lg">
            <div class="flex items-start gap-3">
              <span class="text-xl">${l.recorrente ? '🔁' : '🔔'}</span>
              <div class="flex-1">
                <p class="font-medium text-gray-900">${l.titulo}</p>
                ${l.mensagem ? `<p class="text-sm text-gray-600">${l.mensagem}</p>` : ''}
                <p class="text-xs text-gray-500 mt-1">${l.data.split('-').reverse().join('/')}${l.hora ? ` às ${l.hora}` : ''}</p>
              </div>
              <div class="flex gap-1">
                <button onclick="editarLembrete(${l.id}, '${l.titulo.replace(/'/g, "\\'")}', '${(l.mensagem || '').replace(/'/g, "\\'")}', '${l.data}', '${l.hora || ''}', ${l.recorrente})" class="text-xs text-indigo-600 hover:text-indigo-800">Editar</button>
                <button onclick="excluirLembrete(${l.id})" class="text-xs text-red-600 hover:text-red-800">Excluir</button>
              </div>
            </div>
          </div>
        `).join('')
      } else {
        container.innerHTML = '<p class="text-gray-500 text-sm">Todos os lembretes foram concluídos.</p>'
      }
    }
  } catch (erro) {
    console.error('Erro ao carregar lembretes:', erro)
  }
}

window.editarLembrete = function(id, titulo, mensagem, data, hora, recorrente) {
  document.getElementById('editarLembreteId').value = id
  document.getElementById('editarTituloLembrete').value = titulo
  document.getElementById('editarMensagemLembrete').value = mensagem
  document.getElementById('editarDataLembrete').value = data
  document.getElementById('editarHoraLembrete').value = hora
  document.getElementById('editarRecorrenteLembrete').checked = recorrente
  document.getElementById('editarConcluidoLembrete').checked = false
  document.getElementById('modalEditarLembrete').classList.remove('hidden')
}

window.excluirLembrete = async function(id) {
  if (!confirm('Tem certeza que deseja excluir este lembrete?')) return
  const resultado = await api.delete(`/lembretes/${id}`)
  if (resultado.sucesso) {
    App.toast('Lembrete excluído com sucesso!')
    await carregarLembretes()
    renderizarCalendario()
  } else {
    App.toast(resultado.mensagem || 'Erro ao excluir lembrete.', 'erro')
  }
}
