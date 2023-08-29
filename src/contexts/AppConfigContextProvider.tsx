import { ReactElement, useEffect, useState } from 'react';
import { SettingsDialog } from '../components/settingsDialog/SettingsDialog';
import { EditComplete } from '../hooks/useEditLink/useEditLink';
import { Config, MyLinks, Theme } from '../model/MyLinks-interface';
import { defaultAppConfig, reloadAll } from './AppConfig';
import { AppConfigContext } from './AppConfigContext';

interface AppConfigContextProps {
  readonly myLinks: MyLinks | undefined;
  readonly onEditComplete: (result: EditComplete) => void;
  readonly children: ReactElement;
}

export function AppConfigContextProvider(
  {
    myLinks,
    onEditComplete,
    children
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

  return (
    <AppConfigContext.Provider value={config}>
      {children}

      <SettingsDialog
        onSave={onSaveSettings}
      />
    </AppConfigContext.Provider>
  );
}
