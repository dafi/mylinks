import { createContext, useContext } from 'react';
import { EditDataType } from '../model/EditData-interface';

export interface AppUIState {
  hideShortcuts: boolean;
  onEdit?: (editData: EditDataType) => void;
}

const defaultAppUIState = {
  hideShortcuts: false,
};

export const AppUIStateContext = createContext<AppUIState>(defaultAppUIState);

export const useAppUIStateContext = (): AppUIState => useContext(AppUIStateContext);
