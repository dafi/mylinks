import { Dispatch, ReactElement, useEffect, useState } from 'react';
import { ExportSettingsForm } from '../components/settingsDialog/ExportSettingsDialog';
import { SettingsDialog } from '../components/settingsDialog/SettingsDialog';
import { settingsDialogId, SettingsPanel } from '../components/settingsDialog/SettingsDialogTypes';
import { ThemeSettingsForm } from '../components/settingsDialog/ThemeSettingsDialog';
import { SystemShortcutForm } from '../components/SystemShortcutsDialog/SystemShortcutsDialog';
import { EditComplete } from '../hooks/useEditLink/useEditLink';
import { Config, MyLinks, ShortcutAction, Theme } from '../model/MyLinks-interface';
import { defaultAppConfig, reloadAll } from './AppConfig';
import { AppConfigContext } from './AppConfigContext';
import { AppUIStateAction } from './useAppUIState';

type AppConfigContextProps = {
  readonly myLinks: MyLinks | undefined;
  readonly updateUIState: Dispatch<AppUIStateAction>;
  readonly onEditComplete: (result: EditComplete) => void;
  readonly onLoadConfig: (file: File) => void;
  readonly onExportConfig: () => void;
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
  function onSaveSettings(settings: Theme & Config): void {
    if (!myLinks) {
      return;
    }

    if (myLinks.theme) {
      myLinks.theme.backgroundImage = settings.backgroundImage;
      myLinks.theme.faviconColor = settings.faviconColor;
    }
    if (myLinks.config) {
      myLinks.config.faviconService = settings.faviconService;
    }

    onEditComplete({ type: 'success', data: myLinks });
  }

  function onSaveSystemShortcuts(shortcuts: ShortcutAction[]): void {
    if (!myLinks) {
      return;
    }

    if (myLinks.config) {
      myLinks.config.systemShortcuts = shortcuts;
    }

    onEditComplete({ type: 'success', data: myLinks });
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
