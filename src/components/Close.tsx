interface CloseProps {
	onClick(): void;
}

export function Close(props: CloseProps) {
	const { onClick } = props;

	return (
		<button
			onClick={onClick}
			className={'relative h-[35px] w-[35px] rounded-[50%] bg-[#0A1225]'}
		>
			<div
				className={
					'absolute left-[50%] top-[50%] h-[2px] w-[18px] translate-x-[-50%] translate-y-[-50%] -rotate-45 rounded bg-[#24428B]'
				}
			></div>
			<div
				className={
					'absolute left-[50%] top-[50%] h-[2px] w-[18px] translate-x-[-50%] translate-y-[-50%] rotate-45 rounded bg-[#24428B]'
				}
			></div>
		</button>
	);
}
