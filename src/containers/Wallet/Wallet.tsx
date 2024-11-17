'use client';

import { TonConnectButton, useTonAddress, useTonWallet } from '@tonconnect/ui-react';
import { Coins } from '@/components/Coins';
import { formatNumber } from '@/utils/formatter';
import { useEffect, useState } from 'react';
import { getAllUserLikes } from '@/model/battle/services';
import { useSelector } from 'react-redux';
import { userIdSelector } from '@/model/user/selectors';

export function Wallet() {
	const userFriendlyAddress = useTonAddress();
	const rawAddress = useTonAddress(false);
	const wallet = useTonWallet();
	const userId = useSelector(userIdSelector);
	const [likesCount, setLikesCount] = useState(0);

	useEffect(() => {
		(async () => {
			const a = await getAllUserLikes(userId);
			if (typeof a.data === 'number') {
				setLikesCount(a.data);
			}
		})();
	}, []);

	return (
		<div className={'px-[10px] pt-[20px]'}>
			<div className={'mb-[15px]'}>
				<div className={'bg-[#0E3888F2] flex items-center justify-center px-[10px] py-[12px] text-xl rounded-tl-[10px] rounded-tr-[10px]'}>Your balance</div>
				<div className={'bg-[#205295] px-[15px] py-[20px] flex flex-col items-start gap-y-[10px] rounded-bl-[10px] rounded-br-[10px]'}>
					<Coins />
					<div className={'flex flex-row items-center gap-x-[10px]'}>
						<img width={25} src={'/assets/icons/like.svg'} />
						<span className={'text-lg font-semibold'}>{formatNumber(likesCount)}</span>
					</div>
				</div>
			</div>
			<TonConnectButton className={'tonConnectButton'} />
		</div>
	);
}
