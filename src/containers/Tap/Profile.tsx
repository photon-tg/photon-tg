'use client';

import Coin from '@/../public/assets/icons/photon.svg';
import { useSelector } from 'react-redux';
import { userDataSelector, userPassiveIncomeSelector } from '@/model/user/selectors';
import { getUserLevel, getUserLevelProgress } from '@/constants';

export function Profile() {
	const passiveIncome = useSelector(userPassiveIncomeSelector);
	const user = useSelector(userDataSelector);

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
				<div className={'grid content-start'}>
					<span className={'mb-[7px] text-md'}>
						{user.user.first_name}
					</span>
					<span className={'text-md font-semibold text-sky-blue mb-[3px]'}>
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
				<span className={'text-md'}>Profit per hour</span>
				<div className={'flex gap-x-[5px] text-md'}>
					<Coin /> +{passiveIncome}
				</div>
			</div>
		</div>
	);
}
