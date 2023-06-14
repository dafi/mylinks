import React, { ReactNode, RefObject } from 'react';
import { Link } from '../../model/MyLinks-interface';
import { DialogProps } from '../modal/Dialog';
import Modal from '../modal/Modal';
import './EditLinkDialog.css';

export interface EditLinkDialogProps extends DialogProps {
  link: Link;
}

export class EditLinkDialog extends React.Component<EditLinkDialogProps, unknown> {
  private inputRef: RefObject<HTMLInputElement> = React.createRef();

  onClose(): void {
    this.props.onClose();
  }

  moveFocusToSearch(): void {
    const el = this.inputRef?.current;
    if (el) {
      el.focus();
    }
  }

  componentDidMount(): void {
    this.moveFocusToSearch();
  }

  render(): ReactNode {
    const link = this.props.link;

    return (
      <Modal isOpen={this.props.isOpen}
             onClose={(): void => this.onClose()}>
        <div className="edit-link-dialog">
          <h2 className="title">Edit Link</h2>

          <form>
            <ul className="flex-outer">
              <li>
                <label htmlFor="link-label">Label</label>
                <input ref={this.inputRef} type="text" value={link.label} id="link-label" placeholder="Videos"/>
              </li>
              <li>
                <label htmlFor="link-url">Url</label>
                <input type="text" value={link.url} id="link-url" placeholder="https://youtube.com"/>
              </li>
              <li>
                <label htmlFor="shortcut">Shortcut</label>
                <input type="text" value={link.shortcut} id="shortcut" placeholder="press the key combination to assign"/>
              </li>
              <li>
                <button type="submit">Submit</button>
              </li>
            </ul>
          </form>
        </div>
      </Modal>
    );
  }
}
