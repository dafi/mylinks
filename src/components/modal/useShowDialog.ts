import { Dispatch, useEffect, useState } from 'react';
import { getModal } from './ModalHandler';
import { ModalCallback } from './ModalTypes';

export function useOpenDialog(
  id: string,
  cb?: ModalCallback
): [boolean, Dispatch<boolean>] {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (isDialogOpen) {
      getModal(id)?.open({
        onClose: (code, data) => {
          setIsDialogOpen(false);
          if (cb?.onClose) {
            cb.onClose(code, data);
          }
        },
      });
    }
  }, [cb, id, isDialogOpen]);

  return [isDialogOpen, setIsDialogOpen];
}
