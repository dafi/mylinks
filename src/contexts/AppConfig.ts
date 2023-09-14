import { MyLinksHolder } from '../common/MyLinksHolder';
import { reloadShortcuts } from '../common/shortcut/ShortcutManagerHelper';
import { applyTheme, defaultTheme } from '../common/ThemeUtil';
import { MyLinks } from '../model/MyLinks-interface';
import { MyLinksLookup } from '../model/MyLinksLookup';

export type AppConfig = {
  faviconService?: string;
  myLinksLookup?: MyLinksLookup;
} & Required<Pick<MyLinks, 'theme'>> & Pick<MyLinks, 'multiOpen'>;

export const defaultAppConfig: Readonly<AppConfig> = {
  theme: defaultTheme,
};

export function reloadAll(myLinks: MyLinks | undefined): Readonly<AppConfig> {
  if (!myLinks) {
    return defaultAppConfig;
  }
  const myLinksHolder = new MyLinksHolder(myLinks);
  reloadShortcuts(myLinks, myLinksHolder);

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
    multiOpen: holder.myLinks.multiOpen,
  };
}
