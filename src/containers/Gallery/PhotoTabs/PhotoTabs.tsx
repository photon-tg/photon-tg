'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { AppContext } from '@/contexts/AppContext';

const tabs = [
	{
		name: 'Gallery',
		icon: '/assets/icons/gallery.svg',
		url: '/photo/gallery',
		id: 1,
	},
	{
		name: 'Camera',
		icon: '/assets/icons/camera-photo.svg',
		url: '/photo/camera',
		id: 2,
	},
];

export function PhotoTabs() {
	const [activeTab, setActiveTab] = useState<number | null>(tabs[0].id);

	return (
		<div className={'mx-auto flex w-fit gap-x-[14px]'}>
			{tabs.map((tab) => (
				<Tab
					{...tab}
					isActive={activeTab === tab.id}
					onClick={() => setActiveTab(tab.id)}
					key={tab.url}
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
	onClick(): void;
}

export function Tab({ name, icon, url, isActive, onClick }: TabProps) {
	const { lang } = useContext(AppContext);
	return (
		<Link
			style={{
				backgroundColor: isActive ? '#155596' : '#102547',
			}}
			className={
				'flex w-[130px] flex-col items-center gap-y-[6px] rounded px-[30px] py-[8px]'
			}
			href={`/${lang}${url}`}
			onClick={onClick}
		>
			<img width={40} src={icon} />
			<span className={'text-xsm'}>{name}</span>
		</Link>
	);
}
