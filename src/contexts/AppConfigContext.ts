import React from 'react';
import { Theme, MyLinksLookup } from '../model/MyLinks-interface';

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

export const AppConfigContext = React.createContext<AppConfig>(defaultAppConfig);
