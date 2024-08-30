'use client';

import { Button } from '@/components/Button/Button';
import { CTACard } from '@/components/CTACard/CTACard';
import { appURL } from '@/constants/urls';
import { useApplicationContext } from '@/contexts/ApplicationContext/ApplicationContext';
import { useUserContext } from '@/contexts/UserContext';

export function Friends() {
	const { referrals } = useApplicationContext();
	const { user } = useUserContext();
	const onReferealLink = () => {
		window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
		navigator.clipboard.writeText(`https://${appURL}?startapp=friendId${user.telegram_id}`);
	};

	const onShare = async () => {
		const shareData = {
			title: 'Photon',
			text: 'Join Photon!',
			url: `https://${appURL}?startapp=friendId${user.telegram_id}`,
		};

		const canShare = navigator.canShare(shareData);

		if (canShare) {
			const shareResult = navigator.share(shareData);
		}
	};

	return (
		<div
			className={
				'gap-y-[10px] flex h-full flex-col items-center px-[15px] pt-[30px] justify-between'
			}
		>
			<div className={'flex flex-col items-center relative overflow-auto'}>
				<h1 className={'mb-[10px] text-xxl'}>Invite friends!</h1>
				<p
					className={'mb-[20px] max-w-[230px] text-center text-sm text-text-blue'}
				>
					you and your friend will receive bonuses for participation
				</p>
				<div className={'mb-[20px] flex w-full flex-col gap-y-[10px]'}>
					<CTACard
						title={'Invite a friend'}
						description={'for you and your friend'}
						profit={5000}
						iconUrl={'/assets/present.png'}
					/>
					<CTACard
						title={'Invite a friend with Telegram premium'}
						description={'for you and your friend'}
						profit={25000}
						iconUrl={'/assets/icons/presents.png'}
					/>
				</div>
				<div className={'w-full mb-[15px]'}>
					<span className={'text-start text-md mb-[10px] inline-block'}>Friends list</span>
					{!referrals?.length && (
						<div className={'text-inactive-grey text-md font-semibold text-[16px] text-center'}>Empty</div>
					)}
					{!!referrals?.length && (
						<div className={'flex flex-col gap-y-[10px]'}>
							{referrals.map((ref) => {
								return (
									<div key={ref.firstName} className={'bg-inactive-grey rounded py-[12px] px-[20px] flex flex-col gap-x-[5px]'}>
										<div>
											<span className={'text-md'}>{ref.firstName}</span>
										</div>
										<div>
											<span className={'text-md text-[#42C2FF]'}>Lvl {ref.level}</span>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
			<div
				className={
					'justify-self-end grid w-full gap-y-[10px] pb-[20px]'
				}
			>
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
