'use client';

import {
	TonConnectButton,
	useTonConnectUI,
	useTonWallet,
} from '@tonconnect/ui-react';
import { Coins } from '@/components/Coins';
import { formatNumber } from '@/utils/formatter';
import { useEffect, useState } from 'react';
import { getAllUserLikes } from '@/model/battle/services';
import { useSelector } from 'react-redux';
import { userIdSelector } from '@/model/user/selectors';
import { useModalContext } from '@/contexts/ModalContext';
import { Button } from '@/components/Button/Button';

export function Wallet() {
	const userId = useSelector(userIdSelector);
	const [likesCount, setLikesCount] = useState(0);

	const { openModal } = useModalContext();
	const [tonConnectUI] = useTonConnectUI();
	const wallet = useTonWallet();
	useEffect(() => {
		(async () => {
			const a = await getAllUserLikes(userId);
			if (typeof a.data === 'number') {
				setLikesCount(a.data);
			}
		})();
	}, []);

	const onDisconnect = () => {
		openModal(<WalletDisconnectWarning />, {
			withoutClose: true,
			position: 'center',
		});
	};

	return (
		<div className={'px-[10px] pt-[20px]'}>
			<div className={'mb-[15px]'}>
				<div
					className={
						'flex items-center justify-center rounded-tl-[10px] rounded-tr-[10px] bg-[#0E3888F2] px-[10px] py-[12px] text-xl'
					}
				>
					Your balance
				</div>
				<div
					className={
						'flex flex-col items-start gap-y-[10px] rounded-bl-[10px] rounded-br-[10px] bg-[#205295] px-[15px] py-[20px]'
					}
				>
					<Coins />
					<div className={'flex flex-row items-center gap-x-[10px]'}>
						<img width={25} src={'/assets/icons/like.svg'} />
						<span className={'text-lg font-semibold'}>
							{formatNumber(likesCount)}
						</span>
					</div>
				</div>
			</div>
			<div className={'flex flex-row gap-x-[5px]'}>
				<TonConnectButton className={'tonConnectButton'} />
				{tonConnectUI.connected || !!wallet ? (
					<button
						className={
							'flex h-[45px] items-center justify-center rounded-[15px] bg-[#2866b9] px-[15px]'
						}
						onClick={onDisconnect}
					>
						<img width={25} src={'/assets/icons/bin.svg'} />
					</button>
				) : null}
			</div>
		</div>
	);
}

function WalletDisconnectWarning() {
	const { closeModal } = useModalContext();
	const [tonConnectUI] = useTonConnectUI();

	const onDisconnect = () => {
		tonConnectUI.connected && tonConnectUI.disconnect();
		closeModal();
	};

	return (
		<div className={'px-[10px]'}>
			<span className={'mb-[10px] block text-xl'}>
				Are you sure you want to unlink your wallet?
			</span>
			<p className={'mb-[15px] text-md font-medium'}>
				It is impossible to receive reward without linked wallet!
			</p>
			<div className={'flex flex-row gap-x-[8px]'}>
				<Button onClick={onDisconnect} variant={'outline'}>
					Disconnect
				</Button>
				<Button onClick={closeModal} variant={'outline'}>
					Cancel
				</Button>
			</div>
		</div>
	);
}
