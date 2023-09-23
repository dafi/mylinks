import { ReactElement, useEffect, useState } from 'react';
import { ExportSettingsForm } from '../components/settingsDialog/ExportSettingsDialog';
import { SettingsDialog } from '../components/settingsDialog/SettingsDialog';
import { settingsDialogId, SettingsPanel } from '../components/settingsDialog/SettingsDialogTypes';
import { ThemeSettingsForm } from '../components/settingsDialog/ThemeSettingsDialog';
import { EditComplete } from '../hooks/useEditLink/useEditLink';
import { Config, MyLinks, Theme } from '../model/MyLinks-interface';
import { defaultAppConfig, reloadAll } from './AppConfig';
import { AppConfigContext } from './AppConfigContext';

interface AppConfigContextProps {
  readonly myLinks: MyLinks | undefined;
  readonly onEditComplete: (result: EditComplete) => void;
  readonly children: ReactElement;
  readonly onLoadConfig: (file: File) => void;
  readonly onExportConfig: () => void;
}

export function AppConfigContextProvider(
  {
    myLinks,
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

  const [config, setConfig] = useState(defaultAppConfig);

  useEffect(() => {
    setConfig(reloadAll(myLinks));
  }, [myLinks]);

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
