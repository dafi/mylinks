import { ReactElement } from 'react';
import { ExportConfigType, ExportSettingsForm } from '../components/settingsDialog/ExportSettingsDialog';
import { SettingsDialog } from '../components/settingsDialog/SettingsDialog';
import { settingsDialogId, SettingsPanel } from '../components/settingsDialog/SettingsDialogTypes';
import { ThemeSettingsForm } from '../components/settingsDialog/ThemeSettingsDialog';
import { SystemShortcutForm } from '../components/systemShortcutsDialog/SystemShortcutsDialog';
import { EditComplete } from '../hooks/useEditLink/useEditLink';
import { AppAction } from '../model/AppAction';
import { MyLinks } from '../model/MyLinks-interface';
import { AppConfig } from './AppConfig';
import { AppConfigContext } from './AppConfigContext';

type AppConfigContextProps = {
  readonly config: AppConfig;
  readonly onEditComplete: (result: EditComplete) => void;
  readonly onLoadConfig: (file: File) => void;
  readonly onExportConfig: (type: ExportConfigType) => void;
  readonly children: ReactElement;
};

export function AppConfigContextProvider(
  {
    config,
    onEditComplete,
    children,
    onLoadConfig,
    onExportConfig,
  }: AppConfigContextProps
): ReactElement {
  function onSaveSettings(settings: Pick<MyLinks, 'theme' | 'config'>): void {
    const data: MyLinks = {
      ...myLinks,
      theme: { ...myLinks.theme, ...settings.theme },
      config: { ...myLinks.config, ...settings.config },
    };

    onEditComplete({ type: 'success', data });
  }

  function onSaveSystemShortcuts(systemShortcuts: AppAction[]): void {
    const data: MyLinks = {
      ...myLinks,
      config: { ...myLinks.config, systemShortcuts },
    };

    onEditComplete({ type: 'success', data });
  }

  const myLinks = config.myLinksLookup.myLinks;

  const panels: SettingsPanel[] = [
    {
      title: 'Configuration', content:
        <ExportSettingsForm
          onLoadConfig={onLoadConfig}
          onExportConfig={onExportConfig}
          modalId={settingsDialogId}
        />
    },
    { title: 'Theme/FavIcon', content: <ThemeSettingsForm onSave={onSaveSettings} modalId={settingsDialogId} /> },
    { title: 'System Shortcuts', content: <SystemShortcutForm onSave={onSaveSystemShortcuts} modalId={settingsDialogId} /> },
  ];
  return (
    <AppConfigContext.Provider value={config}>
      {children}

      <SettingsDialog
        panels={panels}
        selected={panels[0]}
      />
    </AppConfigContext.Provider>
  );
}
