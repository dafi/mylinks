import { createContext, useContext } from 'react';
import { MyLinksLookup, Theme } from '../model/MyLinks-interface';

export const defaultTheme: Theme = {
  faviconColor: 'blue',
};

export interface AppConfig {
  theme: Theme;
  faviconService?: string;
  myLinksLookup?: MyLinksLookup;
}

export const defaultAppConfig: AppConfig = {
  theme: defaultTheme,
};

export const AppConfigContext = createContext<AppConfig>(defaultAppConfig);

export const useAppConfigContext = (): AppConfig => useContext(AppConfigContext);
