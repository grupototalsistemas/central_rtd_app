# Operadores Eletronicos: guia de fluxo e manutencao

## Objetivo
Manter 3 componentes separados por regra de negocio (Ecartorio, Onrtdpj e Rtdbrasil), com baixo acoplamento entre JSON bruto e interface.

Cada operador:
- recebe payload bruto,
- normaliza para um formato comum,
- delega renderizacao para uma base compartilhada.

## Arquitetura atual
Arquivos principais:
- src/app/(private)/entradas/eletronica/page.tsx
- src/components/operadores/ecartorio.tsx
- src/components/operadores/onrtdpj.tsx
- src/components/operadores/rtdbrasil.tsx
- src/components/operadores/OperadorEntradasBase.tsx
- src/components/operadores/operadoresConfig.ts
- src/components/operadores/types.ts

Papeis:
- page.tsx: escolhe operador ativo, carrega dados apenas do operador selecionado e injeta payload no componente ativo.
- ecartorio.tsx/onrtdpj.tsx/rtdbrasil.tsx: wrappers finos para regra por operador + adapter especifico.
- OperadorEntradasBase.tsx: UI compartilhada (grid, selecao, modal de detalhes, acao de importar).
- operadoresConfig.ts: adapters, colunas, campos de detalhe, mocks e loader mock.
- types.ts: contratos de tipagem compartilhados.

## Fluxo de dados
1. Usuario seleciona um operador no botao da tela.
2. page.tsx identifica o operador ativo.
3. page.tsx busca dados somente do operador ativo com loadOperadorMockPayload.
4. Resultado e salvo em cache local por operador (evita novo fetch ao voltar para operador ja carregado).
5. Wrapper do operador recebe payload bruto e aplica o adapter correspondente.
6. Wrapper envia rows normalizadas para OperadorEntradasBase.
7. OperadorEntradasBase renderiza grid, permite selecao e abre modal de detalhes.

## Contrato comum de UI
Definido em types.ts:
- OperadorPayload: JSON bruto recebido.
- OperadorGridRow: linha normalizada para UI (inclui id e payloadOriginal).
- OperadorEntradasBaseProps: contrato da base compartilhada.

Regra importante:
- a base compartilhada nao conhece chaves do JSON bruto.
- toda traducao de campos deve acontecer no adapter.

## Utilidades disponiveis no adapter
Em operadoresConfig.ts existem helpers para normalizacao:
- getNested: leitura de caminhos aninhados (ex.: pedido.idInterno).
- pickFirst: tenta multiplos caminhos e usa o primeiro valor valido.
- asString: normaliza para texto com fallback.
- asNumber: normaliza para numero quando possivel.
- formatDate: padroniza data para exibicao pt-BR.
- formatCurrency: padroniza moeda BRL.

## Pontos de atencao
1. O adapter decide o que aparece na UI.
Se o JSON mudar e o adapter nao for atualizado, campos vao aparecer com fallback "-".

2. Colunas e detalhes precisam refletir o row normalizado.
Sempre alinhar ENTRADAS_COLUMNS e ENTRADAS_DETAIL_FIELDS com as chaves produzidas pelo adapter.

3. Evitar logica de negocio dentro da base compartilhada.
A base deve permanecer agnostica de operador.

4. Preservar payloadOriginal.
Mantem rastreabilidade para acoes futuras (importar, auditoria, debug).

5. IDs estaveis.
Sempre preferir id vindo do payload.
Fallback existe, mas id real do sistema e mais confiavel para selecao e reconciliacao.

6. Carregamento sob demanda.
O fetch (mock ou API) deve continuar ocorrendo somente para operador ativo.

## Como fazer mudancas com seguranca

### Ajustar mapeamento de campos de um operador
1. Edite ADAPTERS.<operador> em operadoresConfig.ts.
2. Se necessario, ajuste ENTRADAS_COLUMNS.
3. Se necessario, ajuste ENTRADAS_DETAIL_FIELDS.
4. Valide selecao + modal na tela.

### Adicionar novos valores/campos no payload
1. Inclua os caminhos no pickFirst do adapter.
2. Se o campo for exibido na grid, inclua em ENTRADAS_COLUMNS.
3. Se o campo for exibido no modal, inclua em ENTRADAS_DETAIL_FIELDS.
4. Garanta fallback seguro para campos opcionais.

### Adicionar uma nova entrada mock para operador existente
1. Adicione item em OPERADOR_MOCK_PAYLOADS.<operador>.
2. Confirme que o adapter desse operador cobre o novo shape.
3. Valide visualmente grid e modal.

### Adicionar novo operador
1. Incluir novo id em OperadorId (types.ts).
2. Criar wrapper do operador em src/components/operadores/<novo>.tsx.
3. Incluir adapter do novo operador em ADAPTERS.
4. Incluir mock em OPERADOR_MOCK_PAYLOADS.
5. Registrar no mapa OPERADORES em page.tsx (label + component).
6. Validar comportamento do botao e carregamento sob demanda.

### Trocar mock por API
1. Substituir implementacao de loadOperadorMockPayload por chamada HTTP.
2. Manter assinatura da funcao para evitar mudancas no restante da tela.
3. Reutilizar os mesmos adapters para normalizacao.
4. Adicionar tratamento de erro/loading no page.tsx se necessario.

## Checklist rapido antes de concluir alteracao
- Adapter atualizado para o shape novo.
- Colunas e detalhes alinhados ao row normalizado.
- Nenhuma regra especifica foi movida para a base.
- Fluxo de operador ativo continua carregando sob demanda.
- Selecao e modal funcionando.
- Lint dos arquivos alterados executado.

## Erros comuns
- Alterar somente mock e esquecer adapter.
- Exibir campo novo no modal sem incluir no detailFields.
- Adicionar operador no botao sem registrar adapter/payload.
- Acoplar JSON bruto diretamente na base compartilhada.

## Convencao recomendada para evolucao
Preferir mudancas pequenas:
1. Primeiro atualizar adapter.
2. Depois atualizar exibicao (colunas/detalhes).
3. Por fim atualizar mock/API.

Esse fluxo reduz regressao e facilita revisao de PR.
