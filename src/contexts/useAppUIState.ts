import { useState } from 'react';
import { getBoolean, setBoolean } from '../common/localStorageUtil';
import { AppUIState } from './AppUIStateContext';

const PREF_HIDE_SHORTCUTS = 'hideShortcuts';
const PREF_WIDGETS_MODIFIED = 'widgetModified';

export function useAppUIState(): [AppUIState, (uiState: Partial<AppUIState>) => void] {
  const defaultUIState: AppUIState = {
    hideShortcuts: getBoolean(PREF_HIDE_SHORTCUTS),
    widgetsModified: getBoolean(PREF_WIDGETS_MODIFIED),
  };

  const [uiState, setUIState] = useState(defaultUIState);

  return [
    uiState,
    (state: Partial<AppUIState>): void => {
      const { hideShortcuts, widgetsModified } = state;

      if (hideShortcuts !== undefined) {
        setBoolean(PREF_HIDE_SHORTCUTS, hideShortcuts);
      }
      if (widgetsModified !== undefined) {
        setBoolean(PREF_WIDGETS_MODIFIED, widgetsModified);
      }
      setUIState(prevState => ({ ...prevState, ...state }));
    }
  ];
}
