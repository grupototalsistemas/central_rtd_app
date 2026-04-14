'use client';

import { cn } from '@/utils/cn';
import type {
	ButtonHTMLAttributes,
	CSSProperties,
	MouseEventHandler,
	ReactNode,
} from 'react';

export interface CustomButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'onClick'> {
	title: ReactNode;
	description?: ReactNode;
	onClick: MouseEventHandler<HTMLButtonElement>;
	size?: 'sm' | 'md' | 'lg';
	isActive?: boolean;
	backgroundColor?: string;
	textColor?: string;
	hoverBackgroundColor?: string;
	hoverTextColor?: string;
	activeBackgroundColor?: string;
	activeTextColor?: string;
	titleClassName?: string;
	descriptionClassName?: string;
}

export default function CustomButton({
	title,
	description,
	onClick,
	className,
	size,
	isActive = false,
	backgroundColor,
	textColor,
	hoverBackgroundColor,
	hoverTextColor,
	activeBackgroundColor,
	activeTextColor,
	titleClassName,
	descriptionClassName,
	type,
	style,
	...rest
}: CustomButtonProps) {
	const sizeClasses = {
		sm: 'px-4 py-1.5 rounded-xl',
		md: 'px-6 py-2 rounded-2xl',
		lg: 'px-7 py-3 rounded-2xl',
	} as const;

	const colorStyle = {
		...(backgroundColor ? { '--custom-btn-bg': backgroundColor } : {}),
		...(textColor ? { '--custom-btn-text': textColor } : {}),
		...(hoverBackgroundColor ? { '--custom-btn-hover-bg': hoverBackgroundColor } : {}),
		...(hoverTextColor ? { '--custom-btn-hover-text': hoverTextColor } : {}),
		...(activeBackgroundColor ? { '--custom-btn-active-bg': activeBackgroundColor } : {}),
		...(activeTextColor ? { '--custom-btn-active-text': activeTextColor } : {}),
	} as CSSProperties;

	const mergedStyle = {
		...colorStyle,
		...style,
	} as CSSProperties;

	return (
		<button
			type={type ?? 'button'}
			onClick={onClick}
			className={cn(
				'navigatorButton justify-start text-left transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/28 dark:focus:ring-brand-500/35 disabled:cursor-not-allowed disabled:opacity-70',
				isActive ? 'navigatorButtonActive' : 'navigatorButtonInactive',
				size ? 'w-auto self-start' : 'w-full',
				size ? sizeClasses[size] : '',
				backgroundColor ? 'bg-(--custom-btn-bg)!' : '',
				textColor ? 'text-(--custom-btn-text)!' : '',
				hoverBackgroundColor ? 'hover:bg-(--custom-btn-hover-bg)!' : '',
				hoverTextColor ? 'hover:text-(--custom-btn-hover-text)!' : '',
				activeBackgroundColor ? 'active:bg-(--custom-btn-active-bg)!' : '',
				activeTextColor ? 'active:text-(--custom-btn-active-text)!' : '',
				className
			)}
			style={mergedStyle}
			{...rest}
		>
			<span className="flex min-w-0 flex-col items-start gap-0.5">
				<span
					className={cn(
						'max-w-full truncate text-sm font-semibold text-current',
						titleClassName
					)}
				>
					{title}
				</span>

				{description ? (
					<span
						className={cn(
							'line-clamp-2 max-w-full text-xs text-current opacity-85',
							descriptionClassName
						)}
					>
						{description}
					</span>
				) : null}
			</span>
		</button>
	);
}
