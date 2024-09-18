import { formatNumber } from '@/utils/formatter';

export type MoneySize = 'xxs' | 'xs' | 'md' | 'xl';

export interface MoneyProps {
	amount: number;
	isCompact?: boolean;
	size?: MoneySize;
	withoutPlus?: boolean;
}

export function Money(props: MoneyProps) {
	const { amount, isCompact = false, withoutPlus = false, size = 'md' } = props;

	const sizeMap: Record<
		MoneySize,
		{ img: { width: number; height: number }; text: string }
	> = {
		xxs: {
			img: {
				width: 15,
				height: 15,
			},
			text: 'text-sm gap-x-[3px]',
		},
		xs: {
			img: {
				width: 22,
				height: 22,
			},
			text: 'text-sm gap-x-[3px]',
		},
		md: {
			img: {
				width: 22,
				height: 22,
			},
			text: 'text-md gap-x-[5px]',
		},
		xl: {
			img: {
				width: 40,
				height: 40,
			},
			text: 'text-xxl gap-x-[10px]',
		},
	};

	const { img, text } = sizeMap[size];

	return (
		<div
			className={`flex items-center gap-x-[10px] justify-self-center ${text}`}
		>
			<img
				width={img.width}
				height={img.height}
				src={'/assets/icons/photon.svg'}
			/>
			{!withoutPlus && '+'}
			{isCompact ? formatNumber(amount) : amount}
		</div>
	);
}
