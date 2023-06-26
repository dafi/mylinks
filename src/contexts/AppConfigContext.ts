import React from 'react';
import { Theme, MyLinksLookup } from '../model/MyLinks-interface';

const defaultTheme: Theme = {
  faviconColor: 'blue',
};

export interface AppConfig {
  theme: Theme;
  faviconService?: string;
  myLinksLookup?: MyLinksLookup;
}

const defaultAppConfig: AppConfig = {
  theme: defaultTheme,
};

// deep copy the configuration
export const appConfigClone = (): AppConfig => JSON.parse(JSON.stringify(defaultAppConfig)) as AppConfig;

export const AppConfigContext = React.createContext<AppConfig>(defaultAppConfig);
