// Internacionalização do frontend - SAFEMED
// Dicionário principal gerado pela lib tradutor/node-google-translate (pt -> es).
const I18n = (() => {
  const CHAVE_IDIOMA = 'safemed_idioma'
  const ATRIBUTOS_TRADUZIVEIS = ['placeholder', 'title', 'aria-label', 'alt']
  const TAGS_IGNORADAS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT'])
  const TAGS_SEM_TEXTO = new Set(['TEXTAREA', 'INPUT', 'CODE', 'PRE'])
  const OPCOES_OBSERVER = {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATRIBUTOS_TRADUZIVEIS
  }

  // Ajustes pontuais para termos que o Google traduz fora do contexto da tela.
  const AJUSTES_ES = {
    'SAFEMED': 'SAFEMED',
    'Dom': 'Dom',
    'Seg': 'Lun',
    'Ter': 'Mar',
    'Qua': 'Mié',
    'Qui': 'Jue',
    'Sex': 'Vie',
    'Sáb': 'Sáb',
    'Geral': 'General',
    'Médico': 'Médico',
    'Médicos': 'Médicos',
    'Medicamento': 'Medicamento',
    'Medicamentos': 'Medicamentos',
    'Novo Medicamento': 'Nuevo medicamento',
    '+ Novo Medicamento': '+ Nuevo medicamento',
    'Editar Medicamento': 'Editar medicamento',
    'Medicamento cadastrado com sucesso!': '¡Medicamento registrado con éxito!',
    'Medicamento não encontrado.': 'Medicamento no encontrado.',
    'Administração': 'Administración',
    'Área Administrativa': 'Área administrativa',
    'Você': '(Tú)',
    'Login realizado com sucesso!': '¡Sesión iniciada con éxito!',
    'Exame': 'Examen',
    'Nome completo': 'Nombre completo',
    'Prontuário': 'Historial médico',
    'Cuidador/Familiar': 'Cuidador/Familiar',
    'paciente': 'paciente',
    'medico': 'médico',
    'cuidador': 'cuidador',
    'admin': 'administrador'
  }

  const MODELOS = [
    [/^Bem-vindo,\s*(.+?)!$/, '¡Bienvenido, $1!'],
    [/^Nenhum compromisso em\s*(.+)$/, 'Ningún compromiso el $1'],
    [/^Mostrando página (\d+) de (\d+) \((\d+) usuários\)$/, 'Mostrando la página $1 de $2 ($3 usuarios)'],
    [/^Deseja ativar o usuário "(.+)"\?$/, '¿Desea activar al usuario "$1"?'],
    [/^Deseja desativar o usuário "(.+)"\?$/, '¿Desea desactivar al usuario "$1"?'],
    [/^Excluir permanentemente o usuário "(.+)"\?\nTodos os registros clínicos também serão removidos\.$/, '¿Eliminar permanentemente al usuario "$1"?\nTambién se eliminarán todos los registros clínicos.'],
    [/^Início:\s*(.+?)\s*\|\s*Fim:\s*(.+)$/, 'Inicio: $1 | Fin: $2'],
    [/^Início:\s*(.+)$/, 'Inicio: $1'],
    [/^(.+?)\s+às\s+(\d{2}:\d{2})$/, '$1 a las $2'],
    [/^Resultado:\s*(.+)$/, 'Resultado: $1']
  ]

  let idioma = 'pt'
  let dicionario = Object.assign({}, window.I18N_DICIONARIO_ES || {}, AJUSTES_ES)
  let observer = null
  let carregamentoRemoto = null
  let dicionarioRemotoCarregado = false

  const registrosTexto = new WeakMap()
  const registrosAtributos = new WeakMap()

  let tituloEmPortugues = document.title
  let tituloTraduzido = null

  function textoTraduzido(texto) {
    if (idioma !== 'es') return texto

    const valor = String(texto)
    const partes = valor.match(/^(\s*)([\s\S]*?)(\s*)$/)
    if (!partes || !partes[2]) return valor

    return partes[1] + traduzirNucleo(partes[2]) + partes[3]
  }

  function traduzirNucleo(texto) {
    if (!texto) return texto
    if (dicionario[texto]) return dicionario[texto]

    const titulo = texto.match(/^(.+?) - SAFEMED$/)
    if (titulo) {
      return `${traduzirNucleo(titulo[1])} - SAFEMED`
    }

    for (const [padrao, substituicao] of MODELOS) {
      if (padrao.test(texto)) {
        return texto.replace(padrao, substituicao)
      }
    }

    const mesAno = texto.match(/^([A-Za-zÀ-ÿ]+)\s+(\d{4})$/)
    if (mesAno && dicionario[mesAno[1]]) {
      return `${dicionario[mesAno[1]]} ${mesAno[2]}`
    }

    return texto
  }

  function deveIgnorar(elemento) {
    if (!elemento) return false
    if (TAGS_IGNORADAS.has(elemento.tagName)) return true
    if (elemento.id === 'seletorIdioma') return true
    if (elemento.closest && elemento.closest('#seletorIdioma')) return true
    if (elemento.closest && elemento.closest('[data-i18n-ignore]')) return true
    return false
  }

  function deveIgnorarTexto(elemento) {
    if (deveIgnorar(elemento)) return true
    return elemento ? TAGS_SEM_TEXTO.has(elemento.tagName) : false
  }

  function aplicarTexto(no) {
    const valorAtual = no.nodeValue
    if (!valorAtual || !valorAtual.trim()) return

    const registro = registrosTexto.get(no)
    let original
    let ultimo

    if (registro && valorAtual === registro.ultimo) {
      original = registro.original
      ultimo = registro.ultimo
    } else {
      original = valorAtual
      ultimo = valorAtual
    }

    const partes = original.match(/^(\s*)([\s\S]*?)(\s*)$/)
    if (!partes || !partes[2]) return

    const prefixo = partes[1]
    const nucleo = partes[2]
    const sufixo = partes[3]
    const novoNucleo = idioma === 'es' ? traduzirNucleo(nucleo) : nucleo
    const novoValor = prefixo + novoNucleo + sufixo

    if (no.nodeValue !== novoValor) {
      no.nodeValue = novoValor
    }

    registrosTexto.set(no, { original, ultimo: novoValor || ultimo })
  }

  function aplicarAtributos(elemento) {
    if (!elemento || !elemento.getAttribute) return

    let registros = registrosAtributos.get(elemento)

    for (const atributo of ATRIBUTOS_TRADUZIVEIS) {
      if (!elemento.hasAttribute(atributo)) continue

      const valorAtual = elemento.getAttribute(atributo)
      if (!valorAtual || !valorAtual.trim()) continue

      if (!registros) {
        registros = {}
        registrosAtributos.set(elemento, registros)
      }

      const registro = registros[atributo]
      let original
      let ultimo

      if (registro && valorAtual === registro.ultimo) {
        original = registro.original
        ultimo = registro.ultimo
      } else {
        original = valorAtual
        ultimo = valorAtual
      }

      const novoValor = idioma === 'es' ? textoTraduzido(original) : original

      if (valorAtual !== novoValor) {
        elemento.setAttribute(atributo, novoValor)
      }

      registros[atributo] = { original, ultimo: novoValor || ultimo }
    }
  }

  function aplicarEm(raiz) {
    if (!raiz) return

    if (raiz.nodeType === Node.TEXT_NODE) {
      if (!deveIgnorarTexto(raiz.parentElement)) aplicarTexto(raiz)
      return
    }

    if (raiz.nodeType !== Node.ELEMENT_NODE) return
    if (deveIgnorar(raiz)) return

    aplicarAtributos(raiz)

    const caminhante = document.createTreeWalker(raiz, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: (no) => {
        if (no.nodeType === Node.ELEMENT_NODE) {
          return deveIgnorar(no) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        }
        return no.parentElement && deveIgnorarTexto(no.parentElement)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT
      }
    })

    let no = caminhante.nextNode()

    while (no) {
      if (no.nodeType === Node.TEXT_NODE) {
        aplicarTexto(no)
      } else if (no.nodeType === Node.ELEMENT_NODE) {
        aplicarAtributos(no)
      }

      no = caminhante.nextNode()
    }
  }

  function atualizarTitulo() {
    const tituloAtual = document.title

    if (tituloTraduzido === null || tituloAtual !== tituloTraduzido) {
      tituloEmPortugues = tituloAtual
    }

    const novoTitulo = idioma === 'es' ? traduzirNucleo(tituloEmPortugues) : tituloEmPortugues
    document.title = novoTitulo
    tituloTraduzido = idioma === 'es' ? novoTitulo : null
  }

  function aplicar() {
    if (!document.body) return

    if (observer) observer.disconnect()

    try {
      aplicarEm(document.body)
      atualizarTitulo()
    } finally {
      if (observer) observer.observe(document.body, OPCOES_OBSERVER)
    }
  }

  function aplicarMutacoes(mutacoes) {
    if (idioma !== 'es' || !observer) return

    observer.disconnect()

    try {
      for (const mutacao of mutacoes) {
        if (mutacao.type === 'childList') {
          mutacao.addedNodes.forEach((no) => {
            if (no.nodeType === Node.TEXT_NODE) {
              if (no.parentElement) aplicarEm(no.parentElement)
            } else {
              aplicarEm(no)
            }
          })
        } else if (mutacao.type === 'characterData') {
          if (mutacao.target.parentElement) aplicarEm(mutacao.target)
        } else if (mutacao.type === 'attributes') {
          aplicarAtributos(mutacao.target)
        }
      }
    } finally {
      observer.observe(document.body, OPCOES_OBSERVER)
    }
  }

  function iniciarObserver() {
    if (observer || !document.body) return

    observer = new MutationObserver(aplicarMutacoes)
    observer.observe(document.body, OPCOES_OBSERVER)
  }

  function atualizarBotoes() {
    document.querySelectorAll('#seletorIdioma [data-idioma]').forEach((botao) => {
      const ativo = botao.dataset.idioma === idioma
      botao.classList.toggle('ativo', ativo)
      botao.setAttribute('aria-pressed', ativo ? 'true' : 'false')
    })
  }

  function carregarDicionarioRemoto() {
    if (dicionarioRemotoCarregado || carregamentoRemoto) return carregamentoRemoto

    carregamentoRemoto = fetch('/api/traducao/dicionario?destino=es')
      .then((resposta) => {
        if (!resposta.ok) throw new Error('HTTP ' + resposta.status)
        return resposta.json()
      })
      .then((resultado) => {
        if (!resultado || !resultado.sucesso || !resultado.dados || !resultado.dados.mapa) return

        dicionario = Object.assign({}, dicionario, resultado.dados.mapa, AJUSTES_ES)
        dicionarioRemotoCarregado = true

        if (idioma === 'es') aplicar()
      })
      .catch((erro) => {
        console.warn('Não foi possível atualizar o dicionário de tradução:', erro.message)
      })
      .finally(() => {
        carregamentoRemoto = null
      })

    return carregamentoRemoto
  }

  function definirIdioma(novoIdioma) {
    if (novoIdioma !== 'pt' && novoIdioma !== 'es') return

    idioma = novoIdioma

    try {
      localStorage.setItem(CHAVE_IDIOMA, idioma)
    } catch (erro) {
      // Armazenamento indisponível: segue apenas na sessão atual.
    }

    document.documentElement.lang = idioma === 'es' ? 'es' : 'pt-BR'

    atualizarBotoes()
    aplicar()

    if (idioma === 'es') {
      carregarDicionarioRemoto()
    }
  }

  function iniciar() {
    try {
      const salvo = localStorage.getItem(CHAVE_IDIOMA)
      if (salvo === 'es' || salvo === 'pt') idioma = salvo
    } catch (erro) {
      idioma = 'pt'
    }

    document.documentElement.lang = idioma === 'es' ? 'es' : 'pt-BR'

    const seletor = document.getElementById('seletorIdioma')
    if (seletor) {
      seletor.querySelectorAll('[data-idioma]').forEach((botao) => {
        botao.addEventListener('click', () => definirIdioma(botao.dataset.idioma))
      })
    }

    atualizarBotoes()
    iniciarObserver()
    aplicar()

    if (idioma === 'es') {
      carregarDicionarioRemoto()
    }
  }

  // Traduz também as mensagens nativas de confirmação/alerta.
  const confirmarOriginal = window.confirm.bind(window)
  const alertarOriginal = window.alert.bind(window)

  window.confirm = (mensagem) => confirmarOriginal(textoTraduzido(mensagem))
  window.alert = (mensagem) => alertarOriginal(textoTraduzido(mensagem))

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar)
  } else {
    iniciar()
  }

  return {
    aplicar,
    aplicarTitulo: atualizarTitulo,
    definirIdioma,
    traduzir: textoTraduzido,
    t: textoTraduzido,
    get idioma() {
      return idioma
    }
  }
})()

window.I18n = I18n
