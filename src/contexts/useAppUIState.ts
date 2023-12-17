import { Dispatch, useReducer } from 'react';
import { getBoolean, setBoolean } from '../common/localStorageUtil';
import { AppUIState } from './AppUIStateContext';

const PREF_HIDE_SHORTCUTS = 'hideShortcuts';
const PREF_SETTINGS_CHANGED = 'settingsChanged';

export type AppUIStateAction = {
  type: 'settingsChanged';
  value: boolean;
} | {
  type: 'hideShortcuts';
  value: boolean | 'toggle';
};

function reducer(state: AppUIState, action: AppUIStateAction): AppUIState {
  switch (action.type) {
    case 'settingsChanged':
      setBoolean(PREF_SETTINGS_CHANGED, action.value);
      return { ...state, settingsChanged: action.value };
    case 'hideShortcuts': {
      const newValue = action.value === 'toggle' ? !state.hideShortcuts : action.value;
      setBoolean(PREF_HIDE_SHORTCUTS, newValue);
      return { ...state, hideShortcuts: newValue };
    }
    default:
      return state;
  }
}

export function useAppUIState(): [AppUIState, Dispatch<AppUIStateAction>] {
  const defaultUIState: AppUIState = {
    hideShortcuts: getBoolean(PREF_HIDE_SHORTCUTS),
    settingsChanged: getBoolean(PREF_SETTINGS_CHANGED),
  };

  return useReducer(reducer, defaultUIState);
}
