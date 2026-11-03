// Módulo de Login
export default function renderizarLogin() {
  return `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-indigo-600">SAFEMED</h1>
          <p class="text-gray-600 mt-2">Prontuário Digital de Saúde</p>
        </div>
        
        <div class="bg-white p-8 rounded-2xl shadow-lg">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Entrar</h2>
          
          <form id="formLogin" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" id="email" name="email" required placeholder="seu@email.com"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
            </div>
            
            <div>
              <label for="senha" class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input type="password" id="senha" name="senha" required placeholder="Sua senha" minlength="6"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
            </div>
            
            <button type="submit" id="btnEntrar" disabled class="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition">
              Entrar
            </button>
          </form>
          
          <div class="mt-6 text-center">
            <a href="#/cadastro" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Não tem conta? Cadastre-se
            </a>
          </div>
        </div>
      </div>
    </div>
  `
}

export function inicializar() {
  const form = document.getElementById('formLogin')
  
  configurarValidacaoFormulario('formLogin', [
    { id: 'email' },
    { id: 'senha' }
  ], 'btnEntrar')
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const email = document.getElementById('email').value.trim()
    const senha = document.getElementById('senha').value
    
    try {
      const resultado = await auth.login(email, senha)
      
      if (resultado.sucesso) {
        App.toast('Login realizado com sucesso!')
        window.location.hash = '#/dashboard'
      } else {
        App.toast(resultado.mensagem || 'Erro ao fazer login.', 'erro')
      }
    } catch (erro) {
      App.toast('Erro de conexão com o servidor.', 'erro')
    }
  })
}
