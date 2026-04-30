import type { CustomSelectGridColumn } from '../inputs/CustomSelectGrid';
import type {
  OperadorDetailField,
  OperadorGridRow,
  OperadorId,
  OperadorPayload,
} from './types';

export type EntradaEletronicaRow = OperadorGridRow & {
  solicitante: string;
  documento: string;
  matricula: string;
  data_do_pedido: string;
  protocolo_do_pedido: string;
  total: string;
  status_onr: string;
  imovel: string;
};

const FALLBACK = '-';

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const formatDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return FALLBACK;
  }

  return new Intl.DateTimeFormat('pt-BR').format(date);
};

const asString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim() || FALLBACK;
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Nao';
  }

  return FALLBACK;
};

const asNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return null;
};

const getNested = (record: OperadorPayload, path: string): unknown => {
  const keys = path.split('.');
  let current: unknown = record;

  for (const key of keys) {
    const objectValue = asRecord(current);
    if (!objectValue) {
      return undefined;
    }

    current = objectValue[key];
  }

  return current;
};

const pickFirst = (record: OperadorPayload, paths: string[]): unknown => {
  for (const path of paths) {
    const value = getNested(record, path);
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return undefined;
};

const toBaseRow = (
  payloadOriginal: OperadorPayload,
  fallbackId: number,
  mappedValues: {
    id: unknown;
    solicitante: unknown;
    documento: unknown;
    matricula: unknown;
    data_do_pedido: unknown;
    protocolo_do_pedido: unknown;
    total: unknown;
    status_onr: unknown;
    imovel: unknown;
  }
): EntradaEletronicaRow => {
  const idValue = mappedValues.id;
  const id =
    typeof idValue === 'number' || typeof idValue === 'string'
      ? idValue
      : `mock-${fallbackId + 1}`;

  return {
    id,
    solicitante: asString(mappedValues.solicitante),
    documento: asString(mappedValues.documento),
    matricula: asString(mappedValues.matricula),
    data_do_pedido: asString(mappedValues.data_do_pedido),
    protocolo_do_pedido: asString(mappedValues.protocolo_do_pedido),
    total: asString(mappedValues.total),
    status_onr: asString(mappedValues.status_onr),
    imovel: asString(mappedValues.imovel),
    payloadOriginal,
  };
};

export const ADAPTERS = {
  ecartorio: (
    payload: OperadorPayload,
    fallbackId: number
  ): EntradaEletronicaRow =>
    toBaseRow(payload, fallbackId, {
      id: pickFirst(payload, ['requestId', 'id', 'protocolo']),
      solicitante: pickFirst(payload, [
        'requester.name',
        'solicitante',
        'cliente.nome',
      ]),
      documento: pickFirst(payload, [
        'requester.document',
        'documento',
        'cliente.documento',
      ]),
      matricula: pickFirst(payload, [
        'registry.matricula',
        'matricula',
        'ecertidao.nuRgi',
      ]),
      data_do_pedido: formatDate(
        asString(
          pickFirst(payload, ['requestedAt', 'data_do_pedido', 'dataPedido'])
        )
      ),
      protocolo_do_pedido: pickFirst(payload, [
        'protocol',
        'protocolo_do_pedido',
        'protocolo',
      ]),
      total: formatCurrency(
        asNumber(pickFirst(payload, ['amountTotal', 'total', 'valorTotal'])) ??
          0
      ),
      status_onr: pickFirst(payload, [
        'status.label',
        'status_onr',
        'status.nome',
      ]),
      imovel: pickFirst(payload, ['property.hasRealEstate', 'imovel']),
    }),

  onrtdpj: (
    payload: OperadorPayload,
    fallbackId: number
  ): EntradaEletronicaRow =>
    toBaseRow(payload, fallbackId, {
      id: pickFirst(payload, ['meta.codigoSolicitacao', 'id', 'protocolo']),
      solicitante: pickFirst(payload, [
        'pessoa.nomeCompleto',
        'solicitante',
        'cliente.nome',
      ]),
      documento: pickFirst(payload, [
        'pessoa.cpfCnpj',
        'documento',
        'cliente.cpfCnpj',
      ]),
      matricula: pickFirst(payload, ['registro.numero', 'matricula']),
      data_do_pedido: formatDate(
        asString(
          pickFirst(payload, ['datas.pedido', 'data_do_pedido', 'dataPedido'])
        )
      ),
      protocolo_do_pedido: pickFirst(payload, [
        'registro.protocolo',
        'protocolo_do_pedido',
        'protocolo',
      ]),
      total: pickFirst(payload, [
        'custas.totalFormatado',
        'total',
        'valorTotal',
      ]),
      status_onr: pickFirst(payload, [
        'onr.statusAtual',
        'status_onr',
        'status.nome',
      ]),
      imovel: pickFirst(payload, ['registro.imovel', 'imovel']),
    }),

  rtdbrasil: (
    payload: OperadorPayload,
    fallbackId: number
  ): EntradaEletronicaRow =>
    toBaseRow(payload, fallbackId, {
      id: pickFirst(payload, ['pedido.idInterno', 'id', 'protocolo']),
      solicitante: pickFirst(payload, ['cliente.nome', 'solicitante']),
      documento: pickFirst(payload, [
        'cliente.documentoPrincipal',
        'documento',
        'cliente.cpfCnpj',
      ]),
      matricula: pickFirst(payload, ['pedido.matriculaAlvo', 'matricula']),
      data_do_pedido: formatDate(
        asString(
          pickFirst(payload, [
            'pedido.dataCriacaoIso',
            'data_do_pedido',
            'dataPedido',
          ])
        )
      ),
      protocolo_do_pedido: pickFirst(payload, [
        'pedido.protocoloExterno',
        'protocolo_do_pedido',
        'protocolo',
      ]),
      total: formatCurrency(
        (asNumber(pickFirst(payload, ['financeiro.totalCentavos'])) ?? 0) /
          100 ||
          (asNumber(pickFirst(payload, ['valorTotal'])) ?? 0)
      ),
      status_onr: pickFirst(payload, [
        'integracao.onrStatus',
        'status_onr',
        'status.nome',
      ]),
      imovel: pickFirst(payload, ['pedido.temImovel', 'imovel']),
    }),
} satisfies Record<
  OperadorId,
  (payload: OperadorPayload, fallbackId: number) => EntradaEletronicaRow
>;

export const ENTRADAS_COLUMNS: Array<
  CustomSelectGridColumn<EntradaEletronicaRow>
> = [
  {
    key: 'id',
    header: '#',
    widthClassName: 'w-10',
  },
  {
    key: 'solicitante',
    header: 'Solicitante / Instituicao',
    align: 'center',
    widthClassName: 'w-32',
  },
  {
    key: 'documento',
    header: 'Documento',
    align: 'center',
    widthClassName: 'w-32',
  },
  {
    key: 'matricula',
    header: 'Matricula',
    align: 'center',
    widthClassName: 'w-32',
  },
  {
    key: 'data_do_pedido',
    header: 'Data do Pedido',
    align: 'center',
    widthClassName: 'w-32',
  },
  {
    key: 'protocolo_do_pedido',
    header: 'Protocolo do Pedido',
    align: 'center',
    widthClassName: 'w-32',
  },
];

export const ENTRADAS_DETAIL_FIELDS: Array<
  OperadorDetailField<EntradaEletronicaRow>
> = [
  { key: 'documento', label: 'Documento' },
  { key: 'matricula', label: 'Matricula' },
  { key: 'data_do_pedido', label: 'Data do Pedido' },
  { key: 'protocolo_do_pedido', label: 'Protocolo do Pedido' },
  { key: 'total', label: 'Total' },
  { key: 'status_onr', label: 'Status ONR' },
  { key: 'imovel', label: 'Imovel' },
];

export const OPERADOR_MOCK_PAYLOADS: Record<OperadorId, OperadorPayload[]> = {
  ecartorio: [
    {
      requestId: 101,
      requester: {
        name: 'Jose da Silva',
        document: '12345678909',
      },
      registry: {
        matricula: '123456',
      },
      requestedAt: '2024-06-01',
      protocol: 'ECA-2024-0001',
      amountTotal: 100.5,
      status: {
        label: 'Em andamento',
      },
      property: {
        hasRealEstate: true,
      },
    },
    {
      requestId: 102,
      requester: {
        name: 'Maria Oliveira',
        document: '10987654321',
      },
      registry: {
        matricula: '654321',
      },
      requestedAt: '2024-06-05',
      protocol: 'ECA-2024-0002',
      amountTotal: 320,
      status: {
        label: 'Concluido',
      },
      property: {
        hasRealEstate: false,
      },
    },
  ],
  onrtdpj: [
    {
      meta: {
        codigoSolicitacao: 'ONR-9001',
      },
      pessoa: {
        nomeCompleto: 'Cartorio Centro',
        cpfCnpj: '12345678000199',
      },
      registro: {
        numero: 'AB-123',
        protocolo: 'ONR-PROT-77',
        imovel: 'S',
      },
      datas: {
        pedido: '2024-06-02',
      },
      custas: {
        totalFormatado: 'R$ 250,00',
      },
      onr: {
        statusAtual: 'Aguardando lote',
      },
    },
  ],
  rtdbrasil: [
    {
      pedido: {
        idInterno: 7001,
        matriculaAlvo: 'ZX-99',
        dataCriacaoIso: '2024-06-03',
        protocoloExterno: 'RTD-BR-441',
        temImovel: true,
      },
      cliente: {
        nome: 'Empresa XPTO',
        documentoPrincipal: '22333444000155',
      },
      financeiro: {
        totalCentavos: 45990,
      },
      integracao: {
        onrStatus: 'Sincronizado',
      },
    },
  ],
};

export const loadOperadorMockPayload = async (
  operadorId: OperadorId
): Promise<OperadorPayload[]> => {
  const payload = OPERADOR_MOCK_PAYLOADS[operadorId] ?? [];

  // Retorna uma copia rasa para evitar mutacoes acidentais do cache base.
  return payload.map((item) => ({ ...item }));
};
