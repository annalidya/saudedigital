const fs = require('fs')
const path = require('path')

const googleTranslate = require(path.resolve(__dirname, '../../../tradutor/node-google-translate'))

const RAIZ_PROJETO = path.resolve(__dirname, '../../..')
const tradutor = googleTranslate(process.env.GOOGLE_TRANSLATE_API_KEY || undefined)

const PASTAS_DE_TEXTO = [
  path.join(RAIZ_PROJETO, 'frontend', 'js'),
  path.join(RAIZ_PROJETO, 'api', 'src', 'controladores'),
  path.join(RAIZ_PROJETO, 'api', 'src', 'utilitarios')
]

const TEXTOS_EXTRAS = [
  'Carregando...',
  'paciente',
  'medico',
  'cuidador',
  'admin',
  'compromisso',
  'medico',
  'exame',
  'outro'
]

let dicionarioEmCache = null
let carregamentoEmAndamento = null

function listarArquivosJs(diretorio) {
  if (!fs.existsSync(diretorio)) return []

  const arquivos = []
  const itens = fs.readdirSync(diretorio, { withFileTypes: true })

  for (const item of itens) {
    const caminho = path.join(diretorio, item.name)

    if (item.isDirectory()) {
      arquivos.push(...listarArquivosJs(caminho))
    } else if (item.isFile() && item.name.endsWith('.js')) {
      // Evita realimentar o dicionario com o proprio arquivo gerado.
      if (item.name === 'i18n-dicionario.js' || item.name === 'i18n.js') continue
      arquivos.push(caminho)
    }
  }

  return arquivos
}

function desescaparTexto(texto) {
  return texto
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/\\(['"`\\])/g, '$1')
}

function pareceTextoDeInterface(texto) {
  const limpo = texto.trim()

  if (!limpo || limpo.length < 2 || limpo.length > 220) return false
  if (limpo === 'SAFEMED') return false
  if (limpo.includes('${') || limpo.includes('\n')) return false
  if (/[<>{}\\]/.test(limpo)) return false
  if (!/[A-Za-zÀ-ÿ]/.test(limpo)) return false
  if (/^(https?:|\/\/|\/|#|\.\/|\.\.\/)/.test(limpo)) return false

  // Ignora identificadores, valores internos e classes CSS em minusculas.
  if (/^[a-z0-9_\-:.%/]+$/.test(limpo) && !/[À-ÿ]/.test(limpo)) return false
  if (/(^|\s)(text-|bg-|border-|rounded|flex|grid|p[xytrbl]?-|m[xytrbl]?-|w-|h-|min-|max-|gap-|space-|items-|justify-|font-|shadow|transition|cursor-|overflow-|absolute|relative|fixed|sticky|hidden|block|inline|col-|row-|md:|lg:|sm:|hover:|focus:)/.test(limpo)) {
    return false
  }

  if (/(=>|function\s|const\s|let\s|var\s|require\(|querySelector|addEventListener|localStorage|JSON\.)/.test(limpo)) {
    return false
  }

  // Descarta fragmentos de codigo que aparecem ao varrer template literals.
  if (/(document\.|getElementById|classList|\.\w+\(|;\s*$|^\s*[).])/.test(limpo)) return false
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|WHERE|FROM|AND|OR)\b/i.test(limpo)) return false
  if (/^(AND|OR|DELETE|Authorization|Bearer|Content-Type|Enter)$/.test(limpo)) return false
  if (/^\d+(\.\d+)?px\b|sans-serif$/.test(limpo)) return false
  if (/^(btn|editar|campo|lista|conteudo|corpo|canvas|area|stat|total|info|modal|form|busca|data|descricao|dosagem|valor|nome|email|senha)[A-Z]/.test(limpo)) return false

  // Exige pelo menos maiuscula, acento, espaco ou pontuacao (descarta tokens soltos).
  if (!/[A-ZÀ-Þ]|[À-ÿ]|\s|[?!.:;]/.test(limpo)) return false

  return true
}

function adicionarTexto(textos, texto) {
  const limpo = desescaparTexto(texto).trim()

  if (pareceTextoDeInterface(limpo)) {
    textos.add(limpo)
  }
}

// Extrai textos visiveis e atributos de trechos HTML presentes em template literals.
function extrairTextosDeHtml(textos, html) {
  const padraoAtributos = /(?:placeholder|title|aria-label|alt)\s*=\s*"([^"]*)"/g
  const padraoTexto = />([^<>]+)</g
  let correspondencia

  while ((correspondencia = padraoAtributos.exec(html)) !== null) {
    adicionarTexto(textos, correspondencia[1])
  }

  while ((correspondencia = padraoTexto.exec(html)) !== null) {
    adicionarTexto(textos, correspondencia[1])
  }
}

function extrairStrings(conteudo, textos) {
  const padraoStrings = /'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)"|`((?:\\.|[^`\\])*)`/g
  let correspondencia

  while ((correspondencia = padraoStrings.exec(conteudo)) !== null) {
    const bruto = correspondencia[1] ?? correspondencia[2] ?? correspondencia[3]
    if (bruto === undefined) continue

    if (correspondencia[3] !== undefined) {
      // Template literal: extrai os textos e atributos do HTML interno.
      if (bruto.includes('<')) {
        extrairTextosDeHtml(textos, bruto)
      } else {
        adicionarTexto(textos, bruto)
      }

      // Tambem extrai literais que estao dentro das interpolacoes ${...}.
      extrairStrings(bruto, textos)
      continue
    }

    adicionarTexto(textos, bruto)
  }
}

function extrairTextosDosArquivos(arquivos) {
  const textos = new Set()

  for (const arquivo of arquivos) {
    const conteudo = fs.readFileSync(arquivo, 'utf8')
    extrairStrings(conteudo, textos)
  }

  return Array.from(textos)
}

function extrairTextos() {
  const arquivos = PASTAS_DE_TEXTO.flatMap(listarArquivosJs)
  const textos = new Set(extrairTextosDosArquivos(arquivos))

  for (const extra of TEXTOS_EXTRAS) {
    textos.add(extra)
  }

  return Array.from(textos).sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

function traduzirTextos(textos, origem = 'pt', destino = 'es') {
  if (textos.length === 0) return Promise.resolve([])

  return new Promise((resolve, reject) => {
    tradutor.translate(textos, origem, destino, (erro, resultado) => {
      if (erro) {
        return reject(new Error(typeof erro === 'string' ? erro : erro.message))
      }

      const lista = Array.isArray(resultado) ? resultado : [resultado]

      resolve(lista.map((item) => {
        if (typeof item === 'string') return item
        return item && item.translatedText ? item.translatedText : ''
      }))
    })
  })
}

async function obterDicionario(destino = 'es') {
  if (dicionarioEmCache && dicionarioEmCache.destino === destino) {
    return dicionarioEmCache
  }

  if (carregamentoEmAndamento) {
    return carregamentoEmAndamento
  }

  carregamentoEmAndamento = (async () => {
    const textos = extrairTextos()
    const traducoes = await traduzirTextos(textos, 'pt', destino)

    const mapa = {}
    textos.forEach((texto, indice) => {
      const traduzido = traducoes[indice]

      if (traduzido && traduzido !== texto) {
        mapa[texto] = traduzido
      }
    })

    dicionarioEmCache = {
      destino,
      origem: 'pt',
      mapa,
      total: Object.keys(mapa).length,
      gerado_em: new Date().toISOString()
    }

    return dicionarioEmCache
  })()

  try {
    return await carregamentoEmAndamento
  } finally {
    carregamentoEmAndamento = null
  }
}

module.exports = {
  extrairTextos,
  traduzirTextos,
  obterDicionario
}
