'use client';

import { useModalManager } from '@/context/ModalManagerContext';
import { cn } from '@/utils/cn';
import React from 'react';
import type { ModalKind, ModalSize } from '@/types/modal.types';
import { Modal } from './index';

const sizeClassMap: Record<Exclude<ModalSize, 'full'>, string> = {
  sm: 'max-w-md p-6 sm:p-7',
  md: 'max-w-xl p-6 sm:p-7',
  lg: 'max-w-2xl p-6 sm:p-8',
};

const defaultConfirmLabel: Record<ModalKind, string> = {
  confirm: 'Confirmar',
  alert: 'Entendi',
  custom: 'Confirmar',
};

const defaultCancelLabel: Record<ModalKind, string> = {
  confirm: 'Cancelar',
  alert: 'Fechar',
  custom: 'Cancelar',
};

const ModalHost: React.FC = () => {
  const { activeModal, resolveModal, closeModal } = useModalManager();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!activeModal) {
      setIsSubmitting(false);
    }
  }, [activeModal]);

  if (!activeModal) {
    return null;
  }

  const { request } = activeModal;
  const kind = request.kind ?? 'confirm';
  const size = request.size ?? 'md';
  const isFullscreen = size === 'full';

  const handleDismiss = () => {
    if (isSubmitting) {
      return;
    }

    closeModal('dismissed');
  };

  const handleCancel = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await request.onCancel?.();
      resolveModal({ status: 'cancelled' });
    } catch (error) {
      console.error('[ModalHost] Erro ao executar cancelamento do modal:', error);
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await request.onConfirm?.();
      resolveModal({ status: 'confirmed', data });
    } catch (error) {
      console.error('[ModalHost] Erro ao executar confirmacao do modal:', error);
      setIsSubmitting(false);
    }
  };

  const shouldShowActions =
    request.showDefaultActions ?? (kind === 'confirm' || kind === 'alert');

  return (
    <Modal
      isOpen
      onClose={handleDismiss}
      className={cn(
        !isFullscreen && 'mx-4 w-full',
        !isFullscreen && sizeClassMap[size as Exclude<ModalSize, 'full'>],
        request.className
      )}
      showCloseButton={request.showCloseButton ?? true}
      isFullscreen={isFullscreen}
      disableBackdropClose={request.disableBackdropClose}
      disableEscKey={request.disableEscKey}
      titleId={request.title ? `modal-title-${activeModal.id}` : undefined}
      ariaLabel={!request.title ? 'Modal de confirmação' : undefined}
    >
      <div className="flex flex-col gap-6">
        {request.title ? (
          <h2
            id={`modal-title-${activeModal.id}`}
            className="pr-12 text-xl font-semibold text-(--cor-texto) dark:text-(--dark-cor-texto)"
          >
            {request.title}
          </h2>
        ) : null}

        {request.description ? (
          <p className="text-sm leading-6 text-(--cor-texto)/80 dark:text-(--dark-cor-texto)/80">
            {request.description}
          </p>
        ) : null}

        {request.renderContent?.({
          close: handleDismiss,
          cancel: handleCancel,
          confirm: handleConfirm,
          isSubmitting,
        })}

        {shouldShowActions ? (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {kind !== 'alert' ? (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-(--cor-edit) px-4 py-2 text-sm font-semibold text-(--cor-texto) ring-1 ring-(--cor-borda)/60 transition-all hover:bg-(--cor-button-hover)/15 focus:outline-hidden focus:ring-2 focus:ring-brand-500/28 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-(--dark-cor-edit) dark:text-(--dark-cor-texto) dark:ring-(--dark-cor-borda)/65 dark:hover:bg-(--dark-cor-button-hover)/20 dark:focus:ring-brand-500/35"
              >
                {request.cancelLabel ?? defaultCancelLabel[kind]}
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-(--central-azul) px-4 py-2 text-sm font-semibold text-(--chrome-text) shadow-theme-xs transition-all hover:bg-(--cor-button-active) hover:shadow-theme-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500/28 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-(--dark-chrome-background) dark:text-(--dark-chrome-text) dark:hover:bg-(--dark-cor-button-active) dark:focus:ring-brand-500/35"
            >
              {isSubmitting ? 'Processando...' : request.confirmLabel ?? defaultConfirmLabel[kind]}
            </button>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default ModalHost;
