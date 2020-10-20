import React from 'react';

export interface Theme {
  missingFavIconColor: string;
  linkKeyBackground?: string;
  linkKeyColor?: string;
}

const defaultTheme: Theme = {
  missingFavIconColor: 'blue',
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
export const appConfigClone = (): AppConfig => JSON.parse(JSON.stringify(defaultAppConfig));

export const AppConfigContext = React.createContext<AppConfig>(defaultAppConfig);
