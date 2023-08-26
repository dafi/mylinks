import { useCallback, useEffect, useState } from 'react';
import { registerModal, unregisterModal } from './ModalHandler';
import { CloseResultCode, ModalAction, ModalCallback } from './ModalTypes';

// hooks code sometimes is so loooong
// eslint-disable-next-line max-lines-per-function
export function useModal(id: string): ModalAction & { visible: boolean } {
  const [visible, setVisible] = useState(false);
  const [modalCallback, setModalCallback] = useState<ModalCallback>();

  function open(cb?: ModalCallback): void {
    setModalCallback(cb);
    setVisible(true);
  }

  const close = useCallback((code: CloseResultCode, data?: unknown): void => {
    if (!visible) {
      return;
    }

    unregisterModal(id);

    if (modalCallback?.onClose) {
      modalCallback.onClose(code, data);
    }
    setVisible(false);
  }, [id, modalCallback, visible]);

  useEffect(() => {
    const keyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        close(CloseResultCode.Cancel);
      }
    };

    if (visible) {
      document.addEventListener('keydown', keyDown);
    } else {
      document.removeEventListener('keydown', keyDown);
    }
    return () => document.removeEventListener('keydown', keyDown);
  }, [visible, close]);

  registerModal(id, { open, close });

  return { visible, open, close };
}
