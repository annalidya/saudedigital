# PLANO DE EXECUÇÃO & PROMPT PARA OPENCODE: ÁREA ADMINISTRATIVA E DASHBOARD SAFEMED (2026)

Este documento contém o planejamento arquitetural e o prompt pronto para envio ao **Opencode**, visando a recriação da Área Administrativa (`#/admin`) do projeto **SAFEMED** (Prontuário Digital de Saúde). 

O foco central é o monitoramento detalhado do volume de acessos e das páginas mais visitadas, estruturado com tendências de **UI/UX de Novembro de 2026**, acessibilidade universal e responsividade total em dispositivos móveis (iPhones e Samsung Galaxy), tablets, notebooks e desktops.

---

## 🚀 PROMPT PARA ENVIAR AO OPENCODE

> **Instruções de uso:** Copie e cole todo o bloco de código Markdown abaixo na interface do seu **Opencode**.

```markdown
# PROMPT DE DESENVOLVIMENTO: ÁREA ADMINISTRATIVA & DASHBOARD DE ACESSOS SAFEMED (NOVEMBRO 2026)

Atue como um Arquiteto de Software Sênior, Especialista em UI/UX Design de Alta Performance e Desenvolvedor Full Stack especializado em Node.js, SQLite, Tailwind CSS e Vanilla JavaScript (SPA).

Sua tarefa é recriar e transformar a **Área Administrativa (`#/admin`)** do sistema **SAFEMED** em um dashboard analítico moderno de alta precisão para controle total de acessos e engajamento do sistema.

---

### 1. OBJETIVOS PRINCIPAIS DA INTERFACE

1. **Monitoramento do Volume de Acessos:**
   - Exibir quantidade total de acessos (geral, hoje, últimos 7 dias, últimos 30 dias).
   - Medir a taxa de sucesso vs. falhas de autenticação com base na tabela `registros_login`.

2. **Métricas das Páginas Mais Acessadas (Heatmap/Ranking de Rotas):**
   - Ranking interativo mostrando quais módulos (`#/dashboard`, `#/prontuario`, `#/medicamentos`, `#/sintomas`, `#/agenda`, `#/relatorios`, `#/admin`) possuem a maior retenção e volume de navegação.

3. **Linguagem Visual e Design System (Tendências Novembro 2026):**
   - **Glassmorphism Avançado:** Fundos translúcidos com efeito `backdrop-blur-2xl` e bordas finas dinâmicas em degradê metálico/luminoso (`border-slate-700/50`).
   - **Paleta Health-Tech Profunda:** Dominância de fundos em `slate-950` e `slate-900`, com destaques em Esmeralda Fluorescente (`emerald-400`/`emerald-500`) e Safira Digital (`cyan-400`).
   - **Feedback Dinâmico:** Animações fluidas de carregamento (*skeleton loaders*), micro-interações ao passar o mouse (*hover micro-scaling*) e indicadores em tempo real com efeitos *pulse*.

4. **Técnicas de UVUX (User Value & User Experience) & Acessibilidade:**
   - Design pensado nas personas do SAFEMED (como o *Sr. Alfredo*, 72 anos, e *Dra. Arnaldo*, 55 anos).
   - Áreas de toque confortáveis (mínimo de 48x48px para dispositivos sensíveis ao toque).
   - Suporte a modo de alto contraste e redimensionamento proporcional de fontes.
   - Jerarquia clara de cards de KPI com tipografia de rápido escaneamento (*Scannability-First*).

5. **Responsividade Universal Mobile-First:**
   - **Smartphones (iPhone 15/16/17 Pro, Samsung Galaxy S24/S25 Ultra, Z Fold/Flip):** Interface fluida em coluna única com navegabilidade adaptada por gesto e abas responsivas.
   - **Tablets (iPad Pro/Air, Galaxy Tab):** Grid adaptável em 2 colunas com suporte a orientação Retrato e Paisagem.
   - **Desktops e Notebooks:** Dashboard executivo completo em grid de 3 a 4 colunas com menu lateral responsivo.

---

### 2. ARQUITETURA DE BACKEND (API & BANCO DE DADOS)

Sua resposta deve incluir a criação ou atualização dos seguintes endpoints no backend (`api/src/controladores/adminControlador.js` e `api/src/rotas/adminRotas.js`):

1. **Atualização da Tabela / Rastreio de Navegação:**
   - Garanta a funcionalidade de registrar a navegação no SPA ou consolidar as requisições atreladas às rotas principais.

2. **`GET /api/admin/estatisticas-acessos`**
   - **Payload de resposta necessário:**
     ```json
     {
       "total_acessos": 1250,
       "acessos_hoje": 84,
       "acessos_semana": 412,
       "taxa_sucesso_login": 96.5,
       "paginas_mais_acessadas": [
         { "rota": "#/prontuario", "nome": "Prontuário Digital", "visitas": 450, "percentual": 36 },
         { "rota": "#/dashboard", "nome": "Dashboard Principal", "visitas": 310, "percentual": 24.8 },
         { "rota": "#/medicamentos", "nome": "Medicamentos", "visitas": 210, "percentual": 16.8 },
         { "rota": "#/sintomas", "nome": "Diário de Sintomas", "visitas": 150, "percentual": 12 },
         { "rota": "#/agenda", "nome": "Agenda e Lembretes", "visitas": 130, "percentual": 10.4 }
       ],
       "historico_acessos_dias": [
         { "data": "2026-10-28", "quantidade": 62 },
         { "data": "2026-10-29", "quantidade": 78 },
         { "data": "2026-10-30", "quantidade": 95 },
         { "data": "2026-10-31", "quantidade": 88 },
         { "data": "2026-11-01", "quantidade": 110 },
         { "data": "2026-11-02", "quantidade": 105 },
         { "data": "2026-11-03", "quantidade": 84 }
       ]
     }
     ```

---

### 3. COMPONENTES DO FRONTEND (`frontend/js/modulos/admin.js`)

Implemente a tela administrativa renderizando dynamicamente os seguintes blocos:

- **Cabeçalho de Controle:** Status do servidor em tempo real, seletor de período (Hoje, 7 dias, 30 dias) e botão de atualizar dados instantâneo.
- **Grid de KPIs (Cards Principais):**
  - Card 1: *Acessos Totais* (com marcador de crescimento vs. período anterior).
  - Card 2: *Usuários Ativos / Registrados* (proporção de contas ativas).
  - Card 3: *Índice de Sucesso de Logins* (% e gráfico circular de rosca em SVG).
  - Card 4: *Módulo Mais Popular* (exibindo o ícone e nome da rota líder).
- **Painel Central de Métricas:**
  - **Gráfico de Barras / Áreas Interativo:** Volume diário de acessos dos últimos dias (feito em HTML/SVG puro ou estilizado com Tailwind).
  - **Lista de Páginas Mais Acessadas:** Barras de progresso visual mostrando a distribuição de tráfego por módulo.
- **Tabela de Auditoria de Logins Recentes:**
  - Exibição limpa de e-mail, IP, status (Badge verde/vermelho), navegador/dispositivo e data/hora formatada.

---

### 4. REQUISITOS DE ENTREGÁVEIS DO OPENCODE

Forneça a implementação completa e revisada para os seguintes arquivos do projeto SAFEMED:

1. **`api/src/controladores/adminControlador.js`**: Lógica das consultas SQL com `better-sqlite3` para agregar acessos e estatísticas de uso.
2. **`frontend/js/modulos/admin.js`**: Módulo JavaScript Vanilla reativo para renderizar a nova área administrativa e os gráficos interativos.
3. **`frontend/css/estilo.css`**: Estilos CSS adicionais para Tailwind (efeitos de Glassmorphism, animações `@keyframes` de entrada e ajustes responsivos para dispositivos mobile).
4. **Instruções passo a passo** de como atualizar o banco de dados e rodar a nova versão do painel.
```

---

## 📋 RECOMENDAÇÕES DE TESTE APÓS GERAR COM O OPENCODE

1. **Testes de Responsividade Dispositivo a Dispositivo:**
   - **iOS:** Teste no Safari com alturas dinâmicas de viewport (`100dvh`).
   - **Android / Samsung Chrome:** Verifique a renderização das fontes ampladas no modo acessibilidade.
2. **Validação de Performance:**
   - Certifique-se de que as consultas de agrupamento no `better-sqlite3` utilizem os índices já existentes em `registros_login` (`idx_registros_login_data` e `idx_registros_login_usuario`).