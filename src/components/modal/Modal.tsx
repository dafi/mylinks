import React, { ReactNode, useEffect, useState } from 'react';
import './Modal.css';

export interface ModalProp {
  onClose: () => void;
  isOpen: boolean;
  children: ReactNode;
}

export default function Modal(props: ModalProp): JSX.Element | null {
  function keyDown(e: KeyboardEvent): boolean {
    if (e.key === 'Escape') {
      setIsOpen(false);
      props.onClose();
    }
    return true;
  }
  const [isOpen, setIsOpen] = useState(props.isOpen);

  useEffect(() => {
    document.addEventListener('keydown', keyDown);
    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        {props.children}
      </div>
    </div>
  );
}
