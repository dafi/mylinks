import { ReactElement, useEffect, useState } from 'react';
import './Modal.css';

export interface ModalProp {
  readonly onClose: () => void;
  readonly isOpen: boolean;
  readonly children: ReactElement;
}

export default function Modal(
  {
    onClose,
    isOpen: isDialogOpen,
    children,
  }: ModalProp
): ReactElement | null {
  const [isOpen, setIsOpen] = useState(isDialogOpen);

  useEffect(() => {
    function keyDown(e: KeyboardEvent): boolean {
      if (e.key === 'Escape') {
        setIsOpen(false);
        onClose();
      }
      return true;
    }
    document.addEventListener('keydown', keyDown);
    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        {children}
      </div>
    </div>
  );
}
