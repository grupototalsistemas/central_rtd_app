'use client';

import Label from '@/components/form/Label';
import { CalenderIcon } from '@/icons';
import { cn } from '@/utils/cn';
import { format, isValid, parse } from 'date-fns';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';
import * as React from 'react';
import type { FieldError } from 'react-hook-form';

type InputError = boolean | string | FieldError | null | undefined;
type DatepickerLocale = flatpickr.Options.LocaleKey | Partial<flatpickr.CustomLocale>;

type DateValueChangeHandler = (value: string, date: Date | null) => void;

export interface CustomDateInputProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		'type' | 'value' | 'defaultValue'
	> {
	value?: string;
	defaultValue?: string;
	label?: React.ReactNode;
	hint?: React.ReactNode;
	helperText?: React.ReactNode;
	helperId?: string;
	error?: InputError;
	success?: boolean;
	containerClassName?: string;
	labelClassName?: string;
	inputClassName?: string;
	hintClassName?: string;
	leftAdornment?: React.ReactNode;
	rightAdornment?: React.ReactNode;
	displayFormat?: string;
	acceptedInputFormats?: readonly string[];
	outputFormat?: string;
	locale?: DatepickerLocale;
	showDatepicker?: boolean;
	showCalendarButton?: boolean;
	openDatepickerOnFocus?: boolean;
	onValueChange?: DateValueChangeHandler;
	onInvalidDate?: (inputValue: string) => void;
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

const normalizeDate = (date: Date): Date => {
	const normalized = new Date(date);
	normalized.setHours(12, 0, 0, 0);
	return normalized;
};

const parseStrict = (value: string, dateFormat: string): Date | null => {
	if (!value) {
		return null;
	}

	try {
		const parsed = parse(value, dateFormat, new Date());
		if (!isValid(parsed)) {
			return null;
		}

		if (format(parsed, dateFormat) !== value) {
			return null;
		}

		return normalizeDate(parsed);
	} catch {
		return null;
	}
};

const parseWithFormats = (
	value: string,
	formats: readonly string[]
): Date | null => {
	for (const dateFormat of formats) {
		const parsed = parseStrict(value, dateFormat);
		if (parsed) {
			return parsed;
		}
	}

	return null;
};

const toFlatpickrFormat = (dateFormat: string): string => {
	return dateFormat
		.replaceAll('yyyy', 'Y')
		.replaceAll('dd', 'd')
		.replaceAll('MM', 'm');
};

const formatSafely = (date: Date, dateFormat: string, fallback: string): string => {
	try {
		return format(date, dateFormat);
	} catch {
		return fallback;
	}
};

const resolveDisplayValue = (
	rawValue: string,
	parseFormats: readonly string[],
	displayFormat: string
): string => {
	if (!rawValue) {
		return '';
	}

	const parsedDate = parseWithFormats(rawValue, parseFormats);
	if (!parsedDate) {
		return rawValue;
	}

	return formatSafely(parsedDate, displayFormat, rawValue);
};

const setForwardedRef = <T,>(
	ref: React.ForwardedRef<T>,
	value: T | null
): void => {
	if (typeof ref === 'function') {
		ref(value);
		return;
	}

	if (ref) {
		(ref as React.MutableRefObject<T | null>).current = value;
	}
};

const CustomDateInput = React.forwardRef<HTMLInputElement, CustomDateInputProps>(
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
			value,
			defaultValue,
			onValueChange,
			onInvalidDate,
			displayFormat = 'dd/MM/yyyy',
			acceptedInputFormats = ['dd/MM/yyyy'],
			outputFormat,
			locale = Portuguese,
			showDatepicker = true,
			showCalendarButton = true,
			openDatepickerOnFocus = true,
			containerClassName,
			labelClassName,
			inputClassName,
			hintClassName,
			leftAdornment,
			rightAdornment,
			placeholder,
			className,
			onChange,
			onBlur,
			'aria-describedby': ariaDescribedBy,
			'aria-invalid': ariaInvalid,
			...rest
		},
		ref
	) => {
		const generatedId = React.useId();
		const inputId = id ?? name ?? `custom-date-input-${generatedId}`;
		const outputDateFormat = outputFormat ?? displayFormat;

		const parseFormats = React.useMemo(() => {
			return Array.from(
				new Set([displayFormat, outputDateFormat, ...acceptedInputFormats])
			);
		}, [acceptedInputFormats, displayFormat, outputDateFormat]);

		const isControlled = value !== undefined;
		const controlledDisplayValue = React.useMemo(
			() =>
				resolveDisplayValue(value ?? '', parseFormats, displayFormat),
			[value, parseFormats, displayFormat]
		);

		const [uncontrolledDisplayValue, setUncontrolledDisplayValue] =
			React.useState(() =>
				resolveDisplayValue(defaultValue ?? '', parseFormats, displayFormat)
			);

		const displayValue = isControlled
			? controlledDisplayValue
			: uncontrolledDisplayValue;

		const inputRef = React.useRef<HTMLInputElement | null>(null);
		const pickerRef = React.useRef<flatpickr.Instance | null>(null);

		const errorMessage = getErrorMessage(error);
		const isError = Boolean(error) && !disabled;
		const hasSuccess = !isError && success;
		const feedback = errorMessage ?? helperText ?? hint;
		const feedbackId = feedback ? helperId ?? `${inputId}-hint` : undefined;

		const resolvedAriaDescribedBy = [ariaDescribedBy, feedbackId]
			.filter(Boolean)
			.join(' ')
			.trim();

		const emitValueChange = React.useCallback(
			(date: Date | null) => {
				if (!onValueChange) {
					return;
				}

				if (!date) {
					onValueChange('', null);
					return;
				}

				onValueChange(
					formatSafely(date, outputDateFormat, format(date, displayFormat)),
					date
				);
			},
			[displayFormat, onValueChange, outputDateFormat]
		);

		const commitParsedValue = React.useCallback(
			(date: Date, syncPicker = true) => {
				const normalizedDate = normalizeDate(date);
				const formattedDisplayValue = formatSafely(
					normalizedDate,
					displayFormat,
					''
				);

				if (!isControlled) {
					setUncontrolledDisplayValue(formattedDisplayValue);
				}

				if (syncPicker) {
					pickerRef.current?.setDate(normalizedDate, false);
				}

				emitValueChange(normalizedDate);
			},
			[displayFormat, emitValueChange, isControlled]
		);

		const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			const nextValue = event.target.value;

			if (!isControlled) {
				setUncontrolledDisplayValue(nextValue);
			}

			onChange?.(event);

			const trimmed = nextValue.trim();
			if (!trimmed) {
				pickerRef.current?.clear();
				emitValueChange(null);
				return;
			}

			const parsedDate = parseWithFormats(trimmed, parseFormats);
			if (!parsedDate) {
				emitValueChange(null);
				return;
			}

			commitParsedValue(parsedDate);
		};

		const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
			onBlur?.(event);

			const trimmed = event.currentTarget.value.trim();
			if (!trimmed) {
				if (!isControlled) {
					setUncontrolledDisplayValue('');
				}
				emitValueChange(null);
				return;
			}

			const parsedDate = parseWithFormats(trimmed, parseFormats);
			if (!parsedDate) {
				onInvalidDate?.(trimmed);
				return;
			}

			commitParsedValue(parsedDate);
		};

		const handlePickerChange = React.useCallback(
			(selectedDates: Date[]) => {
				const selectedDate = selectedDates[0] ?? null;
				if (!selectedDate) {
					if (!isControlled) {
						setUncontrolledDisplayValue('');
					}
					emitValueChange(null);
					return;
				}

				commitParsedValue(selectedDate, false);
			},
			[commitParsedValue, emitValueChange, isControlled]
		);

		const positionPicker = React.useCallback(
			(instance: flatpickr.Instance) => {
				const inputElement = inputRef.current;
				const calendarElement = instance.calendarContainer;

				if (!inputElement || !calendarElement) {
					return;
				}

				const viewportPadding = 8;
				const verticalGap = 8;

				const inputRect = inputElement.getBoundingClientRect();
				const calendarRect = calendarElement.getBoundingClientRect();
				const calendarHeight = calendarRect.height || 320;
				const calendarWidth = calendarRect.width || 307;

				const spaceBelow = window.innerHeight - inputRect.bottom - verticalGap;
				const spaceAbove = inputRect.top - verticalGap;
				const shouldOpenBelow =
					spaceBelow >= calendarHeight || spaceBelow >= spaceAbove;

				const rawTop = shouldOpenBelow
					? inputRect.bottom + window.scrollY + verticalGap
					: inputRect.top + window.scrollY - calendarHeight - verticalGap;

				const minLeft = window.scrollX + viewportPadding;
				const maxLeft =
					window.scrollX + window.innerWidth - calendarWidth - viewportPadding;
				const targetLeft = inputRect.left + window.scrollX;

				const boundedLeft = Math.min(
					Math.max(targetLeft, minLeft),
					Math.max(minLeft, maxLeft)
				);

				calendarElement.style.position = 'absolute';
				calendarElement.style.top = `${Math.max(
					window.scrollY + viewportPadding,
					rawTop
				)}px`;
				calendarElement.style.left = `${boundedLeft}px`;
			},
			[]
		);

		React.useEffect(() => {
			const inputElement = inputRef.current;
			if (!inputElement) {
				return;
			}

			if (!showDatepicker || disabled || readOnly) {
				pickerRef.current?.destroy();
				pickerRef.current = null;
				return;
			}

			const picker = flatpickr(inputElement, {
				allowInput: true,
				appendTo: document.body,
				clickOpens: openDatepickerOnFocus,
				locale,
				monthSelectorType: 'static',
				position: (_instance, _customElement) => {
					positionPicker(_instance);
				},
				positionElement: inputElement,
				dateFormat: toFlatpickrFormat(displayFormat),
				onOpen: (_, __, instance) => {
					positionPicker(instance);
				},
				onReady: (_, __, instance) => {
					positionPicker(instance);
				},
				onChange: handlePickerChange,
			});

			pickerRef.current = Array.isArray(picker) ? picker[0] : picker;

			return () => {
				pickerRef.current?.destroy();
				pickerRef.current = null;
			};
		}, [
			disabled,
			displayFormat,
			handlePickerChange,
			locale,
			openDatepickerOnFocus,
			positionPicker,
			readOnly,
			showDatepicker,
		]);

		React.useEffect(() => {
			if (!pickerRef.current) {
				return;
			}

			if (!displayValue.trim()) {
				pickerRef.current.clear();
				return;
			}

			const parsedDate = parseWithFormats(displayValue.trim(), parseFormats);
			if (!parsedDate) {
				return;
			}

			pickerRef.current.setDate(parsedDate, false);
		}, [displayValue, parseFormats]);

		const assignInputRef = React.useCallback(
			(node: HTMLInputElement | null) => {
				inputRef.current = node;
				setForwardedRef(ref, node);
			},
			[ref]
		);

		const shouldRenderCalendarButton =
			showDatepicker && showCalendarButton && !disabled;

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

		const paddingClasses = cn({
			'pl-10': Boolean(leftAdornment),
			'pr-10': Boolean(rightAdornment) && !shouldRenderCalendarButton,
			'pr-20': shouldRenderCalendarButton && !rightAdornment,
			'pr-28': shouldRenderCalendarButton && Boolean(rightAdornment),
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

				<div className="relative">
					{leftAdornment ? (
						<span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500">
							{leftAdornment}
						</span>
					) : null}

					<input
						id={inputId}
						ref={assignInputRef}
						name={name}
						type="text"
						required={required}
						disabled={disabled}
						readOnly={readOnly}
						value={displayValue}
						inputMode="numeric"
						placeholder={placeholder ?? displayFormat}
						aria-invalid={isError || ariaInvalid ? true : undefined}
						aria-describedby={resolvedAriaDescribedBy || undefined}
						onChange={handleInputChange}
						onBlur={handleInputBlur}
						className={cn(
							textLikeBaseClasses,
							textLikeStateClasses,
							readOnly &&
								'read-only:cursor-default read-only:bg-(--cor-edit) read-only:dark:bg-(--dark-cor-edit)',
							paddingClasses,
							className,
							inputClassName
						)}
						{...rest}
					/>

					{rightAdornment ? (
						<span
							className={cn(
								'pointer-events-none absolute inset-y-0 flex items-center text-gray-400 dark:text-gray-500',
								shouldRenderCalendarButton ? 'right-11' : 'right-3'
							)}
						>
							{rightAdornment}
						</span>
					) : null}

					{shouldRenderCalendarButton ? (
						<button
							type="button"
							onClick={() => pickerRef.current?.open()}
							disabled={readOnly}
							aria-label="Abrir calendario"
							className="absolute inset-y-0 right-3 flex items-center text-gray-400 transition-colors hover:text-(--central-azul) focus:outline-hidden focus:text-(--central-azul) disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-500 dark:hover:text-(--dark-cor-texto) dark:focus:text-(--dark-cor-texto)"
						>
							<CalenderIcon />
						</button>
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

CustomDateInput.displayName = 'CustomDateInput';

export default CustomDateInput;
