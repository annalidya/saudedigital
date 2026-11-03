// Módulo de Cadastro
export default function renderizarCadastro() {
  return `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-indigo-600">SAFEMED</h1>
          <p class="text-gray-600 mt-2">Prontuário Digital de Saúde</p>
        </div>
        
        <div class="bg-white p-8 rounded-2xl shadow-lg">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Criar Conta</h2>
          
          <form id="formCadastro" class="space-y-4">
            <div>
              <label for="nome_completo" class="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
              <input type="text" id="nome_completo" name="nome_completo" required minlength="3" maxlength="150" placeholder="Seu nome completo"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" id="email" name="email" required placeholder="seu@email.com"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
            </div>
            
            <div>
              <label for="tipo" class="block text-sm font-medium text-gray-700 mb-1">Tipo de usuário</label>
              <select id="tipo" name="tipo" required
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
                <option value="paciente">Paciente</option>
                <option value="medico">Médico</option>
                <option value="cuidador">Cuidador/Familiar</option>
              </select>
            </div>
            
            <div id="campoEspecialidade" class="hidden">
              <label for="especialidade" class="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
              <input type="text" id="especialidade" name="especialidade" placeholder="Ex: Cardiologista"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
            </div>
            
            <div>
              <label for="senha" class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input type="password" id="senha" name="senha" required minlength="6" placeholder="Mínimo 6 caracteres"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
            </div>
            
            <div>
              <label for="confirmar_senha" class="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
              <input type="password" id="confirmar_senha" name="confirmar_senha" required minlength="6" placeholder="Confirme sua senha"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
            </div>
            
            <button type="submit" id="btnCadastrar" disabled class="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition">
              Cadastrar
            </button>
          </form>
          
          <div class="mt-6 text-center">
            <a href="#/login" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Já tem conta? Entrar
            </a>
          </div>
        </div>
      </div>
    </div>
  `
}

export function inicializar() {
  const form = document.getElementById('formCadastro')
  const tipoSelect = document.getElementById('tipo')
  const campoEspecialidade = document.getElementById('campoEspecialidade')
  
  // Mostrar/esconder campo de especialidade
  tipoSelect.addEventListener('change', () => {
    campoEspecialidade.classList.toggle('hidden', tipoSelect.value !== 'medico')
    configurarValidacaoFormulario('formCadastro', [
      { id: 'nome_completo' },
      { id: 'email' },
      { id: 'tipo' },
      { id: 'especialidade', condicional: () => document.getElementById('tipo').value === 'medico' },
      { id: 'senha' },
      { id: 'confirmar_senha' }
    ], 'btnCadastrar')
  })
  
  // Configurar validação inicial
  configurarValidacaoFormulario('formCadastro', [
    { id: 'nome_completo' },
    { id: 'email' },
    { id: 'tipo' },
    { id: 'especialidade', condicional: () => document.getElementById('tipo').value === 'medico' },
    { id: 'senha' },
    { id: 'confirmar_senha' }
  ], 'btnCadastrar')
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const dados = {
      nome_completo: document.getElementById('nome_completo').value.trim(),
      email: document.getElementById('email').value.trim(),
      tipo: document.getElementById('tipo').value,
      especialidade: document.getElementById('especialidade').value.trim(),
      senha: document.getElementById('senha').value,
      confirmar_senha: document.getElementById('confirmar_senha').value
    }
    
    try {
      const resultado = await auth.cadastrar(dados)
      
      if (resultado.sucesso) {
        App.toast('Cadastro realizado com sucesso! Faça login.')
        window.location.hash = '#/login'
      } else {
        const msg = resultado.erros ? resultado.erros.join(' ') : resultado.mensagem
        App.toast(msg || 'Erro ao cadastrar.', 'erro')
      }
    } catch (erro) {
      App.toast('Erro de conexão com o servidor.', 'erro')
    }
  })
}
