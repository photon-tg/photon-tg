'use client';

import { Close } from '@/components/Close';
import {
	createContext,
	PropsWithChildren,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import { cn } from '@/utils/cn';

export type ModalContextPositions = 'bottom' | 'center';

export interface OpenModalOptions {
	position?: ModalContextPositions;
	withoutClose?: boolean;
}

export interface ModalContext {
	openModal(component: ReactNode, options?: OpenModalOptions): void;
	closeModal(): void;
}

const initialModalContext: ModalContext = {
	openModal() {},
	closeModal() {},
};

export const ModalContext = createContext<ModalContext>(initialModalContext);

export function ModalContextProvider({ children }: PropsWithChildren<{}>) {
	const [modalContent, setModalContent] = useState<ReactNode>(null);
	const [options, setOptions] = useState<OpenModalOptions>();

	const openModal = useCallback(
		(component: ReactNode, options: OpenModalOptions) => {
			setModalContent(component);
			setOptions({
				...options,
				position: options?.position ?? 'bottom',
			});
		},
		[],
	);

	const closeModal = useCallback(() => {
		setModalContent(null);
	}, []);

	const value = useMemo(
		() => ({
			openModal,
			closeModal,
		}),
		[openModal, closeModal],
	);

	return (
		<ModalContext.Provider value={value}>
			<div
				style={{ filter: modalContent ? 'blur(3px)' : '' }}
				className={cn(
					'h-full w-full',
					modalContent && 'pointer-events-none z-10 bg-dark-blue opacity-50',
				)}
			>
				{children}
			</div>
			{modalContent && (
				<div
					className={cn(
						'absolute z-20 w-full',
						options?.position === 'bottom' && 'bottom-0 left-0',
						options?.position === 'center' &&
							'left-0 top-[50%] translate-y-[-50%]',
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
							<div className={'absolute right-[20px] top-[20px]'}>
								<Close onClick={closeModal} />
							</div>
						)}
						{modalContent}
					</div>
				</div>
			)}
		</ModalContext.Provider>
	);
}

export function useModalContext() {
	const context = useContext(ModalContext);

	if (!context) {
		throw new Error('useModalContext is used outside of ModalContext');
	}

	return context;
}
