'use client';

import {
	createContext,
	PropsWithChildren,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

export type ModalContextPositions = 'bottom' | 'center';

export interface OpenModalOptions {
	position?: ModalContextPositions;
	withoutClose?: boolean;
}

export interface ModalContext {
	openModal(component: ReactNode, options?: OpenModalOptions): void;
	closeModal(): void;
	modalContent: ReactNode;
	options?: OpenModalOptions;
}

const initialModalContext: ModalContext = {
	openModal() {},
	closeModal() {},
	modalContent: null,
};

export const ModalContext = createContext<ModalContext>(initialModalContext);

export function ModalContextProvider({ children }: PropsWithChildren<{}>) {
	const [modalContent, setModalContent] = useState<ReactNode>(null);
	const [options, setOptions] = useState<OpenModalOptions>();

	const openModal = useCallback(
		(component: ReactNode, options: OpenModalOptions) => {
			console.log('open open open')
			setModalContent(component);
			setOptions({
				...options,
				position: options?.position ?? 'bottom',
			});
		},
		[],
	);

	const closeModal = useCallback(() => {
		console.log('click on close')
		setModalContent(null);
	}, []);

	const value = useMemo(
		() => ({
			openModal,
			closeModal,
			modalContent,
			options,
		}),
		[openModal, closeModal, modalContent, options],
	);

	return (
		<ModalContext.Provider value={value}>
			{children}
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
