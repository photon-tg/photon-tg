import { cn } from '@/utils/cn';
import { MouseEventHandler, PropsWithChildren } from 'react';

export interface ButtonProps {
	variant?: 'outline' | 'filled';
	width?: string | number;
	fz?: string;
	size?: 'lg' | 'sm';
	height?: string | number;
	disabled?: boolean;
	noInnerStyle?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	className?: string;
}

export function Button(props: PropsWithChildren<ButtonProps>) {
	const {
		children,
		variant = 'outline',
		width = '100%',
		noInnerStyle = false,
		disabled,
		size = 'md',
		onClick,
		height,
		className,
		fz,
	} = props;

	return (
		<div
			style={{ width }}
			className={cn(
				'h-fit w-full rounded p-[2px]',
				variant === 'outline' &&
					!disabled &&
					'bg-gradient-to-tr from-light-blue from-0% to-sky-blue to-100%',
				variant === 'filled' &&
					!disabled &&
					'bg-gradient-to-tr from-sky-blue to-saturated-blue',
				disabled && 'bg-[#1b2b50]',
				className ?? '',
			)}
		>
			<button
				style={{ height }}
				disabled={disabled}
				onClick={onClick}
				className={cn(
					'w-full rounded px-[30px] py-[15px] text-center text-lg font-semibold',
					variant === 'outline' &&
						!disabled &&
						'bg-[#041837] active:bg-gradient-to-tr active:from-light-blue active:from-0% active:to-sky-blue active:to-100%',
					variant === 'filled' &&
						!disabled &&
						'bg-gradient-to-tr from-sky-blue to-saturated-blue',
					disabled && 'bg-[#1b2b50]',
					size === 'sm' && 'px-[10px] py-[7px]',
				)}
			>
				{children}
			</button>
		</div>
	);
}
