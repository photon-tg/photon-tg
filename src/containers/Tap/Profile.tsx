'use client';

import Coin from '@/../public/assets/icons/photon.svg';
import { useSelector } from 'react-redux';
import {
	userDataSelector,
	userPassiveIncomeSelector,
} from '@/model/user/selectors';
import { getUserLevel, getUserLevelProgress } from '@/constants';
import { useModalContext } from '@/contexts/ModalContext';
import { Settings } from '@/containers/Tap/Settings';

import { useContent } from '@/containers/Tap/useContent';

export function Profile() {
	const passiveIncome = useSelector(userPassiveIncomeSelector);
	const user = useSelector(userDataSelector);
	const content = useContent();
	const { openModal } = useModalContext();

	const openSettings = () => {
		openModal(<Settings />);
	};

	return (
		<div className={'mb-[5px] grid grid-cols-2 gap-x-[10px] pt-[5px]'}>
			<div className={'grid grid-cols-[max-content_1fr] gap-x-[10px]'}>
				<img
					height={63}
					width={63}
					src={user?.telegramUser.photo_url || '/assets/icons/user.svg'}
					className={'rounded'}
					alt={'avatar'}
				/>
				<div className={'relative grid content-start'}>
					<button
						onClick={openSettings}
						className={'absolute right-0 top-[5px] h-[18px] w-[18px]'}
					>
						<img src={'/assets/icons/settings.svg'} />
					</button>
					<span
						className={'mb-[7px] overflow-hidden overflow-ellipsis text-md'}
					>
						{user.user.first_name || user.user.username}
					</span>
					<span className={'mb-[3px] text-md font-semibold text-sky-blue'}>
						Level {getUserLevel(user.user.coins)}
					</span>
					<div className={'h-[9px] w-full rounded bg-[#2E3F69]'}>
						<div
							className={'h-full rounded bg-sky-blue'}
							style={{ width: `${getUserLevelProgress(user.user.coins)}%` }}
						></div>
					</div>
				</div>
			</div>
			<div className={'grid rounded bg-[#041837] px-[20px] py-[10px]'}>
				<span className={'text-md'}>{content.profitPerHour}</span>
				<div className={'flex gap-x-[5px] text-md'}>
					<Coin /> +{passiveIncome}
				</div>
			</div>
		</div>
	);
}
