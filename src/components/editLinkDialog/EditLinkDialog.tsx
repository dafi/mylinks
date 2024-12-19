import { ChangeEvent, ReactNode, useState } from 'react';
import { isNotEmptyString } from '../../common/StringUtil';
import { LinkEditableProperties, LinkEditData, LinkEditDataCreate, LinkEditDataUpdate } from '../../model/EditData-interface';
import { KeyCombination } from '../../model/KeyCombination';
import { Footer, FooterButton } from '../footer/Footer';
import Modal from '../modal/Modal';
import { getModal } from '../modal/ModalHandler';
import { CloseResultCode } from '../modal/ModalTypes';
import '../modal/StandardDialog.css';
import { ShortcutDetails } from '../shortcut/shortcutDetails/ShortcutDetails';
import { ShortcutDialog } from '../shortcut/shortcutDialog/ShortcutDialog';
import { shortcutDialogId } from '../shortcut/shortcutDialog/ShortcutDialogTypes';
import { editLinkDialogId } from './EditLinkDialogTypes';
import './EditLinkDialog.css';

export type EditLinkDialogProps = Readonly<{
  data: LinkEditDataCreate | LinkEditDataUpdate;
  onSave: (linkEditData: LinkEditData) => void;
}>;

// https://stackoverflow.com/questions/57773734/how-to-use-partially-the-computed-property-name-on-a-type-definition/57774343#57774343
// compound properties must be strings so, we allow to index elements by string
type EditLinkDialogState = LinkEditableProperties & Record<string, LinkEditableProperties[keyof LinkEditableProperties]>;

export function EditLinkDialog({ data, onSave }: EditLinkDialogProps): ReactNode {
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
  const invalidUrl = urls.find(url => !/^[a-z]*:\/\/.*/.test(url));
  if (invalidUrl !== undefined) {
    el.setCustomValidity(`Invalid url '${invalidUrl}'`);
    return false;
  }
  el.setCustomValidity('');
  return true;
}

// eslint-disable-next-line react/no-multi-comp
function EditLinkForm({ data, onSave }: EditLinkDialogProps): ReactNode {
  function onCloseDialog(code: CloseResultCode): void {
    getModal(editLinkDialogId)?.close(code);
  }

  function onClickSave(): void {
    switch (data.action) {
      case 'create':
        onSave({ ...data, edited: form });
        break;
      case 'update':
        onSave({ ...data, edited: form, original: { ...data.link } });
        break;
    }
    onCloseDialog('Ok');
  }

  function onClickCancel(): void {
    onCloseDialog('Cancel');
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
    const currentHotKey = form.hotKey ?? [];
    setDefaultCombination(currentHotKey);
    setSelectedCombination([...currentHotKey]);
    getModal(shortcutDialogId)?.open({
      onClose: (code, hotKey) => {
        if (code === 'Ok' && Array.isArray(hotKey)) {
          setForm(prevState => ({
            ...prevState, hotKey
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

  const rightButtons: FooterButton[] = [
    { id: 'save', label: 'Save', type: 'submit' },
    { id: 'cancel', label: 'Cancel', onClick: onClickCancel },
  ];

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
          <Footer rightButtons={rightButtons} />
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
