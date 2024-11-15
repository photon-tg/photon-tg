'use client';

import Coin from '@/../public/assets/icons/photon.svg';
import { Button } from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';

export function EmptyMessage() {
	const router = useRouter();
	const { lang } = useContext(AppContext);
	return (
		<div className={'flex flex-col rounded bg-[#062243] px-[30px] py-[24px]'}>
			<h2 className={'mb-[15px] text-center text-xl'}>Your gallery is empty</h2>
			<div className={'mb-[30px] text-lg'}>
				Make your first photo and earn
				<Money />
			</div>
			<Button
				onClick={() => router.push(`/${lang}/photo/camera`)}
				width={'100%'}
			>
				Take a photo
			</Button>
		</div>
	);
}

function Money() {
	return (
		<div className={'inline-block'}>
			<div
				className={
					'flex translate-x-[7px] translate-y-[4px] items-center gap-x-[5px] font-semibold text-sky-blue'
				}
			>
				<Coin />
				+5000
			</div>
		</div>
	);
}
