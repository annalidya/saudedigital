// Módulo Medicamentos
export default function renderizarMedicamentos(usuario) {
  return `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Medicamentos</h1>
      <p class="text-gray-600">Gerencie seus medicamentos e horários</p>
    </div>
    
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Meus Medicamentos</h2>
      <button onclick="document.getElementById('modalMedicamento').classList.remove('hidden')" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
        + Novo Medicamento
      </button>
    </div>
    
    <div id="listaMedicamentos" class="space-y-3">
      <p class="text-gray-500">Nenhum medicamento registrado.</p>
    </div>
    
    <!-- Modal Novo Medicamento -->
    <div id="modalMedicamento" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Novo Medicamento</h3>
        <form id="formMedicamento" class="space-y-4">
          <input type="text" id="nomeMedicamento" placeholder="Nome do medicamento" required class="w-full border rounded-lg px-4 py-2">
          <input type="text" id="dosagemMedicamento" placeholder="Dosagem (ex: 500mg)" class="w-full border rounded-lg px-4 py-2">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Início</label>
              <input type="date" id="inicioMedicamento" class="w-full border rounded-lg px-4 py-2">
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Fim</label>
              <input type="date" id="fimMedicamento" class="w-full border rounded-lg px-4 py-2">
            </div>
          </div>
          <div class="flex gap-2">
            <button type="button" onclick="document.getElementById('modalMedicamento').classList.add('hidden')" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" id="btnSalvarMedicamento" disabled class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Editar Medicamento -->
    <div id="modalEditarMedicamento" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Editar Medicamento</h3>
        <form id="formEditarMedicamento" class="space-y-4">
          <input type="hidden" id="editarMedicamentoId">
          <input type="text" id="editarNomeMedicamento" placeholder="Nome do medicamento" required class="w-full border rounded-lg px-4 py-2">
          <input type="text" id="editarDosagemMedicamento" placeholder="Dosagem (ex: 500mg)" class="w-full border rounded-lg px-4 py-2">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Início</label>
              <input type="date" id="editarInicioMedicamento" class="w-full border rounded-lg px-4 py-2">
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Fim</label>
              <input type="date" id="editarFimMedicamento" class="w-full border rounded-lg px-4 py-2">
            </div>
          </div>
          <div class="flex gap-2">
            <button type="button" onclick="document.getElementById('modalEditarMedicamento').classList.add('hidden')" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Horários -->
    <div id="modalHorarios" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Horários do Medicamento</h3>
        <div id="listaHorarios" class="space-y-2 mb-4">
          <p class="text-gray-500 text-sm">Nenhum horário registrado.</p>
        </div>
        <form id="formHorario" class="flex gap-2">
          <input type="time" id="novoHorario" required class="flex-1 border rounded-lg px-4 py-2">
          <button type="submit" id="btnAdicionarHorario" disabled class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Adicionar</button>
        </form>
        <button onclick="document.getElementById('modalHorarios').classList.add('hidden')" class="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Fechar</button>
      </div>
    </div>
  `
}

let medicamentoAtual = null

export async function inicializar() {
  await carregarMedicamentos()
  
  configurarValidacaoFormulario('formMedicamento', [
    { id: 'nomeMedicamento' }
  ], 'btnSalvarMedicamento')
  
  configurarValidacaoFormulario('formHorario', [
    { id: 'novoHorario' }
  ], 'btnAdicionarHorario')
  
  document.getElementById('formMedicamento').addEventListener('submit', async (e) => {
    e.preventDefault()
    const dados = {
      nome: document.getElementById('nomeMedicamento').value.trim(),
      dosagem: document.getElementById('dosagemMedicamento').value.trim(),
      inicio: document.getElementById('inicioMedicamento').value,
      fim: document.getElementById('fimMedicamento').value
    }
    
    const resultado = await api.post('/medicamentos', dados)
    if (resultado.sucesso) {
      App.toast('Medicamento cadastrado com sucesso!')
      document.getElementById('modalMedicamento').classList.add('hidden')
      document.getElementById('formMedicamento').reset()
      await carregarMedicamentos()
    } else {
      App.toast(resultado.mensagem || 'Erro ao cadastrar medicamento.', 'erro')
    }
  })
  
  document.getElementById('formEditarMedicamento').addEventListener('submit', async (e) => {
    e.preventDefault()
    const id = document.getElementById('editarMedicamentoId').value
    const dados = {
      nome: document.getElementById('editarNomeMedicamento').value.trim(),
      dosagem: document.getElementById('editarDosagemMedicamento').value.trim(),
      inicio: document.getElementById('editarInicioMedicamento').value,
      fim: document.getElementById('editarFimMedicamento').value
    }
    
    const resultado = await api.put(`/medicamentos/${id}`, dados)
    if (resultado.sucesso) {
      App.toast('Medicamento atualizado com sucesso!')
      document.getElementById('modalEditarMedicamento').classList.add('hidden')
      await carregarMedicamentos()
    } else {
      App.toast(resultado.mensagem || 'Erro ao atualizar medicamento.', 'erro')
    }
  })
  
  document.getElementById('formHorario').addEventListener('submit', async (e) => {
    e.preventDefault()
    const hora = document.getElementById('novoHorario').value
    
    if (!medicamentoAtual) {
      App.toast('Nenhum medicamento selecionado.', 'erro')
      return
    }
    
    const resultado = await api.post(`/medicamentos/${medicamentoAtual}/horarios`, { hora })
    if (resultado.sucesso) {
      App.toast('Horário adicionado com sucesso!')
      document.getElementById('novoHorario').value = ''
      await carregarHorarios(medicamentoAtual)
    } else {
      App.toast(resultado.mensagem || 'Erro ao adicionar horário.', 'erro')
    }
  })
}

async function carregarMedicamentos() {
  const resultado = await api.get('/medicamentos')
  if (resultado.sucesso && resultado.dados.length > 0) {
    const lista = document.getElementById('listaMedicamentos')
    lista.innerHTML = resultado.dados.map(m => `
      <div class="p-4 bg-gray-50 rounded-lg">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">${m.nome}</h3>
            <p class="text-sm text-gray-600">${m.dosagem || 'Sem dosagem'}</p>
            ${m.inicio ? `<p class="text-xs text-gray-500">Início: ${m.inicio}${m.fim ? ` | Fim: ${m.fim}` : ''}</p>` : ''}
          </div>
          <div class="flex gap-2 items-start">
            <span class="px-2 py-1 text-xs rounded ${m.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">
              ${m.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
        <div class="flex gap-3 mt-3 pt-3 border-t border-gray-200">
          <button onclick="abrirHorarios(${m.id})" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Horários</button>
          <button onclick="editarMedicamento(${m.id}, '${m.nome.replace(/'/g, "\\'")}', '${(m.dosagem || '').replace(/'/g, "\\'")}', '${m.inicio || ''}', '${m.fim || ''}')" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Editar</button>
          <button onclick="excluirMedicamento(${m.id})" class="text-sm text-red-600 hover:text-red-800 font-medium">Excluir</button>
        </div>
      </div>
    `).join('')
    
    window.abrirHorarios = async (id) => {
      medicamentoAtual = id
      document.getElementById('modalHorarios').classList.remove('hidden')
      await carregarHorarios(id)
    }
  } else {
    document.getElementById('listaMedicamentos').innerHTML = '<p class="text-gray-500">Nenhum medicamento registrado.</p>'
  }
}

window.editarMedicamento = function(id, nome, dosagem, inicio, fim) {
  document.getElementById('editarMedicamentoId').value = id
  document.getElementById('editarNomeMedicamento').value = nome
  document.getElementById('editarDosagemMedicamento').value = dosagem
  document.getElementById('editarInicioMedicamento').value = inicio
  document.getElementById('editarFimMedicamento').value = fim
  document.getElementById('modalEditarMedicamento').classList.remove('hidden')
}

window.excluirMedicamento = async function(id) {
  if (!confirm('Tem certeza que deseja excluir este medicamento e todos os seus horários?')) return
  const resultado = await api.delete(`/medicamentos/${id}`)
  if (resultado.sucesso) {
    App.toast('Medicamento excluído com sucesso!')
    await carregarMedicamentos()
  } else {
    App.toast(resultado.mensagem || 'Erro ao excluir medicamento.', 'erro')
  }
}

async function carregarHorarios(medicamentoId) {
  const resultado = await api.get(`/medicamentos/${medicamentoId}/horarios`)
  const lista = document.getElementById('listaHorarios')
  
  if (resultado.sucesso && resultado.dados.length > 0) {
    lista.innerHTML = resultado.dados.map(h => `
      <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
        <span class="font-medium">${h.hora}</span>
        <button onclick="excluirHorario(${medicamentoId}, ${h.id})" class="text-sm text-red-600 hover:text-red-800 font-medium">Excluir</button>
      </div>
    `).join('')
  } else {
    lista.innerHTML = '<p class="text-gray-500 text-sm">Nenhum horário registrado.</p>'
  }
}

window.excluirHorario = async function(medicamentoId, horarioId) {
  if (!confirm('Tem certeza que deseja excluir este horário?')) return
  const resultado = await api.delete(`/medicamentos/${medicamentoId}/horarios/${horarioId}`)
  if (resultado.sucesso) {
    App.toast('Horário excluído com sucesso!')
    await carregarHorarios(medicamentoId)
  } else {
    App.toast(resultado.mensagem || 'Erro ao excluir horário.', 'erro')
  }
}
