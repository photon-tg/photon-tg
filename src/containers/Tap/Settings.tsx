import { Locale, Locales } from '@/constants/locales';
import { useDispatch, useSelector } from 'react-redux';
import { selectedLocaleSelector } from '@/model/translations/selectors';
import { cn } from '@/utils/cn';
import { operationSelectLocale } from '@/model/translations/operations/operationSelectLocale';
import { useModalContext } from '@/contexts/ModalContext';

export function Settings() {
	const selectedLocale = useSelector(selectedLocaleSelector);
	const dispatch = useDispatch();
	const { closeModal } = useModalContext();

	const onSelect = (code: Locales) => {
		dispatch(operationSelectLocale(code));
		closeModal();
	};

	return (
		<div className={'h-[100px] w-[100px]'}>
			<div className={'mb-[10px] text-lg'}>Languages</div>
			<ul>
				{Object.entries(Locale).map(([name, code]) => (
					<button
						onClick={() => onSelect(code)}
						className={'flex flex-row items-center gap-x-[10px] py-[10px]'}
						key={name}
					>
						<div
							className={cn(
								'h-[15px] w-[15px] rounded-[50%] border-[1px] border-[white]',
								selectedLocale === code && 'bg-[white]',
							)}
						></div>
						<span className={'text-md'}>{name}</span>
					</button>
				))}
			</ul>
		</div>
	);
}
