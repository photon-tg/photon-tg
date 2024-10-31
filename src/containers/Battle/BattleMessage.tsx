import { Close } from '@/components/Close';

export interface BattleMessageProps {
	onClose(): void;
	title?: string;
	description?: string;
}

export function BattleMessage({
	onClose,
	title,
	description,
}: BattleMessageProps) {
	return (
		<div
			className={
				'relative rounded-[10px] bg-[rgba(39,71,132,80%)] px-[15px] py-[10px]'
			}
			style={{ backdropFilter: 'blur(5px)' }}
		>
			<div className={'absolute right-[15px] top-[15px]'}>
				<Close theme={'light'} size={'sm'} onClick={onClose} />
			</div>
			<span className={'mb-[5px] text-lg font-semibold'}>{title}</span>
			<p
				className={'text-sm'}
				dangerouslySetInnerHTML={{ __html: description || '' }}
			></p>
		</div>
	);
}
