import Label from '@/components/form/Label';
import { cn } from '@/utils/cn';
import * as React from 'react';
import type { FieldError } from 'react-hook-form';

type InputError = boolean | string | FieldError | null | undefined;
export type SelectGridValue = string | number;
export type CustomSelectGridSelectionMode = 'single' | 'multiple';
export type CustomSelectGridSortDirection = 'asc' | 'desc';
type SortCycleMode = 'two-state' | 'three-state';
type Density = 'compact' | 'default' | 'comfortable';

interface LegacySelectGridItem {
	value: SelectGridValue;
	label: React.ReactNode;
	description?: React.ReactNode;
	disabled?: boolean;
}

export interface CustomSelectGridSort {
	columnKey: string;
	direction: CustomSelectGridSortDirection;
}

type SortablePrimitive = string | number | boolean | Date | null | undefined;

export interface CustomSelectGridColumn<RowType extends Record<string, unknown>> {
	/** Chave do campo da coluna dentro da linha. */
	key: keyof RowType & string;
	/** Conteudo do cabecalho da coluna. */
	header: React.ReactNode;
	/** Permite ordenar clicando no cabecalho. */
	sortable?: boolean;
	/** Valor customizado usado na ordenacao da coluna. */
	sortAccessor?: (row: RowType) => SortablePrimitive;
	/** Render customizado da celula da coluna. */
	render?: (row: RowType) => React.ReactNode;
	/** Classe adicional para o cabecalho desta coluna. */
	headerClassName?: string;
	/** Classe adicional para as celulas desta coluna. */
	cellClassName?: string;
	/** Classe utilitaria de largura (ex.: min-w-40). */
	widthClassName?: string;
	/** Alinhamento do texto em cabecalho e celulas. */
	align?: 'left' | 'center' | 'right';
}

/**
 * Props do `CustomSelectGrid`.
 *
 * Funcionamento:
 * - Renderiza uma grade tabular com cabecalho de colunas e linhas selecionaveis.
 * - Suporta ordenacao por coluna e selecao single/multiple.
 * - Exponibiliza os selecionados para a camada pai acionar botoes externos do card.
 */
export interface CustomSelectGridProps<
	RowType extends Record<string, unknown>,
> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
	/** ID da area interativa para acessibilidade. */
	id?: string;
	/** Nome logico do campo (exposto em `data-name`). */
	name?: string;
	/** Rotulo exibido acima da grade. */
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
	/** Desabilita toda interacao na grade. */
	disabled?: boolean;
	/** Mantem leitura sem permitir alteracao da selecao. */
	readOnly?: boolean;
	/** Indica obrigatoriedade visual no rotulo. */
	required?: boolean;
	/** Linhas renderizadas na grade. */
	rows?: RowType[];
	/** Definicao de colunas da grade. */
	columns?: Array<CustomSelectGridColumn<RowType>>;
	/**
	 * Compatibilidade com API antiga baseada em lista simples de itens.
	 * Quando `rows` e `columns` nao sao informados, a grade usa este array.
	 */
	items?: LegacySelectGridItem[];
	/** Modo de selecao da grade. */
	selectionMode?: CustomSelectGridSelectionMode;
	/** Chave do ID da linha quando nao usar `getRowId`. */
	rowIdKey?: keyof RowType & string;
	/** Resolve o ID da linha para selecao e payload externo. */
	getRowId?: (row: RowType, rowIndex: number) => SelectGridValue;
	/** Permite desabilitar linha dinamicamente. */
	isRowDisabled?: (row: RowType, rowIndex: number) => boolean;
	/** Exibe coluna de indicador de selecao. */
	showSelectionColumn?: boolean;
	/** Selecionados no modo controlado. */
	value?: SelectGridValue[] | null;
	/** Selecionados iniciais no modo nao controlado. */
	defaultValue?: SelectGridValue[] | null;
	/** Callback de selecao com valores e linhas selecionadas. */
	onChange?: (selectedValues: SelectGridValue[], selectedRows: RowType[]) => void;
	/** Quantidade maxima de linhas selecionadas no modo `multiple`. */
	maxSelected?: number;
	/** Callback disparado quando tenta selecionar acima do limite. */
	onLimitReached?: (
		selectedValues: SelectGridValue[],
		maxSelected: number,
		selectedRows: RowType[]
	) => void;
	/** Ordenacao no modo controlado. */
	sort?: CustomSelectGridSort | null;
	/** Ordenacao inicial no modo nao controlado. */
	defaultSort?: CustomSelectGridSort | null;
	/** Callback de mudanca de ordenacao. */
	onSortChange?: (sort: CustomSelectGridSort | null) => void;
	/** Ciclo da ordenacao ao clicar no cabecalho. */
	sortCycle?: SortCycleMode;
	/** Texto exibido quando nao ha linhas. */
	emptyStateText?: React.ReactNode;
	/** Densidade visual das linhas. */
	density?: Density;
	/** Aplica alternancia visual entre linhas nao selecionadas. */
	striped?: boolean;
	/** Classe para o container externo (`div` raiz). */
	containerClassName?: string;
	/** Classe para o componente de label. */
	labelClassName?: string;
	/** Classe para o wrapper que aplica ring e overflow horizontal. */
	tableWrapperClassName?: string;
	/** Classe para o viewport rolavel que contem a tabela. */
	scrollViewportClassName?: string;
	/** Classe utilitaria de altura maxima para o viewport rolavel (ex.: max-h-64). */
	maxHeightClassName?: string;
	/** Classe utilitaria de raio no wrapper externo da grade. */
	roundedClassName?: string;
	/** Classe para o elemento `<table>`. */
	tableClassName?: string;
	/** Classe para o `<thead>`. */
	theadClassName?: string;
	/** Classe para a linha de cabecalho. */
	headerRowClassName?: string;
	/** Classe base para as celulas de cabecalho. */
	headerCellClassName?: string;
	/** Classe para o `<tbody>`. */
	bodyClassName?: string;
	/** Classe base para linhas. */
	rowClassName?: string;
	/** Classe adicional para linhas selecionadas. */
	selectedRowClassName?: string;
	/** Classe adicional para linhas nao selecionadas. */
	unselectedRowClassName?: string;
	/** Classe base para celulas do corpo. */
	cellClassName?: string;
	/** Classe para celulas da coluna de selecao. */
	selectionCellClassName?: string;
	/** Classe para o texto de hint/helper/erro. */
	hintClassName?: string;
	/** Classe para a linha de estado vazio. */
	emptyStateClassName?: string;
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

const getValueKey = (value: SelectGridValue): string =>
	`${typeof value}:${String(value)}`;

const normalizeSelectionList = (
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

const getPrimitiveSortValue = (value: SortablePrimitive): string | number => {
	if (value instanceof Date) {
		return value.getTime();
	}

	if (typeof value === 'number') {
		return value;
	}

	if (typeof value === 'boolean') {
		return value ? 1 : 0;
	}

	if (typeof value === 'string') {
		return value;
	}

	return '';
};

const areSelectionsEqual = (
	left: SelectGridValue[],
	right: SelectGridValue[]
): boolean => {
	if (left.length !== right.length) {
		return false;
	}

	for (let index = 0; index < left.length; index += 1) {
		if (getValueKey(left[index]) !== getValueKey(right[index])) {
			return false;
		}
	}

	return true;
};

const densityCellClassMap: Record<Density, string> = {
	compact: 'px-3 py-2',
	default: 'px-3 py-2.5',
	comfortable: 'px-3 py-3',
};

const headerButtonAlignClassMap: Record<
	NonNullable<CustomSelectGridColumn<Record<string, unknown>>['align']>,
	string
> = {
	left: 'justify-start text-left',
	center: 'justify-center text-center',
	right: 'justify-end text-right',
};

const headerCellAlignClassMap: Record<
	NonNullable<CustomSelectGridColumn<Record<string, unknown>>['align']>,
	string
> = {
	left: 'text-left',
	center: 'text-center',
	right: 'text-right',
};

const getSortAriaValue = (
	isActive: boolean,
	direction?: CustomSelectGridSortDirection
): React.AriaAttributes['aria-sort'] => {
	if (!isActive || !direction) {
		return 'none';
	}

	return direction === 'asc' ? 'ascending' : 'descending';
};

interface SortIndicatorProps {
	active: boolean;
	direction?: CustomSelectGridSortDirection;
}

const SortIndicator = ({ active, direction }: SortIndicatorProps) => {
	if (!active || !direction) {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 16 16"
				className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500"
				fill="none"
			>
				<path
					d="M5 6L8 3L11 6M5 10L8 13L11 10"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.25"
				/>
			</svg>
		);
	}

	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 16 16"
			className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400"
			fill="none"
		>
			<path
				d={direction === 'asc' ? 'M5 9L8 6L11 9' : 'M5 7L8 10L11 7'}
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.45"
			/>
		</svg>
	);
};

const SelectionIndicator = ({ checked }: { checked: boolean }) => {
	return (
		<span
			aria-hidden="true"
			className={cn(
				'flex h-4 w-4 items-center justify-center rounded-sm border transition-all duration-200',
				checked
					? 'border-brand-600 bg-brand-600 text-white dark:border-brand-400 dark:bg-brand-400 dark:text-(--dark-texto-button)'
					: 'border-(--cor-borda) bg-transparent text-transparent dark:border-(--dark-cor-borda)'
			)}
		>
			<svg
				viewBox="0 0 16 16"
				className="h-3 w-3"
				fill="none"
			>
				<path
					d="M3.5 8.25L6.6 11.25L12.5 5.25"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.85"
				/>
			</svg>
		</span>
	);
};

/**
 * Grid tabular com linhas selecionaveis para acoes externas no card/pagina.
 *
 * Integracao com react-hook-form + zod:
 * - Use `Controller` para controlar `value` (array de IDs) e `onChange`.
 * - A validacao de minimo/maximo de selecao pode ser feita no schema.
 *
 * @example
 * ```tsx
 * type ServicoRow = {
 *   id: number;
 *   codigo: string;
 *   descricao: string;
 * };
 *
 * const servicos: ServicoRow[] = [
 *   { id: 1, codigo: '6000', descricao: 'Registro de Titulo' },
 *   { id: 2, codigo: '7000', descricao: 'Registro de Midia' },
 * ];
 *
 * const [selectedIds, setSelectedIds] = React.useState<SelectGridValue[]>([]);
 *
 * <CustomSelectGrid<ServicoRow>
 *   label="Servicos"
 *   rows={servicos}
 *   columns={[
 *     { key: 'codigo', header: 'Codigo', sortable: true, widthClassName: 'w-28' },
 *     { key: 'descricao', header: 'Descricao', sortable: true },
 *   ]}
 *   selectionMode="multiple"
 *   rowIdKey="id"
 *   value={selectedIds}
 *   onChange={(values) => setSelectedIds(values)}
 * />
 *
 * // Compatibilidade com API legada (items)
 * <CustomSelectGrid
 *   label="Modelos de descricao"
 *   items={[
 *     { value: 'modelo1', label: 'Modelo 1' },
 *     { value: 'modelo2', label: 'Modelo 2', description: 'Padrao cartorio' },
 *   ]}
 *   selectionMode="single"
 * />
 * ```
 */
type CustomSelectGridComponent = {
	<RowType extends Record<string, unknown>>(
		props: CustomSelectGridProps<RowType> & {
			ref?: React.ForwardedRef<HTMLDivElement>;
		}
	): React.ReactElement;
	displayName?: string;
};

const CustomSelectGrid = React.forwardRef(
	<
		RowType extends Record<string, unknown>,
	>(
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
			rows = [],
			columns = [],
			items,
			selectionMode = 'multiple',
			rowIdKey,
			getRowId,
			isRowDisabled,
			showSelectionColumn = true,
			value,
			defaultValue,
			onChange,
			maxSelected,
			onLimitReached,
			sort,
			defaultSort = null,
			onSortChange,
			sortCycle = 'three-state',
			emptyStateText = 'Nenhum registro disponível.',
			density = 'default',
			striped = false,
			containerClassName,
			labelClassName,
			tableWrapperClassName,
			scrollViewportClassName,
			maxHeightClassName,
			roundedClassName = 'rounded-none',
			tableClassName,
			theadClassName,
			headerRowClassName,
			headerCellClassName,
			bodyClassName,
			rowClassName,
			selectedRowClassName,
			unselectedRowClassName,
			cellClassName,
			selectionCellClassName,
			hintClassName,
			emptyStateClassName,
			className,
			onBlur,
			'aria-describedby': ariaDescribedBy,
			'aria-invalid': ariaInvalid,
			...rest
		}: CustomSelectGridProps<RowType>,
		ref: React.ForwardedRef<HTMLDivElement>
	) => {
		const generatedId = React.useId();
		const inputId = id ?? name ?? `custom-select-grid-table-${generatedId}`;

		const legacyRows = React.useMemo(() => {
			if (!Array.isArray(items) || items.length === 0) {
				return [] as RowType[];
			}

			return items.map((item) => {
				return {
					id: item.value,
					label: item.label,
					description: item.description,
					disabled: item.disabled,
				} as unknown as RowType;
			});
		}, [items]);

		const resolvedRows = React.useMemo(() => {
			if (rows.length > 0) {
				return rows;
			}

			return legacyRows;
		}, [legacyRows, rows]);

		const resolvedColumns = React.useMemo(() => {
			if (columns.length > 0) {
				return columns;
			}

			if (legacyRows.length === 0) {
				return [] as Array<CustomSelectGridColumn<RowType>>;
			}

			const hasDescription =
				items?.some((item) => item.description !== undefined && item.description !== null) ??
				false;

			const fallbackColumns: Array<CustomSelectGridColumn<RowType>> = [
				{
					key: 'label' as keyof RowType & string,
					header: 'Item',
					render: (row) => {
						const rowRecord = row as Record<string, React.ReactNode>;
						return rowRecord.label;
					},
				},
			];

			if (hasDescription) {
				fallbackColumns.push({
					key: 'description' as keyof RowType & string,
					header: 'Detalhes',
					render: (row) => {
						const rowRecord = row as Record<string, React.ReactNode>;
						return rowRecord.description;
					},
				});
			}

			return fallbackColumns;
		}, [columns, items, legacyRows.length]);

		const resolveRowId = React.useCallback(
			(row: RowType, rowIndex: number): SelectGridValue => {
				if (getRowId) {
					return getRowId(row, rowIndex);
				}

				const fallbackKey = (rowIdKey ?? 'id') as keyof RowType;
				const candidate = row[fallbackKey];

				if (typeof candidate === 'string' || typeof candidate === 'number') {
					return candidate;
				}

				return rowIndex;
			},
			[getRowId, rowIdKey]
		);

		const rowsWithMeta = React.useMemo(() => {
			return resolvedRows.map((row, rowIndex) => {
				const idValue = resolveRowId(row, rowIndex);
				return {
					row,
					rowIndex,
					idValue,
					key: getValueKey(idValue),
				};
			});
		}, [resolveRowId, resolvedRows]);

		const allowedKeys = React.useMemo(() => {
			return new Set(rowsWithMeta.map((item) => item.key));
		}, [rowsWithMeta]);

		const rowMapByKey = React.useMemo(() => {
			const map = new Map<string, RowType>();
			for (const item of rowsWithMeta) {
				map.set(item.key, item.row);
			}
			return map;
		}, [rowsWithMeta]);

		const isSelectionControlled = value !== undefined;
		const [uncontrolledSelection, setUncontrolledSelection] = React.useState<
			SelectGridValue[]
		>(() => normalizeSelectionList(defaultValue, allowedKeys));

		const normalizedSelection = React.useMemo(() => {
			const sourceValue = isSelectionControlled ? value : uncontrolledSelection;
			const normalized = normalizeSelectionList(sourceValue, allowedKeys);
			if (selectionMode === 'single') {
				return normalized.slice(0, 1);
			}
			return normalized;
		}, [
			allowedKeys,
			isSelectionControlled,
			selectionMode,
			uncontrolledSelection,
			value,
		]);

		const selectedKeySet = React.useMemo(() => {
			return new Set(normalizedSelection.map((item) => getValueKey(item)));
		}, [normalizedSelection]);

		const normalizedMaxSelected = React.useMemo(() => {
			if (selectionMode !== 'multiple') {
				return undefined;
			}

			if (typeof maxSelected !== 'number' || Number.isNaN(maxSelected)) {
				return undefined;
			}

			return Math.max(0, Math.floor(maxSelected));
		}, [maxSelected, selectionMode]);

		React.useEffect(() => {
			if (isSelectionControlled) {
				return;
			}

			const normalizedUncontrolled = normalizeSelectionList(
				uncontrolledSelection,
				allowedKeys
			);
			const nextSelection =
				selectionMode === 'single'
					? normalizedUncontrolled.slice(0, 1)
					: normalizedUncontrolled;

			if (!areSelectionsEqual(nextSelection, uncontrolledSelection)) {
				setUncontrolledSelection(nextSelection);
			}
		}, [allowedKeys, isSelectionControlled, selectionMode, uncontrolledSelection]);

		const isSortControlled = sort !== undefined;
		const [uncontrolledSort, setUncontrolledSort] =
			React.useState<CustomSelectGridSort | null>(defaultSort);
		const activeSort = isSortControlled ? sort ?? null : uncontrolledSort;

		const setSortAndNotify = React.useCallback(
			(nextSort: CustomSelectGridSort | null) => {
				if (!isSortControlled) {
					setUncontrolledSort(nextSort);
				}

				onSortChange?.(nextSort);
			},
			[isSortControlled, onSortChange]
		);

		const sortedRowsWithMeta = React.useMemo(() => {
			if (!activeSort) {
				return rowsWithMeta;
			}

			const targetColumn = resolvedColumns.find(
				(column) => column.key === activeSort.columnKey
			);
			if (!targetColumn || !targetColumn.sortable) {
				return rowsWithMeta;
			}

			const sorted = [...rowsWithMeta];
			sorted.sort((left, right) => {
				const leftValue = getPrimitiveSortValue(
					targetColumn.sortAccessor
						? targetColumn.sortAccessor(left.row)
						: (left.row[targetColumn.key] as SortablePrimitive)
				);
				const rightValue = getPrimitiveSortValue(
					targetColumn.sortAccessor
						? targetColumn.sortAccessor(right.row)
						: (right.row[targetColumn.key] as SortablePrimitive)
				);

				const baseResult =
					typeof leftValue === 'number' && typeof rightValue === 'number'
						? leftValue - rightValue
						: String(leftValue).localeCompare(String(rightValue), 'pt-BR', {
								numeric: true,
								sensitivity: 'base',
							});

				if (baseResult === 0) {
					return left.rowIndex - right.rowIndex;
				}

				return activeSort.direction === 'asc' ? baseResult : -baseResult;
			});

			return sorted;
		}, [activeSort, resolvedColumns, rowsWithMeta]);

		const setSelectionAndNotify = React.useCallback(
			(nextSelection: SelectGridValue[]) => {
				const normalizedNext = normalizeSelectionList(nextSelection, allowedKeys);
				const modeSelection =
					selectionMode === 'single'
						? normalizedNext.slice(0, 1)
						: normalizedNext;

				if (!isSelectionControlled) {
					setUncontrolledSelection(modeSelection);
				}

				const nextSelectedRows = modeSelection
					.map((selectedValue) => rowMapByKey.get(getValueKey(selectedValue)))
					.filter((row): row is RowType => Boolean(row));

				onChange?.(modeSelection, nextSelectedRows);
			},
			[
				allowedKeys,
				isSelectionControlled,
				onChange,
				rowMapByKey,
				selectionMode,
			]
		);

		const emitLimitReached = React.useCallback(() => {
			if (typeof normalizedMaxSelected !== 'number') {
				return;
			}

			const selectedRows = normalizedSelection
				.map((selectedValue) => rowMapByKey.get(getValueKey(selectedValue)))
				.filter((row): row is RowType => Boolean(row));

			onLimitReached?.(normalizedSelection, normalizedMaxSelected, selectedRows);
		}, [normalizedMaxSelected, normalizedSelection, onLimitReached, rowMapByKey]);

		const handleToggleRow = React.useCallback(
			(item: (typeof rowsWithMeta)[number]) => {
				if (disabled || readOnly || isRowDisabled?.(item.row, item.rowIndex)) {
					return;
				}

				const rowKey = item.key;
				const rowId = item.idValue;
				const alreadySelected = selectedKeySet.has(rowKey);

				if (selectionMode === 'single') {
					setSelectionAndNotify(alreadySelected ? [] : [rowId]);
					return;
				}

				if (alreadySelected) {
					setSelectionAndNotify(
						normalizedSelection.filter(
							(selectedValue) => getValueKey(selectedValue) !== rowKey
						)
					);
					return;
				}

				if (
					typeof normalizedMaxSelected === 'number' &&
					normalizedSelection.length >= normalizedMaxSelected
				) {
					emitLimitReached();
					return;
				}

				setSelectionAndNotify([...normalizedSelection, rowId]);
			},
			[
				disabled,
				emitLimitReached,
				isRowDisabled,
				normalizedMaxSelected,
				normalizedSelection,
				readOnly,
				selectedKeySet,
				selectionMode,
				setSelectionAndNotify,
			]
		);

		const handleHeaderSort = React.useCallback(
			(column: CustomSelectGridColumn<RowType>) => {
				if (disabled || !column.sortable) {
					return;
				}

				const isSameColumn = activeSort?.columnKey === column.key;
				if (!isSameColumn) {
					setSortAndNotify({ columnKey: column.key, direction: 'asc' });
					return;
				}

				if (activeSort?.direction === 'asc') {
					setSortAndNotify({ columnKey: column.key, direction: 'desc' });
					return;
				}

				if (sortCycle === 'three-state') {
					setSortAndNotify(null);
					return;
				}

				setSortAndNotify({ columnKey: column.key, direction: 'asc' });
			},
			[activeSort, disabled, setSortAndNotify, sortCycle]
		);

		const handleBlurCapture = React.useCallback(
			(event: React.FocusEvent<HTMLDivElement>) => {
				const nextFocusedElement = event.relatedTarget as Node | null;
				if (nextFocusedElement && event.currentTarget.contains(nextFocusedElement)) {
					return;
				}

				onBlur?.(event);
			},
			[onBlur]
		);

		const shouldShowSelectionColumn = showSelectionColumn;
		const colSpan = resolvedColumns.length + (shouldShowSelectionColumn ? 1 : 0);
		const errorMessage = getErrorMessage(error);
		const isError = Boolean(error) && !disabled;
		const hasSuccess = !isError && success;
		const feedback = errorMessage ?? helperText ?? hint;
		const feedbackId = feedback ? helperId ?? `${inputId}-hint` : undefined;
		const hasNoRows = resolvedRows.length === 0;

		const resolvedAriaDescribedBy = [ariaDescribedBy, feedbackId]
			.filter(Boolean)
			.join(' ')
			.trim();

		const tableWrapperStateClasses = disabled
			? 'bg-gray-100 text-gray-500 opacity-80 ring-1 ring-(--cor-borda)/40 dark:bg-gray-800 dark:text-gray-400 dark:ring-(--dark-cor-borda)/45'
			: isError
				? 'bg-(--cor-edit) text-error-800 ring-1 ring-error-500/35 focus-within:ring-2 focus-within:ring-error-500/45 dark:bg-(--dark-cor-edit) dark:text-error-400 dark:ring-error-400/45 dark:focus-within:ring-error-400/55'
				: hasSuccess
					? 'bg-(--cor-edit) text-(--cor-texto) ring-1 ring-success-400/45 focus-within:ring-2 focus-within:ring-success-500/45 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-success-500/45 dark:focus-within:ring-success-500/55'
					: 'bg-(--cor-edit) text-(--cor-texto) ring-1 ring-(--cor-borda)/60 focus-within:ring-2 focus-within:ring-brand-500/28 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-(--dark-cor-borda)/65 dark:focus-within:ring-brand-500/35';

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
					className={className}
					{...rest}
				>
					<div
						className={cn(
							'transition-all duration-200',
							roundedClassName,
							tableWrapperStateClasses,
							tableWrapperClassName
						)}
					>
						<div
							className={cn(
								'overflow-auto',
								maxHeightClassName,
								scrollViewportClassName
							)}
						>
							<table
								className={cn(
									'w-full min-w-140 border-separate border-spacing-0 text-sm',
									tableClassName
								)}
							>
								<thead
									className={cn(
										'sticky top-0 z-10 bg-(--background)/95 text-gray-600 dark:bg-(--dark-cor-edit)/95 dark:text-gray-300',
										theadClassName
									)}
								>
									<tr className={cn('h-11', headerRowClassName)}>
										{shouldShowSelectionColumn ? (
											<th
												scope="col"
												className={cn(
													'w-10 px-3 py-2 text-left text-xs font-semibold tracking-[0.05em] text-gray-500 dark:text-gray-400',
													headerCellClassName
												)}
											>
												<span className="sr-only">Selecionado</span>
											</th>
										) : null}

										{resolvedColumns.map((column) => {
											const align = column.align ?? 'left';
											const isActiveSort = activeSort?.columnKey === column.key;
											const sortDirection = isActiveSort
												? activeSort?.direction
												: undefined;
											const canSort = column.sortable && !disabled;

											return (
												<th
													key={column.key}
													scope="col"
													aria-sort={getSortAriaValue(isActiveSort, sortDirection)}
													className={cn(
														'px-3 py-2 text-xs font-semibold tracking-[0.05em] text-gray-500 dark:text-gray-300',
														headerCellAlignClassMap[align],
														column.widthClassName,
														headerCellClassName,
														column.headerClassName
													)}
												>
													{canSort ? (
														<button
															type="button"
															onClick={() => handleHeaderSort(column)}
															className={cn(
																'inline-flex w-full items-center gap-1.5 rounded-md px-1 py-1 text-xs font-semibold uppercase tracking-[0.05em] transition-colors duration-200',
																headerButtonAlignClassMap[align],
																'read-only:pointer-events-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500/35',
																isActiveSort
																	? 'text-brand-700 dark:text-brand-300'
																	: 'text-gray-600 hover:text-(--cor-texto) dark:text-gray-300 dark:hover:text-(--dark-cor-texto)'
															)}
														>
															<span className="truncate">{column.header}</span>
															<SortIndicator active={isActiveSort} direction={sortDirection} />
														</button>
													) : (
														<span
															className={cn(
																'inline-flex w-full items-center truncate px-1 py-1',
																headerButtonAlignClassMap[align] 
															)}
														>
															{column.header}
														</span>
													)}
												</th>
											);
										})}
									</tr>
								</thead>

								<tbody className={cn('bg-transparent', bodyClassName)}>
									{hasNoRows ? (
										<tr>
											<td
												colSpan={colSpan}
												className={cn(
													'px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400',
													emptyStateClassName
												)}
											>
												{emptyStateText}
											</td>
										</tr>
									) : (
										sortedRowsWithMeta.map((item, sortedIndex) => {
											const rowBlockedByMax =
												typeof normalizedMaxSelected === 'number' &&
												selectionMode === 'multiple' &&
												normalizedSelection.length >= normalizedMaxSelected &&
												!selectedKeySet.has(item.key);
											const rowDisabled =
												disabled ||
												readOnly ||
												rowBlockedByMax ||
												isRowDisabled?.(item.row, item.rowIndex);
											const selected = selectedKeySet.has(item.key);
											const canInteract = !rowDisabled;

											const rowStateClasses = rowDisabled
												? rowBlockedByMax
													? 'cursor-not-allowed text-gray-500/90 opacity-75 dark:text-gray-400/90'
													: 'cursor-not-allowed text-gray-500 opacity-80 dark:text-gray-400'
												: selected
													? 'bg-brand-50/75 text-(--cor-texto) dark:bg-brand-500/14 dark:text-(--dark-cor-texto)'
													: striped && sortedIndex % 2 === 1
														? 'bg-(--background)/25 text-(--cor-texto) hover:bg-(--background)/55 dark:bg-white/3 dark:text-(--dark-cor-texto) dark:hover:bg-white/6'
														: 'bg-transparent text-(--cor-texto) hover:bg-(--background)/55 dark:text-(--dark-cor-texto) dark:hover:bg-white/5';

											return (
												<tr
													key={item.key}
													aria-selected={selected}
													tabIndex={canInteract ? 0 : -1}
													onClick={() => {
														handleToggleRow(item);
													}}
													onKeyDown={(event) => {
														if (!canInteract) {
															return;
														}

														if (event.key === 'Enter' || event.key === ' ') {
															event.preventDefault();
															handleToggleRow(item);
														}
													}}
													className={cn(
														'group outline-hidden transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-500/35',
														rowStateClasses,
														selected ? selectedRowClassName : unselectedRowClassName,
														rowClassName
													)}
												>
													{shouldShowSelectionColumn ? (
														<td
															className={cn(
																'border-b border-(--cor-borda)/25 px-3 py-2 align-middle dark:border-(--dark-cor-borda)/35',
																densityCellClassMap[density],
																selectionCellClassName,
																cellClassName
															)}
														>
															<SelectionIndicator checked={selected} />
														</td>
													) : null}

													{resolvedColumns.map((column) => {
														const align = column.align ?? 'left';
														const cellAlignmentClass =
															align === 'center'
																? 'text-center'
																: align === 'right'
																	? 'text-right'
																	: 'text-left';

														const cellValue = column.render
															? column.render(item.row)
															: (item.row[column.key] as React.ReactNode);

														return (
															<td
																key={`${item.key}-${column.key}`}
																className={cn(
																	'border-b border-(--cor-borda)/25 align-middle text-sm dark:border-(--dark-cor-borda)/35',
																	densityCellClassMap[density],
																	cellAlignmentClass,
																	column.widthClassName,
																	column.cellClassName,
																	cellClassName
																)}
															>
																{cellValue}
															</td>
														);
													})}
												</tr>
											);
										})
									)}
								</tbody>
							</table>
						</div>
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
) as CustomSelectGridComponent;

CustomSelectGrid.displayName = 'CustomSelectGrid';

export default CustomSelectGrid;
