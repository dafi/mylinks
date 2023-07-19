import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { EditLinkData } from '../../model/EditData-interface';
import { DialogProps } from '../modal/Dialog';
import Modal from '../modal/Modal';
import './EditLinkDialog.css';

export interface EditLinkDialogProps extends DialogProps {
  data: Readonly<EditLinkData>;
  onSave: (editLinkData: EditLinkData) => void;
}

export function EditLinkDialog({ isOpen, data, onSave, onClose }: EditLinkDialogProps): JSX.Element {
  function onCloseDialog(): void {
    onClose();
  }

  function onClickSave(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();

    onSave({ ...data, editedProperties: { label, url, shortcut, favicon } });
    onCloseDialog();
  }

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const action = e.target.dataset.action;
    if (action) {
      actionMap[action](e.target.value);
    }
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const [label, setLabel] = useState(data.link.label);
  const [url, setUrl] = useState(data.link.url);
  const [shortcut, setShortcut] = useState(data.link.shortcut);
  const [favicon, setFavicon] = useState(data.link.favicon);

  const actionMap: Record<string, (v: string) => void> = {
    label: setLabel,
    url: setUrl,
    shortcut: setShortcut,
    favicon: setFavicon
  };

  return (
    <Modal isOpen={isOpen}
           onClose={onCloseDialog}>
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
                defaultValue={label}
                onChange={onChange}
                placeholder="Videos"
              />
            </li>
            <li>
              <label htmlFor="link-url">Url</label>
              <input
                data-action="url"
                type="text"
                defaultValue={url}
                onChange={onChange}
                placeholder="https://youtube.com"/>
            </li>
            <li>
              <label htmlFor="shortcut">Favicon URL</label>
              <input
                data-action="favicon"
                type="text"
                defaultValue={favicon}
                onChange={onChange}
                placeholder="favicon url"/>
            </li>
            <li>
              <label htmlFor="shortcut">Shortcut</label>
              <input
                data-action="shortcut"
                type="text"
                defaultValue={shortcut}
                onChange={onChange}
                placeholder="press the key combination to assign"/>
            </li>
            <li>
              <div className="toolbar">
                <button
                  className="text-white bg-action-primary hover"
                  onClick={onClickSave}>Save
                </button>
                <button
                  className="text-white bg-action-secondary hover"
                  onClick={onCloseDialog}>Cancel
                </button>
              </div>
            </li>
          </ul>
        </form>
      </div>
    </Modal>
  );
}
