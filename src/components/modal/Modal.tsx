import { ReactElement } from 'react';
import './Modal.css';
import { useModal } from './useModal';

export interface ModalProp {
  readonly id: string;
  readonly children: ReactElement;
}

export default function Modal(
  {
    id,
    children,
  }: ModalProp
): ReactElement | null {
  const { visible } = useModal(id);

  if (!visible) {
    return null;
  }

  return (
    <div id={`modal-${id}`} key={id} className="modal-backdrop">
      <div className="modal-container">
        {children}
      </div>
    </div>
  );
}
