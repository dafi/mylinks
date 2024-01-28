import { Dispatch } from 'react';
import { MyLinksHolder } from '../common/MyLinksHolder';
import { reloadShortcuts } from '../common/shortcut/ShortcutManagerHelper';
import { applyTheme, defaultTheme } from '../common/ThemeUtil';
import { Config, MyLinks } from '../model/MyLinks-interface';
import { MyLinksLookup } from '../model/MyLinksLookup';
import { AppUIStateAction } from './useAppUIState';

export type AppConfig = {
  myLinksLookup?: MyLinksLookup;
} & Config & Required<Pick<MyLinks, 'theme'>>;

export const defaultAppConfig: Readonly<AppConfig> = {
  theme: defaultTheme,
};

export function reloadAll(myLinks: MyLinks | undefined, updateUIState: Dispatch<AppUIStateAction>): Readonly<AppConfig> {
  if (!myLinks) {
    return defaultAppConfig;
  }
  try {
    const myLinksHolder = new MyLinksHolder(myLinks);
    reloadShortcuts(myLinks, myLinksHolder, updateUIState);

    const config = buildConfig(myLinksHolder);
    applyTheme(config.theme);
    return config;
  } catch (e) {
    window.alert(e);
  }
  return defaultAppConfig;
}

function buildConfig(holder: MyLinksHolder): AppConfig {
  return {
    theme: {
      ...holder.myLinks.theme,
      faviconColor: holder.myLinks.theme?.faviconColor ?? defaultTheme.faviconColor,
    },
    faviconService: holder.myLinks.config?.faviconService,
    systemShortcuts: holder.myLinks.config?.systemShortcuts,
    myLinksLookup: holder,
  };
}
