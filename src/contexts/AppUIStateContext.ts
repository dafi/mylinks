import { createContext, useContext } from 'react';
import { EditDataType } from '../model/EditData-interface';

export interface AppUIState {
  hideShortcuts: boolean;
  settingsChanged: boolean;
  // If the user loads a new configuration containing widgets ids already present on the current one
  // React doesn't re-render ignoring the fact some properties may be different (e.g. collapse state)
  // To prevent this from happening we force the rendering of the entire subtree
  reloadCounter: number;
  onEdit?: (editData: EditDataType) => void;
  error?: unknown;
}

const defaultAppUIState: AppUIState = {
  hideShortcuts: false,
  settingsChanged: false,
  reloadCounter: 0,
};

export const AppUIStateContext = createContext(defaultAppUIState);

export const useAppUIStateContext = (): AppUIState => useContext(AppUIStateContext);

