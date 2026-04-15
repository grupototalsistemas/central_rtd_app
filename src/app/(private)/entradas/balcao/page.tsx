'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import CardContainer from '@/components/card/CardContainer';
import CustomInput from '@/components/inputs/CustomInput';
import PageTitle from '@/components/page/PageTitle';
import { formatCpfCnpj, validarCpfCnpj } from '@/utils/formatCpfCnpj';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
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

const custasItensAtoRows: CustasItensAtoRow[] = [
  {
    id: 1,
    tabela: '25',
    item: '1',
    subitem: 'I',
    descricao: 'Registro com valor declarado de R$ 81.588,66 ate R$ 102.091,14',
    valor: formatCurrencyValue(2948.83),
    qtd: 1,
    total: formatCurrencyValue(2948.83),
  },
  {
    id: 2,
    tabela: '25',
    item: '2',
    subitem: 'A',
    descricao: 'Analise documental complementar',
    valor: formatCurrencyValue(352.5),
    qtd: 1,
    total: formatCurrencyValue(352.5),
  },
  {
    id: 3,
    tabela: '25',
    item: '3',
    subitem: 'C',
    descricao: 'Conferencia e diligencia administrativa',
    valor: formatCurrencyValue(212.3),
    qtd: 1,
    total: formatCurrencyValue(212.3),
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

const custasDefaultValues: CustasValues = {
  emolumentos: currencyMask('294883'),
  fetj: currencyMask('58976'),
  fundperj: currencyMask('14744'),
  funperj: currencyMask('14744'),
  funarpen: currencyMask('17692'),
  pmcmv: currencyMask('5897'),
  funpgalerj: currencyMask('0'),
  funpgt: currencyMask('0'),
  fundacpguerj: currencyMask('0'),
  iss: currencyMask('15835'),
  distribuicao: currencyMask('0'),
  selo: currencyMask('327'),
};

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

export default function BalcaoPage() {
  const { openModal, openConfirm } = useModalManager();

  const recibo = [
    {
      id: 1,
      protocolo: '6000',
      descricao: 'Registro de Titulo',
      emolumentos: 'R$ 100,00',
      fundos: 'R$ 100,00',
      iss: 'R$ 100,00',
      dist: 'R$ 100,00',
      selo: 'R$ 100,00',
      total: 'R$ 500,00',
    },
    {
      id: 2,
      protocolo: '7000',
      descricao: 'Registro de Midia',
      emolumentos: 'R$ 150,00',
      fundos: 'R$ 100,00',
      iss: 'R$ 100,00',
      dist: 'R$ 100,00',
      selo: 'R$ 100,00',
      total: 'R$ 500,00',
    },
    {
      id: 3,
      protocolo: '8000',
      descricao: 'Registro de Imóveis',
      emolumentos: 'R$ 200,00',
      fundos: 'R$ 100,00',
      iss: 'R$ 100,00',
      dist: 'R$ 100,00',
      selo: 'R$ 100,00',
      total: 'R$ 500,00',
    },
    {
      id: 4,
      protocolo: '9000',
      descricao: 'Registro Civil de Pessoas Naturais',
      emolumentos: 'R$ 250,00',
      fundos: 'R$ 100,00',
      iss: 'R$ 100,00',
      dist: 'R$ 100,00',
      selo: 'R$ 100,00',
      total: 'R$ 500,00',
    },
    {
      id: 5,
      protocolo: '10000',
      descricao: 'Registro de Contratos',
      emolumentos: 'R$ 300,00',
      fundos: 'R$ 100,00',
      iss: 'R$ 100,00',
      dist: 'R$ 100,00',
      selo: 'R$ 100,00',
      total: 'R$ 500,00',
    },
    {
      id: 6,
      protocolo: '11000',
      descricao: 'Registro de Distribuição',
      emolumentos: 'R$ 350,00',
      fundos: 'R$ 100,00',
      iss: 'R$ 100,00',
      dist: 'R$ 100,00',
      selo: 'R$ 100,00',
      total: 'R$ 500,00',
    },
    {
      id: 7,
      protocolo: '12000',
      descricao: 'Registro de Imóveis Rurais',
      emolumentos: 'R$ 400,00',
      fundos: 'R$ 100,00',
      iss: 'R$ 100,00',
      dist: 'R$ 100,00',
      selo: 'R$ 100,00',
      total: 'R$ 500,00',
    },
    {
      id: 8,
      protocolo: '13000',
      descricao: 'Registro de Imóveis Urbanos',
      emolumentos: 'R$ 450,00',
      fundos: 'R$ 100,00',
      iss: 'R$ 100,00',
      dist: 'R$ 100,00',
      selo: 'R$ 100,00',
      total: 'R$ 500,00',
    },
    {
      id: 9,
      protocolo: '14000',
      descricao: 'Registro de Imóveis Especiais',
      emolumentos: 'R$ 500,00',
      fundos: 'R$ 100,00',
      iss: 'R$ 100,00',
      dist: 'R$ 100,00',
      selo: 'R$ 100,00',
      total: 'R$ 500,00',
    },
    {
      id: 10,
      protocolo: '15000',
      descricao: 'Registro de Títulos e Documentos',
      emolumentos: 'R$ 550,00',
      fundos: 'R$ 100,00',
      iss: 'R$ 100,00',
      dist: 'R$ 100,00',
      selo: 'R$ 100,00',
      total: 'R$ 500,00',
    },
    {
      id: 11,
      protocolo: '16000',
      descricao: 'Registro de Protestos',
      emolumentos: 'R$ 550,00',
      fundos: 'R$ 100,00',
      iss: 'R$ 100,00',
      dist: 'R$ 100,00',
      selo: 'R$ 100,00',
      total: 'R$ 500,00',
    },
  ];

  const {
    control,
    handleSubmit,
    reset,
    resetField,
    watch,
    formState: { errors },
  } = useForm<FormInputValues, unknown, FormValues>({
    // Zod concentra as regras de validação e saneamento final antes do submit.
    resolver: zodResolver(balcaoFormSchema),
    defaultValues: balcaoDefaultValues,
    // Primeira validação ao tocar/sair do campo e, depois disso, revalida em cada mudança.
    mode: 'onTouched',
    reValidateMode: 'onChange',
    delayError: 200,
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const payload = {
      ...data,
      ato: {
        ...data.ato,
        valorDocumentoNumerico: getNumericValue(data.ato.valorDocumento),
      },
    };

    console.log(payload);
  };

  const documentoDigitsLength = watch('documento').length;
  const contatoDigitsLength = watch('contato').length;

  const [servicosSearchTerm, setServicosSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<SelectGridValue[]>([]);
  const [custasValues, setCustasValues] =
    useState<CustasValues>(custasDefaultValues);

  const custasTotal = useMemo(
    () =>
      Object.values(custasValues).reduce(
        (accumulator, currentValue) => accumulator + getNumericValue(currentValue),
        0
      ),
    [custasValues]
  );

  const handleCustasFieldChange = (fieldKey: CustasFieldKey, inputValue: string) => {
    setCustasValues((previousValues) => ({
      ...previousValues,
      [fieldKey]: currencyMask(inputValue),
    }));
  };

  const handleOpenCustasModal = async () => {
    const result = await openModal({
      kind: 'alert',
      title: 'Custas',
      size: 'lg',
      className: 'max-h-[90vh] max-w-[min(96vw,1280px)] overflow-auto',
      confirmLabel: 'Fechar',
      showCloseButton: true,
      renderContent: () => (
        <div className="custom-scrollbar max-h-[60vh] space-y-4 overflow-y-auto pr-1">
          <div className="dashboard-card-soft space-y-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-(--titulos) dark:text-(--dark-titulos)">
                Tabela de Emolumentos - CGJ/RJ
              </h3>
              <span className="text-xs font-medium text-(--cor-texto)/70 dark:text-(--dark-cor-texto)/75">
                Consulta de referencia
              </span>
            </div>

            <CustomSelectGrid<CustasTabelaRow>
              // readOnly={true}
              maxSelected={1}
              rows={custasTabelaRows}
              rowIdKey="id"
              showSelectionColumn={false}
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
          </div>

          <div className="dashboard-card-soft space-y-3 p-4">
            <h3 className="text-sm font-semibold text-(--titulos) dark:text-(--dark-titulos)">
              Itens Cobrados no Ato
            </h3>

            <CustomSelectGrid<CustasItensAtoRow>
              // readOnly={true}
              
              rows={custasItensAtoRows}
              rowIdKey="id"
              showSelectionColumn={false}
              density="compact"
              roundedClassName="rounded-xl"
              maxHeightClassName="max-h-44 min-h-44"
              scrollViewportClassName="custom-scrollbar"
              tableClassName="min-w-[960px]"
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
                {
                  key: 'qtd',
                  header: 'Qtd.',
                  align: 'center',
                  widthClassName: 'w-16',
                },
                {
                  key: 'total',
                  header: 'Total',
                  align: 'right',
                  widthClassName: 'w-32',
                },
              ]}
            />
          </div>

          <div className="dashboard-card-soft space-y-4 p-4">
            <h3 className="text-sm font-semibold text-(--titulos) dark:text-(--dark-titulos)">
              Composicao das Custas
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {custasFieldDefinitions.map((fieldDefinition) => (
                <CustomInput
                  key={fieldDefinition.key}
                  label={fieldDefinition.label}
                  placeholder={fieldDefinition.placeholder}
                  autoComplete="off"
                  inputMode="numeric"
                  value={custasValues[fieldDefinition.key]}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleCustasFieldChange(
                      fieldDefinition.key,
                      event.target.value
                    );
                  }}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:max-w-sm">
              <CustomInput
                label="Total"
                value={formatCurrencyValue(custasTotal)}
                readOnly={true}
                className="font-semibold"
                leftAdornment={<CurrencyDollarIcon className="size-4" />}
                hint="Valor consolidado automaticamente pela soma dos campos."
              />
            </div>
          </div>
        </div>
      ),
    });

    if (result.status === 'blocked') {
      console.info(
        '[Balcao] Modal de Custas bloqueado: ja existe um modal aberto.'
      );
    }
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

    reset(balcaoDefaultValues);
    setServicosSearchTerm('');
    setSelectedIds([]);
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

    resetField('documento');
    resetField('contato');
    resetField('nome');
    resetField('email');
    resetField('observacao');
    resetField('horarioUrgencia');
  };

  const handleSubmitWithConfirmation = handleSubmit(async (data) => {
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

    onSubmit(data);
  });

  const filteredServicosOptions = useMemo(() => {
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
    <PageTitle title="Balcão" description="Gerencie lançamentos de balcão">
      {/* Formulário de apresentantes */}
      <form
        onSubmit={handleSubmitWithConfirmation}
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
          description="Insira informações do apresentante."
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
          description="Insira informações sobre o ato"
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
                maxSelected={1}
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
              type="submit"
              title="Salvar"
              onClick={() => console.log('Valores do formulario: ', watch())}
            />
          </div>
        </CardContainer>

        {/* Desrição do recibo */}
        <CardContainer
          title="Descrição do Recibo"
          description="Descrição detalhada do recibo."
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
              onClick={() => console.log('Gerar descrição automática')}
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
            showSelectionColumn={false}
            // selectionMode="single"
            maxSelected={1}
            maxHeightClassName="max-h-80 min-h-80"
            scrollViewportClassName="custom-scrollbar"
            // roundedClassName="rounded-xl"
            rows={recibo}
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

          <div className="flex justify-between items-center align-middle px-2 mt-4">
            <div className="flex">
              <CustomButton
                size="lg"
                type="submit"
                title="Finalizar"
                onClick={() => console.log('Valores do formulario: ', watch())}
              />
            </div>

            <div className="text-end">
              <h1 className="text-xl font-bold">
                Total: R${' '}
                {recibo
                  .reduce(
                    (sum, item) =>
                      sum +
                      parseFloat(
                        item.total.replace('R$ ', '').replace(',', '.')
                      ),
                    0
                  )
                  .toFixed(2)}
              </h1>
              <h2 className="text-lg font-light opacity-95">
                Quantidade de serviços: {recibo.length}
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
