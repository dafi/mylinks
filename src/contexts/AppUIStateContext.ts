import { createContext, useContext } from 'react';
import { EditDataType } from '../model/EditData-interface';

export interface AppUIState {
  hideShortcuts: boolean;
  onEdit?: (editData: EditDataType) => void;
}

const defaultAppUIState: AppUIState = {
  hideShortcuts: false,
};

export const AppUIStateContext = createContext(defaultAppUIState);

export const useAppUIStateContext = (): AppUIState => useContext(AppUIStateContext);

