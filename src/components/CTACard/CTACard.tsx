import { Money } from '../Money/Money';

interface CTACardProps {
	iconUrl?: string;
	title: string;
	profit: number;
	description?: string;
	clickable?: boolean;
}

export function CTACard(props: CTACardProps) {
	const { iconUrl, title, profit, description, clickable = false } = props;

	return (
		<article
			className={`grid w-full grid-cols-[max-content_1fr] gap-x-[10px] rounded bg-light-blue px-[12px] py-[10px] ${clickable && 'active:bg-[#183368]'}`}
		>
			<div>
				<img src={iconUrl} />
			</div>
			<div className={'grid gap-y-[5px]'}>
				<span className={'text-lg font-medium'}>{title}</span>
				<div className={'flex items-center gap-x-[10px]'}>
					<Money size={'md'} amount={profit} />
					{description && (
						<p className={'text-sm text-[#939393]'}>{description}</p>
					)}
				</div>
			</div>
		</article>
	);
}
