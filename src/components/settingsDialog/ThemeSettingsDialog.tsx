import { ChangeEvent, ReactNode, useState } from 'react';
import { applyColorScheme, buildColorSchemeOptions, ColorScheme } from '../../common/ColorScheme';
import { setPropertyFromDotNotation } from '../../common/DotNotation';
import { applyColorToFavicon } from '../../common/Favicon';
import { isNotEmptyString } from '../../common/StringUtil';
import { applyBackground, defaultBackgroundColor } from '../../common/ThemeUtil';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { Config, MyLinks } from '../../model/MyLinks-interface';
import { Theme } from '../../model/Theme';
import { SelectColorScheme } from '../colorScheme/SelectColorScheme';
import { Footer, FooterButton } from '../footer/Footer';
import { getModal } from '../modal/ModalHandler';

type DialogState = {
  theme: Pick<Theme, 'background' | 'faviconColor' | 'colorScheme'>;
  config: Pick<Config, 'faviconService'>;
};

type SettingsProps = Readonly<{
  modalId: string;
  onSave: (settings: Pick<MyLinks, 'theme' | 'config'>) => void;
}>;

function restoreConfig(form: DialogState, theme: Theme | undefined): void {
  if (theme?.background &&
    (form.theme.background?.image !== theme.background.image ||
      form.theme.background?.color !== theme.background.color)) {
    applyBackground(theme.background);
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

export function ThemeSettingsForm({ onSave, modalId }: SettingsProps): ReactNode {
  function onClickSave(): void {
    onSave(form);
    getModal(modalId).close('Ok');
  }

  function onClickCancel(): void {
    restoreConfig(form, theme);
    getModal(modalId).close('Cancel');
  }

  function onClickPreview(): void {
    const { background, faviconColor } = form.theme;
    if (background) {
      applyBackground(background);
    }
    applyColorToFavicon(faviconColor);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const propertyName = e.target.dataset.propertyName;

    if (isNotEmptyString(propertyName)) {
      const newValue = setPropertyFromDotNotation(propertyName, e.target.value, structuredClone(form));
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
      background: theme?.background,
      faviconColor: theme?.faviconColor,
      colorScheme: theme?.colorScheme,
    },
    config: {
      faviconService
    },
  });

  const leftButtons: FooterButton[] = [
    { id: 'cancel', label: 'Preview', onClick: onClickPreview },
  ];
  const rightButtons: FooterButton[] = [
    { id: 'save', label: 'Save', onClick: onClickSave },
    { id: 'close', label: 'Close', onClick: onClickCancel },
  ];

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
                data-property-name="theme.background.image"
                data-auto-focus="true"
                type="text"
                id="background-image"
                defaultValue={form.theme.background?.image}
                onChange={onChange}
                placeholder="Image url"
              />
            </li>
            <li>
              <label htmlFor="background-color">Background color</label>
              <input
                data-property-name="theme.background.color"
                type="color"
                id="background-color"
                onChange={onChange}
                defaultValue={form.theme.background?.color ?? defaultBackgroundColor}
              />
            </li>
            <li>
              <label htmlFor="favicon-service">Favicon Service</label>
              <input
                data-property-name="config.faviconService"
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
                data-property-name="theme.faviconColor"
                type="color"
                id="favicon-color"
                onChange={onChange}
                defaultValue={form.theme.faviconColor}
              />
            </li>
          </ul>
        </form>
      </section>
      <Footer leftButtons={leftButtons} rightButtons={rightButtons} />
    </div>
  );
}
