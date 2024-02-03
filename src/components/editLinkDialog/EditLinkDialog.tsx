import { ChangeEvent, FormEvent, ReactElement, useState } from 'react';
import { isNotEmptyString } from '../../common/StringUtil';
import { LinkEditableProperties, LinkEditData } from '../../model/EditData-interface';
import { KeyCombination } from '../../model/KeyCombination';
import Modal from '../modal/Modal';
import { getModal } from '../modal/ModalHandler';
import { CloseResultCode } from '../modal/ModalTypes';
import '../modal/StandardDialog.css';
import { ShortcutDetails } from '../shortcut/shortcutDetails/ShortcutDetails';
import { ShortcutDialog } from '../shortcut/shortcutDialog/ShortcutDialog';
import { shortcutDialogId } from '../shortcut/shortcutDialog/ShortcutDialogTypes';
import { editLinkDialogId } from './EditLinkDialogTypes';

export interface EditLinkDialogProps {
  readonly data: Readonly<LinkEditData>;
  readonly onSave: (linkEditData: LinkEditData) => void;
}

// https://stackoverflow.com/questions/57773734/how-to-use-partially-the-computed-property-name-on-a-type-definition/57774343#57774343
// compound properties must be strings so, we allow to index elements by string
type EditLinkDialogState = LinkEditableProperties & Record<string, LinkEditableProperties[keyof LinkEditableProperties]>;

export function EditLinkDialog({ data, onSave }: EditLinkDialogProps): ReactElement {
  return (
    <Modal id={editLinkDialogId}>
      <div className="panel">
        <header>
          <h2 className="title">Edit Link</h2>
        </header>

        <EditLinkForm data={data} onSave={onSave} />
      </div>
    </Modal>
  );
}

function validateUrls(urls: string[], el: HTMLTextAreaElement): boolean {
  if (urls.length === 0) {
    el.setCustomValidity('Url is mandatory');
    return false;
  }
  const invalidUrlIndex = urls.findIndex(url => !/^[a-z]*:\/\/.*/.test(url));
  if (invalidUrlIndex < 0) {
    el.setCustomValidity('');
    return true;
  }
  el.setCustomValidity(`Invalid url at line ${invalidUrlIndex + 1}`);
  return false;
}

// eslint-disable-next-line react/no-multi-comp
function EditLinkForm({ data, onSave }: EditLinkDialogProps): ReactElement {
  function onCloseDialog(code: CloseResultCode): void {
    getModal(editLinkDialogId)?.close(code);
  }

  function onClickSave(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const originalProperties = { ...data.link };
    switch (data.editType) {
      case 'create':
        onSave({ ...data, edited: form });
        break;
      case 'update':
        onSave({ ...data, edited: form, original: originalProperties });
        break;
      default:
        throw new Error(`Not implemented yet: ${data.editType} case`);
    }
    onCloseDialog(CloseResultCode.Ok);
  }

  function onClickCancel(): void {
    onCloseDialog(CloseResultCode.Cancel);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const { action } = e.target.dataset;
    if (isNotEmptyString(action)) {
      setForm(prevState => ({
        ...prevState, [action]: e.target.value
      }));
    }
  }

  function onChangeUrls(e: ChangeEvent<HTMLTextAreaElement>): void {
    const trimmed = e.target.value.trim();
    const urls = trimmed.length === 0 ? [] : trimmed.split(/\n+/);
    if (validateUrls(urls, e.target)) {
      setForm(prevState => ({
        ...prevState, urls
      }));
    }
  }

  function onDoubleClickShortcut(): void {
    setCombinationLabel(form.label);
    const currentShortcut = form.hotKey ?? [];
    setDefaultCombination(currentShortcut);
    setSelectedCombination([...currentShortcut]);
    getModal(shortcutDialogId)?.open({
      onClose: (code, shortcut) => {
        if (code === CloseResultCode.Ok && Array.isArray(shortcut)) {
          setForm(prevState => ({
            ...prevState, shortcut
          }));
        }
      }
    });
  }

  const [form, setForm] = useState<EditLinkDialogState>({
    ...data.link
  });
  const [combinationLabel, setCombinationLabel] = useState('');
  const [defaultCombination, setDefaultCombination] = useState<KeyCombination[]>([]);

  const [selectedCombination, setSelectedCombination] = useState<KeyCombination[]>([]);

  return (
    <>
      <section>
        <form onSubmit={onClickSave}>
          <ul className="form-list">
            <li>
              <label htmlFor="link-label">Label</label>
              <input
                data-action="label"
                data-auto-focus="true"
                type="text"
                defaultValue={form.label}
                onChange={onChange}
                placeholder="Videos"
                required
                pattern="^\S|\S.*\S"
              />
            </li>
            <li>
              <label htmlFor="link-url">Urls</label>
              <textarea
                data-action="urls"
                defaultValue={form.urls.join('\n')}
                onChange={onChangeUrls}
                placeholder="https://youtube.com"
                required
              />
            </li>
            <li>
              <label htmlFor="shortcut">Favicon URL</label>
              <input
                data-action="favicon"
                type="url"
                defaultValue={form.favicon}
                onChange={onChange}
                placeholder="Favicon Url"
              />
            </li>
            <li>
              <label htmlFor="shortcut">Shortcut</label>
              <div onDoubleClick={onDoubleClickShortcut} className="form-shortcut">
                <ShortcutDetails label="Double click to change the shortcut" combination={form.hotKey} />
              </div>
            </li>
          </ul>
          <footer className="footer">
            <div className="toolbar">
              <div className="label" />
              <div className="toolbar-left" />
              <div className="toolbar-right">
                <button
                  type="submit"
                  className="text-white bg-action-primary hover"
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
            </div>
          </footer>
        </form>
      </section>

      <ShortcutDialog
        label={combinationLabel}
        defaultCombination={defaultCombination}
        keyCombination={selectedCombination}
        setKeyCombination={setSelectedCombination}
      />
    </>
  );
}
