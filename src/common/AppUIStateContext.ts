import React from 'react';

export interface AppUIState {
  hideShortcuts: boolean;
}

const defaultAppUIState = {
  hideShortcuts: false,
};

export const AppUIStateContext = React.createContext<AppUIState>(defaultAppUIState);
