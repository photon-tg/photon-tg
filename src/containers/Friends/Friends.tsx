'use client';

import { Button } from '@/components/Button/Button';
import { CTACard } from '@/components/CTACard/CTACard';
import { appURL } from '@/constants/urls';

export function Friends() {
	const onReferealLink = () => {
		navigator.clipboard.writeText(appURL);
	};

	const onShare = async () => {
		const shareData = {
			title: 'Photon',
			text: 'Join Photon!',
			url: appURL,
		};

		const canShare = navigator.canShare(shareData);

		if (canShare) {
			const shareResult = navigator.share(shareData);
			console.log(shareResult);
		}
	};

	return (
		<div
			className={
				'relative flex h-full flex-col items-center px-[15px] py-[50px]'
			}
		>
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
					title={'Invite a friend'}
					description={'for you and your friend'}
					profit={5000}
					iconUrl={'/assets/present.png'}
				/>
			</div>
			<div
				className={
					'absolute bottom-0 left-0 grid w-full gap-y-[10px] px-[15px] pb-[20px]'
				}
			>
				<Button onClick={onReferealLink} variant={'outline'}>
					Referal link
				</Button>
				<Button onClick={onShare} variant={'filled'}>
					Invite a friend
				</Button>
			</div>
		</div>
	);
}
