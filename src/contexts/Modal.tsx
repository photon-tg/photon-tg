import { cn } from '@/utils/cn';
import { Close } from '@/components/Close';
import { useModalContext } from '@/contexts/ModalContext';

export function Modal() {
	const { closeModal, modalContent, options } = useModalContext();
	console.log(modalContent, 'MD');
	if (!modalContent) return null;

	return (
		<div id={'overlay'} className={'fixed top-0 left-0 w-full h-full bg-opacity-50 bg-[#041837] z-[999]'}>
			<div
				className={cn(
					'absolute z-40 w-full',
					options?.position === 'bottom' && 'bottom-0 left-0',
					options?.position === 'center' &&
					'left-0 top-[50%] translate-y-[-50%]'
				)}
			>
				<div
					className={cn(
						'relative mx-auto max-w-[375px] rounded bg-dark-blue px-[15px] pb-[20px] pt-[50px] drop-shadow-xl',
						options?.withoutClose && 'pt-[30px]',
					)}
					id="modal"
				>
					{!options?.withoutClose && (
						<div className={'absolute right-[20px] top-[20px] z-50'}>
							<Close onClick={closeModal} />
						</div>
					)}
					{modalContent}
				</div>
			</div>
		</div>
	)
}
