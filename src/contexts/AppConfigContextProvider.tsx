import { ReactElement, useEffect, useState } from 'react';
import { MyLinksHolder } from '../common/MyLinksHolder';
import { applyTheme } from '../common/ThemeUtil.ts';
import { UIInput } from '../common/UIInput';
import { MyLinks } from '../model/MyLinks-interface';
import { AppConfig, AppConfigContext, defaultAppConfig, defaultTheme } from './AppConfigContext';

function reloadAll(myLinks: MyLinks | undefined): AppConfig {
  if (!myLinks) {
    return defaultAppConfig;
  }
  const myLinksHolder = new MyLinksHolder(myLinks);
  UIInput.instance().setup(myLinksHolder);

  const config = buildConfig(myLinksHolder);
  applyTheme(config.theme);
  return config;
}

function buildConfig(holder: MyLinksHolder): AppConfig {
  return {
    theme: {
      ...holder.myLinks.theme,
      faviconColor: holder.myLinks.theme?.faviconColor ?? defaultTheme.faviconColor,
    },
    faviconService: holder.myLinks.config?.faviconService,
    myLinksLookup: holder,
  };
}

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
