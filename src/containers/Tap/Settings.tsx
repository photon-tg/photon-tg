import { Locales, localeToName } from '@/constants/locales';
import { cn } from '@/utils/cn';
import { useModalContext } from '@/contexts/ModalContext';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';
import { useContent } from '@/containers/Tap/useContent';

export function Settings() {
	const router = useRouter();
	const { closeModal } = useModalContext();
	const { lang } = useContext(AppContext);
	const content = useContent();
	const onSelect = (code: Locales) => {
		router.push(`/${code}`);
		closeModal();
	};

	return (
		<div className={'pb-[30px]'}>
			<div className={'mb-[10px] text-lg'}>{content.languages}</div>
			<ul>
				{Object.entries(localeToName).map(([code, name]) => (
					<button
						onClick={() => onSelect(code as Locales)}
						className={'flex flex-row items-center gap-x-[10px] py-[10px]'}
						key={name}
					>
						<div
							className={cn(
								'h-[15px] w-[15px] rounded-[50%] border-[1px] border-[white]',
								lang === code && 'bg-[white]',
							)}
						></div>
						<span className={'text-md'}>{name}</span>
					</button>
				))}
			</ul>
		</div>
	);
}
