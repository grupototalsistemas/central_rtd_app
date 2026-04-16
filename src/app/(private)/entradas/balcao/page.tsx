'use client';

import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import CardContainer from '@/components/card/CardContainer';
import CustomInput from '@/components/inputs/CustomInput';
import PageTitle from '@/components/page/PageTitle';
import { formatCpfCnpj, validarCpfCnpj } from '@/utils/formatCpfCnpj';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomTextbox from '@/components/inputs/CustomTextbox';
import CustomSelect from '@/components/inputs/CustomSelect';
import CustomDateInput from '@/components/inputs/CustomDateInput';
import CustomSelectData from '@/components/inputs/CustomSelectData';
import CustomButton from '@/components/buttons/CustomButton';
import CustomSelectGrid, {
  SelectGridValue,
} from '@/components/inputs/CustomSelectGrid';
import useModalManager from '@/hooks/useModalManager';
import { CloseLineIcon } from '@/icons';
import { CurrencyDollarIcon } from '@heroicons/react/16/solid';
import { currencyMask, getNumericValue } from '@/utils/masks/monetaryMask';

const onlyDigits = (value: string): string => value.replace(/\D/g, '');

// Mantém a digitação amigável: remove caracteres inválidos e formata nome para exibição.
const normalizeNameForDisplay = (value: string): string => {
  const withoutPunctuation = value.replace(/[.,]/g, '');
  const onlyLettersAndSpaces = withoutPunctuation.replace(/[^\p{L}\s]/gu, '');
  const normalizedSpacing = onlyLettersAndSpaces.replace(/\s+/g, ' ');
  const withoutLeadingSpaces = normalizedSpacing.replace(/^\s+/, '');
  const hasTrailingSpace = /\s$/.test(withoutLeadingSpaces);
  const normalizedCore = withoutLeadingSpaces.trim();

  if (!normalizedCore) {
    return '';
  }

  const formattedCore = normalizedCore
    .split(' ')
    .map(
      (word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
    )
    .join(' ');

  return hasTrailingSpace ? `${formattedCore} ` : formattedCore;
};

// Normalização do nome para envio
const normalizeNameForSubmit = (value: string): string => {
  // No submit/blur, garante que não fique espaço no começo/final.
  return normalizeNameForDisplay(value).trim();
};

// Exibição mascarada do telefone mantendo apenas números no estado do formulário.
const formatPhoneWithDdd = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatHourWithColon = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return digits;

  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
};

const normalizeSearchText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const formatCurrencyValue = (value: number): string =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

type CustasTabelaRow = Record<string, unknown> & {
  id: number;
  tabela: string;
  item: string;
  subitem: string;
  descricao: string;
  valor: string;
};

type CustasItensAtoRow = Record<string, unknown> & {
  id: number;
  tabela: string;
  item: string;
  subitem: string;
  descricao: string;
  valor: string;
  qtd: number;
  total: string;
};

type SelectOptionValue = string | number;

type ServicoSelecionado = {
  value: SelectOptionValue;
  label: string;
  description: string;
};

type AtoItemCobrado = {
  id: number;
  tabela: string;
  item: string;
  subitem: string;
  descricao: string;
  valorUnitarioCentavos: number;
  qtd: number;
};

type CustasFieldKey =
  | 'emolumentos'
  | 'fetj'
  | 'fundperj'
  | 'funperj'
  | 'funarpen'
  | 'pmcmv'
  | 'funpgalerj'
  | 'funpgt'
  | 'fundacpguerj'
  | 'iss'
  | 'distribuicao'
  | 'selo';

type CustasValues = Record<CustasFieldKey, string>;

type CustasAliquotaFieldKey = Exclude<
  CustasFieldKey,
  'emolumentos' | 'distribuicao' | 'selo'
>;

type AtoCustas = {
  itensCobrados: AtoItemCobrado[];
  composicao: CustasValues;
  totalCentavos: number;
};

type AtoSalvo = {
  id: number;
  tipoEntrada: SelectOptionValue;
  natureza: SelectOptionValue;
  tipoCobranca: SelectOptionValue;
  informacoesAto: {
    valorDocumento: string;
    valorDocumentoNumerico: number;
    protocolo: string;
    dataEntrada: string;
    servicos: ServicoSelecionado[];
    quantidade: number;
    nomes: number;
    paginas: number;
    vias: number;
    diligencias: number;
  };
  custas: AtoCustas;
};

type ReciboRow = Record<string, unknown> & {
  id: number;
  protocolo: string;
  descricao: string;
  emolumentos: string;
  fundos: string;
  iss: string;
  dist: string;
  selo: string;
  total: string;
  totalCentavos: number;
};

type CustasModalDraft = {
  itensCobrados: AtoItemCobrado[];
  distribuicaoCentavos: number;
  seloCentavos: number;
};

interface CustasFieldDefinition {
  key: CustasFieldKey;
  label: string;
  placeholder: string;
}

const custasTabelaRows: CustasTabelaRow[] = [
  {
    id: 1,
    tabela: '16',
    item: '1',
    subitem: '*',
    descricao:
      'Certidoes extraidas de livros, assentamentos ou outros papeis arquivados',
    valor: formatCurrencyValue(34.52),
  },
  {
    id: 2,
    tabela: '16',
    item: '2',
    subitem: '*',
    descricao: 'Aposicao de visto/informacao verbal',
    valor: formatCurrencyValue(34.52),
  },
  {
    id: 3,
    tabela: '16',
    item: '3',
    subitem: '*',
    descricao: 'Notificacao ou intimacao, por pessoa',
    valor: formatCurrencyValue(29.95),
  },
  {
    id: 4,
    tabela: '16',
    item: '5',
    subitem: 'A',
    descricao: 'Conciliacao ou mediacao pelo processamento',
    valor: formatCurrencyValue(275.62),
  },
  {
    id: 5,
    tabela: '16',
    item: '6',
    subitem: 'B',
    descricao: 'Arbitragem pelo registro',
    valor: formatCurrencyValue(416.43),
  },
];

const custasFieldDefinitions: CustasFieldDefinition[] = [
  { key: 'emolumentos', label: 'Emolumentos', placeholder: 'R$ 0,00' },
  { key: 'fetj', label: 'Fetj (20%)', placeholder: 'R$ 0,00' },
  { key: 'fundperj', label: 'Fundperj (5%)', placeholder: 'R$ 0,00' },
  { key: 'funperj', label: 'Funperj (5%)', placeholder: 'R$ 0,00' },
  { key: 'funarpen', label: 'Funarpen (6%)', placeholder: 'R$ 0,00' },
  { key: 'pmcmv', label: 'Pmcmv (2%)', placeholder: 'R$ 0,00' },
  { key: 'funpgalerj', label: 'Funpgalerj (1%)', placeholder: 'R$ 0,00' },
  { key: 'funpgt', label: 'Funpgt (1%)', placeholder: 'R$ 0,00' },
  { key: 'fundacpguerj', label: 'Fundacpguerj (1%)', placeholder: 'R$ 0,00' },
  { key: 'iss', label: 'Iss (5,37%)', placeholder: 'R$ 0,00' },
  { key: 'distribuicao', label: 'Distribuicao', placeholder: 'R$ 0,00' },
  { key: 'selo', label: 'Selo', placeholder: 'R$ 0,00' },
];

const aliquotaFieldKeys: CustasAliquotaFieldKey[] = [
  'fetj',
  'fundperj',
  'funperj',
  'funarpen',
  'pmcmv',
  'funpgalerj',
  'funpgt',
  'fundacpguerj',
  'iss',
];

const fundosFieldKeys: CustasFieldKey[] = [
  'fetj',
  'fundperj',
  'funperj',
  'funarpen',
  'pmcmv',
  'funpgalerj',
  'funpgt',
  'fundacpguerj',
];

const custasAliquotaBasisPoints: Record<CustasAliquotaFieldKey, number> = {
  fetj: 2000,
  fundperj: 500,
  funperj: 500,
  funarpen: 600,
  pmcmv: 200,
  funpgalerj: 100,
  funpgt: 100,
  fundacpguerj: 100,
  iss: 537,
};

const modifiableCustasFieldKeys: CustasFieldKey[] = ['distribuicao', 'selo'];

const tipoEntradaOptions = [
  { value: 'opcao1', label: 'Opção 1' },
  { value: 'opcao2', label: 'Opção 2' },
  { value: 'opcao3', label: 'Opção 3' },
];

const naturezaOptions = [
  { value: 'Registro', label: 'REGISTRO' },
  { value: 'Notificação', label: 'NOTIFICACAO' },
  { value: 'DUT', label: 'DUT' },
  { value: 'Certidão', label: 'CERTIDAO' },
  { value: 'Averbação', label: 'AVERBACAO' },
  { value: 'Matrícula', label: 'MATRICULA' },
];

const tipoCobrancaOptions = [
  { value: 'opcao1', label: 'Opção 1' },
  { value: 'opcao2', label: 'Opção 2' },
  { value: 'opcao3', label: 'Opção 3' },
];

const servicosOptions = [
  {
    value: '1',
    label: 'Registro de Título, Documento ou Papel com Valor Declarado',
    description: 'Código 6000',
  },
  {
    value: '2',
    label:
      'Registro de mídia de documentos digitalizados ou nato-digitais até 5 gb',
    description: 'Código 7000',
  },
  {
    value: '3',
    label: 'Tabelionato de Protestos',
    description: 'Código 8000',
  },
  {
    value: '4',
    label: 'Registro Civil de Pessoas Naturais',
    description: 'Código 9000',
  },
  {
    value: '5',
    label: 'Registro Civil de Pessoas Jurídicas',
    description: 'Código 10000',
  },
  {
    value: '6',
    label: 'Registro de Títulos e Documentos',
    description: 'Código 11000',
  },
  {
    value: '7',
    label: 'Registro de Distribuição',
    description: 'Código 12000',
  },
  {
    value: '8',
    label: 'Registro de Imóveis Rurais',
    description: 'Código 13000',
  },
  {
    value: '9',
    label: 'Registro de Imóveis Urbanos',
    description: 'Código 14000',
  },
  {
    value: '10',
    label: 'Registro de Imóveis Especiais',
    description: 'Código 15000',
  },
];

const requiredSelectSchema = z
  .union([z.string(), z.number()])
  .nullable()
  .refine((value) => value !== null, 'Selecione uma opção.');

// Schema unico da pagina: centraliza validacao e saneamento final antes de enviar.
// Isso evita diferenca entre o que a UI mostra e o que realmente vai para o payload.
const balcaoFormSchema = z.object({
  documento: z
    .string()
    .min(1, 'Informe o CPF ou CNPJ.')
    .refine((value) => {
      const digits = onlyDigits(value);
      return digits.length === 11 || digits.length === 14;
    }, 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos.')
    .refine(
      (value) => validarCpfCnpj(onlyDigits(value)),
      'Documento inválido.'
    ),
  contato: z
    .string()
    .min(1, 'Informe o contato. (telefone)')
    .refine((value) => {
      const digits = onlyDigits(value);
      return digits.length >= 10 && digits.length <= 11;
    }, 'Telefone deve ter entre 10 e 11 dígitos.'),
  nome: z
    .string()
    // Reaproveita a mesma regra de normalização para manter UI e validação consistentes.
    .transform((value) => normalizeNameForSubmit(value))
    .refine((value) => value.length > 0, 'Informe o nome do apresentante.')
    .refine(
      (value) => value.length >= 2,
      'Nome deve ter pelo menos 2 caracteres.'
    ),
  email: z
    .string()
    .refine((value) => value.length > 0, 'Informe o email do apresentante.')
    .refine((value) => {
      if (!value) return true; // Permite campo vazio
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }, 'Email inválido.'),
  observacao: z
    .string()
    .max(200, 'Observação deve ter no máximo 200 caracteres.')
    .transform((value) => value.trim()),
  horarioUrgencia: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value),
      'Horário de urgência deve estar no formato HH:mm.'
    ),
  tipoEntrada: requiredSelectSchema,
  natureza: requiredSelectSchema,
  tipoCobranca: requiredSelectSchema,
  ato: z.object({
    valorDocumento: z.string().min(1, 'Informe o valor do documento.'),
    protocolo: z
      .string()
      .min(1, 'Informe o protocolo.')
      .refine(
        (value) => onlyDigits(value).length > 0,
        'Informe um protocolo válido.'
      ),
    dataEntrada: z
      .string()
      .trim()
      .min(1, 'Informe a data da entrada.')
      .regex(
        /^\d{2}\/\d{2}\/\d{4}$/,
        'Data da entrada deve estar no formato DD/MM/AAAA.'
      ),
    servicos: z
      .array(z.union([z.string(), z.number()]))
      .min(1, 'Selecione ao menos 1 serviço.'),
    quantidade: z.number().int().min(0, 'Quantidade não pode ser negativa.'),
    nomes: z.number().int().min(0, 'Nomes não pode ser negativo.'),
    paginas: z.number().int().min(0, 'Páginas não pode ser negativo.'),
    vias: z.number().int().min(0, 'Vias não pode ser negativo.'),
    diligencias: z.number().int().min(0, 'Diligências não pode ser negativa.'),
  }),
});

type FormInputValues = z.input<typeof balcaoFormSchema>;
type FormValues = z.output<typeof balcaoFormSchema>;

const balcaoDefaultValues: FormInputValues = {
  documento: '',
  contato: '',
  nome: '',
  email: '',
  observacao: '',
  horarioUrgencia: '',
  tipoEntrada: null,
  natureza: null,
  tipoCobranca: null,
  ato: {
    valorDocumento: currencyMask('0'),
    protocolo: '',
    dataEntrada: '',
    servicos: [],
    quantidade: 1,
    nomes: 0,
    paginas: 0,
    vias: 0,
    diligencias: 0,
  },
};

const centsToCurrencyMask = (valueInCents: number): string =>
  currencyMask(String(Math.max(0, valueInCents)));

const currencyToCents = (currencyValue: string): number =>
  Math.max(0, Math.trunc(getNumericValue(currencyValue) * 100));

const buildAtoItemFromTabelaRow = (
  row: CustasTabelaRow,
  quantity: number = 1
): AtoItemCobrado => ({
  id: row.id,
  tabela: row.tabela,
  item: row.item,
  subitem: row.subitem,
  descricao: row.descricao,
  valorUnitarioCentavos: currencyToCents(row.valor),
  qtd: Math.max(1, Math.trunc(quantity)),
});

const mapAtoItemsToGridRows = (items: AtoItemCobrado[]): CustasItensAtoRow[] => {
  return items.map((item) => {
    const totalCentavos = item.valorUnitarioCentavos * item.qtd;

    return {
      id: item.id,
      tabela: item.tabela,
      item: item.item,
      subitem: item.subitem,
      descricao: item.descricao,
      valor: centsToCurrencyMask(item.valorUnitarioCentavos),
      qtd: item.qtd,
      total: centsToCurrencyMask(totalCentavos),
    };
  });
};

const calculateCustasFromItems = (
  items: AtoItemCobrado[],
  distribuicaoCentavos: number,
  seloCentavos: number
): { composicao: CustasValues; totalCentavos: number } => {
  const normalizedDistribuicao = Math.max(0, Math.trunc(distribuicaoCentavos));
  const normalizedSelo = Math.max(0, Math.trunc(seloCentavos));
  const aliquotaTotals = aliquotaFieldKeys.reduce(
    (accumulator, currentKey) => {
      return {
        ...accumulator,
        [currentKey]: 0,
      };
    },
    {} as Record<CustasAliquotaFieldKey, number>
  );

  let emolumentosCentavos = 0;

  for (const item of items) {
    const itemQuantity = Math.max(1, Math.trunc(item.qtd));
    const itemTotalCentavos = item.valorUnitarioCentavos * itemQuantity;

    emolumentosCentavos += itemTotalCentavos;

    for (const aliquotaKey of aliquotaFieldKeys) {
      const basisPoints = custasAliquotaBasisPoints[aliquotaKey];
      const aliquotaContribution = Math.trunc(
        (itemTotalCentavos * basisPoints) / 10000
      );
      aliquotaTotals[aliquotaKey] += aliquotaContribution;
    }
  }

  const composicao: CustasValues = {
    emolumentos: centsToCurrencyMask(emolumentosCentavos),
    fetj: centsToCurrencyMask(aliquotaTotals.fetj),
    fundperj: centsToCurrencyMask(aliquotaTotals.fundperj),
    funperj: centsToCurrencyMask(aliquotaTotals.funperj),
    funarpen: centsToCurrencyMask(aliquotaTotals.funarpen),
    pmcmv: centsToCurrencyMask(aliquotaTotals.pmcmv),
    funpgalerj: centsToCurrencyMask(aliquotaTotals.funpgalerj),
    funpgt: centsToCurrencyMask(aliquotaTotals.funpgt),
    fundacpguerj: centsToCurrencyMask(aliquotaTotals.fundacpguerj),
    iss: centsToCurrencyMask(aliquotaTotals.iss),
    distribuicao: centsToCurrencyMask(normalizedDistribuicao),
    selo: centsToCurrencyMask(normalizedSelo),
  };

  const totalCentavos =
    emolumentosCentavos +
    normalizedDistribuicao +
    normalizedSelo +
    aliquotaFieldKeys.reduce(
      (accumulator, currentKey) => accumulator + aliquotaTotals[currentKey],
      0
    );

  return {
    composicao,
    totalCentavos,
  };
};

const createEmptyAtoCustas = (): AtoCustas => {
  const calculatedCustas = calculateCustasFromItems([], 0, 0);

  return {
    itensCobrados: [],
    composicao: calculatedCustas.composicao,
    totalCentavos: calculatedCustas.totalCentavos,
  };
};

const resolveOptionLabel = (
  options: Array<{ value: SelectOptionValue; label: string }>,
  value: SelectOptionValue
): string => {
  const matchedOption = options.find(
    (option) => String(option.value) === String(value)
  );

  return matchedOption?.label ?? String(value);
};

const getCustasFieldCentavos = (
  values: CustasValues,
  field: CustasFieldKey
): number => currencyToCents(values[field]);

interface CustasComposicaoCardProps {
  values: CustasValues;
  disabled: boolean;
  onManualFieldChange: (field: Extract<CustasFieldKey, 'distribuicao' | 'selo'>, value: string) => void;
}

const CustasComposicaoCard = ({
  values,
  disabled,
  onManualFieldChange,
}: CustasComposicaoCardProps) => {
  const localTotalCentavos = useMemo(
    () =>
      Object.values(values).reduce(
        (accumulator, currentValue) =>
          accumulator + currencyToCents(currentValue),
        0
      ),
    [values]
  );

  return (
    <CardContainer title="Composição das Custas" columns={1} collapsible={true}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {custasFieldDefinitions.map((fieldDefinition) => (
          <CustomInput
            key={fieldDefinition.key}
            label={fieldDefinition.label}
            placeholder={fieldDefinition.placeholder}
            autoComplete="off"
            inputMode="numeric"
            readOnly={
              !modifiableCustasFieldKeys.includes(fieldDefinition.key) || disabled
            }
            value={values[fieldDefinition.key]}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (fieldDefinition.key === 'distribuicao' || fieldDefinition.key === 'selo') {
                onManualFieldChange(fieldDefinition.key, event.target.value);
              }
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:max-w-sm">
        <CustomInput
          label="Total"
          value={centsToCurrencyMask(localTotalCentavos)}
          readOnly={true}
          className="font-semibold"
          leftAdornment={<CurrencyDollarIcon className="size-4" />}
          hint="Valor consolidado automaticamente pela soma dos campos."
        />
      </div>
    </CardContainer>
  );
};

interface CustasModalContentProps {
  initialItensCobrados: AtoItemCobrado[];
  initialDistribuicaoCentavos: number;
  initialSeloCentavos: number;
  disabled: boolean;
  onDraftChange: (draft: CustasModalDraft) => void;
}

const CustasModalContent = ({
  initialItensCobrados,
  initialDistribuicaoCentavos,
  initialSeloCentavos,
  disabled,
  onDraftChange,
}: CustasModalContentProps) => {
  const [selectedTabelaValues, setSelectedTabelaValues] = useState<SelectGridValue[]>([]);
  const [selectedTabelaRows, setSelectedTabelaRows] = useState<CustasTabelaRow[]>([]);
  const [itensCobrados, setItensCobrados] = useState<AtoItemCobrado[]>(
    initialItensCobrados.map((item) => ({ ...item }))
  );
  const [distribuicaoValue, setDistribuicaoValue] = useState<string>(
    centsToCurrencyMask(initialDistribuicaoCentavos)
  );
  const [seloValue, setSeloValue] = useState<string>(
    centsToCurrencyMask(initialSeloCentavos)
  );

  const itensCobradosRows = useMemo(
    () => mapAtoItemsToGridRows(itensCobrados),
    [itensCobrados]
  );

  const calculatedCustas = useMemo(
    () =>
      calculateCustasFromItems(
        itensCobrados,
        currencyToCents(distribuicaoValue),
        currencyToCents(seloValue)
      ),
    [itensCobrados, distribuicaoValue, seloValue]
  );

  useEffect(() => {
    onDraftChange({
      itensCobrados,
      distribuicaoCentavos: currencyToCents(distribuicaoValue),
      seloCentavos: currencyToCents(seloValue),
    });
  }, [distribuicaoValue, itensCobrados, onDraftChange, seloValue]);

  const handleAddSelectedRows = () => {
    if (selectedTabelaRows.length === 0 || disabled) {
      return;
    }

    setItensCobrados((previousItems) => {
      const nextItems = [...previousItems];

      for (const selectedRow of selectedTabelaRows) {
        const existingIndex = nextItems.findIndex(
          (item) => item.id === selectedRow.id
        );

        if (existingIndex >= 0) {
          const currentItem = nextItems[existingIndex];
          nextItems[existingIndex] = {
            ...currentItem,
            qtd: currentItem.qtd + 1,
          };
          continue;
        }

        nextItems.push(buildAtoItemFromTabelaRow(selectedRow));
      }

      return nextItems;
    });

    setSelectedTabelaRows([]);
    setSelectedTabelaValues([]);
  };

  const handleIncreaseItemQtd = (itemId: number) => {
    if (disabled) {
      return;
    }

    setItensCobrados((previousItems) =>
      previousItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              qtd: item.qtd + 1,
            }
          : item
      )
    );
  };

  const handleDecreaseItemQtd = (itemId: number) => {
    if (disabled) {
      return;
    }

    setItensCobrados((previousItems) =>
      previousItems.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        return {
          ...item,
          qtd: Math.max(1, item.qtd - 1),
        };
      })
    );
  };

  const handleRemoveItem = (itemId: number) => {
    if (disabled) {
      return;
    }

    setItensCobrados((previousItems) =>
      previousItems.filter((item) => item.id !== itemId)
    );
  };

  return (
    <div className="custom-scrollbar max-h-[60vh] space-y-4 overflow-y-auto pr-1 pb-6">
      <CardContainer
        title="Tabela de Emolumentos - CGJ/RJ"
        description="Selecione um ou mais itens e adicione ao ato"
        columns={1}
        collapsible={true}
      >
        <CustomSelectGrid<CustasTabelaRow>
          selectionMode="multiple"
          rows={custasTabelaRows}
          rowIdKey="id"
          value={selectedTabelaValues}
          onChange={(values, rows) => {
            setSelectedTabelaValues(values);
            setSelectedTabelaRows(rows);
          }}
          density="compact"
          roundedClassName="rounded-xl"
          maxHeightClassName="max-h-56 min-h-56"
          scrollViewportClassName="custom-scrollbar"
          tableClassName="min-w-[860px]"
          columns={[
            {
              key: 'tabela',
              header: 'Tabela',
              align: 'center',
              widthClassName: 'w-16',
            },
            {
              key: 'item',
              header: 'Item',
              align: 'center',
              widthClassName: 'w-16',
            },
            {
              key: 'subitem',
              header: 'Subitem',
              align: 'center',
              widthClassName: 'w-20',
            },
            {
              key: 'descricao',
              header: 'Descricao',
              align: 'left',
              cellClassName: 'text-left',
            },
            {
              key: 'valor',
              header: 'Valor',
              align: 'right',
              widthClassName: 'w-32',
            },
          ]}
        />

        <div className="mt-3 flex justify-end">
          <CustomButton
            size="md"
            title="Adicionar selecionados"
            onClick={() => {
              handleAddSelectedRows();
            }}
            disabled={disabled || selectedTabelaRows.length === 0}
          />
        </div>
      </CardContainer>

      <CardContainer title="Itens Cobrados no Ato" columns={1} collapsible={true}>
        <CustomSelectGrid<CustasItensAtoRow>
          rows={itensCobradosRows}
          rowIdKey="id"
          showSelectionColumn={false}
          density="compact"
          roundedClassName="rounded-xl"
          maxHeightClassName="max-h-52 min-h-52"
          scrollViewportClassName="custom-scrollbar"
          tableClassName="min-w-[1080px]"
          columns={[
            {
              key: 'tabela',
              header: 'Tabela',
              align: 'center',
              widthClassName: 'w-16',
            },
            {
              key: 'item',
              header: 'Item',
              align: 'center',
              widthClassName: 'w-16',
            },
            {
              key: 'subitem',
              header: 'Subitem',
              align: 'center',
              widthClassName: 'w-20',
            },
            {
              key: 'descricao',
              header: 'Descricao',
              align: 'left',
              cellClassName: 'text-left',
            },
            {
              key: 'valor',
              header: 'Valor Unit.',
              align: 'right',
              widthClassName: 'w-32',
            },
            {
              key: 'qtd',
              header: 'Qtd.',
              align: 'center',
              widthClassName: 'w-36',
              render: (row) => (
                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    className="h-7 w-7 rounded-md bg-(--cor-edit) text-sm font-semibold text-(--cor-texto) ring-1 ring-(--cor-borda)/55 transition-all hover:bg-(--cor-button-hover)/20 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-(--dark-cor-borda)/60 dark:hover:bg-(--dark-cor-button-hover)/25"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDecreaseItemQtd(row.id);
                    }}
                    disabled={disabled}
                    aria-label="Diminuir quantidade"
                  >
                    -
                  </button>

                  <span className="min-w-7 text-center text-sm font-semibold">
                    {row.qtd}
                  </span>

                  <button
                    type="button"
                    className="h-7 w-7 rounded-md bg-(--cor-edit) text-sm font-semibold text-(--cor-texto) ring-1 ring-(--cor-borda)/55 transition-all hover:bg-(--cor-button-hover)/20 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-(--dark-cor-borda)/60 dark:hover:bg-(--dark-cor-button-hover)/25"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleIncreaseItemQtd(row.id);
                    }}
                    disabled={disabled}
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>
              ),
            },
            {
              key: 'total',
              header: 'Total',
              align: 'right',
              widthClassName: 'w-32',
            },
            {
              key: 'id',
              header: 'Ação',
              align: 'center',
              widthClassName: 'w-20',
              render: (row) => (
                <button
                  type="button"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-(--cor-edit) text-sm font-semibold text-(--cor-texto) ring-1 ring-(--cor-borda)/55 transition-all hover:bg-red-500/15 hover:text-red-600 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-(--dark-cor-borda)/60 dark:hover:bg-red-400/20 dark:hover:text-red-400"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemoveItem(row.id);
                  }}
                  disabled={disabled}
                  aria-label="Remover item"
                >
                  x
                </button>
              ),
            },
          ]}
        />
      </CardContainer>

      <CustasComposicaoCard
        values={calculatedCustas.composicao}
        disabled={disabled}
        onManualFieldChange={(field, value) => {
          if (field === 'distribuicao') {
            setDistribuicaoValue(currencyMask(value));
            return;
          }

          setSeloValue(currencyMask(value));
        }}
      />
    </div>
  );
};

/**
 * Pagina de Balcao:
 * - Usa react-hook-form + Zod para validar e normalizar dados.
 * - Campos com mascara exibem valor formatado, mas salvam valor normalizado no form.
 * - Acoes sensiveis (limpar e enviar) passam por confirmacao do modal manager.
 */
export default function BalcaoPage() {
  const { openModal, openConfirm } = useModalManager();

  const {
    control,
    reset,
    resetField,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormInputValues, unknown, FormValues>({
    // Mantem tipagem alinhada com entrada e saida do schema (inclui transforms do Zod).
    // Zod concentra as regras de validação e saneamento final antes do submit.
    resolver: zodResolver(balcaoFormSchema),
    defaultValues: balcaoDefaultValues,
    // Primeira validação ao tocar/sair do campo e, depois disso, revalida em cada mudança.
    mode: 'onTouched',
    reValidateMode: 'onChange',
    delayError: 200,
  });

  const documentoDigitsLength = watch('documento').length;
  const contatoDigitsLength = watch('contato').length;

  const [servicosSearchTerm, setServicosSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<SelectGridValue[]>([]);
  const [atosSalvos, setAtosSalvos] = useState<AtoSalvo[]>([]);
  const [nextAtoId, setNextAtoId] = useState(1);

  const clearAllFormAndLocalState = () => {
    reset(balcaoDefaultValues);
    setServicosSearchTerm('');
    setSelectedIds([]);
    setAtosSalvos([]);
    setNextAtoId(1);
  };

  const showAlert = async (title: string, description: string) => {
    const result = await openModal({
      kind: 'alert',
      title,
      description,
      confirmLabel: 'Entendi',
      showCloseButton: true,
    });

    if (result.status === 'blocked') {
      console.info(
        '[Balcao] Modal de alerta bloqueado: ja existe um modal aberto.'
      );
    }
  };

  const selectedAtoId =
    selectedIds.length > 0 ? Number(selectedIds[0]) : null;

  const reciboRows = useMemo<ReciboRow[]>(() => {
    return atosSalvos.map((ato) => {
      const fundosCentavos = fundosFieldKeys.reduce(
        (accumulator, field) =>
          accumulator + getCustasFieldCentavos(ato.custas.composicao, field),
        0
      );

      return {
        id: ato.id,
        protocolo: ato.informacoesAto.protocolo,
        descricao:
          ato.informacoesAto.servicos.map((servico) => servico.label).join(' | ') ||
          'Ato sem servico vinculado',
        emolumentos: ato.custas.composicao.emolumentos,
        fundos: centsToCurrencyMask(fundosCentavos),
        iss: ato.custas.composicao.iss,
        dist: ato.custas.composicao.distribuicao,
        selo: ato.custas.composicao.selo,
        total: centsToCurrencyMask(ato.custas.totalCentavos),
        totalCentavos: ato.custas.totalCentavos,
      };
    });
  }, [atosSalvos]);

  const totalReciboCentavos = useMemo(
    () =>
      reciboRows.reduce(
        (accumulator, currentRow) => accumulator + currentRow.totalCentavos,
        0
      ),
    [reciboRows]
  );

  const quantidadeServicos = useMemo(
    () =>
      atosSalvos.reduce(
        (accumulator, currentAto) =>
          accumulator + currentAto.informacoesAto.servicos.length,
        0
      ),
    [atosSalvos]
  );

  const handleSaveAto = async () => {
    const isValid = await trigger([
      'tipoEntrada',
      'natureza',
      'tipoCobranca',
      'ato.valorDocumento',
      'ato.protocolo',
      'ato.dataEntrada',
      'ato.servicos',
      'ato.quantidade',
      'ato.nomes',
      'ato.paginas',
      'ato.vias',
      'ato.diligencias',
    ]);

    if (!isValid) {
      return;
    }

    const values = getValues();
    if (
      values.tipoEntrada === null ||
      values.natureza === null ||
      values.tipoCobranca === null
    ) {
      return;
    }

    const newAtoId = nextAtoId;
    const servicosSelecionados: ServicoSelecionado[] = values.ato.servicos.map(
      (serviceValue) => {
        const matchedService = servicosOptions.find(
          (serviceOption) =>
            String(serviceOption.value) === String(serviceValue)
        );

        return {
          value: serviceValue,
          label: String(matchedService?.label ?? serviceValue),
          description: String(matchedService?.description ?? ''),
        };
      }
    );

    const newAto: AtoSalvo = {
      id: newAtoId,
      tipoEntrada: values.tipoEntrada,
      natureza: values.natureza,
      tipoCobranca: values.tipoCobranca,
      informacoesAto: {
        valorDocumento: values.ato.valorDocumento,
        valorDocumentoNumerico: getNumericValue(values.ato.valorDocumento),
        protocolo: values.ato.protocolo,
        dataEntrada: values.ato.dataEntrada,
        servicos: servicosSelecionados,
        quantidade: values.ato.quantidade,
        nomes: values.ato.nomes,
        paginas: values.ato.paginas,
        vias: values.ato.vias,
        diligencias: values.ato.diligencias,
      },
      custas: createEmptyAtoCustas(),
    };

    setAtosSalvos((previousAtos) => [...previousAtos, newAto]);
    setSelectedIds([newAtoId]);
    setNextAtoId((previousId) => previousId + 1);
    reset({
      ...values,
      tipoEntrada: null,
      natureza: null,
      tipoCobranca: null,
      ato: {
        ...balcaoDefaultValues.ato,
      },
    });
    setServicosSearchTerm('');
  };

  const handleOpenCustasModal = async () => {
    if (selectedAtoId === null) {
      await showAlert(
        'Selecione um ato',
        'Escolha um ato na grade de recibo para editar as custas.'
      );
      return;
    }

    const targetAto = atosSalvos.find((ato) => ato.id === selectedAtoId);
    if (!targetAto) {
      setSelectedIds([]);
      await showAlert(
        'Ato não encontrado',
        'A seleção atual não corresponde a um ato válido. Selecione novamente.'
      );
      return;
    }

    let stagedDraft: CustasModalDraft = {
      itensCobrados: targetAto.custas.itensCobrados.map((item) => ({ ...item })),
      distribuicaoCentavos: currencyToCents(targetAto.custas.composicao.distribuicao),
      seloCentavos: currencyToCents(targetAto.custas.composicao.selo),
    };

    const result = await openModal<AtoCustas>({
      kind: 'custom',
      title: `Custas - Protocolo ${targetAto.informacoesAto.protocolo}`,
      size: 'lg',
      className: 'max-h-[90vh] max-w-[min(96vw,1280px)] overflow-auto',
      confirmLabel: 'Salvar custas',
      cancelLabel: 'Cancelar',
      showCloseButton: true,
      disableBackdropClose: true,
      showDefaultActions: true,
      onConfirm: () => {
        const calculatedCustas = calculateCustasFromItems(
          stagedDraft.itensCobrados,
          stagedDraft.distribuicaoCentavos,
          stagedDraft.seloCentavos
        );

        return {
          itensCobrados: stagedDraft.itensCobrados,
          composicao: calculatedCustas.composicao,
          totalCentavos: calculatedCustas.totalCentavos,
        };
      },
      renderContent: (controls) => (
        <CustasModalContent
          initialItensCobrados={stagedDraft.itensCobrados}
          initialDistribuicaoCentavos={stagedDraft.distribuicaoCentavos}
          initialSeloCentavos={stagedDraft.seloCentavos}
          disabled={controls.isSubmitting}
          onDraftChange={(nextDraft) => {
            stagedDraft = {
              itensCobrados: nextDraft.itensCobrados.map((item) => ({ ...item })),
              distribuicaoCentavos: nextDraft.distribuicaoCentavos,
              seloCentavos: nextDraft.seloCentavos,
            };
          }}
        />
      ),
    });

    if (result.status === 'blocked') {
      console.info(
        '[Balcao] Modal de Custas bloqueado: ja existe um modal aberto.'
      );
      return;
    }

    if (result.status !== 'confirmed' || !result.data) {
      return;
    }

    const modalData = result.data;

    setAtosSalvos((previousAtos) =>
      previousAtos.map((ato) =>
        ato.id === targetAto.id
          ? {
              ...ato,
              custas: {
                itensCobrados: modalData.itensCobrados.map((item) => ({
                  ...item,
                })),
                composicao: modalData.composicao,
                totalCentavos: modalData.totalCentavos,
              },
            }
          : ato
      )
    );
  };

  const handleClearSelectedAto = async () => {
    if (selectedAtoId === null) {
      await showAlert(
        'Selecione um ato',
        'Escolha um ato na grade para remover do recibo.'
      );
      return;
    }

    const confirmed = await openConfirm({
      title: 'Remover ato selecionado?',
      description: 'Essa ação remove apenas o ato selecionado da descrição do recibo.',
      confirmLabel: 'Sim, remover ato',
      cancelLabel: 'Cancelar',
      showCloseButton: true,
      disableBackdropClose: true,
    });

    if (!confirmed) {
      return;
    }

    setAtosSalvos((previousAtos) =>
      previousAtos.filter((ato) => ato.id !== selectedAtoId)
    );
    setSelectedIds([]);
  };

  const handleClearAll = async () => {
    const confirmed = await openConfirm({
      title: 'Limpar todos os dados?',
      description:
        'Essa ação remove os dados preenchidos do formulário e a seleção da grade.',
      confirmLabel: 'Sim, limpar tudo',
      cancelLabel: 'Cancelar',
      showCloseButton: true,
      disableBackdropClose: true,
    });

    if (!confirmed) {
      return;
    }

    // Limpa tanto o formulario quanto estados locais fora do react-hook-form.
    clearAllFormAndLocalState();
  };

  const handleClearApresentante = async () => {
    const confirmed = await openConfirm({
      title: 'Limpar informações do apresentante?',
      description:
        'Essa ação remove apenas os dados preenchidos na seção de apresentante.',
      confirmLabel: 'Sim, limpar apresentante',
      cancelLabel: 'Cancelar',
      showCloseButton: true,
      disableBackdropClose: true,
    });

    if (!confirmed) {
      return;
    }

    // Limpeza granular: afeta somente a secao de apresentante.
    resetField('documento');
    resetField('contato');
    resetField('nome');
    resetField('email');
    resetField('observacao');
    resetField('horarioUrgencia');
  };

  const handleFinalize = async () => {
    const isApresentanteValid = await trigger([
      'documento',
      'contato',
      'nome',
      'email',
      'observacao',
      'horarioUrgencia',
    ]);

    if (!isApresentanteValid) {
      return;
    }

    if (atosSalvos.length === 0) {
      await showAlert(
        'Nenhum ato salvo',
        'Adicione ao menos um ato antes de finalizar o envio.'
      );
      return;
    }

    const confirmed = await openConfirm({
      title: 'Confirmar envio?',
      description:
        'Confira os dados antes de continuar. Esta ação vai enviar as informações do balcão.',
      confirmLabel: 'Sim, enviar',
      cancelLabel: 'Revisar',
      showCloseButton: true,
      disableBackdropClose: true,
    });

    if (!confirmed) {
      return;
    }

    const formValues = getValues();

    const payload = {
      apresentante: {
        documento: formValues.documento,
        contato: formValues.contato,
        nome: formValues.nome,
        email: formValues.email,
        observacao: formValues.observacao,
        horarioUrgencia: formValues.horarioUrgencia,
        atos: atosSalvos.map((ato) => {
          const composicaoComCentavos = Object.fromEntries(
            Object.entries(ato.custas.composicao).map(([key, value]) => [
              key,
              {
                valor: value,
                centavos: currencyToCents(value),
              },
            ])
          );

          return {
            id: ato.id,
            tipoEntrada: {
              value: ato.tipoEntrada,
              label: resolveOptionLabel(tipoEntradaOptions, ato.tipoEntrada),
            },
            natureza: {
              value: ato.natureza,
              label: resolveOptionLabel(naturezaOptions, ato.natureza),
            },
            tipoCobranca: {
              value: ato.tipoCobranca,
              label: resolveOptionLabel(tipoCobrancaOptions, ato.tipoCobranca),
            },
            informacoesAto: {
              ...ato.informacoesAto,
              servicos: ato.informacoesAto.servicos.map((servico) => ({
                value: servico.value,
                label: servico.label,
                description: servico.description,
              })),
            },
            custas: {
              itensCobrados: ato.custas.itensCobrados.map((item) => {
                const totalCentavos = item.valorUnitarioCentavos * item.qtd;
                return {
                  id: item.id,
                  tabela: item.tabela,
                  item: item.item,
                  subitem: item.subitem,
                  descricao: item.descricao,
                  qtd: item.qtd,
                  valorUnitarioCentavos: item.valorUnitarioCentavos,
                  valorUnitario: centsToCurrencyMask(item.valorUnitarioCentavos),
                  totalCentavos,
                  total: centsToCurrencyMask(totalCentavos),
                };
              }),
              composicao: composicaoComCentavos,
              totalCentavos: ato.custas.totalCentavos,
              total: centsToCurrencyMask(ato.custas.totalCentavos),
            },
          };
        }),
      },
    };

    const payloadFormatado = JSON.stringify(payload, null, 2);

    const result = await openModal({
      kind: 'alert',
      title: 'Objeto completo da finalização',
      description:
        'Visualização temporária do payload montado antes da integração com a API.',
      confirmLabel: 'Fechar',
      showCloseButton: true,
      size: 'lg',
      className: 'max-h-[90vh] max-w-[min(96vw,1280px)] overflow-auto',
      renderContent: () => (
        <div className="custom-scrollbar max-h-[60vh] overflow-auto rounded-xl bg-(--cor-edit) p-4 ring-1 ring-(--cor-borda)/60 dark:bg-(--dark-cor-edit) dark:ring-(--dark-cor-borda)/65">
          <pre className="whitespace-pre-wrap wrap-break-word text-xs leading-relaxed text-(--cor-texto) dark:text-(--dark-cor-texto)">
            {payloadFormatado}
          </pre>
        </div>
      ),
    });

    if (result.status === 'blocked') {
      console.info(
        '[Balcao] Modal de payload bloqueado: ja existe um modal aberto.'
      );
    }

    clearAllFormAndLocalState();
  };

  const filteredServicosOptions = useMemo(() => {
    // Busca tolerante a acentos para melhorar experiencia ao filtrar servicos.
    const normalizedTerm = normalizeSearchText(servicosSearchTerm);

    if (!normalizedTerm) {
      return servicosOptions;
    }

    return servicosOptions.filter((item) => {
      const searchableText = normalizeSearchText(
        `${item.label} ${item.description ?? ''}`
      );

      return searchableText.includes(normalizedTerm);
    });
  }, [servicosSearchTerm]);

  return (
    <PageTitle title="Balcão" description="Lançamentos">
      {/* Formulário de apresentantes */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
        className="col-span-full space-y-4"
        noValidate
      >
        {/* Botões utilitários */}
        <div className="flex justify-end gap-6">
          <CustomButton
            size="lg"
            title="Limpar Apresentante"
            onClick={() => {
              void handleClearApresentante();
            }}
          />
          <CustomButton
            backgroundColor="#940100"
            hoverBackgroundColor="#F9A526"
            size="lg"
            title="Limpar tudo"
            onClick={() => {
              void handleClearAll();
            }}
          />
        </div>

        {/* Apresentante */}
        <CardContainer
          title="Apresentante"
          columns={1}
          collapsible={true}
        >
          {/*
            Controller é necessário aqui porque estes campos são controlados:
            - a UI mostra valores formatados (CPF/CNPJ, telefone e nome);
            - o estado do formulário guarda valores normalizados (ex.: só dígitos).
            Com register simples, ficaria mais difícil sincronizar exibição e valor persistido.
          */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {/* Documento */}
            <Controller
              name="documento"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Documento"
                  placeholder="123.456.789-10"
                  autoComplete="off"
                  maxLength={18}
                  error={errors.documento}
                  hint={
                    documentoDigitsLength > 0
                      ? `${documentoDigitsLength}/14 dígitos informados.`
                      : 'Aceita CPF (11 dígitos) ou CNPJ (14 dígitos).'
                  }
                  // O input recebe máscara na tela, porém o estado guarda apenas números.
                  name={field.name}
                  value={formatCpfCnpj(field.value)}
                  onBlur={field.onBlur}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(onlyDigits(event.target.value).slice(0, 14));
                  }}
                  ref={field.ref}
                />
              )}
            />

            {/* Nome */}
            <div className="col-span-1 grid xl:col-span-2">
              <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label="Nome"
                    placeholder="Nome do Apresentante"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={150}
                    error={errors.nome}
                    name={field.name}
                    // Mostra nome normalizado em tempo real, inclusive com iniciais maiúsculas.
                    value={normalizeNameForDisplay(field.value)}
                    onBlur={() => {
                      // Ao sair do campo, aplica a normalização final usada também no Zod.
                      field.onChange(normalizeNameForSubmit(field.value));
                      field.onBlur();
                    }}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(
                        normalizeNameForDisplay(event.target.value)
                      );
                    }}
                    ref={field.ref}
                  />
                )}
              />
            </div>

            {/* Contato */}
            <Controller
              name="contato"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Contato"
                  placeholder="(21) 99999-0000"
                  autoComplete="off"
                  maxLength={15}
                  error={errors.contato}
                  hint={
                    contatoDigitsLength > 0
                      ? `${contatoDigitsLength}/11 dígitos informados.`
                      : 'Formato: (DDD) 0000-0000 ou (DDD) 00000-0000.'
                  }
                  // Mantém máscara visual de telefone sem poluir o valor salvo no form.
                  name={field.name}
                  value={formatPhoneWithDdd(field.value)}
                  onBlur={field.onBlur}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(onlyDigits(event.target.value).slice(0, 11));
                  }}
                  ref={field.ref}
                />
              )}
            />

            <div className="contents xl:col-span-2 xl:grid xl:grid-cols-[minmax(0,1fr)_10rem] xl:gap-4">
              {/* Email */}
              <div className="min-w-0">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      label="Email"
                      placeholder="apresentante@apresentante.com.br"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      maxLength={320}
                      error={errors.email}
                      name={field.name}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        field.onChange(event.target.value);
                      }}
                      ref={field.ref}
                      className="w-full"
                    />
                  )}
                />
              </div>

              {/* Horario de Urgencia */}
              <div className="xl:justify-self-end">
                <Controller
                  name="horarioUrgencia"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      label="Horário de Urgência"
                      placeholder="HH:mm"
                      autoComplete="off"
                      spellCheck={false}
                      inputMode="numeric"
                      maxLength={5}
                      error={errors.horarioUrgencia}
                      name={field.name}
                      value={formatHourWithColon(field.value)}
                      onBlur={() => {
                        // Reaplica mascara no blur para garantir formato consistente antes da validacao.
                        field.onChange(formatHourWithColon(field.value));
                        field.onBlur();
                      }}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        field.onChange(formatHourWithColon(event.target.value));
                      }}
                      ref={field.ref}
                      className="max-w-40"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <Controller
            name="observacao"
            control={control}
            render={({ field }) => (
              <CustomTextbox
                label="Observações"
                placeholder="Observações sobre o apresentante"
                resize="vertical"
                autoComplete="off"
                spellCheck={true}
                maxLength={200}
                error={errors.observacao}
                name={field.name}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                  field.onChange(event.target.value);
                }}
                ref={field.ref}
              />
            )}
          />
        </CardContainer>

        {/* Não sei o nome ainda */}
        <CardContainer columns={1}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {/* Naturezas */}

            {/* Tipo de entradas */}
            <Controller
              name="tipoEntrada"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Tipo de entradas"
                  options={tipoEntradaOptions}
                  placeholder="Selecione uma opção"
                  error={errors.tipoEntrada}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />

            <Controller
              name="natureza"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Naturezas"
                  options={naturezaOptions}
                  placeholder="Selecione uma opção"
                  error={errors.natureza}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />

            {/* Tipos de cobrança */}
            <Controller
              name="tipoCobranca"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Tipo de cobrança"
                  options={tipoCobrancaOptions}
                  placeholder="Selecione uma opção"
                  error={errors.tipoCobranca}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          </div>
        </CardContainer>

        {/* Informação do Ato */}
        <CardContainer
          title="Informação do Ato"
          collapsible={true}
          columns={1}
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {/* Valor */}
            <Controller
              name="ato.valorDocumento"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Valor do documento"
                  placeholder="Digite o valor do ato"
                  autoComplete="off"
                  inputMode="numeric"
                  maxLength={20}
                  leftAdornment={<CurrencyDollarIcon className="size-4" />}
                  error={errors.ato?.valorDocumento}
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(currencyMask(event.target.value));
                  }}
                  ref={field.ref}
                />
              )}
            />

            {/* Protocolo */}
            <Controller
              name="ato.protocolo"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Protocolo"
                  placeholder="Digite o protocolo"
                  autoComplete="off"
                  inputMode="numeric"
                  maxLength={30}
                  error={errors.ato?.protocolo}
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(onlyDigits(event.target.value));
                  }}
                  ref={field.ref}
                />
              )}
            />

            {/* Data da entrada */}
            <Controller
              name="ato.dataEntrada"
              control={control}
              render={({ field }) => (
                <CustomDateInput
                  label="Data da Entrada"
                  placeholder="DD/MM/AAAA"
                  autoComplete="off"
                  showDatepicker={true}
                  error={errors.ato?.dataEntrada}
                  name={field.name}
                  value={field.value}
                  onValueChange={(nextValue) => {
                    if (nextValue !== field.value) {
                      field.onChange(nextValue);
                    }
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              )}
            />
          </div>

          <CustomInput
            label="Pesquisar"
            placeholder="Digite a descrição ou código"
            autoComplete="off"
            value={servicosSearchTerm}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setServicosSearchTerm(event.target.value);
            }}
          />

          <Controller
            name="ato.servicos"
            control={control}
            render={({ field }) => (
              <CustomSelectData
                className="custom-scrollbar max-h-60 min-h-60 overflow-auto sm:grid-cols-1 md:grid-cols-2"
                label="Serviços"
                
                items={filteredServicosOptions}
                error={errors.ato?.servicos?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            )}
          />

          {/* Configurações do ato */}
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
            <Controller
              name="ato.quantidade"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Quantidade"
                  placeholder="0"
                  autoComplete="off"
                  type="number"
                  min={0}
                  error={errors.ato?.quantidade}
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const nextValue = Number(onlyDigits(event.target.value));
                    field.onChange(Number.isNaN(nextValue) ? 0 : nextValue);
                  }}
                  ref={field.ref}
                />
              )}
            />

            <Controller
              name="ato.nomes"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Nomes"
                  placeholder="0"
                  autoComplete="off"
                  type="number"
                  min={0}
                  error={errors.ato?.nomes}
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const nextValue = Number(onlyDigits(event.target.value));
                    field.onChange(Number.isNaN(nextValue) ? 0 : nextValue);
                  }}
                  ref={field.ref}
                />
              )}
            />

            <Controller
              name="ato.paginas"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Páginas"
                  placeholder="0"
                  autoComplete="off"
                  type="number"
                  min={0}
                  error={errors.ato?.paginas}
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const nextValue = Number(onlyDigits(event.target.value));
                    field.onChange(Number.isNaN(nextValue) ? 0 : nextValue);
                  }}
                  ref={field.ref}
                />
              )}
            />

            <Controller
              name="ato.vias"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Vias"
                  placeholder="0"
                  autoComplete="off"
                  type="number"
                  min={0}
                  error={errors.ato?.vias}
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const nextValue = Number(onlyDigits(event.target.value));
                    field.onChange(Number.isNaN(nextValue) ? 0 : nextValue);
                  }}
                  ref={field.ref}
                />
              )}
            />

            <Controller
              name="ato.diligencias"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Diligências"
                  placeholder="0"
                  autoComplete="off"
                  type="number"
                  min={0}
                  error={errors.ato?.diligencias}
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const nextValue = Number(onlyDigits(event.target.value));
                    field.onChange(Number.isNaN(nextValue) ? 0 : nextValue);
                  }}
                  ref={field.ref}
                />
              )}
            />
          </div>

          {/* Botão de salvar */}
          <div className="flex justify-end">
            <CustomButton
              size="lg"
              type="button"
              title="Salvar Ato"
              onClick={() => {
                void handleSaveAto();
              }}
            />
          </div>
        </CardContainer>

        {/* Desrição do recibo */}
        <CardContainer
          title="Descrição do Recibo"
          collapsible={true}
          columns={1}
        >
          <div className="mb-2 flex justify-end gap-4">
            <CustomButton
              circle={true}
              size="lg"
              title="Limpar"
              icon={<CloseLineIcon className="size-5" />}
              aria-label="Fechar descrição"
              onClick={() => {
                void handleClearSelectedAto();
              }}
            />

            <CustomButton
              circle={true}
              size="lg"
              icon={<CurrencyDollarIcon className="size-5" />}
              title="Custas"
              onClick={() => {
                void handleOpenCustasModal();
              }}
            />
          </div>

          <CustomSelectGrid
            showSelectionColumn={true}
            selectionMode="single"
            maxSelected={1}
            maxHeightClassName="max-h-80 min-h-80"
            scrollViewportClassName="custom-scrollbar"
            rows={reciboRows}
            columns={[
              {
                key: 'protocolo',
                header: 'Protocolo',
                // sortable: true,
                widthClassName: 'w-20',
              },
              {
                key: 'descricao',
                header: 'Descricao',
                cellClassName: 'text-left',
                align: 'left',
                // sortable: true,
              },
              {
                key: 'emolumentos',
                header: 'Emolumentos',
                cellClassName: 'text-right',
                align: 'center',
                // sortable: true,
              },
              {
                key: 'fundos',
                header: 'Fundos',
                cellClassName: 'text-right',
                align: 'center',
                // sortable: true,
              },
              {
                key: 'iss',
                header: 'ISS',
                cellClassName: 'text-right',
                align: 'center',
              },
              {
                key: 'dist',
                header: 'Dist',
                cellClassName: 'text-right',
                align: 'center',
              },
              {
                key: 'selo',
                header: 'Selo',
                cellClassName: 'text-right',
                align: 'center',
              },
              {
                key: 'total',
                header: 'Total',
                cellClassName: 'text-right',
                align: 'center',
              },
            ]}
            rowIdKey="id"
            value={selectedIds}
            onChange={(values) => setSelectedIds(values)}
          />

          <div className="mt-4 flex items-center justify-between px-2 align-middle">
            <div className="flex">
              <CustomButton
                size="lg"
                type="button"
                title="Finalizar"
                onClick={() => {
                  void handleFinalize();
                }}
              />
            </div>

            <div className="text-end">
              <h1 className="text-xl font-bold">
                Total: {centsToCurrencyMask(totalReciboCentavos)}
              </h1>
              <h2 className="text-lg font-light opacity-95">
                Quantidade de serviços: {quantidadeServicos}
              </h2>
            </div>
          </div>
          {/* Total e quantidade de serviços */}
        </CardContainer>

        {/* Botão de enviar */}
      </form>
    </PageTitle>
  );
}
