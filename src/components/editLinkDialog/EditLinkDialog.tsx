import { ChangeEvent, MouseEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { EditLinkData, LinkEditedProperties } from '../../model/EditData-interface';
import Modal from '../modal/Modal';
import { getModal } from '../modal/ModalHandler';
import { CloseResultCode } from '../modal/ModalTypes';
import './EditLinkDialog.css';

export const editLinkDialogId = 'editLinkDialog';

export interface EditLinkDialogProps {
  readonly data?: Readonly<EditLinkData>;
  readonly onSave: (editLinkData: EditLinkData) => void;
}

const defaultProps = {
  data: undefined
};

// https://stackoverflow.com/questions/57773734/how-to-use-partially-the-computed-property-name-on-a-type-definition/57774343#57774343
// compound properties must be strings so, we allow to index elements by string
type EditLinkDialogState = LinkEditedProperties & Record<string, string | undefined>;

export function EditLinkDialog({ data, onSave }: EditLinkDialogProps): ReactElement {
  function onCloseDialog(code: CloseResultCode): void {
    getModal(editLinkDialogId)?.close(code);
  }

  function onClickSave(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();

    if (data) {
      onSave({ ...data, editedProperties: form });
    }
    onCloseDialog(CloseResultCode.Ok);
  }

  function onClickCancel(): void {
    onCloseDialog(CloseResultCode.Cancel);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const action = e.target.dataset.action;
    if (action) {
      setForm(prevState => {
        prevState[action] = e.target.value;
        return prevState;
      });
    }
  }

  const inputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<EditLinkDialogState>({
    label: '',
    url:  '',
  });

  useEffect(() => {
    if (data) {
      setForm({
        label: data.link.label,
        url: data.link.url,
        shortcut: data.link.shortcut,
        favicon: data.link.favicon
      });
    } else {
      setForm({
        label: '',
        url: '',
        shortcut: '',
        favicon: ''
      });
    }
  }, [data]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [form]);

  // defaultValue is not updated using state, wo we declare the key
  // https://stackoverflow.com/a/69590829/195893
  // https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key

  return (
    <Modal id={editLinkDialogId}>
      <div className="edit-link-dialog">
        <h2 className="title">Edit Link</h2>

        <form>
          <ul className="flex-outer">
            <li>
              <label htmlFor="link-label">Label</label>
              <input
                data-action="label"
                ref={inputRef}
                type="text"
                key={form.label}
                defaultValue={form.label}
                onChange={onChange}
                placeholder="Videos"
              />
            </li>
            <li>
              <label htmlFor="link-url">Url</label>
              <input
                data-action="url"
                type="text"
                defaultValue={form.url}
                key={form.url}
                onChange={onChange}
                placeholder="https://youtube.com"
              />
            </li>
            <li>
              <label htmlFor="shortcut">Favicon URL</label>
              <input
                data-action="favicon"
                type="text"
                defaultValue={form.favicon}
                key={form.favicon}
                onChange={onChange}
                placeholder="favicon url"
              />
            </li>
            <li>
              <label htmlFor="shortcut">Shortcut</label>
              <input
                data-action="shortcut"
                type="text"
                defaultValue={form.shortcut}
                key={form.shortcut}
                onChange={onChange}
                placeholder="press the key combination to assign"
              />
            </li>
            <li>
              <div className="toolbar">
                <button
                  type="button"
                  className="text-white bg-action-primary hover"
                  onClick={onClickSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-white bg-action-secondary hover"
                  onClick={onClickCancel}
                >
                  Cancel
                </button>
              </div>
            </li>
          </ul>
        </form>
      </div>
    </Modal>
  );
}

EditLinkDialog.defaultProps = defaultProps;
