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

export interface ModalContext {
	openModal(component: ReactNode): void;
	closeModal(): void;
}

const initialModalContext: ModalContext = {
	openModal() {},
	closeModal() {},
};

export const ModalContext = createContext<ModalContext>(initialModalContext);

export function ModalContextProvider({ children }: PropsWithChildren<{}>) {
	const [modalContent, setModalContent] = useState<ReactNode>(null);

	const openModal = useCallback((component: ReactNode) => {
		setModalContent(component);
	}, []);

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
				<div className={'absolute bottom-0 left-0 z-20 w-full'}>
					<div
						className={
							'relative mx-auto max-w-[375px] rounded bg-dark-blue px-[15px] pb-[20px] pt-[50px] drop-shadow-xl'
						}
						id="modal"
					>
						<div className={'absolute right-[20px] top-[20px]'}>
							<Close onClick={closeModal} />
						</div>
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
