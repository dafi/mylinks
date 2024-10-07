import { ChangeEvent, MouseEvent, ReactElement, useState } from 'react';
import { applyColorScheme, buildColorSchemeOptions, ColorScheme } from '../../common/ColorScheme';
import { applyColorToFavicon } from '../../common/Favicon';
import { isNotEmptyString } from '../../common/StringUtil';
import { applyBackground } from '../../common/ThemeUtil';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { Config, MyLinks, Theme } from '../../model/MyLinks-interface';
import { SelectColorScheme } from '../colorScheme/SelectColorScheme';
import { getModal } from '../modal/ModalHandler';
import { CloseResultCode } from '../modal/ModalTypes';

type DialogState = {
  theme: Pick<Theme, 'backgroundImage' | 'faviconColor' | 'colorScheme'>;
  config: Pick<Config, 'faviconService'>;
};

type SettingsProps = Readonly<{
  modalId: string;
  onSave: (settings: Pick<MyLinks, 'theme' | 'config'>) => void;
}>;

function restoreConfig(form: DialogState, theme: Theme | undefined): void {
  if (form.theme.backgroundImage !== theme?.backgroundImage) {
    applyBackground(theme?.backgroundImage);
  }
  if (form.theme.faviconColor !== theme?.faviconColor) {
    applyColorToFavicon(theme?.faviconColor);
  }
  if (form.theme.colorScheme !== theme?.colorScheme) {
    previewColorScheme(theme?.colorScheme ?? 'system');
  }
}

function previewColorScheme(colorScheme: ColorScheme): void {
  applyColorScheme(buildColorSchemeOptions({
    colorScheme,
  }));
}

export function ThemeSettingsForm({ onSave, modalId }: SettingsProps): ReactElement {
  const onCloseDialog = (code: CloseResultCode): void => {
    getModal(modalId)?.close(code);
  };

  function onClickSave(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();

    onSave(form);
    onCloseDialog(CloseResultCode.Ok);
  }

  function onClickCancel(): void {
    restoreConfig(form, theme);
    onCloseDialog(CloseResultCode.Cancel);
  }

  function onClickPreview(): void {
    const { backgroundImage, faviconColor } = form.theme;
    applyBackground(backgroundImage);
    applyColorToFavicon(faviconColor);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const action = e.target.dataset.action as keyof DialogState;
    const propertyName = e.target.dataset.propertyName;

    if (isNotEmptyString(action) && isNotEmptyString(propertyName)) {
      const value = { [propertyName]: { [action]: e.target.value } };
      const newValue = { ...form, ...value };
      setForm(newValue);
    }
  }

  function onSelectColorScheme(scheme: ColorScheme): void {
    form.theme.colorScheme = scheme;
    previewColorScheme(scheme);
  }

  const { theme, faviconService } = useAppConfigContext();
  const [form, setForm] = useState<DialogState>({
    theme: {
      backgroundImage: theme?.backgroundImage,
      faviconColor: theme?.faviconColor,
      colorScheme: theme?.colorScheme,
    },
    config: {
      faviconService
    },
  });

  return (
    <div className="panel">
      <section>
        <form>
          <ul className="form-list">
            <li>
              <label htmlFor="color-scheme">Color Scheme</label>
              <SelectColorScheme
                colorScheme={form.theme.colorScheme}
                onSelectColorScheme={onSelectColorScheme}
              />
            </li>
            <li>
              <label htmlFor="background-image">Background Image</label>
              <input
                data-action="backgroundImage"
                data-property-name="theme"
                data-auto-focus="true"
                type="text"
                id="background-image"
                defaultValue={form.theme.backgroundImage}
                onChange={onChange}
                placeholder="Image url"
              />
            </li>
            <li>
              <label htmlFor="favicon-service">Favicon Service</label>
              <input
                data-action="faviconService"
                data-property-name="config"
                type="text"
                defaultValue={form.config.faviconService}
                id="favicon-service"
                onChange={onChange}
                placeholder="Favicon service URL"
              />
            </li>
            <li>
              <label htmlFor="favicon-color">Favicon color</label>
              <input
                data-action="faviconColor"
                data-property-name="theme"
                type="color"
                id="favicon-color"
                onChange={onChange}
                defaultValue={form.theme.faviconColor}
              />
            </li>
          </ul>
        </form>
      </section>

      <footer className="footer">
        <div className="toolbar">
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
              Close
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
