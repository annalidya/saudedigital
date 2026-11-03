// Módulo Prontuário Digital
export default function renderizarProntuario(usuario) {
  return `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Prontuário Digital</h1>
      <p class="text-gray-600">Gerencie seus exames, receitas e consultas</p>
    </div>
    
    <!-- Abas -->
    <div class="flex gap-2 mb-6 border-b border-gray-200">
      <button class="aba-prontuario px-4 py-2 font-medium text-indigo-600 border-b-2 border-indigo-600" data-aba="exames">
        Exames
      </button>
      <button class="aba-prontuario px-4 py-2 font-medium text-gray-500 hover:text-gray-700" data-aba="receitas">
        Receitas
      </button>
      <button class="aba-prontuario px-4 py-2 font-medium text-gray-500 hover:text-gray-700" data-aba="consultas">
        Consultas
      </button>
    </div>
    
    <!-- Conteúdo das abas -->
    <div id="conteudoExames" class="aba-conteudo">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Exames</h2>
        <button onclick="document.getElementById('modalExame').classList.remove('hidden')" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          + Novo Exame
        </button>
      </div>
      <div id="listaExames" class="space-y-3">
        <p class="text-gray-500">Nenhum exame registrado.</p>
      </div>
    </div>
    
    <div id="conteudoReceitas" class="aba-conteudo hidden">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Receitas</h2>
        <button onclick="document.getElementById('modalReceita').classList.remove('hidden')" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          + Nova Receita
        </button>
      </div>
      <div id="listaReceitas" class="space-y-3">
        <p class="text-gray-500">Nenhuma receita registrada.</p>
      </div>
    </div>
    
    <div id="conteudoConsultas" class="aba-conteudo hidden">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Consultas</h2>
        <button onclick="document.getElementById('modalConsulta').classList.remove('hidden')" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          + Nova Consulta
        </button>
      </div>
      <div id="listaConsultas" class="space-y-3">
        <p class="text-gray-500">Nenhuma consulta registrada.</p>
      </div>
    </div>
    
    <!-- Modal Novo Exame -->
    <div id="modalExame" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Novo Exame</h3>
        <form id="formExame" class="space-y-4">
          <input type="text" id="nomeExame" placeholder="Nome do exame" required class="w-full border rounded-lg px-4 py-2">
          <input type="text" id="tipoExame" placeholder="Tipo (ex: sangue, imagem)" class="w-full border rounded-lg px-4 py-2">
          <input type="text" id="laboratorioExame" placeholder="Laboratório" class="w-full border rounded-lg px-4 py-2">
          <input type="date" id="dataExame" class="w-full border rounded-lg px-4 py-2">
          <textarea id="resultadoExame" placeholder="Resultado" rows="3" class="w-full border rounded-lg px-4 py-2"></textarea>
          <div class="flex gap-2">
            <button type="button" onclick="document.getElementById('modalExame').classList.add('hidden')" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" id="btnSalvarExame" disabled class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Editar Exame -->
    <div id="modalEditarExame" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Editar Exame</h3>
        <form id="formEditarExame" class="space-y-4">
          <input type="hidden" id="editarExameId">
          <input type="text" id="editarNomeExame" placeholder="Nome do exame" required class="w-full border rounded-lg px-4 py-2">
          <input type="text" id="editarTipoExame" placeholder="Tipo (ex: sangue, imagem)" class="w-full border rounded-lg px-4 py-2">
          <input type="text" id="editarLaboratorioExame" placeholder="Laboratório" class="w-full border rounded-lg px-4 py-2">
          <input type="date" id="editarDataExame" class="w-full border rounded-lg px-4 py-2">
          <textarea id="editarResultadoExame" placeholder="Resultado" rows="3" class="w-full border rounded-lg px-4 py-2"></textarea>
          <div class="flex gap-2">
            <button type="button" onclick="document.getElementById('modalEditarExame').classList.add('hidden')" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Nova Receita -->
    <div id="modalReceita" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Nova Receita</h3>
        <form id="formReceita" class="space-y-4">
          <input type="text" id="medicoReceita" placeholder="Nome do médico" class="w-full border rounded-lg px-4 py-2">
          <input type="text" id="medicamentoReceita" placeholder="Medicamento" required class="w-full border rounded-lg px-4 py-2">
          <input type="text" id="dosagemReceita" placeholder="Dosagem" class="w-full border rounded-lg px-4 py-2">
          <textarea id="instrucoesReceita" placeholder="Instruções" rows="2" class="w-full border rounded-lg px-4 py-2"></textarea>
          <div class="flex gap-2">
            <button type="button" onclick="document.getElementById('modalReceita').classList.add('hidden')" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" id="btnSalvarReceita" disabled class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Editar Receita -->
    <div id="modalEditarReceita" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Editar Receita</h3>
        <form id="formEditarReceita" class="space-y-4">
          <input type="hidden" id="editarReceitaId">
          <input type="text" id="editarMedicoReceita" placeholder="Nome do médico" class="w-full border rounded-lg px-4 py-2">
          <input type="text" id="editarMedicamentoReceita" placeholder="Medicamento" required class="w-full border rounded-lg px-4 py-2">
          <input type="text" id="editarDosagemReceita" placeholder="Dosagem" class="w-full border rounded-lg px-4 py-2">
          <textarea id="editarInstrucoesReceita" placeholder="Instruções" rows="2" class="w-full border rounded-lg px-4 py-2"></textarea>
          <div class="flex gap-2">
            <button type="button" onclick="document.getElementById('modalEditarReceita').classList.add('hidden')" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Nova Consulta -->
    <div id="modalConsulta" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Nova Consulta</h3>
        <form id="formConsulta" class="space-y-4">
          <input type="text" id="medicoConsulta" placeholder="Nome do médico" class="w-full border rounded-lg px-4 py-2">
          <input type="text" id="especialidadeConsulta" placeholder="Especialidade" class="w-full border rounded-lg px-4 py-2">
          <input type="date" id="dataConsulta" required class="w-full border rounded-lg px-4 py-2">
          <input type="text" id="localConsulta" placeholder="Local" class="w-full border rounded-lg px-4 py-2">
          <textarea id="observacoesConsulta" placeholder="Observações" rows="2" class="w-full border rounded-lg px-4 py-2"></textarea>
          <div class="flex gap-2">
            <button type="button" onclick="document.getElementById('modalConsulta').classList.add('hidden')" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" id="btnSalvarConsulta" disabled class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Editar Consulta -->
    <div id="modalEditarConsulta" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Editar Consulta</h3>
        <form id="formEditarConsulta" class="space-y-4">
          <input type="hidden" id="editarConsultaId">
          <input type="text" id="editarMedicoConsulta" placeholder="Nome do médico" class="w-full border rounded-lg px-4 py-2">
          <input type="text" id="editarEspecialidadeConsulta" placeholder="Especialidade" class="w-full border rounded-lg px-4 py-2">
          <input type="date" id="editarDataConsulta" required class="w-full border rounded-lg px-4 py-2">
          <input type="text" id="editarLocalConsulta" placeholder="Local" class="w-full border rounded-lg px-4 py-2">
          <textarea id="editarObservacoesConsulta" placeholder="Observações" rows="2" class="w-full border rounded-lg px-4 py-2"></textarea>
          <div class="flex gap-2">
            <button type="button" onclick="document.getElementById('modalEditarConsulta').classList.add('hidden')" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  `
}

export async function inicializar() {
  await carregarExames()
  await carregarReceitas()
  await carregarConsultas()
  
  configurarValidacaoFormulario('formExame', [
    { id: 'nomeExame' }
  ], 'btnSalvarExame')
  
  configurarValidacaoFormulario('formReceita', [
    { id: 'medicamentoReceita' }
  ], 'btnSalvarReceita')
  
  configurarValidacaoFormulario('formConsulta', [
    { id: 'dataConsulta' }
  ], 'btnSalvarConsulta')
  
  document.querySelectorAll('.aba-prontuario').forEach(aba => {
    aba.addEventListener('click', () => {
      document.querySelectorAll('.aba-prontuario').forEach(a => {
        a.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600')
        a.classList.add('text-gray-500')
      })
      aba.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600')
      aba.classList.remove('text-gray-500')
      
      document.querySelectorAll('.aba-conteudo').forEach(c => c.classList.add('hidden'))
      document.getElementById(`conteudo${aba.dataset.aba.charAt(0).toUpperCase() + aba.dataset.aba.slice(1)}`).classList.remove('hidden')
    })
  })
  
  // Formulário de exame
  document.getElementById('formExame').addEventListener('submit', async (e) => {
    e.preventDefault()
    const dados = {
      nome: document.getElementById('nomeExame').value.trim(),
      tipo: document.getElementById('tipoExame').value.trim(),
      laboratorio: document.getElementById('laboratorioExame').value.trim(),
      data_exame: document.getElementById('dataExame').value,
      resultado: document.getElementById('resultadoExame').value.trim()
    }
    
    const resultado = await api.post('/exames', dados)
    if (resultado.sucesso) {
      App.toast('Exame cadastrado com sucesso!')
      document.getElementById('modalExame').classList.add('hidden')
      document.getElementById('formExame').reset()
      await carregarExames()
    } else {
      App.toast(resultado.mensagem || 'Erro ao cadastrar exame.', 'erro')
    }
  })
  
  // Formulário de receita
  document.getElementById('formReceita').addEventListener('submit', async (e) => {
    e.preventDefault()
    const dados = {
      medico: document.getElementById('medicoReceita').value.trim(),
      medicamento: document.getElementById('medicamentoReceita').value.trim(),
      dosagem: document.getElementById('dosagemReceita').value.trim(),
      instrucoes: document.getElementById('instrucoesReceita').value.trim()
    }
    
    const resultado = await api.post('/receitas', dados)
    if (resultado.sucesso) {
      App.toast('Receita cadastrada com sucesso!')
      document.getElementById('modalReceita').classList.add('hidden')
      document.getElementById('formReceita').reset()
      await carregarReceitas()
    } else {
      App.toast(resultado.mensagem || 'Erro ao cadastrar receita.', 'erro')
    }
  })
  
  // Formulário de consulta
  document.getElementById('formConsulta').addEventListener('submit', async (e) => {
    e.preventDefault()
    const dados = {
      medico: document.getElementById('medicoConsulta').value.trim(),
      especialidade: document.getElementById('especialidadeConsulta').value.trim(),
      data: document.getElementById('dataConsulta').value,
      local: document.getElementById('localConsulta').value.trim(),
      observacoes: document.getElementById('observacoesConsulta').value.trim()
    }
    
    const resultado = await api.post('/consultas', dados)
    if (resultado.sucesso) {
      App.toast('Consulta cadastrada com sucesso!')
      document.getElementById('modalConsulta').classList.add('hidden')
      document.getElementById('formConsulta').reset()
      await carregarConsultas()
    } else {
      App.toast(resultado.mensagem || 'Erro ao cadastrar consulta.', 'erro')
    }
  })
  
  // Formulário editar exame
  document.getElementById('formEditarExame').addEventListener('submit', async (e) => {
    e.preventDefault()
    const id = document.getElementById('editarExameId').value
    const dados = {
      nome: document.getElementById('editarNomeExame').value.trim(),
      tipo: document.getElementById('editarTipoExame').value.trim(),
      laboratorio: document.getElementById('editarLaboratorioExame').value.trim(),
      data_exame: document.getElementById('editarDataExame').value,
      resultado: document.getElementById('editarResultadoExame').value.trim()
    }
    
    const resultado = await api.put(`/exames/${id}`, dados)
    if (resultado.sucesso) {
      App.toast('Exame atualizado com sucesso!')
      document.getElementById('modalEditarExame').classList.add('hidden')
      await carregarExames()
    } else {
      App.toast(resultado.mensagem || 'Erro ao atualizar exame.', 'erro')
    }
  })
  
  // Formulário editar receita
  document.getElementById('formEditarReceita').addEventListener('submit', async (e) => {
    e.preventDefault()
    const id = document.getElementById('editarReceitaId').value
    const dados = {
      medico: document.getElementById('editarMedicoReceita').value.trim(),
      medicamento: document.getElementById('editarMedicamentoReceita').value.trim(),
      dosagem: document.getElementById('editarDosagemReceita').value.trim(),
      instrucoes: document.getElementById('editarInstrucoesReceita').value.trim()
    }
    
    const resultado = await api.put(`/receitas/${id}`, dados)
    if (resultado.sucesso) {
      App.toast('Receita atualizada com sucesso!')
      document.getElementById('modalEditarReceita').classList.add('hidden')
      await carregarReceitas()
    } else {
      App.toast(resultado.mensagem || 'Erro ao atualizar receita.', 'erro')
    }
  })
  
  // Formulário editar consulta
  document.getElementById('formEditarConsulta').addEventListener('submit', async (e) => {
    e.preventDefault()
    const id = document.getElementById('editarConsultaId').value
    const dados = {
      medico: document.getElementById('editarMedicoConsulta').value.trim(),
      especialidade: document.getElementById('editarEspecialidadeConsulta').value.trim(),
      data: document.getElementById('editarDataConsulta').value,
      local: document.getElementById('editarLocalConsulta').value.trim(),
      observacoes: document.getElementById('editarObservacoesConsulta').value.trim()
    }
    
    const resultado = await api.put(`/consultas/${id}`, dados)
    if (resultado.sucesso) {
      App.toast('Consulta atualizada com sucesso!')
      document.getElementById('modalEditarConsulta').classList.add('hidden')
      await carregarConsultas()
    } else {
      App.toast(resultado.mensagem || 'Erro ao atualizar consulta.', 'erro')
    }
  })
}

async function carregarExames() {
  const resultado = await api.get('/exames')
  if (resultado.sucesso && resultado.dados.length > 0) {
    const lista = document.getElementById('listaExames')
    lista.innerHTML = resultado.dados.map(e => `
      <div class="p-4 bg-gray-50 rounded-lg">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">${e.nome}</h3>
            <p class="text-sm text-gray-600">${e.tipo || ''} ${e.laboratorio ? `- ${e.laboratorio}` : ''}</p>
          </div>
          <span class="text-sm text-gray-500">${e.data_exame || ''}</span>
        </div>
        ${e.resultado ? `<p class="mt-2 text-sm text-gray-700">${e.resultado}</p>` : ''}
        <div class="flex gap-3 mt-3 pt-3 border-t border-gray-200">
          <button onclick="editarExame(${e.id}, '${e.nome.replace(/'/g, "\\'")}', '${(e.tipo || '').replace(/'/g, "\\'")}', '${(e.laboratorio || '').replace(/'/g, "\\'")}', '${e.data_exame || ''}', '${(e.resultado || '').replace(/'/g, "\\'")}')" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Editar</button>
          <button onclick="excluirExame(${e.id})" class="text-sm text-red-600 hover:text-red-800 font-medium">Excluir</button>
        </div>
      </div>
    `).join('')
  } else {
    document.getElementById('listaExames').innerHTML = '<p class="text-gray-500">Nenhum exame registrado.</p>'
  }
}

async function carregarReceitas() {
  const resultado = await api.get('/receitas')
  if (resultado.sucesso && resultado.dados.length > 0) {
    const lista = document.getElementById('listaReceitas')
    lista.innerHTML = resultado.dados.map(r => `
      <div class="p-4 bg-gray-50 rounded-lg">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">${r.medicamento}</h3>
            <p class="text-sm text-gray-600">${r.medico || ''} ${r.dosagem ? `- ${r.dosagem}` : ''}</p>
          </div>
          <span class="text-sm text-gray-500">${r.data_emissao || ''}</span>
        </div>
        ${r.instrucoes ? `<p class="mt-2 text-sm text-gray-700">${r.instrucoes}</p>` : ''}
        <div class="flex gap-3 mt-3 pt-3 border-t border-gray-200">
          <button onclick="editarReceita(${r.id}, '${(r.medico || '').replace(/'/g, "\\'")}', '${r.medicamento.replace(/'/g, "\\'")}', '${(r.dosagem || '').replace(/'/g, "\\'")}', '${(r.instrucoes || '').replace(/'/g, "\\'")}')" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Editar</button>
          <button onclick="excluirReceita(${r.id})" class="text-sm text-red-600 hover:text-red-800 font-medium">Excluir</button>
        </div>
      </div>
    `).join('')
  } else {
    document.getElementById('listaReceitas').innerHTML = '<p class="text-gray-500">Nenhuma receita registrada.</p>'
  }
}

async function carregarConsultas() {
  const resultado = await api.get('/consultas')
  if (resultado.sucesso && resultado.dados.length > 0) {
    const lista = document.getElementById('listaConsultas')
    lista.innerHTML = resultado.dados.map(c => `
      <div class="p-4 bg-gray-50 rounded-lg">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">${c.medico || 'Não informado'}</h3>
            <p class="text-sm text-gray-600">${c.especialidade || 'Geral'} ${c.local ? `- ${c.local}` : ''}</p>
          </div>
          <span class="text-sm text-gray-500">${c.data || ''}</span>
        </div>
        ${c.observacoes ? `<p class="mt-2 text-sm text-gray-700">${c.observacoes}</p>` : ''}
        <div class="flex gap-3 mt-3 pt-3 border-t border-gray-200">
          <button onclick="editarConsulta(${c.id}, '${(c.medico || '').replace(/'/g, "\\'")}', '${(c.especialidade || '').replace(/'/g, "\\'")}', '${c.data || ''}', '${(c.local || '').replace(/'/g, "\\'")}', '${(c.observacoes || '').replace(/'/g, "\\'")}')" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Editar</button>
          <button onclick="excluirConsulta(${c.id})" class="text-sm text-red-600 hover:text-red-800 font-medium">Excluir</button>
        </div>
      </div>
    `).join('')
  } else {
    document.getElementById('listaConsultas').innerHTML = '<p class="text-gray-500">Nenhuma consulta registrada.</p>'
  }
}

// Funções globais de edição e exclusão
window.editarExame = function(id, nome, tipo, laboratorio, data, resultado) {
  document.getElementById('editarExameId').value = id
  document.getElementById('editarNomeExame').value = nome
  document.getElementById('editarTipoExame').value = tipo
  document.getElementById('editarLaboratorioExame').value = laboratorio
  document.getElementById('editarDataExame').value = data
  document.getElementById('editarResultadoExame').value = resultado
  document.getElementById('modalEditarExame').classList.remove('hidden')
}

window.excluirExame = async function(id) {
  if (!confirm('Tem certeza que deseja excluir este exame?')) return
  const resultado = await api.delete(`/exames/${id}`)
  if (resultado.sucesso) {
    App.toast('Exame excluído com sucesso!')
    await carregarExames()
  } else {
    App.toast(resultado.mensagem || 'Erro ao excluir exame.', 'erro')
  }
}

window.editarReceita = function(id, medico, medicamento, dosagem, instrucoes) {
  document.getElementById('editarReceitaId').value = id
  document.getElementById('editarMedicoReceita').value = medico
  document.getElementById('editarMedicamentoReceita').value = medicamento
  document.getElementById('editarDosagemReceita').value = dosagem
  document.getElementById('editarInstrucoesReceita').value = instrucoes
  document.getElementById('modalEditarReceita').classList.remove('hidden')
}

window.excluirReceita = async function(id) {
  if (!confirm('Tem certeza que deseja excluir esta receita?')) return
  const resultado = await api.delete(`/receitas/${id}`)
  if (resultado.sucesso) {
    App.toast('Receita excluída com sucesso!')
    await carregarReceitas()
  } else {
    App.toast(resultado.mensagem || 'Erro ao excluir receita.', 'erro')
  }
}

window.editarConsulta = function(id, medico, especialidade, data, local, observacoes) {
  document.getElementById('editarConsultaId').value = id
  document.getElementById('editarMedicoConsulta').value = medico
  document.getElementById('editarEspecialidadeConsulta').value = especialidade
  document.getElementById('editarDataConsulta').value = data
  document.getElementById('editarLocalConsulta').value = local
  document.getElementById('editarObservacoesConsulta').value = observacoes
  document.getElementById('modalEditarConsulta').classList.remove('hidden')
}

window.excluirConsulta = async function(id) {
  if (!confirm('Tem certeza que deseja excluir esta consulta?')) return
  const resultado = await api.delete(`/consultas/${id}`)
  if (resultado.sucesso) {
    App.toast('Consulta excluída com sucesso!')
    await carregarConsultas()
  } else {
    App.toast(resultado.mensagem || 'Erro ao excluir consulta.', 'erro')
  }
}
