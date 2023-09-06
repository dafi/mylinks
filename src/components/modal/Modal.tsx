import { ReactElement } from 'react';
import './Modal.css';
import { useModalAutoFocus } from './useModalAutoFocus';

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
  const [ visible, ref ] = useModalAutoFocus<HTMLDivElement>(id);

  if (!visible) {
    return null;
  }

  return (
    <div
      id={`modal-${id}`}
      key={id}
      className="modal-backdrop"
      ref={ref}
    >
      <div className="modal-container">
        {children}
      </div>
    </div>
  );
}
