---
name: frontend-rtd-distintivo
description: 'Cria interfaces frontend memoraveis e prontas para producao no Central RTD. Use para pagina, componente ou fluxo novo com direcao estetica forte, sem visual generico, respeitando tokens/utilitarios do projeto e suporte claro/escuro. Inclui casos de ring elegante em inputs, inputs sem sombra, modo escuro sem borda e paridade de profundidade entre claro/escuro.'
argument-hint: 'Descreva objetivo, publico, escopo (componente/pagina/app), restricoes tecnicas e nivel de ousadia visual.'
user-invocable: true
disable-model-invocation: false
---

# Frontend RTD Distintivo

Skill para construir interfaces frontend com assinatura visual clara e execucao tecnica consistente com o projeto Central RTD.

## Quando usar
- Qualquer tarefa frontend no projeto (componente, pagina, fluxo, ajuste visual pontual).
- Criacao de nova tela, pagina, secao, dashboard, card ou componente de UI.
- Refactor visual para sair de layout generico e elevar qualidade estetica.
- Implementacao de experiencia com identidade forte sem quebrar padroes do projeto.
- Tarefas de front-end que exigem equilibrio entre criatividade e consistencia de tema.

## Nao usar quando
- A tarefa for puramente backend sem impacto de interface.
- A regra principal for aderir 100% a design system externo diferente do RTD.

## Entradas esperadas
- Objetivo da interface: o que resolve, para quem, prioridade de negocio.
- Escopo: componente isolado, pagina completa, fluxo multi-etapas ou app.
- Restricoes: framework, performance, acessibilidade, responsividade, prazo.
- Nivel de ousadia: minimalista refinado, editorial, brutalista, playful etc.

## Defaults da skill
- Se o prompt nao definir direcao visual: usar "maximalista expressivo" como padrao.
- Se faltar token em `@theme`: nao criar automaticamente; pedir confirmacao do usuario.
- Fontes externas podem ser sugeridas para elevar direcao tipografica, mas nao devem ser aplicadas automaticamente.

## Fonte de verdade do projeto
- Estilo global: `src/app/globals.css`
- Regras locais: `.github/copilot-instructions.md`
- Pipeline: `postcss.config.js` (Tailwind v4)

## Processo recomendado

### 1. Entender contexto e meta
1. Definir quem usa e qual tarefa principal sera executada.
2. Definir criterio de sucesso: compreensao rapida, conversao, velocidade, clareza.
3. Capturar restricoes inegociaveis (acessibilidade, dados, responsividade, performance).

### 2. Escolher direcao estetica intencional
1. Escolher uma direcao visual clara e extrema o suficiente para ser memoravel.
2. Registrar o elemento assinatura da tela (ex: tipografia, composicao, motion hero).
3. Evitar convergir para padrao generico sem identidade.

### 3. Alinhar com o sistema RTD antes de codar
1. Reutilizar tokens existentes em `@theme` antes de criar cor/variavel nova.
2. Reutilizar utilitarios globais ja definidos quando o contexto combinar.
3. Planejar claro/escuro desde o inicio; nao tratar dark mode como remendo.
4. Manter contraste legivel para texto e icones em todos os estados.
5. Em componentes de formulario, usar ring como feedback principal de input por padrao; sombra em input somente quando pedido explicitamente.
6. Se criar sombras dedicadas para claro/escuro, manter mesma geometria base e ajustar apenas opacidade/contraste para paridade perceptiva.

### 4. Implementar com codigo de producao
1. Escrever codigo funcional e pronto para uso real.
2. Aplicar composicao espacial intencional: assimetria, ritmo, hierarquia visual.
3. Usar motion com foco em momentos de alto impacto (entrada da pagina, hover, transicao de estado).
4. Priorizar animacoes CSS quando suficiente; usar biblioteca de motion no React quando necessario.
5. Evitar boilerplate visual repetido entre telas.

### 5. Revisar, validar e concluir
1. Verificar aderencia ao tema e utilitarios RTD.
2. Verificar estados hover/focus/active/disabled e leitura em mobile + desktop.
3. Confirmar que nao houve regressao de contraste.
4. Confirmar que icones/SVG seguem `currentColor` quando devem seguir tema.
5. Entregar com resumo de decisoes visuais e trade-offs.

## Logica de decisao (branching)

### Direcao visual
- Se o contexto pedir alto impacto: aumentar contraste, composicao e momentos de motion.
- Se o contexto pedir sobriedade: reduzir ruido, manter assinatura forte em poucos elementos.

### Tokens e cores
- Se existir token equivalente em `@theme`: usar token existente.
- Se nao existir token e for realmente necessario: pedir confirmacao antes de propor adicao minima.

### Header e sidebar
- Se o header deve seguir fundo da pagina: usar `app-header`.
- Se o header deve usar chrome azul: usar `header`.
- Se houver botoes/acoes no header: usar `header-button`/`header-button-active`.
- Se for navegacao lateral: usar `sidebar` e utilitarios de menu correspondentes.

### Icones e SVG
- Se o icone precisa acompanhar tema/estado: usar `fill="currentColor"` e/ou `stroke="currentColor"`.
- Se houver hex fixo em SVG para algo tematico: substituir por controle via classe/utilitario.

### Tailwind
- Em novo codigo: preferir padrao Tailwind v4 adotado no projeto.
- Em trecho legado v3 existente: manter compatibilidade sem refactor amplo desnecessario.

### Complexidade da implementacao
- Se visual maximalista: permitir estrutura mais rica (camadas, efeitos, motion coordenado).
- Se visual minimalista/refinado: focar precisao de espacamento, tipografia e micro-contraste.

### Formularios e inputs
- Se for input/campo de formulario sem instrucao contraria: usar ring elegante como feedback principal (default/focus/erro/sucesso) e evitar sombra no proprio input.
- Se o contexto for modo escuro e a separacao estiver clara por sombra: evitar borda em superficies e inputs.
- Se o usuario pedir explicitamente sombra em input: aplicar de forma discreta e manter consistencia entre claro/escuro.

## Guardrails anti "AI slop"
- Nao usar stacks de fonte genericas previsiveis como escolha principal.
- Nao usar combinacao cliche de gradiente roxo em fundo branco.
- Nao repetir layout de cards padrao sem assinatura do contexto.
- Nao distribuir cores com timidez uniforme; definir dominancia e acentos.
- Nao adicionar efeito por efeito; cada detalhe visual precisa ter funcao narrativa.
- Se sugerir fonte externa, apresentar como opcao e aguardar aprovacao antes de aplicar no codigo.

## Checklist de conclusao
- A interface tem direcao estetica clara e memoravel?
- O visual esta coeso do inicio ao fim?
- Foram reutilizados tokens e utilitarios existentes antes de criar novos?
- Claro/escuro funcionam com contraste adequado?
- Header/sidebar seguiram utilitarios corretos quando aplicavel?
- SVG/Icones seguem `currentColor` quando precisam reagir ao tema?
- O resultado final evita padrao generico e parece intencional?
- Em formularios, o input usa ring como feedback principal por padrao (quando nao houver pedido contrario)?
- Se houve criacao de sombras para claro/escuro, a espessura perceptiva entre os modos ficou equivalente?

## Formato de resposta esperado da skill
Ao concluir uma tarefa usando esta skill, sempre retornar:
1. Direcao estetica escolhida e porque ela atende ao contexto.
2. Principais decisoes tecnicas (tokens, utilitarios, responsividade, motion).
3. Riscos/limitacoes e como foram mitigados.
4. Checklist final de validacao (pass/fail por item).

## Prompt base sugerido
"Crie [componente/pagina/fluxo] para [publico/objetivo], com direcao [estetica], mantendo aderencia total aos tokens e utilitarios do Central RTD, com suporte claro/escuro e interacoes refinadas sem visual generico."