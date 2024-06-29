import { Dispatch, useEffect, useMemo, useState } from 'react';
import { OnLoadCallback } from '../common/Config';
import { MyLinks } from '../model/MyLinks-interface';
import { applyAppConfig, createAppConfig, defaultAppConfig } from './AppConfig';
import { AppConfig } from './AppConfigType';
import { AppUIStateAction } from './useAppUIState';

export function useAppConfig(
  updateUIState: Dispatch<AppUIStateAction>
):
  [AppConfig, Dispatch<AppConfig>, OnLoadCallback] {
  const [config, setConfig] = useState(defaultAppConfig);

  const onConfigLoaded = useMemo(() => ({
    onLoad: (m: MyLinks): void => setConfig(createAppConfig(m, updateUIState)),
    onError: (error: unknown): void => updateUIState({ type: 'error', error }),
  }), [updateUIState]);

  useEffect(() => {
    try {
      applyAppConfig(config, updateUIState);
    } catch (error) {
      updateUIState({ type: 'error', error });
    }
  }, [config, updateUIState]);

  return [config, setConfig, onConfigLoaded];
}
