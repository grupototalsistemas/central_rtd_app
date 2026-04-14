import Label from '@/components/form/Label';
import { cn } from '@/utils/cn';
import * as React from 'react';
import type { FieldError } from 'react-hook-form';

type InputError = boolean | string | FieldError | null | undefined;
type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

/**
 * Props do `CustomTextbox`.
 *
 * Funcionamento:
 * - Encapsula um `<textarea />` com estados visuais padronizados.
 * - Repassa props nativas de textarea (maxLength, placeholder etc.).
 * - Permite controle de redimensionamento via `resize`.
 */
export interface CustomTextboxProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
	/** Controle de resize do textarea. */
	resize?: TextareaResize;
	/** Classe para o container externo (`div` raiz). */
	containerClassName?: string;
	/** Classe para o componente de label. */
	labelClassName?: string;
	/** Classe adicional aplicada no `<textarea />`. */
	inputClassName?: string;
	/** Classe para o texto de hint/helper/erro. */
	hintClassName?: string;
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

const resizeClassMap: Record<TextareaResize, string> = {
	none: 'resize-none',
	vertical: 'resize-y',
	horizontal: 'resize-x',
	both: 'resize',
};

/**
 * Textarea reutilizavel com suporte a validacao visual e acessibilidade.
 *
 * Integracao com react-hook-form + zod:
 * - Use `Controller` quando precisar de componente controlado.
 * - Para campos simples, `register` tambem funciona por herdar props nativas.
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   observacao: z
 *     .string()
 *     .min(10, 'Informe ao menos 10 caracteres.')
 *     .max(500, 'Limite de 500 caracteres.'),
 * });
 *
 * type FormValues = z.infer<typeof schema>;
 *
 * const { control, formState: { errors } } = useForm<FormValues>({
 *   resolver: zodResolver(schema),
 *   defaultValues: { observacao: '' },
 * });
 *
 * <Controller
 *   name="observacao"
 *   control={control}
 *   render={({ field }) => (
 *     <CustomTextbox
 *       label="Observacao"
 *       resize="vertical"
 *       error={errors.observacao}
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       ref={field.ref}
 *     />
 *   )}
 * />
 * ```
 */
const CustomTextbox = React.forwardRef<HTMLTextAreaElement, CustomTextboxProps>(
	(
		{
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
			rows = 4,
			resize = 'none',
			containerClassName,
			labelClassName,
			inputClassName,
			hintClassName,
			className,
			'aria-describedby': ariaDescribedBy,
			'aria-invalid': ariaInvalid,
			...rest
		},
		ref
	) => {
		const generatedId = React.useId();
		const textareaId = id ?? name ?? `custom-textbox-${generatedId}`;

		const errorMessage = getErrorMessage(error);
		const isError = Boolean(error) && !disabled;
		const hasSuccess = !isError && success;
		const feedback = errorMessage ?? helperText ?? hint;
		const feedbackId = feedback ? helperId ?? `${textareaId}-hint` : undefined;

		const resolvedAriaDescribedBy = [ariaDescribedBy, feedbackId]
			.filter(Boolean)
			.join(' ')
			.trim();

		const textLikeBaseClasses = cn(
			'min-h-24 w-full rounded-lg border border-transparent appearance-none px-4 py-2.5 text-sm',
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

		return (
			<div className={cn('w-full', containerClassName)}>
				{label ? (
					<Label htmlFor={textareaId} className={labelClassName}>
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

				<textarea
					id={textareaId}
					ref={ref}
					name={name}
					required={required}
					disabled={disabled}
					readOnly={readOnly}
					rows={rows}
					aria-invalid={isError || ariaInvalid ? true : undefined}
					aria-describedby={resolvedAriaDescribedBy || undefined}
					className={cn(
						textLikeBaseClasses,
						textLikeStateClasses,
						resizeClassMap[resize],
						readOnly &&
							'read-only:cursor-default read-only:bg-(--cor-edit) read-only:dark:bg-(--dark-cor-edit)',
						className,
						inputClassName
					)}
					{...rest}
				/>

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

CustomTextbox.displayName = 'CustomTextbox';

export default CustomTextbox;
