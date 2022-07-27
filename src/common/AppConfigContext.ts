import React from 'react';
import { Theme } from '../model/MyLinks-interface';

const defaultTheme: Theme = {
  faviconColor: 'blue',
};

export interface AppConfig {
  theme: Theme;
  faviconService?: string;
  hideShortcuts: boolean;
}

const defaultAppConfig: AppConfig = {
  theme: defaultTheme,
  hideShortcuts: false
};

// deep copy the configuration
export const appConfigClone = (): AppConfig => JSON.parse(JSON.stringify(defaultAppConfig)) as AppConfig;

export const AppConfigContext = React.createContext<AppConfig>(defaultAppConfig);
