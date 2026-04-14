import Label from '@/components/form/Label';
import { cn } from '@/utils/cn';
import * as React from 'react';
import type { FieldError } from 'react-hook-form';

type InputError = boolean | string | FieldError | null | undefined;
export type SelectGridValue = string | number;

/** Item exibido no grid de selecao. */
export interface CustomSelectDataItem {
	/** Valor tecnico do item. */
	value: SelectGridValue;
	/** Conteudo principal do item. */
	label: React.ReactNode;
	/** Conteudo secundario exibido abaixo do label. */
	description?: React.ReactNode;
	/** Desabilita interacao com o item. */
	disabled?: boolean;
	/** Conteudo opcional na esquerda do item. */
	leftAdornment?: React.ReactNode;
	/** Conteudo opcional na direita do item. */
	rightAdornment?: React.ReactNode;
	/** Classe adicional aplicada somente no botao do item. */
	className?: string;
}

type GridGap = 'sm' | 'md' | 'lg';
type GridColumns = 1 | 2 | 3 | 4 | 5 | 6;

interface RenderItemContext {
	selected: boolean;
	disabled: boolean;
	blockedByMax: boolean;
}

/**
 * Props do `CustomSelectGrid`.
 *
 * Funcionamento:
 * - Selecao multipla em layout de grade.
 * - Suporta minimo (`minSelected`) e maximo (`maxSelected`) de selecoes.
 * - Pode operar em modo controlado (`value`) ou nao controlado (`defaultValue`).
 */
export interface CustomSelectDataProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
	/** ID da area interativa para acessibilidade. */
	id?: string;
	/** Nome logico do campo (exposto em `data-name`). */
	name?: string;
	/** Rotulo exibido acima do grid. */
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
	/** Desabilita toda interacao no grid. */
	disabled?: boolean;
	/** Mantem leitura sem permitir alteracao das selecoes. */
	readOnly?: boolean;
	/** Indica obrigatoriedade visual no rotulo. */
	required?: boolean;
	/** Itens disponiveis para selecao. */
	items: CustomSelectDataItem[];
	/** Valores selecionados no modo controlado. */
	value?: SelectGridValue[] | null;
	/** Valores iniciais no modo nao controlado. */
	defaultValue?: SelectGridValue[] | null;
	/** Callback disparado a cada alteracao de selecao. */
	onChange?: (value: SelectGridValue[]) => void;
	/** Callback disparado quando tenta selecionar acima do limite. */
	onLimitReached?: (value: SelectGridValue[], maxSelected: number) => void;
	/** Quantidade minima de itens exigida para estado valido local. */
	minSelected?: number;
	/** Quantidade maxima de itens permitida. */
	maxSelected?: number;
	/** Mensagem custom para erro de minimo nao atendido. */
	minSelectionMessage?: React.ReactNode;
	/** Texto exibido quando `items` estiver vazio. */
	emptyStateText?: React.ReactNode;
	/** Numero de colunas do grid. */
	columns?: GridColumns;
	/** Espacamento entre itens da grade. */
	gap?: GridGap;
	/** Classe para o container externo (`div` raiz). */
	containerClassName?: string;
	/** Classe para o componente de label. */
	labelClassName?: string;
	/** Classe adicional no bloco visual que envolve os itens. */
	gridClassName?: string;
	/** Classe base adicional aplicada a todos os itens. */
	itemClassName?: string;
	/** Classe adicional apenas para itens selecionados. */
	selectedItemClassName?: string;
	/** Classe adicional apenas para itens nao selecionados. */
	unselectedItemClassName?: string;
	/** Classe para o texto de hint/helper/erro. */
	hintClassName?: string;
	/** Render custom de cada item com contexto de estado. */
	renderItemContent?: (
		item: CustomSelectDataItem,
		context: RenderItemContext
	) => React.ReactNode;
	/** IDs auxiliares de acessibilidade para descricao. */
	'aria-describedby'?: string;
	/** Estado aria de erro adicional (alem de `error`). */
	'aria-invalid'?: boolean;
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

const columnClassMap: Record<GridColumns, string> = {
	1: 'grid-cols-1',
	2: 'grid-cols-2',
	3: 'grid-cols-3',
	4: 'grid-cols-4',
	5: 'grid-cols-5',
	6: 'grid-cols-6',
};

const gapClassMap: Record<GridGap, string> = {
	sm: 'gap-2',
	md: 'gap-3',
	lg: 'gap-4',
};

const getValueKey = (value: SelectGridValue): string =>
	`${typeof value}:${String(value)}`;

const normalizeValueList = (
	value: SelectGridValue[] | null | undefined,
	allowedKeys?: Set<string>
): SelectGridValue[] => {
	if (!Array.isArray(value)) {
		return [];
	}

	const seen = new Set<string>();
	const normalized: SelectGridValue[] = [];

	for (const item of value) {
		if (typeof item !== 'string' && typeof item !== 'number') {
			continue;
		}

		const key = getValueKey(item);
		if (seen.has(key)) {
			continue;
		}

		if (allowedKeys && !allowedKeys.has(key)) {
			continue;
		}

		seen.add(key);
		normalized.push(item);
	}

	return normalized;
};

const getMinSelectionFallbackText = (minSelected: number): string => {
	return minSelected === 1
		? 'Selecione ao menos 1 item.'
		: `Selecione ao menos ${minSelected} itens.`;
};

/**
 * Grid de selecao multipla com validacoes locais de minimo e maximo.
 *
 * Integracao com react-hook-form + zod:
 * - Use `Controller` para mapear `value` (array) e `onChange`.
 * - Valide tamanho minimo/maximo no schema com `z.array(...).min(...).max(...)`.
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   permissoes: z
 *     .array(z.union([z.string(), z.number()]))
 *     .min(1, 'Selecione ao menos 1 permissao.')
 *     .max(3, 'Selecione no maximo 3 permissoes.'),
 * });
 *
 * type FormValues = z.infer<typeof schema>;
 *
 * const { control, formState: { errors } } = useForm<FormValues>({
 *   resolver: zodResolver(schema),
 *   defaultValues: { permissoes: [] },
 * });
 *
 * <Controller
 *   name="permissoes"
 *   control={control}
 *   render={({ field }) => (
 *     <CustomSelectData
 *       label="Permissoes"
 *       items={itensPermissao}
 *       minSelected={1}
 *       maxSelected={3}
 *       error={errors.permissoes}
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       ref={field.ref as React.Ref<HTMLDivElement>}
 *     />
 *   )}
 * />
 * ```
 */
const CustomSelectData = React.forwardRef<HTMLDivElement, CustomSelectDataProps>(
	(
		{
			id,
			name,
			label,
			hint,
			helperText,
			helperId,
			error,
			success = false,
			disabled = false,
			readOnly = false,
			required = false,
			items,
			value,
			defaultValue,
			onChange,
			onLimitReached,
			minSelected = 0,
			maxSelected,
			minSelectionMessage,
			emptyStateText = 'Nenhum item disponível.',
			columns = 2,
			gap = 'md',
			containerClassName,
			labelClassName,
			gridClassName,
			itemClassName,
			selectedItemClassName,
			unselectedItemClassName,
			hintClassName,
			renderItemContent,
			className,
			onBlur,
			'aria-describedby': ariaDescribedBy,
			'aria-invalid': ariaInvalid,
			...rest
		},
		ref
	) => {
		const generatedId = React.useId();
		const inputId = id ?? name ?? `custom-select-grid-${generatedId}`;

		const normalizedMinSelected = Math.max(0, minSelected);
		const normalizedMaxSelected =
			typeof maxSelected === 'number'
				? Math.max(normalizedMinSelected, maxSelected)
				: undefined;

		const allowedKeys = React.useMemo(() => {
			return new Set(items.map((item) => getValueKey(item.value)));
		}, [items]);

		const isControlled = value !== undefined;
		const [uncontrolledValue, setUncontrolledValue] = React.useState<
			SelectGridValue[]
		>(() => normalizeValueList(defaultValue, allowedKeys));
		const [isTouched, setIsTouched] = React.useState(false);

		const selectedValues = React.useMemo(() => {
			const sourceValue = isControlled ? value : uncontrolledValue;
			return normalizeValueList(sourceValue, allowedKeys);
		}, [allowedKeys, isControlled, uncontrolledValue, value]);

		const selectedKeySet = React.useMemo(() => {
			return new Set(selectedValues.map((item) => getValueKey(item)));
		}, [selectedValues]);

		const maxReached =
			typeof normalizedMaxSelected === 'number' &&
			selectedValues.length >= normalizedMaxSelected;

		const externalErrorMessage = getErrorMessage(error);
		const hasExternalError = Boolean(error) && !disabled;
		const hasLocalMinError =
			!hasExternalError &&
			!disabled &&
			isTouched &&
			normalizedMinSelected > 0 &&
			selectedValues.length < normalizedMinSelected;
		const isError = hasExternalError || hasLocalMinError;
		const hasSuccess = !isError && success;

		const localMinErrorMessage = hasLocalMinError
			? minSelectionMessage ?? getMinSelectionFallbackText(normalizedMinSelected)
			: undefined;
		const feedback = externalErrorMessage ?? localMinErrorMessage ?? helperText ?? hint;
		const feedbackId = feedback ? helperId ?? `${inputId}-hint` : undefined;

		const resolvedAriaDescribedBy = [ariaDescribedBy, feedbackId]
			.filter(Boolean)
			.join(' ')
			.trim();

		const setValueAndNotify = React.useCallback(
			(nextValue: SelectGridValue[]) => {
				if (!isControlled) {
					setUncontrolledValue(nextValue);
				}

				onChange?.(nextValue);
			},
			[isControlled, onChange]
		);

		const handleToggleItem = React.useCallback(
			(item: CustomSelectDataItem) => {
				if (disabled || readOnly || item.disabled) {
					return;
				}

				setIsTouched(true);

				const itemKey = getValueKey(item.value);
				const alreadySelected = selectedKeySet.has(itemKey);

				if (alreadySelected) {
					setValueAndNotify(
						selectedValues.filter((selectedItem) => {
							return getValueKey(selectedItem) !== itemKey;
						})
					);
					return;
				}

				if (
					typeof normalizedMaxSelected === 'number' &&
					selectedValues.length >= normalizedMaxSelected
				) {
					onLimitReached?.(selectedValues, normalizedMaxSelected);
					return;
				}

				setValueAndNotify([...selectedValues, item.value]);
			},
			[
				disabled,
				normalizedMaxSelected,
				onLimitReached,
				readOnly,
				selectedKeySet,
				selectedValues,
				setValueAndNotify,
			]
		);

		const handleBlurCapture = React.useCallback(
			(event: React.FocusEvent<HTMLDivElement>) => {
				const nextFocusedElement = event.relatedTarget as Node | null;
				if (nextFocusedElement && event.currentTarget.contains(nextFocusedElement)) {
					return;
				}

				setIsTouched(true);
				onBlur?.(event);
			},
			[onBlur]
		);

		const containerStateClasses = disabled
			? 'bg-gray-100 text-gray-500 opacity-80 ring-1 ring-(--cor-borda)/40 dark:bg-gray-800 dark:text-gray-400 dark:ring-(--dark-cor-borda)/45'
			: isError
				? 'bg-(--cor-edit) text-error-800 ring-1 ring-error-500/35 focus-within:ring-2 focus-within:ring-error-500/45 dark:bg-(--dark-cor-edit) dark:text-error-400 dark:ring-error-400/45 dark:focus-within:ring-error-400/55'
				: hasSuccess
					? 'bg-(--cor-edit) text-(--cor-texto) ring-1 ring-success-400/45 focus-within:ring-2 focus-within:ring-success-500/45 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-success-500/45 dark:focus-within:ring-success-500/55'
					: 'bg-(--cor-edit) text-(--cor-texto) ring-1 ring-(--cor-borda)/60 focus-within:ring-2 focus-within:ring-brand-500/28 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-(--dark-cor-borda)/65 dark:focus-within:ring-brand-500/35';

		const gridClasses = cn(
			'grid rounded-lg border border-transparent p-2.5 transition-all duration-200',
			columnClassMap[columns],
			gapClassMap[gap],
			containerStateClasses,
			readOnly && 'cursor-default',
			className,
			gridClassName
		);

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

				<div
					id={inputId}
					ref={ref}
					aria-label={typeof label === 'string' ? label : undefined}
					aria-describedby={resolvedAriaDescribedBy || undefined}
					aria-invalid={isError || ariaInvalid ? true : undefined}
					onBlurCapture={handleBlurCapture}
					data-name={name}
					{...rest}
				>
					<div className={gridClasses}>
						{items.length === 0 ? (
							<p className="col-span-full px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
								{emptyStateText}
							</p>
						) : (
							items.map((item) => {
								const itemKey = getValueKey(item.value);
								const selected = selectedKeySet.has(itemKey);
								const blockedByMax =
									!selected &&
									maxReached &&
									typeof normalizedMaxSelected === 'number';
								const itemDisabled =
									disabled || readOnly || item.disabled || blockedByMax;

								const itemStateClasses = itemDisabled
									? 'cursor-not-allowed bg-gray-100 text-gray-500 opacity-80 ring-1 ring-(--cor-borda)/40 dark:bg-gray-800 dark:text-gray-400 dark:ring-(--dark-cor-borda)/45'
									: selected
										? 'bg-(--cor-edit) text-(--cor-texto) ring-2 ring-brand-500/38 hover:ring-brand-500/50 focus:ring-2 focus:ring-brand-500/45 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-brand-500/45 dark:hover:ring-brand-500/55 dark:focus:ring-brand-500/55'
										: 'bg-(--cor-edit) text-(--cor-texto) ring-1 ring-(--cor-borda)/60 hover:ring-brand-500/28 focus:ring-2 focus:ring-brand-500/28 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-(--dark-cor-borda)/65 dark:hover:ring-brand-500/35 dark:focus:ring-brand-500/35';

								const indicatorClasses = selected
									? 'border-brand-600 bg-brand-600 dark:border-brand-400 dark:bg-brand-400'
									: 'border-(--cor-borda) bg-transparent dark:border-(--dark-cor-borda)';

								return (
									<button
										key={itemKey}
										type="button"
										aria-pressed={selected}
										aria-disabled={itemDisabled}
										disabled={itemDisabled}
										onClick={() => handleToggleItem(item)}
										className={cn(
											'group flex min-h-11 w-full items-center gap-2 rounded-md border border-transparent px-3 py-2 text-left text-sm transition-all duration-200 focus:outline-hidden',
											itemStateClasses,
											selected
												? selectedItemClassName
												: unselectedItemClassName,
											itemClassName,
											item.className
										)}
									>
										{renderItemContent ? (
											renderItemContent(item, {
												selected,
												disabled: itemDisabled,
												blockedByMax,
											})
										) : (
											<>
												{item.leftAdornment ? (
													<span className="text-gray-500 dark:text-gray-400">
														{item.leftAdornment}
													</span>
												) : null}

												<span
													aria-hidden="true"
													className={cn(
														'h-4 w-4 shrink-0 rounded-full border transition-all duration-200',
														indicatorClasses
													)}
												/>

												<span className="min-w-0 flex-1">
													<span className="line-clamp-1 block font-medium">{item.label}</span>
													{item.description ? (
														<span className="line-clamp-1 block text-xs text-gray-500 dark:text-gray-400">
															{item.description}
														</span>
													) : null}
												</span>

												{item.rightAdornment ? (
													<span className="text-gray-500 dark:text-gray-400">
														{item.rightAdornment}
													</span>
												) : null}
											</>
										)}
									</button>
								);
							})
						)}
					</div>
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

CustomSelectData.displayName = 'CustomSelectData';

export default CustomSelectData;
