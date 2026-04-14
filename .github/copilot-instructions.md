# Instrucoes de Estilo e Engenharia para IA - Central RTD

## Objetivo
Garantir que toda alteracao visual siga os estilos existentes do projeto, reutilizando os tokens e utilitarios definidos em src/app/globals.css, e que o codigo gerado seja performatico, limpo, moderno e facil de ler/manter.

## Fonte de verdade
- Tema, cores, tipografia, breakpoints e utilitarios customizados: src/app/globals.css
- Pipeline Tailwind: postcss.config.js
- Versao em uso: Tailwind CSS v4 (nao criar padrao novo de v3 que conflite com v4)

## Regras obrigatorias
- Reutilizar classes utilitarias existentes antes de criar classes novas.
- Reutilizar tokens CSS ja definidos em @theme antes de usar cor fixa.
- Manter suporte completo a modo claro e modo escuro.
- Evitar regressao de contraste em textos e icones.
- Priorizar solucoes simples, previsiveis e de facil manutencao.
- Evitar complexidade acidental e over-engineering.

## Tema de cor
- Primaria da marca: --central-azul (#004A96)
- Secundaria da marca: --central-amarelo / --cor-button-hover (#F9A526)
- Fundo da pagina: --background (claro) e --dark-background (escuro)
- Texto base: --cor-texto (claro) e --dark-cor-texto (escuro)

## Utilitarios globais preferenciais
Sempre priorizar estes utilitarios quando o contexto combinar:
- Layout base: module
- Sidebar: sidebar
- Menu sidebar: menu-item, menu-item-active, menu-item-inactive
- Submenu sidebar: menu-dropdown-item, menu-dropdown-item-active, menu-dropdown-item-inactive
- Header com fundo de pagina: app-header
- Header com fundo azul (chrome): header
- Controles do header: header-button, header-button-active
- Dropdowns de header: filter-dropdown, filter-dropdown-button, filter-dropdown-text, notification-card, notification-card-text
- Navegacao local: navigatorButton, navigatorButtonActive, navigatorButtonInactive

## Regras para header e sidebar
- AppHeader deve usar app-header quando a intencao for manter o fundo igual ao da pagina.
- Botoes e icones interativos do header devem usar header-button para herdar estado hover/active do tema.
- Sidebar deve usar sidebar e os utilitarios de menu para manter consistencia entre estados ativo/inativo.

## Regras para bordas e profundidade
- Em modais, dropdowns, cards e paines, usar sombreamento como padrao de separacao visual (evitar borda por padrao).
- Usar sombras do projeto para hierarquia sutil e elegante (shadow-theme-xs, shadow-theme-sm ou shadow-theme-md, conforme contexto).
- Usar borda apenas quando houver necessidade clara de separacao estrutural; quando usada, aplicar tokens do tema (--cor-borda / --dark-cor-borda).
- Manter a profundidade discreta: evitar sombras pesadas, blur excessivo ou contraste agressivo.
- Em estados hover/active, aumentar profundidade de forma gradual (ex.: de shadow-theme-xs para shadow-theme-sm), sem quebrar consistencia entre claro e escuro.
- Sempre priorizar utilitarios globais existentes; se faltar cobertura, criar utilitario novo reutilizavel no globals.css em vez de classes ad-hoc no componente.
- Em inputs e controles de formulario, priorizar ring como feedback principal (default/focus/erro/sucesso) e evitar sombra, salvo quando o usuario pedir explicitamente o contrario.
- Em modo escuro, evitar borda para separar superficies quando houver sombra suficiente (principalmente em cards, paineis e inputs).
- Ao criar tokens de sombra para claro e escuro, manter paridade perceptiva entre os modos (mesma geometria base e ajuste apenas de opacidade/contraste).

## Regra de SVG e icones
- SVG deve suportar mudanca de cor via CSS.
- Usar fill="currentColor" e/ou stroke="currentColor".
- Nao usar hex fixo dentro do SVG para elementos que precisam acompanhar tema.
- A cor do icone deve ser controlada por classe no componente pai (text-... ou utilitario global).

## Tailwind v4 no projeto (com compatibilidade v3)
- O projeto usa Tailwind v4 com abordagem CSS-first em globals.css.
- Em @apply dentro de globals.css, preferir padroes do v4 ja adotados no arquivo.
- Em componentes TSX, manter o padrao local do arquivo e evitar refatoracao ampla sem necessidade.
- Compatibilidade v3: aceitar classes legadas somente quando ja existirem no trecho editado; em codigo novo, preferir o padrao atual do projeto.

## Performance e otimizacao
- Priorizar estruturas de dados e fluxos simples com boa complexidade (evitar custo quadratico sem necessidade).
- Evitar re-renders desnecessarios em React; revisar props, estado local e levantamento de estado.
- Usar useMemo/useCallback apenas quando houver ganho real (calculo custoso ou referencia estavel para componente memoizado).
- Em useEffect, declarar dependencias corretamente e limpar efeitos quando necessario.
- Em listas, usar key estavel (id); nao usar index quando a lista puder mudar de ordem.
- Carregar partes pesadas sob demanda (dynamic import/lazy loading) quando fizer sentido.
- Evitar imports amplos de bibliotecas; preferir imports especificos.

## Clean code e manutenibilidade
- Usar nomes descritivos e orientados a intencao (funcoes com verbo, variaveis claras).
- Manter funcoes/componentes coesos, com responsabilidade unica e baixo acoplamento.
- Extrair logica repetida para helper, utilitario ou hook reutilizavel.
- Evitar magic numbers e magic strings; mover para constantes nomeadas.
- Preferir early return para reduzir aninhamento e facilitar leitura.
- Manter mudancas pequenas e focadas no requisito, sem refatoracao ampla desnecessaria.

## Praticas modernas (TypeScript, React e Next.js)
- Tipar props, retornos e contratos publicos de funcoes.
- Evitar any; quando necessario, usar unknown com narrowing explicito.
- Usar unioes discriminadas e type guards em estados complexos.
- Em React/Next.js, preferir composicao de componentes em vez de componentes monoliticos.
- Em App Router, manter separacao clara entre responsabilidades de server e client components.
- Evitar criar API paralela de estilos/comportamentos quando ja existe padrao no projeto.

## Async, erros e robustez
- Tratar erros de chamadas assicronas com try/catch e retornos consistentes.
- Nunca deixar Promise sem tratamento de erro.
- Representar estados de carregamento, sucesso e erro de forma explicita na UI.
- Em efeitos assicronos, prevenir condicoes de corrida e vazamento de estado com cleanup.
- Validar dados externos antes de uso e falhar de forma segura quando o contrato vier invalido.

## Legibilidade e compreensao humana
- Organizar arquivos de forma previsivel: imports, tipos, constantes, componente, helpers e export.
- Priorizar blocos curtos, pouco aninhamento e fluxo linear.
- Preferir codigo autoexplicativo; usar comentarios apenas para contexto nao obvio.
- Escrever comentarios curtos e objetivos, descrevendo intencao e trade-off quando necessario.
- Preservar consistencia de estilo no arquivo editado para facilitar revisao de PR.

## Evitar
- Nao introduzir nova paleta paralela sem token em @theme.
- Nao usar variaveis CSS inexistentes.
- Nao trocar utilitarios globais por classes ad-hoc sem necessidade funcional.
- Nao fixar cor de icone em vermelho/azul/amarelo via hex direto quando houver token equivalente.
- Nao introduzir abstracoes genericas sem necessidade comprovada.
- Nao otimizar prematuramente sem indicio real de gargalo.

## Checklist antes de finalizar
- Mudanca visual usa tokens existentes?
- Claro e escuro continuam consistentes?
- Header/sidebar ficaram com classes utilitarias corretas?
- Sombreamento foi usado como padrao e borda apenas quando realmente necessaria?
- Em formularios, o feedback visual principal de input esta em ring (e nao em sombra), salvo pedido explicito?
- SVG segue currentColor?
- Nao foram criadas variaveis novas sem necessidade?
- O codigo evita re-render desnecessario e custo excessivo?
- Existe repeticao que deveria ser extraida para helper/hook?
- Tipos estao claros (sem any desnecessario) e contratos estao explicitos?
- Fluxos async tratam erro, loading e cleanup corretamente?
- A leitura esta simples para humanos (nomes bons, baixo aninhamento, intencao clara)?
- Lint, typecheck e testes relevantes foram considerados antes de concluir?