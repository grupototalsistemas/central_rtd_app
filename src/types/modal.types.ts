import type { ReactNode } from 'react';

export type ModalKind = 'confirm' | 'alert' | 'custom';

export type ModalCloseStatus =
  | 'confirmed'
  | 'cancelled'
  | 'dismissed'
  | 'blocked';

export type ModalPolicy = 'block-new';

export type ModalSize = 'sm' | 'md' | 'lg' | 'full';

export interface ModalResult<Payload = unknown> {
  status: ModalCloseStatus;
  data?: Payload;
}

export interface ModalRenderControls {
  close: () => void;
  cancel: () => Promise<void>;
  confirm: () => Promise<void>;
  isSubmitting: boolean;
}

export interface ModalRequest<Payload = unknown> {
  id?: string;
  kind?: ModalKind;
  title?: ReactNode;
  description?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  size?: ModalSize;
  disableBackdropClose?: boolean;
  disableEscKey?: boolean;
  showCloseButton?: boolean;
  showDefaultActions?: boolean;
  className?: string;
  onConfirm?: () => Payload | Promise<Payload>;
  onCancel?: () => void | Promise<void>;
  renderContent?: (controls: ModalRenderControls) => ReactNode;
}

export interface ActiveModal {
  id: string;
  request: ModalRequest<unknown>;
}
