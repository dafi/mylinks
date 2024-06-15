import { Dispatch, useCallback, useState } from 'react';
import { MyLinks } from '../model/MyLinks-interface';
import { createAppConfig, defaultAppConfig } from './AppConfig';
import { AppConfig } from './AppConfigType';
import { AppUIStateAction } from './useAppUIState';

export function useAppConfig(
  updateUIState: Dispatch<AppUIStateAction>
):
  [AppConfig, Dispatch<AppConfig>, (m: MyLinks | undefined) => void] {
  const [config, setConfig] = useState(defaultAppConfig);

  const onConfigLoaded = useCallback((m: MyLinks | undefined) => {
    setConfig(createAppConfig(m, updateUIState));
  }, [updateUIState]);

  return [config, setConfig, onConfigLoaded];
}
