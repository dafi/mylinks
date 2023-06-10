import React, { ReactNode } from 'react';
import './Modal.css';

export interface ModalProp {
  onClose: () => void;
  isOpen: boolean;
  children: ReactNode;
}

interface ModalState {
  isOpen: boolean;
}

let clickEventListener: (e: KeyboardEvent) => boolean;

class Modal extends React.Component<ModalProp, ModalState> {

  constructor(props: ModalProp) {
    super(props);
    this.state = { isOpen: props.isOpen };
    clickEventListener = (e: KeyboardEvent): boolean => this.keyDown(e);
  }

  keyDown(e: KeyboardEvent): boolean {
    if (e.key === 'Escape') {
      this.setState({ isOpen: false });
      this.props.onClose();
    }
    return true;
  }

  componentDidMount(): void {
    document.addEventListener('keydown', clickEventListener);
  }

  componentWillUnmount(): void {
    document.removeEventListener('keydown', clickEventListener);
  }

  render(): ReactNode {
    if (!this.state.isOpen) {
      return null;
    }

    return (
      <div className="modal-backdrop">
        <div className="modal-container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Modal;
