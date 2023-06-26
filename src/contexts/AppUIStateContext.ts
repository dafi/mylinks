import React from 'react';
import { EditDataType } from '../model/EditData-interface';

export interface AppUIState {
  hideShortcuts: boolean;
  onEdit?: (editData: EditDataType) => void;
}

const defaultAppUIState = {
  hideShortcuts: false,
};

export const AppUIStateContext = React.createContext<AppUIState>(defaultAppUIState);
