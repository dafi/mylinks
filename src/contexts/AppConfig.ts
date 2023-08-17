import { MyLinksHolder } from '../common/MyLinksHolder.ts';
import { applyTheme, defaultTheme } from '../common/ThemeUtil.ts';
import { UIInput } from '../common/UIInput.ts';
import { MyLinks, Theme } from '../model/MyLinks-interface.ts';
import { MyLinksLookup } from '../model/MyLinksLookup.ts';

export interface AppConfig {
  theme: Theme;
  faviconService?: string;
  myLinksLookup?: MyLinksLookup;
}

export const defaultAppConfig: Readonly<AppConfig> = {
  theme: defaultTheme,
};

export function reloadAll(myLinks: MyLinks | undefined): Readonly<AppConfig> {
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
