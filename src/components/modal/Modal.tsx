import { ReactElement, useEffect } from 'react';
import './Modal.css';

export interface ModalProp {
  readonly onClose: () => void;
  readonly isOpen: boolean;
  readonly children: ReactElement;
}

export default function Modal(
  {
    onClose,
    isOpen,
    children,
  }: ModalProp
): ReactElement | null {
  useEffect(() => {
    function keyDown(e: KeyboardEvent): boolean {
      if (e.key === 'Escape') {
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
