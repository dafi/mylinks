import React from 'react';
import { Link } from '../model/MyLinks-interface';

export interface AppUIState {
  hideShortcuts: boolean;
  hideEditMode: boolean;
  onEdit?: (link: Link) => void;
}

const defaultAppUIState = {
  hideShortcuts: false,
  hideEditMode: true,
};

export const AppUIStateContext = React.createContext<AppUIState>(defaultAppUIState);
