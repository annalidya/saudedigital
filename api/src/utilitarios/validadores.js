const validator = require('validator')

// Remove espaços extras e escapa caracteres especiais
function sanitizar(texto) {
  return validator.trim(validator.escape(texto || ''))
}

// Valida e sanitiza os dados de cadastro de usuário
function validarUsuario(dados) {
  const erros = []
  const nome = sanitizar(dados.nome_completo)
  const email = sanitizar(dados.email)
  const senha = String(dados.senha || '')
  const tipo = sanitizar(dados.tipo) || 'paciente'
  const especialidade = sanitizar(dados.especialidade || '')
  const dataNascimento = sanitizar(dados.data_nascimento || '')
  const cpf = String(dados.cpf || '').replace(/\D/g, '')
  const confirmarSenha = String(dados.confirmar_senha || '')

  if (!nome || nome.length < 3 || nome.length > 150)
    erros.push('Nome completo deve ter entre 3 e 150 caracteres.')

  if (!validator.isEmail(email))
    erros.push('E-mail inválido.')

  if (!senha || senha.length < 6)
    erros.push('Senha deve ter no mínimo 6 caracteres.')

  if (confirmarSenha && senha !== confirmarSenha)
    erros.push('As senhas não conferem.')

  if (!['paciente', 'medico', 'cuidador'].includes(tipo))
    erros.push('Tipo de usuário inválido.')

  return {
    valido: erros.length === 0,
    erros,
    dados: { nome_completo: nome, email, senha, tipo, especialidade, data_nascimento: dataNascimento, cpf }
  }
}

// Valida credenciais de login
function validarLogin(dados) {
  const erros = []
  const email = sanitizar(dados.email)
  const senha = String(dados.senha || '')

  if (!validator.isEmail(email)) erros.push('E-mail inválido.')
  if (!senha) erros.push('Informe a senha.')

  return { valido: erros.length === 0, erros, dados: { email, senha } }
}

// Valida exame
function validarExame(dados) {
  const erros = []
  const nome = sanitizar(dados.nome)

  if (!nome || nome.length < 2) erros.push('Informe o nome do exame.')

  return {
    valido: erros.length === 0,
    erros,
    dados: {
      nome,
      tipo: sanitizar(dados.tipo || ''),
      laboratorio: sanitizar(dados.laboratorio || ''),
      data_exame: sanitizar(dados.data_exame || ''),
      resultado: sanitizar(dados.resultado || ''),
      arquivo: sanitizar(dados.arquivo || '')
    }
  }
}

// Valida receita
function validarReceita(dados) {
  const erros = []
  const medicamento = sanitizar(dados.medicamento)

  if (!medicamento || medicamento.length < 2)
    erros.push('Informe o medicamento.')

  return {
    valido: erros.length === 0,
    erros,
    dados: {
      medico: sanitizar(dados.medico || ''),
      medicamento,
      dosagem: sanitizar(dados.dosagem || ''),
      instrucoes: sanitizar(dados.instrucoes || ''),
      data_emissao: sanitizar(dados.data_emissao || ''),
      validade: sanitizar(dados.validade || '')
    }
  }
}

// Valida consulta
function validarConsulta(dados) {
  const erros = []
  const medico = sanitizar(dados.medico || '')
  const especialidade = sanitizar(dados.especialidade || '')
  const data = sanitizar(dados.data || '')

  if (!data) erros.push('Informe a data da consulta.')
  else if (!validator.isDate(data)) erros.push('Data da consulta inválida.')

  return {
    valido: erros.length === 0,
    erros,
    dados: {
      medico,
      especialidade,
      data,
      local: sanitizar(dados.local || ''),
      observacoes: sanitizar(dados.observacoes || '')
    }
  }
}

// Valida medicamento
function validarMedicamento(dados) {
  const erros = []
  const nome = sanitizar(dados.nome)

  if (!nome || nome.length < 2) erros.push('Informe o nome do medicamento.')

  return {
    valido: erros.length === 0,
    erros,
    dados: {
      nome,
      dosagem: sanitizar(dados.dosagem || ''),
      inicio: sanitizar(dados.inicio || ''),
      fim: sanitizar(dados.fim || '')
    }
  }
}

// Valida horário de medicação (HH:MM)
function validarHorario(dados) {
  const erros = []
  const hora = sanitizar(dados.hora)

  if (!hora || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(hora))
    erros.push('Horário inválido. Use o formato HH:MM.')

  return { valido: erros.length === 0, erros, dados: { hora } }
}

// Valida sintoma
function validarSintoma(dados) {
  const erros = []
  const data = sanitizar(dados.data || new Date().toISOString().slice(0, 10))
  const tipo = sanitizar(dados.tipo || '')
  const intensidade = parseInt(dados.intensidade, 10)

  if (!validator.isDate(data)) erros.push('Data inválida.')
  if (!Number.isInteger(intensidade) || intensidade < 1 || intensidade > 10)
    erros.push('Intensidade deve ser entre 1 e 10.')

  return {
    valido: erros.length === 0,
    erros,
    dados: { data, tipo, intensidade, descricao: sanitizar(dados.descricao || '') }
  }
}

module.exports = {
  sanitizar,
  validarUsuario,
  validarLogin,
  validarExame,
  validarReceita,
  validarConsulta,
  validarMedicamento,
  validarHorario,
  validarSintoma
}
