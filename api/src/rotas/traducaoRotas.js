const { Router } = require('express')
const { obterDicionario } = require('../servicos/traducao')

const rotas = Router()

rotas.get('/traducao/dicionario', async (req, res) => {
  const destino = String(req.query.destino || 'es').toLowerCase()

  if (!['es', 'en'].includes(destino)) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Idioma de destino não suportado.'
    })
  }

  try {
    const dicionario = await obterDicionario(destino)

    res.json({
      sucesso: true,
      dados: dicionario
    })
  } catch (erro) {
    console.error('Erro ao gerar dicionário de tradução:', erro)

    res.status(502).json({
      sucesso: false,
      mensagem: 'Não foi possível gerar o dicionário de tradução.'
    })
  }
})

module.exports = rotas
