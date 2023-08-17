import { ReactElement, useEffect, useState } from 'react';
import { MyLinks } from '../model/MyLinks-interface';
import { AppConfigContext } from './AppConfigContext';
import { defaultAppConfig, reloadAll } from './AppConfig';

interface AppConfigContextProps {
  readonly myLinks: MyLinks | undefined;
  readonly children: ReactElement;
}

export function AppConfigContextProvider({ myLinks, children }: AppConfigContextProps): ReactElement {
  const [config, setConfig] = useState(defaultAppConfig);

  useEffect(() => {
    setConfig(reloadAll(myLinks));
  }, [myLinks]);

  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
}
