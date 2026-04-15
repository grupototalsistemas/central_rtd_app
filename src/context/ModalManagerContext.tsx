'use client';

import type {
  ActiveModal,
  ModalCloseStatus,
  ModalPolicy,
  ModalRequest,
  ModalResult,
} from '@/types/modal.types';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

interface ModalManagerContextType {
  activeModal: ActiveModal | null;
  isModalOpen: boolean;
  policy: ModalPolicy;
  openModal: <Payload = unknown>(request: ModalRequest<Payload>) => Promise<ModalResult<Payload>>;
  openConfirm: (request: Omit<ModalRequest<unknown>, 'kind'>) => Promise<boolean>;
  closeModal: (status?: Exclude<ModalCloseStatus, 'blocked'>) => void;
  resolveModal: <Payload = unknown>(result: ModalResult<Payload>) => void;
}

interface ModalManagerProviderProps {
  children: React.ReactNode;
}

const MODAL_POLICY: ModalPolicy = 'block-new';

const ModalManagerContext = createContext<ModalManagerContextType | undefined>(undefined);

export const ModalManagerProvider: React.FC<ModalManagerProviderProps> = ({ children }) => {
  const [activeModal, setActiveModalState] = useState<ActiveModal | null>(null);
  const activeModalRef = useRef<ActiveModal | null>(null);
  const resolverRef = useRef<((result: ModalResult<unknown>) => void) | null>(null);
  const sequenceRef = useRef(0);

  const setActiveModal = useCallback((nextModal: ActiveModal | null) => {
    activeModalRef.current = nextModal;
    setActiveModalState(nextModal);
  }, []);

  const resolveAndClear = useCallback((result: ModalResult<unknown>) => {
    const currentResolver = resolverRef.current;

    resolverRef.current = null;
    setActiveModal(null);
    currentResolver?.(result);
  }, [setActiveModal]);

  const openModal = useCallback(
    <Payload,>(request: ModalRequest<Payload>): Promise<ModalResult<Payload>> => {
      if (MODAL_POLICY === 'block-new' && activeModalRef.current) {
        return Promise.resolve({ status: 'blocked' } as ModalResult<Payload>);
      }

      sequenceRef.current += 1;
      const modalId =
        request.id ?? `modal-${Date.now()}-${String(sequenceRef.current).padStart(4, '0')}`;

      return new Promise<ModalResult<Payload>>((resolve) => {
        resolverRef.current = resolve as (result: ModalResult<unknown>) => void;
        setActiveModal({
          id: modalId,
          request: request as ModalRequest<unknown>,
        });
      });
    },
    [setActiveModal]
  );

  const resolveModal = useCallback(
    <Payload,>(result: ModalResult<Payload>) => {
      resolveAndClear(result as ModalResult<unknown>);
    },
    [resolveAndClear]
  );

  const closeModal = useCallback(
    (status: Exclude<ModalCloseStatus, 'blocked'> = 'dismissed') => {
      resolveAndClear({ status });
    },
    [resolveAndClear]
  );

  const openConfirm = useCallback(
    async (request: Omit<ModalRequest<unknown>, 'kind'>): Promise<boolean> => {
      const result = await openModal({
        ...request,
        kind: 'confirm',
      });

      return result.status === 'confirmed';
    },
    [openModal]
  );

  useEffect(() => {
    return () => {
      if (resolverRef.current) {
        resolverRef.current({ status: 'dismissed' });
      }
    };
  }, []);

  const value = useMemo<ModalManagerContextType>(
    () => ({
      activeModal,
      isModalOpen: Boolean(activeModal),
      policy: MODAL_POLICY,
      openModal,
      openConfirm,
      closeModal,
      resolveModal,
    }),
    [activeModal, closeModal, openConfirm, openModal, resolveModal]
  );

  return (
    <ModalManagerContext.Provider value={value}>
      {children}
    </ModalManagerContext.Provider>
  );
};

export const useModalManager = (): ModalManagerContextType => {
  const context = useContext(ModalManagerContext);

  if (!context) {
    throw new Error('useModalManager deve ser usado dentro de um ModalManagerProvider');
  }

  return context;
};
