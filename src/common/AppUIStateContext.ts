import React from 'react';
import { Link, Widget } from '../model/MyLinks-interface';

export interface EditLinkData {
  link: Link;
  widget: Widget;
  position?: number;
  editType: 'new' | 'update' | 'delete';
}

export interface AppUIState {
  hideShortcuts: boolean;
  onEdit?: (editLinkData: EditLinkData) => void;
}

const defaultAppUIState = {
  hideShortcuts: false,
};

export const AppUIStateContext = React.createContext<AppUIState>(defaultAppUIState);
