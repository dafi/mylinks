import { useCallback, useState } from 'react';
import { registerModal, unregisterModal } from './ModalHandler';
import { CloseResultCode, ModalAction, ModalCallback } from './ModalTypes';

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

  registerModal(id, { open, close });

  return { visible, open, close };
}
