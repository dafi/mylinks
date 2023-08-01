import { ChangeEvent, MouseEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { EditLinkData, LinkEditedProperties } from '../../model/EditData-interface';
import { DialogProps } from '../modal/Dialog';
import Modal from '../modal/Modal';
import './EditLinkDialog.css';

export interface EditLinkDialogProps extends DialogProps {
  readonly data: Readonly<EditLinkData>;
  readonly onSave: (editLinkData: EditLinkData) => void;
}

// https://stackoverflow.com/questions/57773734/how-to-use-partially-the-computed-property-name-on-a-type-definition/57774343#57774343
// compound properties must be strings so, we allow to index elements by string
type EditLinkDialogState = LinkEditedProperties & Record<string, string | undefined>;

export function EditLinkDialog({ isOpen, data, onSave, onClose }: EditLinkDialogProps): ReactElement {
  function onCloseDialog(): void {
    onClose();
  }

  function onClickSave(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();

    onSave({ ...data, editedProperties: form });
    onCloseDialog();
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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<EditLinkDialogState>({
    label: data.link.label,
    url: data.link.url,
    shortcut: data.link.shortcut,
    favicon: data.link.favicon
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseDialog}
    >
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
                  onClick={onCloseDialog}
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
