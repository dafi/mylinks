import React from 'react';

export interface Theme {
  missingFavIconColor: string;
}

export const defaultTheme: Theme = {
  missingFavIconColor: 'blue'
};

export const ThemeContext = React.createContext(defaultTheme);
