'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const tabs = [
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
	return (
		<div
			className={
				'z-10 mx-auto my-0 flex h-[71px] w-full justify-between rounded-tl rounded-tr bg-[#041837] p-[5px] px-[10px] pb-[10px] drop-shadow-[0_-15px_10px_rgba(0,0,0,0.1)]'
			}
		>
			{tabs.map((tab) => (
				<Tab {...tab} key={tab.name} isActive={tab.url === pathname} />
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
	return (
		<Link
			style={{ backgroundColor: isActive ? '#144272' : 'transparent' }}
			className={
				'w-50 flex flex-col items-center gap-y-[6px] rounded px-[20px] py-[7px]'
			}
			onClick={() =>
				window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
			}
			href={url}
		>
			<img width={25} height={25} color={'red'} src={icon} alt={''} />
			<span className={'text-xsm'}>{name}</span>
		</Link>
	);
}
