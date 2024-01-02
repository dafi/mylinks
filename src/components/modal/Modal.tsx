import { KeyboardEvent, ReactElement, useEffect } from 'react';
import './Modal.css';
import { getModal } from './ModalHandler';
import { CloseResultCode } from './ModalTypes';
import { useModalAutoFocus } from './useModalAutoFocus';

const modalStack: HTMLElement[] = [];

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
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      getModal(id)?.close(CloseResultCode.Cancel);
    }
  };

  const [visible, ref] = useModalAutoFocus<HTMLDivElement>(id);

  useEffect(() => {
    if (ref.current == null) {
      modalStack.pop();
      modalStack.at(-1)?.focus();
    } else {
      modalStack.push(ref.current);
    }
    // this prevents scrolling of the main window on larger screens
    // e.g. pressing the space bar while a modal is open scrolls the main window
    document.body.style.overflow = modalStack.length === 0 || !visible ? '' : 'hidden';
  }, [ref, visible]);

  if (!visible) {
    return null;
  }

  return (
    <div
      id={`modal-${id}`}
      key={id}
      className="modal-backdrop"
      ref={ref}
      style={{ zIndex: modalStack.length }}
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      <div className="modal-container">
        {children}
      </div>
    </div>
  );
}
