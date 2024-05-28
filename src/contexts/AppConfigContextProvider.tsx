import { Dispatch, ReactElement, useEffect, useState } from 'react';
import { ExportConfigType, ExportSettingsForm } from '../components/settingsDialog/ExportSettingsDialog';
import { SettingsDialog } from '../components/settingsDialog/SettingsDialog';
import { settingsDialogId, SettingsPanel } from '../components/settingsDialog/SettingsDialogTypes';
import { ThemeSettingsForm } from '../components/settingsDialog/ThemeSettingsDialog';
import { SystemShortcutForm } from '../components/systemShortcutsDialog/SystemShortcutsDialog';
import { EditComplete } from '../hooks/useEditLink/useEditLink';
import { AppAction } from '../model/AppAction';
import { MyLinks } from '../model/MyLinks-interface';
import { defaultAppConfig, reloadAll } from './AppConfig';
import { AppConfigContext } from './AppConfigContext';
import { AppUIStateAction } from './useAppUIState';

type AppConfigContextProps = {
  readonly myLinks: MyLinks | undefined;
  readonly updateUIState: Dispatch<AppUIStateAction>;
  readonly onEditComplete: (result: EditComplete) => void;
  readonly onLoadConfig: (file: File) => void;
  readonly onExportConfig: (type: ExportConfigType) => void;
  readonly children: ReactElement;
};

export function AppConfigContextProvider(
  {
    myLinks,
    updateUIState,
    onEditComplete,
    children,
    onLoadConfig,
    onExportConfig,
  }: AppConfigContextProps
): ReactElement {
  function onSaveSettings(settings: Pick<MyLinks, 'theme' | 'config'>): void {
    if (!myLinks) {
      return;
    }

    const data: MyLinks = {
      ...myLinks,
      theme: { ...myLinks.theme, ...settings.theme },
      config: { ...myLinks.config, ...settings.config },
    };

    onEditComplete({ type: 'success', data });
  }

  function onSaveSystemShortcuts(systemShortcuts: AppAction[]): void {
    if (!myLinks) {
      return;
    }

    const data: MyLinks = {
      ...myLinks,
      config: { ...myLinks.config, systemShortcuts },
    };

    onEditComplete({ type: 'success', data });
  }

  const [config, setConfig] = useState(defaultAppConfig);

  useEffect(() => {
    setConfig(reloadAll(myLinks, updateUIState));
  }, [myLinks, updateUIState]);

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
