import Label from '@/components/form/Label';
import { cn } from '@/utils/cn';
import * as React from 'react';
import type { FieldError } from 'react-hook-form';

type InputError = boolean | string | FieldError | null | undefined;
type SupportedInputType = Exclude<React.HTMLInputTypeAttribute, 'date'>;

/**
 * Props do `CustomInput`.
 *
 * Funcionamento:
 * - Encapsula um `<input />` com estados visuais de erro/sucesso/disabled.
 * - Aceita adornos laterais (`leftAdornment` e `rightAdornment`) para tipos textuais.
 * - Repassa props nativas de input (placeholder, autoComplete, maxLength etc.)
 *   via `React.InputHTMLAttributes`, exceto `type` (tipado por `SupportedInputType`).
 */
export interface CustomInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
	/** Tipo do input (exceto `date`, que possui componente proprio). */
	type?: SupportedInputType;
	/** Rotulo exibido acima do campo. */
	label?: React.ReactNode;
	/** Texto de apoio exibido abaixo quando nao ha erro. */
	hint?: React.ReactNode;
	/** Texto auxiliar abaixo do campo (prioridade sobre `hint`). */
	helperText?: React.ReactNode;
	/** ID customizado para o texto de feedback (aria-describedby). */
	helperId?: string;
	/** Estado de erro (boolean, string ou FieldError do react-hook-form). */
	error?: InputError;
	/** Estado visual de sucesso quando nao ha erro. */
	success?: boolean;
	/** Classe para o container externo (`div` raiz). */
	containerClassName?: string;
	/** Classe para o componente de label. */
	labelClassName?: string;
	/** Classe adicional aplicada no `<input />`. */
	inputClassName?: string;
	/** Classe para o texto de hint/helper/erro. */
	hintClassName?: string;
	/** Conteudo renderizado no lado esquerdo (icone, prefixo etc.). */
	leftAdornment?: React.ReactNode;
	/** Conteudo renderizado no lado direito (icone, sufixo etc.). */
	rightAdornment?: React.ReactNode;
}

const getErrorMessage = (error: InputError): string | undefined => {
	if (typeof error === 'string') {
		return error;
	}

	if (typeof error === 'object' && error && 'message' in error) {
		const message = error.message;
		return typeof message === 'string' ? message : undefined;
	}

	return undefined;
};

/**
 * Campo de entrada reutilizavel com suporte a tema, acessibilidade e feedback visual.
 *
 * Integracao com react-hook-form + zod:
 * - Pode ser usado com `register` (campos simples) ou com `Controller`.
 * - Passe `error={errors.campo}` para mostrar mensagens do schema Zod.
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   nome: z.string().min(1, 'Informe o nome.'),
 * });
 *
 * type FormValues = z.infer<typeof schema>;
 *
 * const { control, formState: { errors } } = useForm<FormValues>({
 *   resolver: zodResolver(schema),
 *   defaultValues: { nome: '' },
 * });
 *
 * <Controller
 *   name="nome"
 *   control={control}
 *   render={({ field }) => (
 *     <CustomInput
 *       label="Nome"
 *       error={errors.nome}
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       ref={field.ref}
 *     />
 *   )}
 * />
 * ```
 */
const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
	(
		{
			type = 'text',
			id,
			name,
			label,
			required,
			hint,
			helperText,
			helperId,
			error,
			success = false,
			disabled = false,
			readOnly = false,
			containerClassName,
			labelClassName,
			inputClassName,
			hintClassName,
			leftAdornment,
			rightAdornment,
			className,
			'aria-describedby': ariaDescribedBy,
			'aria-invalid': ariaInvalid,
			...rest
		},
		ref
	) => {
		const generatedId = React.useId();
		const inputId = id ?? name ?? `custom-input-${generatedId}`;

		const inputType = type as React.HTMLInputTypeAttribute;
		const isRangeType = inputType === 'range';
		const isFileType = inputType === 'file';
		const isColorType = inputType === 'color';
		const supportsAdornment = !isRangeType && !isFileType && !isColorType;

		const errorMessage = getErrorMessage(error);
		const isError = Boolean(error) && !disabled;
		const hasSuccess = !isError && success;
		const feedback = errorMessage ?? helperText ?? hint;
		const feedbackId = feedback ? helperId ?? `${inputId}-hint` : undefined;

		const resolvedAriaDescribedBy = [ariaDescribedBy, feedbackId]
			.filter(Boolean)
			.join(' ')
			.trim();

		const textLikeBaseClasses = cn(
			'h-11 w-full rounded-lg border border-transparent appearance-none px-4 py-2.5 text-sm',
			'placeholder:text-gray-400 transition-all duration-200',
			'focus:outline-hidden dark:placeholder:text-white/30'
		);

		const textLikeStateClasses = disabled
			? 'cursor-not-allowed bg-gray-100 text-gray-500 opacity-80 ring-1 ring-(--cor-borda)/40 dark:bg-gray-800 dark:text-gray-400 dark:ring-(--dark-cor-borda)/45'
			: isError
				? 'bg-(--cor-edit) text-error-800 ring-1 ring-error-500/35 focus:ring-2 focus:ring-error-500/45 dark:bg-(--dark-cor-edit) dark:text-error-400 dark:ring-error-400/45 dark:focus:ring-error-400/55'
				: hasSuccess
					? 'bg-(--cor-edit) text-(--cor-texto) ring-1 ring-success-400/45 focus:ring-2 focus:ring-success-500/45 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-success-500/45 dark:focus:ring-success-500/55'
					: 'bg-(--cor-edit) text-(--cor-texto) ring-1 ring-(--cor-borda)/60 focus:ring-2 focus:ring-brand-500/28 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-(--dark-cor-borda)/65 dark:focus:ring-brand-500/35';

		const rangeBaseClasses = cn(
			'h-2.5 w-full cursor-pointer appearance-none rounded-full border-0 px-0 py-0 shadow-none',
			'bg-gray-200 focus:outline-hidden focus:ring-0 dark:bg-white/10'
		);

		const rangeStateClasses = disabled
			? 'cursor-not-allowed opacity-50'
			: isError
				? 'accent-error-500'
				: hasSuccess
					? 'accent-success-500'
					: 'accent-brand-600 dark:accent-brand-400';

		const inputTypeClasses = cn({
			'pr-10': supportsAdornment && rightAdornment,
			'pl-10': supportsAdornment && leftAdornment,
			"[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none":
				inputType === 'number',
			'file:mr-4 file:h-full file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-(--cor-borda) file:bg-(--background) file:px-3 file:text-sm file:font-medium file:text-(--cor-texto) dark:file:border-(--dark-cor-borda) dark:file:bg-(--dark-background) dark:file:text-(--dark-cor-texto)':
				isFileType,
			'h-11 cursor-pointer p-1': isColorType,
			"[&::-webkit-search-cancel-button]:cursor-pointer [&::-webkit-search-cancel-button]:opacity-70":
				inputType === 'search',
		});

		return (
			<div className={cn('w-full', containerClassName)}>
				{label ? (
					<Label htmlFor={inputId} className={labelClassName}>
						<span className="inline-flex items-center gap-1 text-(--cor-texto) dark:text-(--dark-cor-texto)">
							{label}
							{required ? (
								<span aria-hidden="true" className="text-error-500">
									*
								</span>
							) : null}
						</span>
					</Label>
				) : null}

				<div className={cn('relative', isRangeType && 'pt-2')}>
					{supportsAdornment && leftAdornment ? (
						<span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500">
							{leftAdornment}
						</span>
					) : null}

					<input
						id={inputId}
						ref={ref}
						name={name}
						type={inputType}
						required={required}
						disabled={disabled}
						readOnly={readOnly}
						aria-invalid={isError || ariaInvalid ? true : undefined}
						aria-describedby={resolvedAriaDescribedBy || undefined}
						className={cn(
							isRangeType ? rangeBaseClasses : textLikeBaseClasses,
							isRangeType ? rangeStateClasses : textLikeStateClasses,
							readOnly &&
								'read-only:cursor-default read-only:bg-(--cor-edit) read-only:dark:bg-(--dark-cor-edit)',
							inputTypeClasses,
							className,
							inputClassName
						)}
						{...rest}
					/>

					{supportsAdornment && rightAdornment ? (
						<span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-gray-500">
							{rightAdornment}
						</span>
					) : null}
				</div>

				{feedback ? (
					<p
						id={feedbackId}
						className={cn(
							'mt-1.5 text-xs',
							isError
								? 'text-error-500'
								: hasSuccess
									? 'text-success-600 dark:text-success-400'
									: 'text-gray-500 dark:text-gray-400',
							hintClassName
						)}
					>
						{feedback}
					</p>
				) : null}
			</div>
		);
	}
);

CustomInput.displayName = 'CustomInput';

export default CustomInput;
