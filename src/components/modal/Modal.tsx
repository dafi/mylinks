import { ReactElement, useEffect, useRef } from 'react';
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && ref.current) {
      const el = ref.current.querySelector('[data-auto-focus="true"]');
      if (el && 'focus' in el) {
        (el as HTMLElement).focus();
      }
    }
  }, [visible, ref]);

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
