import { Dispatch, useCallback, useState } from 'react';
import { MyLinks } from '../model/MyLinks-interface';
import { AppConfig, defaultAppConfig, reloadAll } from './AppConfig';
import { AppUIStateAction } from './useAppUIState';

export function useAppConfig(
  updateUIState: Dispatch<AppUIStateAction>
):
  [AppConfig, Dispatch<AppConfig>, (m: MyLinks | undefined) => void] {
  const [config, setConfig] = useState(defaultAppConfig);

  const onConfigLoaded = useCallback((m: MyLinks | undefined) => {
    if (m) {
      setConfig(reloadAll(m, updateUIState));
    }
  }, [updateUIState]);

  return [config, setConfig, onConfigLoaded];
}
