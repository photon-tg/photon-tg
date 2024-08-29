import { cn } from '@/utils/cn';
import { MouseEventHandler, PropsWithChildren } from 'react';

export interface ButtonProps {
	variant?: 'outline' | 'filled';
	width?: string | number;
	size?: 'lg';
	disabled?: boolean;

	onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button(props: PropsWithChildren<ButtonProps>) {
	const {
		children,
		variant = 'outline',
		width = 'fit-content',
		disabled,
		size = 'md',
		onClick,
	} = props;

	return (
		<div
			className={cn(
				'w-[${width}] rounded p-[2px]',
				variant === 'outline' &&
					!disabled &&
					'bg-gradient-to-tr from-light-blue from-0% to-sky-blue to-100%',
				variant === 'filled' &&
					!disabled &&
					'bg-gradient-to-tr from-sky-blue to-saturated-blue',
				disabled && 'bg-inactive-grey',
			)}
		>
			<button
				disabled={disabled}
				onClick={onClick}
				className={cn(
					'w-full rounded px-[30px] py-[15px] text-center text-lg font-semibold',
					variant === 'outline' &&
						!disabled &&
						'bg-dark-blue active:bg-gradient-to-tr active:from-light-blue active:from-0% active:to-sky-blue active:to-100%',
					variant === 'filled' &&
						!disabled &&
						'bg-gradient-to-tr from-sky-blue to-saturated-blue',
					disabled && 'bg-inactive-grey',
				)}
			>
				{children}
			</button>
		</div>
	);
}
