'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import CardContainer from '@/components/card/CardContainer';
import CustomInput from '@/components/inputs/CustomInput';
import PageTitle from '@/components/page/PageTitle';
import Button from '@/components/ui/button/Button';
import { formatCpfCnpj, validarCpfCnpj } from '@/utils/formatCpfCnpj';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomTextbox from '@/components/inputs/CustomTextbox';
import CustomSelect from '@/components/inputs/CustomSelect';
import CustomDateInput from '@/components/inputs/CustomDateInput';
import CustomSearch from '@/components/inputs/CustomSearch';
import CustomSelectGrid from '@/components/inputs/CustomSelectGrid';
import CustomButton from '@/components/buttons/CustomButton';

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
});

type FormValues = z.infer<typeof balcaoFormSchema>;

export default function BalcaoPage() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // Zod concentra as regras de validação e saneamento final antes do submit.
    resolver: zodResolver(balcaoFormSchema),
    defaultValues: {
      documento: '',
      contato: '',
      nome: '',
      email: '',
      observacao: '',
      horarioUrgencia: '',
    },
    // Primeira validação ao tocar/sair do campo e, depois disso, revalida em cada mudança.
    mode: 'onTouched',
    reValidateMode: 'onChange',
    delayError: 200,
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  const documentoDigitsLength = watch('documento').length;
  const contatoDigitsLength = watch('contato').length;
  return (
    <PageTitle title="Balcão" description="Gerencie lançamentos de balcão">
      {/* Formulário de apresentantes */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="col-span-full space-y-4"
        noValidate
      >
        {/* Botões utilitários */}
        <div className="flex justify-end gap-6">
          <CustomButton
            size="lg"
            title="Limpar Apresentante"
            onClick={() => {}}
          />
          <CustomButton
            backgroundColor="#940100"
            hoverBackgroundColor="#F9A526"
            size="lg"
            title="Limpar tudo"
            onClick={() => {}}
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {/* Documento */}
            <Controller
              name="documento"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Documento CPF/CNPJ"
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
                    field.onChange(normalizeNameForDisplay(event.target.value));
                  }}
                  ref={field.ref}
                />
              )}
            />

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

            {/* Email */}
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
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(event.target.value);
                  }}
                  ref={field.ref}
                />
              )}
            />

            {/* Horario de Urgencia */}
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
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(formatHourWithColon(event.target.value));
                  }}
                  ref={field.ref}
                  className="max-w-50"
                />
              )}
            />
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
            <CustomSelect
              label="Naturezas"
              options={[
                { value: 'Registro', label: 'REGISTRO' },
                { value: 'Notificação', label: 'NOTIFICACAO' },
                { value: 'DUT', label: 'DUT' },
                { value: 'Certidão', label: 'CERTIDAO' },
                { value: 'Averbação', label: 'AVERBACAO' },
                { value: 'Matrícula', label: 'MATRICULA' },
              ]}
              placeholder="Selecione uma opção"
            />

            {/* Tipo de entradas */}
            <CustomSelect
              label="Tipo de entradas"
              options={[
                { value: 'opcao1', label: 'Opção 1' },
                { value: 'opcao2', label: 'Opção 2' },
                { value: 'opcao3', label: 'Opção 3' },
              ]}
              placeholder="Selecione uma opção"
            />

            {/* Tipos de cobrança */}
            <CustomSelect
              label="Tipo de cobrança"
              options={[
                { value: 'opcao1', label: 'Opção 1' },
                { value: 'opcao2', label: 'Opção 2' },
                { value: 'opcao3', label: 'Opção 3' },
              ]}
              placeholder="Selecione uma opção"
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
            <CustomInput
              label="Valor"
              placeholder="Digite o valor do ato"
              autoComplete="off"
              type="number"
            />

            {/* Protocolo */}
            <CustomInput
              label="Protocolo"
              placeholder="Digite o protocolo"
              autoComplete="off"
              type="number"
            />

            {/* Data da entrada */}
            <CustomDateInput
              label="Data da Entrada"
              placeholder="DD/MM/AAAA"
              autoComplete="off"
              showDatepicker={true}
            />
          </div>

          <CustomInput
            label="Pesquisar"
            placeholder="Digite a descrição ou código"
          />

          <CustomSelectGrid
            className="max-h-60 overflow-auto sm:grid-cols-1 md:grid-cols-2"
            label="Serviços"
            maxSelected={1}
            items={[
              {
                value: '1',
                label:
                  'Registro de Título, Documento ou Papel com Valor Declarado',
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
            ]}
          />

          {/* Configurações do ato */}
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
            <CustomInput
              label="Quantidade"
              placeholder="0"
              autoComplete="off"
              type="number"
              defaultValue={1}
            />

            <CustomInput
              label="Nomes"
              placeholder="0"
              autoComplete="off"
              type="number"
              defaultValue={0}
            />

            <CustomInput
              label="Páginas"
              placeholder="0"
              autoComplete="off"
              type="number"
              defaultValue={0}
            />

            <CustomInput
              label="Vias"
              placeholder="0"
              autoComplete="off"
              type="number"
              defaultValue={0}
            />

            <CustomInput
              label="Diligências"
              placeholder="0"
              autoComplete="off"
              type="number"
              defaultValue={0}
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
          <div className="flex justify-end">
            <CustomButton
              size="lg"
              type="submit"
              title="Finalizar"
              onClick={() => console.log('Valores do formulario: ', watch())}
            />

            {/* <Button
            type="submit"
            size="sm"
            loading={isSubmitting}
            className="bg-(--central-azul) text-(--texto-button) hover:opacity-90"
            onClick={() => console.log('Valores do formulario: ', watch())}
          >
            Salvar
          </Button> */}
          </div>
        </CardContainer>

        {/* Botão de enviar */}
      </form>
    </PageTitle>
  );
}
