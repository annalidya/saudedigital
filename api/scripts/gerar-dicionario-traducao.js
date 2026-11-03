const fs = require('fs')
const path = require('path')

const { extrairTextos, traduzirTextos } = require('../src/servicos/traducao')

async function gerar() {
  const textos = extrairTextos()

  console.log(`Extraídos ${textos.length} textos de interface.`)
  console.log('Traduzindo para espanhol com a lib tradutor/node-google-translate...')

  const traducoes = await traduzirTextos(textos, 'pt', 'es')

  const mapa = {}

  textos.forEach((texto, indice) => {
    const traduzido = traducoes[indice]

    if (traduzido && traduzido !== texto) {
      mapa[texto] = traduzido
    }
  })

  const destino = path.resolve(__dirname, '../../frontend/js/i18n-dicionario.js')

  const conteudo = [
    '// Arquivo gerado automaticamente por api/scripts/gerar-dicionario-traducao.js',
    '// Traduções produzidas pela lib tradutor/node-google-translate (pt -> es).',
    `window.I18N_DICIONARIO_ES = ${JSON.stringify(mapa, null, 2)}`,
    ''
  ].join('\n')

  fs.writeFileSync(destino, conteudo, 'utf8')

  console.log(`Dicionário salvo com ${Object.keys(mapa).length} traduções em ${destino}`)
}

gerar().catch((erro) => {
  console.error('Falha ao gerar o dicionário:', erro)
  process.exit(1)
})
