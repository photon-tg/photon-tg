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
				'z-10 mx-auto my-0 flex w-full justify-between rounded border-t-[1px] border-solid border-inactive-grey bg-dark-blue p-[5px] px-[10px]'
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
			className={`w-50 flex flex-col items-center gap-y-[6px] rounded px-[20px] py-[7px] ${isActive && 'bg-gradient-to-b from-light-blue from-0% to-deep-blue to-80%'}`}
			onClick={() =>
				window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
			}
			href={url}
		>
			<img className={'w-6'} src={icon} alt={''} />
			<span className={'text-xsm'}>{name}</span>
		</Link>
	);
}
