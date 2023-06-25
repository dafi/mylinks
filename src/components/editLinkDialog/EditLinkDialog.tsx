import React, { ChangeEvent, ReactNode, RefObject } from 'react';
import { EditLinkData, LinkEditedProperties } from '../../common/AppUIStateContext';
import { DialogProps } from '../modal/Dialog';
import Modal from '../modal/Modal';
import './EditLinkDialog.css';

export interface EditLinkDialogProps extends DialogProps {
  data: Readonly<EditLinkData>;
  onSave: (editLinkData: EditLinkData) => void;
}

type EditLinkDialogState = LinkEditedProperties;

export class EditLinkDialog extends React.Component<EditLinkDialogProps, EditLinkDialogState> {
  private inputRef: RefObject<HTMLInputElement> = React.createRef();

  constructor(props: EditLinkDialogProps) {
    super(props);
    const { label, url, shortcut } = props.data.link;
    this.state = { label, url, shortcut };
  }

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

  private onClickSave(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();

    this.props.onSave({ ...this.props.data, editedProperties: this.state });
    this.onClose();
  }

  onChangeLabel(e: ChangeEvent<HTMLInputElement>): void {
    this.setState({ label: e.target.value });
  }

  onChangeUrl(e: ChangeEvent<HTMLInputElement>): void {
    this.setState({ url: e.target.value });
  }

  onChangeShortcut(e: ChangeEvent<HTMLInputElement>): void {
    this.setState({ shortcut: e.target.value });
  }

  render(): ReactNode {
    const { label, url, shortcut } = this.state;

    return (
      <Modal isOpen={this.props.isOpen}
             onClose={(): void => this.onClose()}>
        <div className="edit-link-dialog">
          <h2 className="title">Edit Link</h2>

          <form>
            <ul className="flex-outer">
              <li>
                <label htmlFor="link-label">Label</label>
                <input
                  id="link-label"
                  ref={this.inputRef}
                  type="text"
                  defaultValue={label}
                  onChange={(e): void => this.onChangeLabel(e)}
                  placeholder="Videos"
                />
              </li>
              <li>
                <label htmlFor="link-url">Url</label>
                <input
                  id="link-url"
                  type="text"
                  defaultValue={url}
                  onChange={(e): void => this.onChangeUrl(e)}
                  placeholder="https://youtube.com"/>
              </li>
              <li>
                <label htmlFor="shortcut">Shortcut</label>
                <input
                  id="shortcut"
                  type="text"
                  defaultValue={shortcut}
                  onChange={(e): void => this.onChangeShortcut(e)}
                  placeholder="press the key combination to assign"/>
              </li>
              <li>
                <div className="toolbar">
                  <button
                    className="text-white bg-action-primary hover"
                    onClick={(e): void => this.onClickSave(e)}>Save</button>
                  <button
                    className="text-white bg-action-secondary hover"
                    onClick={(): void => this.onClose()}>Cancel</button>
                </div>
              </li>
            </ul>
          </form>
        </div>
      </Modal>
    );
  }
}
