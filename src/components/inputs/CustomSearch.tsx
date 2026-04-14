import Label from '@/components/form/Label';
import { AngleDownIcon, CloseLineIcon, SearchIcon } from '@/icons';
import { cn } from '@/utils/cn';
import * as React from 'react';
import type { FieldError } from 'react-hook-form';

type InputError = boolean | string | FieldError | null | undefined;
type SearchFilterValue = string | number;

/** Opcao de filtro exibida no dropdown lateral da busca. */
export interface CustomSearchFilterOption {
	/** Valor tecnico do filtro. */
	value: SearchFilterValue;
	/** Rotulo exibido para o usuario. */
	label: React.ReactNode;
	/** Desabilita a opcao no dropdown de filtro. */
	disabled?: boolean;
}

/** Argumentos recebidos ao customizar renderizacao do dropdown de filtro. */
export interface RenderFilterDropdownArgs {
	/** Valor de filtro atualmente selecionado. */
	selectedFilter: SearchFilterValue | null;
	/** Opcao completa selecionada (ou null). */
	selectedOption: CustomSearchFilterOption | null;
	/** Lista de opcoes disponiveis para filtro. */
	filterOptions: CustomSearchFilterOption[];
	/** Funcao para selecionar/trocar filtro. */
	onSelectFilter: (value: SearchFilterValue | null) => void;
	/** Funcao para fechar o dropdown de filtro. */
	closeDropdown: () => void;
}

/**
 * Props do `CustomSearch`.
 *
 * Funcionamento:
 * - Campo de busca com suporte a valor controlado/nao controlado.
 * - Pode disparar pesquisa no Enter (`searchOnChange=false`) ou por debounce.
 * - Opcionalmente inclui dropdown de filtros acoplado ao campo.
 */
export interface CustomSearchProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		'type' | 'value' | 'defaultValue' | 'onChange'
	> {
	/** Valor controlado do campo de busca. */
	value?: string;
	/** Valor inicial para modo nao controlado. */
	defaultValue?: string;
	/** Handler nativo de mudanca do input. */
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	/** Callback simplificado com o valor textual atual. */
	onValueChange?: (value: string) => void;
	/** Callback principal para executar a pesquisa com filtro atual. */
	onSearch?: (
		value: string,
		selectedFilter: CustomSearchFilterOption | null
	) => void;
	/** Quando true, pesquisa automaticamente a cada alteracao (com debounce). */
	searchOnChange?: boolean;
	/** Tempo de debounce (ms) para `searchOnChange`. */
	searchDebounceMs?: number;
	/** Quando true, dispara pesquisa inicial no mount com `searchOnChange`. */
	triggerSearchOnMount?: boolean;
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
	/** Classe adicional para o texto lateral (`rightText`). */
	rightTextClassName?: string;
	/** Icone/adornment para o lado esquerdo do campo. */
	leftIcon?: React.ReactNode;
	/** Texto exibido no lado direito do campo. */
	rightText?: React.ReactNode;
	/** Exibe botao para limpar o valor da busca. */
	showClearButton?: boolean;
	/** Label de acessibilidade do botao de limpar. */
	clearAriaLabel?: string;
	/** Callback executado ao limpar o campo. */
	onClear?: () => void;
	/** Habilita dropdown de filtros ao lado do campo. */
	enableFilterDropdown?: boolean;
	/** Lista de opcoes do filtro. */
	filterOptions?: CustomSearchFilterOption[];
	/** Valor de filtro controlado. */
	selectedFilter?: SearchFilterValue | null;
	/** Valor inicial de filtro no modo nao controlado. */
	defaultFilter?: SearchFilterValue | null;
	/** Callback ao selecionar novo filtro. */
	onFilterChange?: (
		value: SearchFilterValue | null,
		option: CustomSearchFilterOption | null
	) => void;
	/** Rotulo base do botao de filtro quando nao ha selecao. */
	filterButtonLabel?: React.ReactNode;
	/** Texto da opcao de reset de filtro (quando habilitada). */
	allFiltersLabel?: React.ReactNode;
	/** Habilita opcao para limpar filtro e voltar para "todos". */
	allowResetFilter?: boolean;
	/** Texto exibido quando nao ha opcoes de filtro. */
	noFilterOptionsText?: React.ReactNode;
	/** Classe adicional no botao de abrir filtros. */
	filterButtonClassName?: string;
	/** Classe adicional no painel de dropdown de filtros. */
	dropdownClassName?: string;
	/** Renderizacao customizada completa do dropdown de filtros. */
	renderFilterDropdown?: (args: RenderFilterDropdownArgs) => React.ReactNode;
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
 * Campo de busca com gatilho manual/automatico e filtros opcionais.
 *
 * Integracao com react-hook-form + zod:
 * - O termo pode ficar no RHF, validado por Zod (ex.: minimo de caracteres).
 * - O filtro pode ser outro campo do schema, via `Controller` separado.
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   termo: z.string().min(2, 'Digite ao menos 2 caracteres.'),
 *   filtro: z.union([z.string(), z.number()]).nullable(),
 * });
 *
 * type FormValues = z.infer<typeof schema>;
 *
 * const { control, watch, setValue, formState: { errors } } = useForm<FormValues>({
 *   resolver: zodResolver(schema),
 *   defaultValues: { termo: '', filtro: null },
 * });
 *
 * <Controller
 *   name="termo"
 *   control={control}
 *   render={({ field }) => (
 *     <CustomSearch
 *       label="Pesquisar"
 *       error={errors.termo}
 *       value={field.value}
 *       onValueChange={field.onChange}
 *       onBlur={field.onBlur}
 *       ref={field.ref}
 *       enableFilterDropdown
 *       filterOptions={opcoesFiltro}
 *       selectedFilter={watch('filtro')}
 *       onFilterChange={(nextFilter) => setValue('filtro', nextFilter)}
 *       onSearch={(term, selectedFilter) => {
 *         executarBusca(term, selectedFilter?.value ?? null);
 *       }}
 *     />
 *   )}
 * />
 * ```
 */
const CustomSearch = React.forwardRef<HTMLInputElement, CustomSearchProps>(
	(
		{
			id,
			name,
			label,
			required,
			placeholder = 'Pesquisar...',
			hint,
			helperText,
			helperId,
			error,
			success = false,
			disabled = false,
			readOnly = false,
			value,
			defaultValue = '',
			onChange,
			onValueChange,
			onSearch,
			searchOnChange = false,
			searchDebounceMs = 350,
			triggerSearchOnMount = false,
			containerClassName,
			labelClassName,
			inputClassName,
			hintClassName,
			rightTextClassName,
			leftIcon,
			rightText = 'Buscar',
			showClearButton = true,
			clearAriaLabel = 'Limpar pesquisa',
			onClear,
			enableFilterDropdown = false,
			filterOptions = [],
			selectedFilter,
			defaultFilter = null,
			onFilterChange,
			filterButtonLabel = 'Filtros',
			allFiltersLabel = 'Todos',
			allowResetFilter = true,
			noFilterOptionsText = 'Nenhum filtro disponível',
			filterButtonClassName,
			dropdownClassName,
			renderFilterDropdown,
			className,
			onKeyDown,
			'aria-describedby': ariaDescribedBy,
			'aria-invalid': ariaInvalid,
			...rest
		},
		ref
	) => {
		const generatedId = React.useId();
		const inputId = id ?? name ?? `custom-search-${generatedId}`;
		const listboxId = `${inputId}-filters-listbox`;
		const inputRef = React.useRef<HTMLInputElement>(null);
		const filterWrapperRef = React.useRef<HTMLDivElement>(null);
		const filterDropdownRef = React.useRef<HTMLDivElement>(null);
		const hasMountedRef = React.useRef(false);

		const isValueControlled = value !== undefined;
		const [uncontrolledValue, setUncontrolledValue] =
			React.useState(defaultValue);
		const searchValue = isValueControlled ? value ?? '' : uncontrolledValue;

		const isFilterControlled = selectedFilter !== undefined;
		const [uncontrolledFilter, setUncontrolledFilter] = React.useState<
			SearchFilterValue | null
		>(defaultFilter);
		const activeFilter = isFilterControlled
			? selectedFilter ?? null
			: uncontrolledFilter;

		const [isFilterOpen, setIsFilterOpen] = React.useState(false);
		const [openUpward, setOpenUpward] = React.useState(false);

		const setInputRefs = React.useCallback(
			(node: HTMLInputElement | null) => {
				inputRef.current = node;

				if (typeof ref === 'function') {
					ref(node);
					return;
				}

				if (ref) {
					ref.current = node;
				}
			},
			[ref]
		);

		const errorMessage = getErrorMessage(error);
		const isError = Boolean(error) && !disabled;
		const hasSuccess = !isError && success;
		const feedback = errorMessage ?? helperText ?? hint;
		const feedbackId = feedback ? helperId ?? `${inputId}-hint` : undefined;

		const resolvedAriaDescribedBy = [ariaDescribedBy, feedbackId]
			.filter(Boolean)
			.join(' ')
			.trim();

		const selectedFilterOption = React.useMemo(
			() =>
				filterOptions.find((option) => option.value === activeFilter) ?? null,
			[activeFilter, filterOptions]
		);

		const executeSearch = React.useCallback(
			(nextValue = searchValue) => {
				onSearch?.(nextValue, selectedFilterOption);
			},
			[onSearch, searchValue, selectedFilterOption]
		);

		const closeFilterDropdown = React.useCallback(() => {
			setIsFilterOpen(false);
		}, []);

		const handleSelectFilter = React.useCallback(
			(nextValue: SearchFilterValue | null) => {
				if (!isFilterControlled) {
					setUncontrolledFilter(nextValue);
				}

				const option =
					nextValue === null
						? null
						: filterOptions.find((item) => item.value === nextValue) ?? null;

				onFilterChange?.(nextValue, option);
				closeFilterDropdown();
			},
			[closeFilterDropdown, filterOptions, isFilterControlled, onFilterChange]
		);

		const handleInputChange = React.useCallback(
			(event: React.ChangeEvent<HTMLInputElement>) => {
				const nextValue = event.target.value;

				if (!isValueControlled) {
					setUncontrolledValue(nextValue);
				}

				onValueChange?.(nextValue);
				onChange?.(event);
			},
			[isValueControlled, onChange, onValueChange]
		);

		const handleClear = React.useCallback(() => {
			if (!isValueControlled) {
				setUncontrolledValue('');
			}

			onValueChange?.('');
			onClear?.();

			window.requestAnimationFrame(() => {
				inputRef.current?.focus();
			});

			if (!searchOnChange) {
				executeSearch('');
			}
		}, [executeSearch, isValueControlled, onClear, onValueChange, searchOnChange]);

		const handleKeyDown = React.useCallback(
			(event: React.KeyboardEvent<HTMLInputElement>) => {
				onKeyDown?.(event);

				if (event.defaultPrevented) {
					return;
				}

				if (event.key === 'Enter' && !searchOnChange) {
					event.preventDefault();
					executeSearch();
				}

				if (event.key === 'Escape') {
					closeFilterDropdown();
				}
			},
			[closeFilterDropdown, executeSearch, onKeyDown, searchOnChange]
		);

		React.useEffect(() => {
			if (!searchOnChange || !onSearch) {
				return;
			}

			if (!hasMountedRef.current) {
				hasMountedRef.current = true;
				if (!triggerSearchOnMount) {
					return;
				}
			}

			const timeoutId = window.setTimeout(() => {
				executeSearch(searchValue);
			}, Math.max(0, searchDebounceMs));

			return () => {
				window.clearTimeout(timeoutId);
			};
		}, [
			executeSearch,
			onSearch,
			searchDebounceMs,
			searchOnChange,
			searchValue,
			triggerSearchOnMount,
			activeFilter,
		]);

		React.useEffect(() => {
			if (!enableFilterDropdown || !isFilterOpen) {
				return;
			}

			const handleOutsideClick = (event: MouseEvent) => {
				if (
					filterWrapperRef.current &&
					!filterWrapperRef.current.contains(event.target as Node)
				) {
					closeFilterDropdown();
				}
			};

			document.addEventListener('mousedown', handleOutsideClick);
			return () => {
				document.removeEventListener('mousedown', handleOutsideClick);
			};
		}, [closeFilterDropdown, enableFilterDropdown, isFilterOpen]);

		React.useEffect(() => {
			if (!enableFilterDropdown || !isFilterOpen) {
				return;
			}

			const updatePlacement = () => {
				const triggerRect = filterWrapperRef.current?.getBoundingClientRect();
				if (!triggerRect) {
					return;
				}

				const dropdownHeight = filterDropdownRef.current?.offsetHeight ?? 280;
				const spaceBelow = window.innerHeight - triggerRect.bottom;
				const spaceAbove = triggerRect.top;

				setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
			};

			const raf = window.requestAnimationFrame(updatePlacement);
			window.addEventListener('resize', updatePlacement);
			window.addEventListener('scroll', updatePlacement, true);

			return () => {
				window.cancelAnimationFrame(raf);
				window.removeEventListener('resize', updatePlacement);
				window.removeEventListener('scroll', updatePlacement, true);
			};
		}, [enableFilterDropdown, isFilterOpen, filterOptions.length]);

		const showClearAction =
			showClearButton && searchValue.length > 0 && !disabled && !readOnly;
		const hasRightText = Boolean(rightText);

		const inputRightPaddingClass = hasRightText
			? showClearAction
				? 'pr-28'
				: 'pr-20'
			: showClearAction
				? 'pr-14'
				: 'pr-4';

		const textLikeBaseClasses = cn(
			'h-11 w-full rounded-lg border border-transparent appearance-none py-2.5 text-sm',
			'placeholder:text-gray-400 transition-all duration-200',
			'focus:outline-hidden dark:placeholder:text-white/30',
			'[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
			'pl-10',
			inputRightPaddingClass
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

				<div className="flex w-full items-stretch gap-2">
					<div className="relative min-w-0 flex-1">
						<span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500">
							{leftIcon ?? <SearchIcon className="h-4 w-4" />}
						</span>

						<input
							id={inputId}
							ref={setInputRefs}
							name={name}
							type="search"
							required={required}
							disabled={disabled}
							readOnly={readOnly}
							value={searchValue}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
							placeholder={placeholder}
							autoComplete="off"
							role="searchbox"
							aria-invalid={isError || ariaInvalid ? true : undefined}
							aria-describedby={resolvedAriaDescribedBy || undefined}
							className={cn(
								textLikeBaseClasses,
								textLikeStateClasses,
								readOnly &&
									'read-only:cursor-default read-only:bg-(--cor-edit) read-only:dark:bg-(--dark-cor-edit)',
								className,
								inputClassName
							)}
							{...rest}
						/>

						{hasRightText || showClearAction ? (
							<div className="absolute inset-y-0 right-3 flex items-center gap-2">
								{hasRightText ? (
									<span
										className={cn(
											'pointer-events-none select-none text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400',
											rightTextClassName
										)}
									>
										{rightText}
									</span>
								) : null}

								{showClearAction ? (
									<button
										type="button"
										onClick={handleClear}
										aria-label={clearAriaLabel}
										className="inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-300 transition-colors hover:text-gray-200 dark:text-gray-200 dark:hover:text-white/90"
									>
										<CloseLineIcon className="h-3.5 w-3.5" />
									</button>
								) : null}
							</div>
						) : null}
					</div>

					{enableFilterDropdown ? (
						<div className="relative shrink-0" ref={filterWrapperRef}>
							<button
								type="button"
								disabled={disabled}
								onClick={() => {
									if (disabled || readOnly) {
										return;
									}

									setIsFilterOpen((prevState) => !prevState);
								}}
								role="combobox"
								aria-haspopup="listbox"
								aria-controls={listboxId}
								aria-expanded={isFilterOpen}
								className={cn(
									'h-11 min-w-36 rounded-lg border border-transparent bg-(--cor-edit) px-3 py-2.5 text-left text-sm text-(--cor-texto) ring-1 ring-(--cor-borda)/60 transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/28 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-80 disabled:ring-(--cor-borda)/40 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-(--dark-cor-borda)/65 dark:focus:ring-brand-500/35 dark:disabled:bg-gray-800 dark:disabled:text-gray-400 dark:disabled:ring-(--dark-cor-borda)/45',
									filterButtonClassName
								)}
							>
								<span className="flex items-center justify-between gap-2">
									<span className="truncate">
										{selectedFilterOption?.label ?? filterButtonLabel}
									</span>
									<AngleDownIcon
										className={cn(
											'h-4 w-4 shrink-0 text-gray-400 transition-transform dark:text-gray-500',
											isFilterOpen && 'rotate-180'
										)}
									/>
								</span>
							</button>

							{isFilterOpen ? (
								<div
									ref={filterDropdownRef}
									className={cn(
										'absolute right-0 z-50 mt-1 w-64 overflow-hidden rounded-lg bg-(--cor-edit) py-1 shadow-theme-lg dark:bg-(--dark-cor-edit) dark:shadow-theme-xl',
										openUpward ? 'bottom-full mb-1 mt-0' : 'top-full',
										dropdownClassName
									)}
								>
									{renderFilterDropdown ? (
										renderFilterDropdown({
											selectedFilter: activeFilter,
											selectedOption: selectedFilterOption,
											filterOptions,
											onSelectFilter: handleSelectFilter,
											closeDropdown: closeFilterDropdown,
										})
									) : (
										<ul
											id={listboxId}
											role="listbox"
											className="max-h-60 overflow-auto py-1"
										>
											{allowResetFilter ? (
												<li role="option" aria-selected={activeFilter === null}>
													<button
														type="button"
														onClick={() => handleSelectFilter(null)}
														className={cn(
															'mx-1 block w-[calc(100%-0.5rem)] rounded-md px-3 py-2 text-left text-sm transition-colors',
															activeFilter === null
																? 'bg-brand-500/12 text-(--cor-texto) dark:bg-brand-500/20 dark:text-(--dark-cor-texto)'
																: 'text-(--cor-texto) hover:bg-(--cor-button-hover)/20 dark:text-(--dark-cor-texto) dark:hover:bg-(--dark-cor-button-hover)/25'
														)}
													>
														{allFiltersLabel}
													</button>
												</li>
											) : null}

											{filterOptions.length === 0 ? (
												<li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
													{noFilterOptionsText}
												</li>
											) : (
												filterOptions.map((option, index) => {
													const isSelected = option.value === activeFilter;

													return (
														<li
															key={`${String(option.value)}-${index}`}
															role="option"
															aria-selected={isSelected}
														>
															<button
																type="button"
																disabled={option.disabled}
																onClick={() => handleSelectFilter(option.value)}
																className={cn(
																	'mx-1 block w-[calc(100%-0.5rem)] rounded-md px-3 py-2 text-left text-sm transition-colors',
																	option.disabled
																		? 'cursor-not-allowed text-gray-400 dark:text-gray-500'
																		: isSelected
																			? 'bg-brand-500/12 text-(--cor-texto) dark:bg-brand-500/20 dark:text-(--dark-cor-texto)'
																			: 'text-(--cor-texto) hover:bg-(--cor-button-hover)/20 dark:text-(--dark-cor-texto) dark:hover:bg-(--dark-cor-button-hover)/25'
																)}
															>
																{option.label}
															</button>
														</li>
													);
												})
											)}
										</ul>
									)}
								</div>
							) : null}
						</div>
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

CustomSearch.displayName = 'CustomSearch';

export default CustomSearch;
