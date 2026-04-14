import Label from '@/components/form/Label';
import { cn } from '@/utils/cn';
import * as React from 'react';
import type { FieldError } from 'react-hook-form';
import { createPortal } from 'react-dom';

type SelectError = boolean | string | FieldError | null | undefined;
type SelectValue = string | number;

interface DropdownPosition {
	left: number;
	top: number;
	width: number;
	maxListHeight: number;
}

/** Opcao exibida no dropdown do select. */
export interface CustomSelectOption {
	/** Valor de dominio da opcao. */
	value: SelectValue;
	/** Texto exibido para o usuario. */
	label: string;
	/** Quando true, impede selecao e navegacao por teclado na opcao. */
	disabled?: boolean;
}

/**
 * Props do `CustomSelect`.
 *
 * Funcionamento:
 * - Select customizado com suporte a modo controlado e nao controlado.
 * - Pode operar como botao (nao pesquisavel) ou input combobox (pesquisavel).
 * - Renderiza dropdown via portal, com ajuste automatico de posicao no viewport.
 */
export interface CustomSelectProps {
	/** ID do campo para label/acessibilidade. */
	id?: string;
	/** Nome enviado em formulario via input hidden. */
	name?: string;
	/** Rotulo exibido acima do campo. */
	label?: React.ReactNode;
	/** Placeholder quando nao ha opcao selecionada. */
	placeholder?: React.ReactNode;
	/** Texto de apoio exibido abaixo quando nao ha erro. */
	hint?: React.ReactNode;
	/** Texto auxiliar abaixo do campo (prioridade sobre `hint`). */
	helperText?: React.ReactNode;
	/** ID customizado para o texto de feedback (aria-describedby). */
	helperId?: string;
	/** Estado de erro (boolean, string ou FieldError do react-hook-form). */
	error?: SelectError;
	/** Estado visual de sucesso quando nao ha erro. */
	success?: boolean;
	/** Desabilita interacao com campo e dropdown. */
	disabled?: boolean;
	/** Mantem leitura sem permitir alteracao de valor. */
	readOnly?: boolean;
	/** Marca o campo como obrigatorio no input hidden. */
	required?: boolean;
	/** Lista completa de opcoes disponiveis. */
	options: CustomSelectOption[];
	/** Valor controlado selecionado. */
	value?: SelectValue | null;
	/** Valor inicial para modo nao controlado. */
	defaultValue?: SelectValue | null;
	/** Callback disparado ao selecionar uma opcao valida. */
	onChange?: (value: SelectValue | null) => void;
	/** Habilita input de busca dentro do campo. */
	searchable?: boolean;
	/** Placeholder do input de busca quando dropdown aberto. */
	searchPlaceholder?: string;
	/** Texto exibido quando filtro de busca nao encontra resultados. */
	noOptionsText?: React.ReactNode;
	/** Classe para o container externo (`div` raiz). */
	containerClassName?: string;
	/** Classe para o componente de label. */
	labelClassName?: string;
	/** Classe adicional no gatilho (`input` ou `button`). */
	inputClassName?: string;
	/** Classe adicional no painel de dropdown. */
	dropdownClassName?: string;
	/** Z-index aplicado ao dropdown renderizado em portal. */
	dropdownZIndex?: number;
	/** Classe para o texto de hint/helper/erro. */
	hintClassName?: string;
	/** Conteudo exibido no lado esquerdo do campo. */
	leftAdornment?: React.ReactNode;
	/** Conteudo exibido no lado direito, antes da seta. */
	rightAdornment?: React.ReactNode;
	/** Classe adicional no campo principal. */
	className?: string;
	/** Define foco automatico no carregamento. */
	autoFocus?: boolean;
	/** Controla ordem de tabulacao do gatilho. */
	tabIndex?: number;
	/** Handler de foco do gatilho. */
	onFocus?: React.FocusEventHandler<HTMLButtonElement | HTMLInputElement>;
	/** Handler de blur do gatilho. */
	onBlur?: React.FocusEventHandler<HTMLButtonElement | HTMLInputElement>;
	/** IDs auxiliares de acessibilidade para descricao. */
	'aria-describedby'?: string;
	/** Estado aria de erro adicional (alem de `error`). */
	'aria-invalid'?: boolean;
}

const getErrorMessage = (error: SelectError): string | undefined => {
	if (typeof error === 'string') {
		return error;
	}

	if (typeof error === 'object' && error && 'message' in error) {
		const message = error.message;
		return typeof message === 'string' ? message : undefined;
	}

	return undefined;
};

const getInitialHighlightedIndex = (
	items: CustomSelectOption[],
	selectedValue: SelectValue | null | undefined
): number => {
	if (items.length === 0) {
		return -1;
	}

	const selectedIndex = items.findIndex(
		(item) => item.value === selectedValue && !item.disabled
	);

	if (selectedIndex >= 0) {
		return selectedIndex;
	}

	return items.findIndex((item) => !item.disabled);
};

const findNextEnabledIndex = (
	items: CustomSelectOption[],
	startIndex: number,
	direction: 1 | -1
): number => {
	if (items.length === 0) {
		return -1;
	}

	let nextIndex = startIndex;
	for (let step = 0; step < items.length; step += 1) {
		nextIndex = (nextIndex + direction + items.length) % items.length;
		if (!items[nextIndex]?.disabled) {
			return nextIndex;
		}
	}

	return -1;
};

/**
 * Select customizado com suporte a busca, teclado e portal para dropdown.
 *
 * Integracao com react-hook-form + zod:
 * - Use `Controller` para mapear `value`/`onChange`.
 * - Passe `error={errors.campo}` para refletir mensagens validadas por Zod.
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   perfilId: z.union([z.string(), z.number()]).nullable().refine(Boolean, {
 *     message: 'Selecione um perfil.',
 *   }),
 * });
 *
 * type FormValues = z.infer<typeof schema>;
 *
 * const { control, formState: { errors } } = useForm<FormValues>({
 *   resolver: zodResolver(schema),
 *   defaultValues: { perfilId: null },
 * });
 *
 * <Controller
 *   name="perfilId"
 *   control={control}
 *   render={({ field }) => (
 *     <CustomSelect
 *       label="Perfil"
 *       options={perfis}
 *       searchable
 *       error={errors.perfilId}
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       ref={field.ref}
 *     />
 *   )}
 * />
 * ```
 */
const CustomSelect = React.forwardRef<
	HTMLButtonElement | HTMLInputElement,
	CustomSelectProps
>(
	(
		{
			id,
			name,
			label,
			placeholder = 'Selecione uma opção',
			hint,
			helperText,
			helperId,
			error,
			success = false,
			disabled = false,
			readOnly = false,
			required = false,
			options,
			value,
			defaultValue = null,
			onChange,
			searchable = false,
			searchPlaceholder = 'Pesquisar...',
			noOptionsText = 'Nenhuma opção encontrada',
			containerClassName,
			labelClassName,
			inputClassName,
			dropdownClassName,
			dropdownZIndex = 1200,
			hintClassName,
			leftAdornment,
			rightAdornment,
			className,
			autoFocus,
			tabIndex,
			onBlur,
			onFocus,
			'aria-describedby': ariaDescribedBy,
			'aria-invalid': ariaInvalid,
		},
		ref
	) => {
		const generatedId = React.useId();
		const inputId = id ?? name ?? `custom-select-${generatedId}`;
		const listboxId = `${inputId}-listbox`;
		const wrapperRef = React.useRef<HTMLDivElement>(null);
		const dropdownRef = React.useRef<HTMLDivElement>(null);
		const [isClient, setIsClient] = React.useState(false);

		const isControlled = value !== undefined;
		const [uncontrolledValue, setUncontrolledValue] = React.useState<
			SelectValue | null
		>(defaultValue);
		const selectedValue = isControlled ? value ?? null : uncontrolledValue;

		const [isOpen, setIsOpen] = React.useState(false);
		const [searchTerm, setSearchTerm] = React.useState('');
		const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
		const [openUpward, setOpenUpward] = React.useState(false);
		const [dropdownPosition, setDropdownPosition] =
			React.useState<DropdownPosition | null>(null);

		const errorMessage = getErrorMessage(error);
		const isError = Boolean(error) && !disabled;
		const hasSuccess = !isError && success;
		const feedback = errorMessage ?? helperText ?? hint;
		const feedbackId = feedback ? helperId ?? `${inputId}-hint` : undefined;

		const resolvedAriaDescribedBy = [ariaDescribedBy, feedbackId]
			.filter(Boolean)
			.join(' ')
			.trim();

		const selectedOption = React.useMemo(
			() => options.find((option) => option.value === selectedValue) ?? null,
			[options, selectedValue]
		);

		const filteredOptions = React.useMemo(() => {
			if (!searchable || searchTerm.trim() === '') {
				return options;
			}

			const term = searchTerm.toLowerCase();
			return options.filter((option) => option.label.toLowerCase().includes(term));
		}, [options, searchable, searchTerm]);

		const activeDescendantId =
			isOpen && highlightedIndex >= 0
				? `${inputId}-option-${highlightedIndex}`
				: undefined;

		const textLikeBaseClasses = cn(
			'h-11 w-full rounded-lg border border-transparent appearance-none px-4 py-2.5 text-sm',
			'transition-all duration-200 focus:outline-hidden'
		);

		const textLikeStateClasses = disabled
			? 'cursor-not-allowed bg-gray-100 text-gray-500 opacity-80 ring-1 ring-(--cor-borda)/40 dark:bg-gray-800 dark:text-gray-400 dark:ring-(--dark-cor-borda)/45'
			: isError
				? 'bg-(--cor-edit) text-error-800 ring-1 ring-error-500/35 focus:ring-2 focus:ring-error-500/45 dark:bg-(--dark-cor-edit) dark:text-error-400 dark:ring-error-400/45 dark:focus:ring-error-400/55'
				: hasSuccess
					? 'bg-(--cor-edit) text-(--cor-texto) ring-1 ring-success-400/45 focus:ring-2 focus:ring-success-500/45 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-success-500/45 dark:focus:ring-success-500/55'
					: 'bg-(--cor-edit) text-(--cor-texto) ring-1 ring-(--cor-borda)/60 focus:ring-2 focus:ring-brand-500/28 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-(--dark-cor-borda)/65 dark:focus:ring-brand-500/35';

		const fieldPaddingClasses = cn({
			'pl-10': Boolean(leftAdornment),
			'pr-14': true,
		});

		const closeDropdown = React.useCallback(() => {
			setIsOpen(false);
			setSearchTerm('');
			setHighlightedIndex(-1);
		}, []);

		const openDropdown = React.useCallback((preserveSearch = false) => {
			if (disabled || readOnly) {
				return;
			}

			setIsOpen(true);

			if (!preserveSearch) {
				setSearchTerm('');
			}
		}, [disabled, readOnly]);

		const handleSelectOption = React.useCallback(
			(option: CustomSelectOption) => {
				if (option.disabled || disabled || readOnly) {
					return;
				}

				if (!isControlled) {
					setUncontrolledValue(option.value);
				}

				onChange?.(option.value);
				closeDropdown();
			},
			[closeDropdown, disabled, isControlled, onChange, readOnly]
		);

		const moveHighlight = React.useCallback(
			(direction: 1 | -1) => {
				if (!isOpen) {
					openDropdown();
					return;
				}

				if (filteredOptions.length === 0) {
					return;
				}

				const baseIndex =
					highlightedIndex >= 0
						? highlightedIndex
						: getInitialHighlightedIndex(filteredOptions, selectedValue);

				const nextIndex = findNextEnabledIndex(filteredOptions, baseIndex, direction);
				setHighlightedIndex(nextIndex);
			},
			[
				filteredOptions,
				highlightedIndex,
				isOpen,
				openDropdown,
				selectedValue,
			]
		);

		const handleKeyDown = React.useCallback(
			(event: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>) => {
				if (disabled || readOnly) {
					return;
				}

				const isTypingInput =
					searchable && event.currentTarget instanceof HTMLInputElement;

				switch (event.key) {
					case 'ArrowDown': {
						event.preventDefault();
						moveHighlight(1);
						break;
					}
					case 'ArrowUp': {
						event.preventDefault();
						moveHighlight(-1);
						break;
					}
					case 'Enter':
					case ' ': {
						if (event.key === ' ' && isTypingInput) {
							break;
						}

						event.preventDefault();

						if (!isOpen) {
							openDropdown();
							break;
						}

						const option = filteredOptions[highlightedIndex];
						if (option && !option.disabled) {
							handleSelectOption(option);
						}
						break;
					}
					case 'Escape': {
						event.preventDefault();
						closeDropdown();
						break;
					}
					case 'Tab': {
						closeDropdown();
						break;
					}
					default:
						break;
				}
			},
			[
				closeDropdown,
				disabled,
				filteredOptions,
				handleSelectOption,
				highlightedIndex,
				isOpen,
				moveHighlight,
				openDropdown,
				searchable,
				readOnly,
			]
		);

		React.useEffect(() => {
			if (!isOpen) {
				return;
			}

			setHighlightedIndex(
				getInitialHighlightedIndex(filteredOptions, selectedValue)
			);
		}, [filteredOptions, isOpen, selectedValue]);

		React.useEffect(() => {
			setIsClient(true);
		}, []);

		React.useEffect(() => {
			if (!isOpen || highlightedIndex < 0) {
				return;
			}

			const highlightedElement = dropdownRef.current?.querySelector<HTMLElement>(
				`[data-option-index="${highlightedIndex}"]`
			);

			highlightedElement?.scrollIntoView({ block: 'nearest' });
		}, [highlightedIndex, isOpen]);

		React.useEffect(() => {
			if (!isOpen) {
				return;
			}

			const handleOutsideClick = (event: MouseEvent) => {
				const target = event.target as Node;

				if (
					wrapperRef.current?.contains(target) ||
					dropdownRef.current?.contains(target)
				) {
					return;
				}

				closeDropdown();
			};

			document.addEventListener('mousedown', handleOutsideClick);
			return () => {
				document.removeEventListener('mousedown', handleOutsideClick);
			};
		}, [closeDropdown, isOpen]);

		React.useEffect(() => {
			if (!isOpen) {
				setDropdownPosition(null);
				return;
			}

			const VIEWPORT_MARGIN = 8;
			const TRIGGER_GAP = 4;
			const MIN_DROPDOWN_HEIGHT = 160;

			const updatePlacement = () => {
				const triggerRect = wrapperRef.current?.getBoundingClientRect();
				if (!triggerRect) {
					return;
				}

				const dropdownHeight = dropdownRef.current?.offsetHeight ?? 0;
				const estimatedHeight = Math.max(dropdownHeight, MIN_DROPDOWN_HEIGHT);
				const spaceBelow = Math.max(
					0,
					window.innerHeight - triggerRect.bottom - VIEWPORT_MARGIN
				);
				const spaceAbove = Math.max(0, triggerRect.top - VIEWPORT_MARGIN);
				const shouldOpenUpward =
					spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

				const width = Math.min(
					triggerRect.width,
					window.innerWidth - VIEWPORT_MARGIN * 2
				);
				const left = Math.min(
					Math.max(triggerRect.left, VIEWPORT_MARGIN),
					window.innerWidth - width - VIEWPORT_MARGIN
				);
				const maxListHeight = Math.max(
					120,
					(shouldOpenUpward ? spaceAbove : spaceBelow) - TRIGGER_GAP
				);

				setOpenUpward(shouldOpenUpward);
				setDropdownPosition({
					left,
					top: shouldOpenUpward
						? triggerRect.top - TRIGGER_GAP
						: triggerRect.bottom + TRIGGER_GAP,
					width,
					maxListHeight,
				});
			};

			const raf = window.requestAnimationFrame(updatePlacement);
			window.addEventListener('resize', updatePlacement);
			window.addEventListener('scroll', updatePlacement, true);

			return () => {
				window.cancelAnimationFrame(raf);
				window.removeEventListener('resize', updatePlacement);
				window.removeEventListener('scroll', updatePlacement, true);
			};
		}, [filteredOptions.length, isOpen]);

		const searchablePlaceholder =
			isOpen
				? searchPlaceholder
				: typeof placeholder === 'string'
					? placeholder
					: 'Selecione uma opção';

		const searchableInputValue = isOpen
			? searchTerm
			: selectedOption?.label ?? '';

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

				<div className="relative" ref={wrapperRef}>
					{leftAdornment ? (
						<span className="pointer-events-none absolute inset-y-0 left-3 z-1 flex items-center text-gray-400 dark:text-gray-500">
							{leftAdornment}
						</span>
					) : null}

					{searchable ? (
						<input
							id={inputId}
							ref={ref as React.Ref<HTMLInputElement>}
							type="text"
							disabled={disabled}
							readOnly={readOnly}
							autoFocus={autoFocus}
							tabIndex={tabIndex}
							onBlur={onBlur}
							onFocus={onFocus}
							onClick={() => {
								if (!isOpen) {
									openDropdown();
								}
							}}
							onChange={(event) => {
								setSearchTerm(event.target.value);

								if (!isOpen) {
									openDropdown(true);
								}
							}}
							onKeyDown={handleKeyDown}
							role="combobox"
							aria-autocomplete="list"
							aria-haspopup="listbox"
							aria-controls={listboxId}
							aria-expanded={isOpen}
							aria-activedescendant={activeDescendantId}
							aria-invalid={isError || ariaInvalid ? true : undefined}
							aria-describedby={resolvedAriaDescribedBy || undefined}
							placeholder={searchablePlaceholder}
							value={searchableInputValue}
							className={cn(
								textLikeBaseClasses,
								textLikeStateClasses,
								'text-left',
								fieldPaddingClasses,
								readOnly && 'cursor-default',
								className,
								inputClassName,
								!isOpen && !selectedOption && 'text-gray-400 dark:text-white/30'
							)}
						/>
					) : (
						<button
							id={inputId}
							ref={ref as React.Ref<HTMLButtonElement>}
							type="button"
							disabled={disabled}
							autoFocus={autoFocus}
							tabIndex={tabIndex}
							onBlur={onBlur}
							onFocus={onFocus}
							onClick={() => (isOpen ? closeDropdown() : openDropdown())}
							onKeyDown={handleKeyDown}
							role="combobox"
							aria-haspopup="listbox"
							aria-controls={listboxId}
							aria-expanded={isOpen}
							aria-activedescendant={activeDescendantId}
							aria-invalid={isError || ariaInvalid ? true : undefined}
							aria-describedby={resolvedAriaDescribedBy || undefined}
							className={cn(
								textLikeBaseClasses,
								textLikeStateClasses,
								'flex items-center justify-between gap-2 text-left',
								fieldPaddingClasses,
								readOnly && 'cursor-default',
								className,
								inputClassName
							)}
						>
							<span
								className={cn(
									'truncate',
									!selectedOption && 'text-gray-400 dark:text-white/30'
								)}
							>
								{selectedOption?.label ?? placeholder}
							</span>
						</button>
					)}

					<span className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2 text-gray-400 dark:text-gray-500">
						{rightAdornment}
						<svg
							viewBox="0 0 20 20"
							className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M5 7.5L10 12.5L15 7.5"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</span>

					<input
						type="hidden"
						name={name}
						value={selectedOption ? String(selectedOption.value) : ''}
						required={required}
						readOnly
					/>

					{isOpen && isClient && dropdownPosition
						? createPortal(
								<div
									ref={dropdownRef}
									className={cn(
										'fixed rounded-lg bg-(--cor-edit) shadow-theme-lg dark:bg-(--dark-cor-edit) dark:shadow-theme-xl',
										openUpward && '-translate-y-full',
										dropdownClassName
									)}
									style={{
										left: dropdownPosition.left,
										top: dropdownPosition.top,
										width: dropdownPosition.width,
										zIndex: dropdownZIndex,
									}}
								>
									<ul
										id={listboxId}
										role="listbox"
										className="overflow-auto py-1"
										style={{ maxHeight: dropdownPosition.maxListHeight }}
									>
										{filteredOptions.length === 0 ? (
											<li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
												{noOptionsText}
											</li>
										) : (
											filteredOptions.map((option, index) => {
												const isSelected = option.value === selectedValue;
												const isHighlighted = highlightedIndex === index;

												return (
													<li
														id={`${inputId}-option-${index}`}
														key={`${String(option.value)}-${index}`}
														role="option"
														aria-selected={isSelected}
														data-option-index={index}
														onMouseEnter={() => {
															if (!option.disabled) {
																setHighlightedIndex(index);
															}
														}}
														onMouseDown={(event) => event.preventDefault()}
														onClick={() => handleSelectOption(option)}
														className={cn(
															'mx-1 rounded-md px-3 py-2 text-sm transition-colors',
															option.disabled
																? 'cursor-not-allowed text-gray-400 dark:text-gray-500'
																: isSelected
																	? 'bg-brand-500/12 text-(--cor-texto) dark:bg-brand-500/20 dark:text-(--dark-cor-texto)'
																	: isHighlighted
																		? 'bg-(--cor-button-hover)/25 text-(--cor-texto) dark:bg-(--dark-cor-button-hover)/30 dark:text-(--dark-cor-texto)'
																		: 'text-(--cor-texto) hover:bg-(--cor-button-hover)/20 dark:text-(--dark-cor-texto) dark:hover:bg-(--dark-cor-button-hover)/25'
														)}
													>
														{option.label}
													</li>
												);
											})
										)}
									</ul>
								</div>,
								document.body
							)
						: null}
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

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;
