import React from 'react';

export interface Theme {
  missingFavIconColor: string;
  linkKeyBackground?: string;
  linkKeyColor?: string;

  hideShortcuts: boolean;
}

export const defaultTheme: Theme = {
  missingFavIconColor: 'blue',
  hideShortcuts: false
};

export const ThemeContext = React.createContext(defaultTheme);
