// Módulo Gestão de Usuários (Administração)
export default function renderizarAdminUsuarios(usuario) {
  return `
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
        <p class="text-gray-600">Pesquise, filtre e gerencie os cadastros</p>
      </div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input type="text" id="buscaUsuario" placeholder="Nome ou e-mail..." value=""
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select id="filtroTipo"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition">
            <option value="">Todos</option>
            <option value="paciente">Paciente</option>
            <option value="medico">Médico</option>
            <option value="cuidador">Cuidador/Familiar</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div class="flex items-end">
          <button id="btnFiltrar" class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            Filtrar
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-600 border-b border-gray-200">
          <tr>
            <th class="text-left px-4 py-3 font-medium">Nome</th>
            <th class="text-left px-4 py-3 font-medium">E-mail</th>
            <th class="text-left px-4 py-3 font-medium">Tipo</th>
            <th class="text-left px-4 py-3 font-medium">Status</th>
            <th class="text-left px-4 py-3 font-medium">Cadastro</th>
            <th class="text-right px-4 py-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody id="corpoTabelaUsuarios">
          <tr>
            <td colspan="6" class="px-4 py-6 text-center text-gray-500">Carregando...</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <p id="infoPaginacao" class="text-sm text-gray-500"></p>
      <div class="flex gap-2">
        <button id="btnAnterior" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">Anterior</button>
        <button id="btnProxima" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">Próxima</button>
      </div>
    </div>
  `
}

let pagina = 1
let meuId = null

export async function inicializar() {
  const usuario = auth.obterUsuario()
  meuId = usuario?.id || null

  await carregarUsuarios()

  document.getElementById('btnFiltrar').addEventListener('click', () => {
    pagina = 1
    carregarUsuarios()
  })

  document.getElementById('buscaUsuario').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      pagina = 1
      carregarUsuarios()
    }
  })

  document.getElementById('btnAnterior').addEventListener('click', () => {
    if (pagina > 1) {
      pagina--
      carregarUsuarios()
    }
  })

  document.getElementById('btnProxima').addEventListener('click', () => {
    pagina++
    carregarUsuarios()
  })

  window.adminAlternarStatus = async (id, nome) => {
    const usuarioAtual = await api.get('/admin/usuarios/' + id)
    if (!usuarioAtual.sucesso) {
      App.toast('Erro ao carregar o usuário.', 'erro')
      return
    }
    const ativoAtual = usuarioAtual.dados.ativo
    const acao = ativoAtual ? 'desativar' : 'ativar'
    if (!confirm(`Deseja ${acao} o usuário "${nome}"?`)) return

    const resultado = await api.put(`/admin/usuarios/${id}/status`, { ativo: ativoAtual ? 0 : 1 })
    if (resultado.sucesso) {
      App.toast(resultado.mensagem)
      carregarUsuarios()
    } else {
      App.toast(resultado.mensagem || 'Erro ao alterar status.', 'erro')
    }
  }

  window.adminExcluirUsuario = async (id, nome) => {
    if (!confirm(`Excluir permanentemente o usuário "${nome}"?\nTodos os registros clínicos também serão removidos.`)) return
    const resultado = await api.delete(`/admin/usuarios/${id}`)
    if (resultado.sucesso) {
      App.toast(resultado.mensagem)
      carregarUsuarios()
    } else {
      App.toast(resultado.mensagem || 'Erro ao excluir usuário.', 'erro')
    }
  }
}

async function carregarUsuarios() {
  const busca = document.getElementById('buscaUsuario').value.trim()
  const tipo = document.getElementById('filtroTipo').value

  const params = new URLSearchParams({ pagina })
  if (busca) params.set('busca', busca)
  if (tipo) params.set('tipo', tipo)

  try {
    const resultado = await api.get(`/admin/usuarios?${params.toString()}`)
    const corpo = document.getElementById('corpoTabelaUsuarios')

    if (!resultado.sucesso) {
      corpo.innerHTML = `<tr><td colspan="6" class="px-4 py-6 text-center text-red-500">${resultado.mensagem}</td></tr>`
      return
    }

    if (resultado.dados.length === 0) {
      corpo.innerHTML = '<tr><td colspan="6" class="px-4 py-6 text-center text-gray-500">Nenhum usuário encontrado.</td></tr>'
    } else {
      corpo.innerHTML = resultado.dados.map(u => {
        const ehProprio = u.id === meuId
        return `
          <tr class="border-b border-gray-100 hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-900">${u.nome_completo}</td>
            <td class="px-4 py-3 text-gray-600">${u.email}</td>
            <td class="px-4 py-3"><span class="px-2 py-1 text-xs rounded ${badgeTipo(u.tipo)}">${u.tipo}</span></td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 text-xs rounded ${u.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                ${u.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-500">${u.criado_em}</td>
            <td class="px-4 py-3">
              <div class="flex justify-end gap-2">
                ${ehProprio
                  ? '<span class="text-xs text-gray-400">Você</span>'
                  : `
                    <button onclick="adminAlternarStatus(${u.id}, '${u.nome_completo.replace(/'/g, "\\'")}')"
                      class="px-3 py-1 text-xs rounded ${u.ativo ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'}">
                      ${u.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                    <button onclick="adminExcluirUsuario(${u.id}, '${u.nome_completo.replace(/'/g, "\\'")}')"
                      class="px-3 py-1 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
                      Excluir
                    </button>
                  `
                }
              </div>
            </td>
          </tr>
        `
      }).join('')
    }

    const paginacao = resultado.paginacao
    document.getElementById('infoPaginacao').textContent = `Mostrando página ${paginacao.pagina} de ${paginacao.total_paginas} (${paginacao.total} usuários)`
    document.getElementById('btnAnterior').disabled = pagina <= 1
    document.getElementById('btnProxima').disabled = pagina >= paginacao.total_paginas
    document.getElementById('btnAnterior').classList.toggle('opacity-50', pagina <= 1)
    document.getElementById('btnProxima').classList.toggle('opacity-50', pagina >= paginacao.total_paginas)
  } catch (erro) {
    App.toast('Erro de conexão com o servidor.', 'erro')
  }
}

function badgeTipo(tipo) {
  return {
    admin: 'bg-purple-100 text-purple-700',
    medico: 'bg-blue-100 text-blue-700',
    cuidador: 'bg-teal-100 text-teal-700',
    paciente: 'bg-green-100 text-green-700'
  }[tipo] || 'bg-gray-100 text-gray-700'
}