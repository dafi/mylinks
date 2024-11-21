export type CloseResultCode = 'Cancel' | 'Ok';

export interface ModalAction {
  open: (cb?: ModalCallback) => void;
  close: (code: CloseResultCode, data?: unknown) => void;
}

export interface ModalCallback {
  onClose?: (code: CloseResultCode, data?: unknown) => void;
}
