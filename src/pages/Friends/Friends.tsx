'use client';

import { Button } from '@/components/Button/Button';
import { CTACard } from '@/components/CTACard/CTACard';
import { botURL } from '@/constants/urls';
import { getUserLevel } from '@/constants';
import { Money } from '@/components/Money/Money';
import { useSelector } from 'react-redux';
import { userFriendsSelector, userSelector } from '@/model/user/selectors';

export function Friends() {
	const friends = useSelector(userFriendsSelector);
	const user = useSelector(userSelector);
	const encodedReferrerParam = btoa(`referrer=${user.telegram_id}`);
	const onReferealLink = () => {
		window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
		navigator.clipboard.writeText(
			`https://${botURL}?start=${encodedReferrerParam}`,
		);
	};

	const onShare = async () => {
		const url = encodeURIComponent(
			`https://${botURL}?start=${encodedReferrerParam}`,
		);
		const text = encodeURIComponent(
			'Join me in Photon!\n💲+5k coins\nor\n💰+20k coins if you have telegram Premium',
		);
		Telegram.WebApp.openTelegramLink(
			`https://t.me/share/url?url=${url}&text=${text}`,
		);
	};

	return (
		<div
			className={
				'flex h-full flex-col items-center justify-between gap-y-[10px] px-[15px] pt-[30px]'
			}
		>
			<div className={'relative flex flex-col items-center overflow-auto'}>
				<h1 className={'mb-[10px] text-xxl'}>Invite friends!</h1>
				<p
					className={
						'mb-[20px] max-w-[230px] text-center text-sm text-text-blue'
					}
				>
					you and your friend will receive bonuses for participation
				</p>
				<div className={'mb-[20px] flex w-full flex-col gap-y-[10px]'}>
					<CTACard
						title={'Invite a friend'}
						description={'for you and your friend'}
						profit={5000}
						iconUrl={'/assets/icons/present.svg'}
					/>
					<CTACard
						title={'Invite a friend with Telegram premium'}
						description={'for you and your friend'}
						profit={20000}
						iconUrl={'/assets/icons/presents.svg'}
					/>
				</div>
				<div className={'mb-[15px] w-full'}>
					<span className={'mb-[10px] inline-block text-start text-md'}>
						Friends list
					</span>
					{!friends?.length && (
						<div
							className={
								'text-center text-[16px] text-md font-semibold text-inactive-grey'
							}
						>
							Empty
						</div>
					)}
					{!!friends?.length && (
						<div className={'flex flex-col gap-y-[10px]'}>
							{friends.map((friend, i) => {
								return (
									<div
										key={`${friend.first_name}-${i}`}
										className={
											'flex flex-col gap-y-[8px] rounded bg-[#215295] px-[15px] py-[9px]'
										}
									>
										<span className={'text-md'}>
											{friend?.first_name} {friend?.last_name}
										</span>
										<div className={'flex items-center gap-x-[5px]'}>
											<span className={'text-md text-[#42C2FF]'}>
												Lvl {getUserLevel(friend?.coins)}
											</span>
											<div
												className={'h-[4px] w-[4px] rounded-[50%] bg-[#5a8cd1]'}
											></div>
											<Money withoutPlus amount={friend?.coins} size={'xxs'} />
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
			<div className={'grid w-full gap-y-[10px] justify-self-end pb-[20px]'}>
				<Button onClick={onReferealLink} variant={'outline'}>
					Copy referral link
				</Button>
				<Button onClick={onShare} variant={'filled'}>
					Invite a friend
				</Button>
			</div>
		</div>
	);
}
