import { ChangeEvent, MouseEvent, ReactElement, useState } from 'react';
import { applyColorToFavicon } from '../../common/Favicon';
import { applyBackground } from '../../common/ThemeUtil';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { Config, Theme } from '../../model/MyLinks-interface';
import Modal from '../modal/Modal';
import { getModal } from '../modal/ModalHandler';
import { CloseResultCode } from '../modal/ModalTypes';
import { settingsDialogId } from './SettingsDialogTypes';

type SettingsDialogState = Theme & Config & Record<string, string | undefined>;

interface SettingsProps {
  onSave(settings: Theme & Config): void;
}

export function SettingsDialog({ onSave }: SettingsProps): ReactElement {
  return (
    <Modal id={settingsDialogId}>
      <div className="standard-dialog">
        <h2 className="title">Settings</h2>
        <SettingsForm onSave={onSave} />
      </div>
    </Modal>
  );
}

function restoreConfig(form: SettingsDialogState, theme: Theme): void {
  if (form.backgroundImage !== theme.backgroundImage) {
    applyBackground(theme.backgroundImage);
  }
  if (form.faviconColor !== theme.faviconColor) {
    applyColorToFavicon(theme.faviconColor);
  }
}

// eslint-disable-next-line react/no-multi-comp
function SettingsForm({ onSave }: SettingsProps): ReactElement {
  const onCloseDialog = (code: CloseResultCode): void => {
    restoreConfig(form, theme);
    getModal(settingsDialogId)?.close(code);
  };

  function onClickSave(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();

    onSave(form);
    onCloseDialog(CloseResultCode.Ok);
  }

  function onClickCancel(): void {
    onCloseDialog(CloseResultCode.Cancel);
  }

  function onClickPreview(): void {
    applyBackground(form.backgroundImage);
    applyColorToFavicon(form.faviconColor);
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

  const { theme, faviconService } = useAppConfigContext();
  const [form, setForm] = useState<SettingsDialogState>({
    backgroundImage: theme.backgroundImage,
    faviconColor: theme.faviconColor,
    faviconService,
  });

  return (
    <form>
      <ul className="flex-outer">
        <li>
          <label htmlFor="background-image">Background Image</label>
          <input
            data-action="backgroundImage"
            data-auto-focus="true"
            type="text"
            id="background-image"
            defaultValue={form.backgroundImage}
            onChange={onChange}
            placeholder="Image url"
          />
        </li>
        <li>
          <label htmlFor="favicon-service">Favicon Service</label>
          <input
            data-action="faviconService"
            type="text"
            defaultValue={form.faviconService}
            id="favicon-service"
            onChange={onChange}
            placeholder="Favicon service URL"
          />
        </li>
        <li>
          <label htmlFor="favicon-color">Favicon color</label>
          <input
            data-action="faviconColor"
            type="color"
            id="favicon-color"
            onChange={onChange}
            defaultValue={form.faviconColor}
          />
        </li>
        <li className="toolbar">
          <div className="label" />
          <div className="toolbar-left">
            <button
              type="button"
              className="text-white bg-action-primary hover"
              onClick={onClickPreview}
            >
              Preview
            </button>
          </div>
          <div className="toolbar-right">
            <button
              type="button"
              className="text-white bg-action-primary hover"
              onClick={onClickSave}
            >
              Save
            </button>
            <button
              type="button"
              className="text-white bg-action-secondary hover right"
              onClick={onClickCancel}
            >
              Cancel
            </button>
          </div>
        </li>
      </ul>
    </form>
  );
}
