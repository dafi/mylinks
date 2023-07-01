import React, { ChangeEvent, ReactNode, RefObject } from 'react';
import { EditLinkData, LinkEditedProperties } from '../../model/EditData-interface';
import { DialogProps } from '../modal/Dialog';
import Modal from '../modal/Modal';
import './EditLinkDialog.css';

export interface EditLinkDialogProps extends DialogProps {
  data: Readonly<EditLinkData>;
  onSave: (editLinkData: EditLinkData) => void;
}

// https://stackoverflow.com/questions/57773734/how-to-use-partially-the-computed-property-name-on-a-type-definition/57774343#57774343
// compound properties must be strings so, we allow to index elements by string
type EditLinkDialogState = LinkEditedProperties & Record<string, string | undefined>;

export class EditLinkDialog extends React.Component<EditLinkDialogProps, EditLinkDialogState> {
  private inputRef: RefObject<HTMLInputElement> = React.createRef();

  constructor(props: EditLinkDialogProps) {
    super(props);
    const { label, url, shortcut, favicon } = props.data.link;
    this.state = { label, url, shortcut, favicon };
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

  onChange(e: ChangeEvent<HTMLInputElement>): void {
    const action = e.target.dataset.action;
    if (action) {
      this.setState({ [action]: e.target.value });
    }
  }

  render(): ReactNode {
    const { label, url, shortcut, favicon } = this.state;

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
                  data-action='label'
                  ref={this.inputRef}
                  type="text"
                  defaultValue={label}
                  onChange={(e): void => this.onChange(e)}
                  placeholder="Videos"
                />
              </li>
              <li>
                <label htmlFor="link-url">Url</label>
                <input
                  data-action="url"
                  type="text"
                  defaultValue={url}
                  onChange={(e): void => this.onChange(e)}
                  placeholder="https://youtube.com"/>
              </li>
              <li>
                <label htmlFor="shortcut">Favicon URL</label>
                <input
                  data-action="favicon"
                  type="text"
                  defaultValue={favicon}
                  onChange={(e): void => this.onChange(e)}
                  placeholder="favicon url"/>
              </li>
              <li>
                <label htmlFor="shortcut">Shortcut</label>
                <input
                  data-action="shortcut"
                  type="text"
                  defaultValue={shortcut}
                  onChange={(e): void => this.onChange(e)}
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
