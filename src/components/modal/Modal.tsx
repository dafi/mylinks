import { KeyboardEvent, ReactNode, useEffect } from 'react';
import './Modal.css';
import { createPortal } from 'react-dom';
import { toKebab } from '../../common/StringUtil';
import { getModal } from './ModalHandler';
import { focusLast, isStackEmpty, stackSize, updateStack } from './ModalStack';
import { useModalAutoFocus } from './useModalAutoFocus';

export type ModalProps = Readonly<{
  id: string;
  children: ReactNode;
}>;

export default function Modal(
  {
    id,
    children,
  }: ModalProps
): ReactNode {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      getModal(id)?.close('Cancel');
    }
  };

  const [visible, ref] = useModalAutoFocus<HTMLDivElement>(id);

  useEffect(() => {
    if (updateStack(id, visible, ref.current)) {
      focusLast();
    }
    // this prevents scrolling of the main window on larger screens
    // e.g. pressing the space bar while a modal is open scrolls the main window
    document.body.style.overflow = isStackEmpty() ? '' : 'hidden';
  }, [id, ref, visible]);

  if (!visible) {
    return null;
  }

  // If dialogs are created as direct body children, the document keydown listener is called before the siblings.
  // We insert dialogs inside a document.body child so the keydown listeners are called in the correct order
  const rootDialogs = document.querySelector('#root-dialogs');

  return rootDialogs && createPortal(
    <div
      id={`modal-${toKebab(id)}`}
      key={id}
      className="modal-backdrop"
      ref={ref}
      style={{ zIndex: stackSize() }}
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      <div className="modal-container">
        {children}
      </div>
    </div>,
    rootDialogs
  );
}
