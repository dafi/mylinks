import { Dispatch } from 'react';
import { LinkCache } from '../common/LinkCache';
import { LinkManagerImpl } from '../common/LinkManagerImpl';
import { MyLinksHolder } from '../common/MyLinksHolder';
import { reloadShortcuts } from '../common/shortcut/ShortcutManagerHelper';
import { applyTheme } from '../common/ThemeUtil';
import { WidgetManagerImpl } from '../common/WidgetManagerImpl';
import { Config, MyLinks } from '../model/MyLinks-interface';
import { MyLinksLookup } from '../model/MyLinksLookup';
import { AppUIStateAction } from './useAppUIState';

export type AppConfig = {
  myLinksLookup?: MyLinksLookup;
} & Config & Pick<MyLinks, 'theme'>;

export const defaultAppConfig: Readonly<AppConfig> = {};

export function reloadAll(myLinks: MyLinks | undefined, updateUIState: Dispatch<AppUIStateAction>): Readonly<AppConfig> {
  if (!myLinks) {
    return defaultAppConfig;
  }
  try {
    const widgetManager = new WidgetManagerImpl(myLinks.columns);
    const myLinksHolder = new MyLinksHolder(
      myLinks,
      new LinkManagerImpl(myLinks, new LinkCache(myLinks.columns), widgetManager),
      widgetManager);
    reloadShortcuts(myLinks, myLinksHolder, updateUIState);

    const config = buildConfig(myLinksHolder);
    if (config.theme) {
      applyTheme(config.theme);
    }
    return config;
  } catch (e) {
    window.alert(e);
  }
  return defaultAppConfig;
}

function buildConfig(holder: MyLinksHolder): AppConfig {
  return {
    theme: holder.myLinks.theme,
    faviconService: holder.myLinks.config?.faviconService,
    systemShortcuts: holder.myLinks.config?.systemShortcuts,
    myLinksLookup: holder,
  };
}
