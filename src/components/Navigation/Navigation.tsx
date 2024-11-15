'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import {
	userDailyPhotoIsCompleted,
	userIsDailyRewardClaimedSelector,
} from '@/model/user/selectors';
import { useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';

const tabs: {
	icon: string;
	name: string;
	url: string;
	isHidden?: boolean;
}[] = [
	{
		icon: '/assets/icons/battle.svg',
		name: 'Battle',
		url: '/battle',
		isHidden: process.env.NEXT_PUBLIC_BATTLES_HIDDEN === 'true',
	},
	{
		icon: '/assets/icons/camera.svg',
		name: 'Photo',
		url: '/photo/gallery',
	},
	{
		icon: '/assets/icons/pickaxe.svg',
		name: 'Tap',
		url: '/tap',
	},
	{
		icon: '/assets/icons/friends.svg',
		name: 'Friends',
		url: '/friends',
	},
	{
		icon: '/assets/icons/task.svg',
		name: 'Tasks',
		url: '/tasks',
	},
];

export function Navigation() {
	const pathname = usePathname();
	const { lang } = useContext(AppContext);
	return (
		<div
			className={
				'z-10 mx-auto my-0 flex h-[71px] w-full justify-between rounded-tl rounded-tr bg-[#041837] p-[5px] px-[10px] pb-[10px] drop-shadow-[0_-15px_10px_rgba(0,0,0,0.1)]'
			}
		>
			{tabs
				.filter(({ isHidden }) => !isHidden)
				.map((tab) => (
					<Tab
						{...tab}
						key={tab.name}
						isActive={`/${lang}${tab.url}` === pathname}
					/>
				))}
		</div>
	);
}

export interface TabProps {
	name: string;
	icon: string;
	url: string;
	isActive: boolean;
}

export function Tab({ name, icon, url, isActive }: TabProps) {
	const isDailyRewardClaimed = useSelector(userIsDailyRewardClaimedSelector);
	const isDailyPhotoCompleted = useSelector(userDailyPhotoIsCompleted);

	const { lang } = useContext(AppContext);

	return (
		<Link
			style={{ backgroundColor: isActive ? '#144272' : 'transparent' }}
			className={
				'w-50 relative flex h-[60px] flex-col items-center justify-between gap-y-[6px] rounded px-[20px] pb-[5px] pt-[8px]'
			}
			onClick={() =>
				window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
			}
			href={`/${lang}${url}`}
		>
			{name === 'Tasks' &&
				(!isDailyRewardClaimed || !isDailyPhotoCompleted) && (
					<span
						className={
							'absolute right-[7px] top-[5px] h-[5px] w-[5px] rounded-[50%] bg-[red]'
						}
					></span>
				)}
			<img color={'red'} src={icon} alt={''} />
			<span className={'text-xsm'}>{name}</span>
		</Link>
	);
}
