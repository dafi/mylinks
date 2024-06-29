import { Dispatch } from 'react';
import { registerActions } from '../action/Action';
import { LinkCache } from '../common/LinkCache';
import { LinkManagerImpl } from '../common/LinkManagerImpl';
import { MyLinksHolder } from '../common/MyLinksHolder';
import { reloadShortcuts } from '../common/shortcut/ShortcutManagerHelper';
import { applyTheme } from '../common/ThemeUtil';
import { WidgetManagerImpl } from '../common/WidgetManagerImpl';
import { MyLinks } from '../model/MyLinks-interface';
import { AppConfig } from './AppConfigType';
import { AppUIStateAction } from './useAppUIState';

const defaultMyLinks: MyLinks = {
  columns: []
};

export const defaultAppConfig: Readonly<AppConfig> = { myLinksLookup: createMyLinkHolder(defaultMyLinks) };

export function createAppConfig(
  myLinks: MyLinks | undefined,
  updateUIState: Dispatch<AppUIStateAction>
): Readonly<AppConfig> {
  try {
    return buildConfig(createMyLinkHolder(myLinks ?? defaultMyLinks));
  } catch (error) {
    updateUIState({ type: 'error', error });
  }
  return defaultAppConfig;
}

function createMyLinkHolder(myLinks: MyLinks): MyLinksHolder {
  const widgetManager = new WidgetManagerImpl(myLinks.columns);
  return new MyLinksHolder(
    myLinks,
    new LinkManagerImpl(myLinks, new LinkCache(myLinks.columns), widgetManager),
    widgetManager);
}

function buildConfig(holder: MyLinksHolder): AppConfig {
  return {
    theme: holder.myLinks.theme,
    faviconService: holder.myLinks.config?.faviconService,
    systemShortcuts: holder.myLinks.config?.systemShortcuts,
    myLinksLookup: holder,
  };
}

export function applyAppConfig(
  config: AppConfig,
  updateUIState: Dispatch<AppUIStateAction>
): void {
  registerActions({ config, updateUIState });
  reloadShortcuts(config.myLinksLookup);
  if (config.theme) {
    applyTheme(config.theme);
  }
}
