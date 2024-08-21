'use client';

import { Close } from '@/components/Close';
import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

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

  const value = useMemo(() => ({
    openModal,
    closeModal
  }), [openModal,
    closeModal]);

  return (
    <ModalContext.Provider value={value}>
      <div style={{filter: modalContent ? 'blur(3px)' : ''}} className={`h-full w-full ${modalContent && 'bg-dark-blue opacity-50 z-10'}`}>
        {children}
      </div>
      {modalContent && (
        <div className={'absolute bottom-0 left-0 w-full z-20'}>
          <div className={'relative max-w-[375px] mx-auto bg-dark-blue px-[15px] pt-[50px] pb-[20px] rounded drop-shadow-xl'} id="modal">
            <div className={'absolute top-[20px] right-[20px]'}><Close onClick={closeModal} /></div>
            {modalContent}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  )
}

export function useModalContext() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModalContext is used outside of ModalContext');
  }

  return context;
}
