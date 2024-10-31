import { cn } from '@/utils/cn';

interface CloseProps {
	onClick(): void;
	size?: 'sm' | 'md';
	theme?: 'light' | 'dark';
}

export function Close(props: CloseProps) {
	const { onClick, size = 'md', theme = 'dark' } = props;

	return (
		<button
			onClick={onClick}
			className={cn(
				'relative h-[35px] w-[35px] rounded-[50%] bg-[#0A1225]',
				size === 'sm' && 'h-[25px] w-[25px]',
				theme === 'light' && 'bg-[#A5BFFA]',
			)}
		>
			<div
				className={
					'absolute left-[50%] top-[50%] h-[2px] w-[55%] translate-x-[-50%] translate-y-[-50%] -rotate-45 rounded bg-[#24428B]'
				}
			></div>
			<div
				className={
					'absolute left-[50%] top-[50%] h-[2px] w-[55%] translate-x-[-50%] translate-y-[-50%] rotate-45 rounded bg-[#24428B]'
				}
			></div>
		</button>
	);
}
