// Máscaras de formulário
const Mascara = {
  // Máscara de telefone (xx) xxxxx-xxxx
  telefone: (input) => {
    let valor = input.value.replace(/\D/g, '').slice(0, 11)
    if (valor.length > 2) valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`
    if (valor.length > 10) valor = `${valor.slice(0, 10)}-${valor.slice(10)}`
    input.value = valor
  },

  // Máscara de CPF xxx.xxx.xxx-xx
  cpf: (input) => {
    let valor = input.value.replace(/\D/g, '').slice(0, 11)
    if (valor.length > 3) valor = `${valor.slice(0, 3)}.${valor.slice(3)}`
    if (valor.length > 7) valor = `${valor.slice(0, 7)}.${valor.slice(7)}`
    if (valor.length > 11) valor = `${valor.slice(0, 11)}-${valor.slice(11)}`
    input.value = valor
  },

  // Máscara de data dd/mm/aaaa
  data: (input) => {
    let valor = input.value.replace(/\D/g, '').slice(0, 8)
    if (valor.length > 2) valor = `${valor.slice(0, 2)}/${valor.slice(2)}`
    if (valor.length > 5) valor = `${valor.slice(0, 5)}/${valor.slice(5)}`
    input.value = valor
  },

  // Máscara de hora hh:mm
  hora: (input) => {
    let valor = input.value.replace(/\D/g, '').slice(0, 4)
    if (valor.length > 2) valor = `${valor.slice(0, 2)}:${valor.slice(2)}`
    input.value = valor
  },

  // Aplicar máscara a um elemento
  aplicar: (elemento, tipo) => {
    if (!elemento) return
    elemento.addEventListener('input', () => {
      Mascara[tipo](elemento)
    })
  },

  // Aplicar máscaras a todos os elementos com data-mascara
  inicializar: () => {
    document.querySelectorAll('[data-mascara]').forEach(el => {
      Mascara.aplicar(el, el.dataset.mascara)
    })
  }
}

// Inicializar máscaras quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => Mascara.inicializar())

window.Mascara = Mascara
