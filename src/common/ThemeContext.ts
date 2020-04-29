import React from 'react';

export interface Theme {
  missingFavIconColor: string;
  linkDescriptionBackground?: string;
  linkDescriptionColor?: string;

  hideShortcuts: boolean;
}

export const defaultTheme: Theme = {
  missingFavIconColor: 'blue',
  hideShortcuts: false
};

export const ThemeContext = React.createContext(defaultTheme);
