import React, { ReactNode, useEffect, useState } from 'react';
import { applyColorToFavicon } from '../common/Favicon';
import { MyLinksHolder } from '../common/MyLinksHolder';
import { UIInput } from '../common/UIInput';
import { MyLinks } from '../model/MyLinks-interface';
import { AppConfig, AppConfigContext, defaultAppConfig, defaultTheme } from './AppConfigContext';

function reloadAll(myLinks: MyLinks | undefined): AppConfig {
  if (!myLinks) {
    return defaultAppConfig;
  }
  const myLinksHolder = new MyLinksHolder(myLinks);
  myLinksHolder.applyBackground();
  myLinksHolder.applyTheme();
  UIInput.instance().setup(myLinksHolder);

  const config = buildConfig(myLinksHolder);
  applyColorToFavicon(config.theme.faviconColor);

  return config;
}

function buildConfig(holder: MyLinksHolder): AppConfig {
  return {
    theme: {
      faviconColor: holder.myLinks.theme?.faviconColor || defaultTheme.faviconColor,
    },
    faviconService: holder.myLinks.config?.faviconService,
    myLinksLookup: holder,
  };
}

export function AppConfigContextProvider({ myLinks, children }: { myLinks: MyLinks | undefined; children: ReactNode }): JSX.Element {
  const [config, setConfig] = useState(defaultAppConfig);

  useEffect(() => {
    setConfig(reloadAll(myLinks));
  }, [myLinks]);

  return <AppConfigContext.Provider value={config}>{children}</AppConfigContext.Provider>;
}
