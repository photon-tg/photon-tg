import { formatNumber } from '@/utils/formatter';
import { cn } from '@/utils/cn';

export type MoneySize = 'xxs' | 'xs' | 'md' | 'lg' | 'xl';

export interface MoneyProps {
	amount: number;
	isCompact?: boolean;
	size?: MoneySize;
	withoutPlus?: boolean;
	perHour?: boolean;
	withoutCoin?: boolean;
	activeColor?: boolean;
	bold?: boolean;
}

export function Money(props: MoneyProps) {
	const {
		amount,
		isCompact = false,
		withoutPlus = false,
		perHour = false,
		withoutCoin = false,
		activeColor = false,
		bold = false,
		size = 'md',
	} = props;

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
				width: 20,
				height: 20,
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
		lg: {
			img: {
				width: 21,
				height: 21,
			},
			text: 'text-xl gap-x-[7px] font-medium',
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
			className={cn(
				`flex items-center gap-x-[10px] justify-self-center ${text}`,
				activeColor && 'text-[#42C2FF]',
				bold && 'font-semibold',
			)}
		>
			{!withoutCoin && (
				<img
					width={img.width}
					height={img.height}
					src={'/assets/icons/photon.svg'}
				/>
			)}
			{!withoutPlus && '+'}
			{isCompact ? formatNumber(amount) : amount}
			{perHour && '/hour'}
		</div>
	);
}
