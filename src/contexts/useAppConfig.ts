import { Dispatch, useMemo, useState } from 'react';
import { OnLoadCallback } from '../common/Config';
import { MyLinks } from '../model/MyLinks-interface';
import { createAppConfig } from './AppConfig';
import { AppConfig } from './AppConfigType';
import { AppUIStateAction } from './useAppUIState';

export function useAppConfig(
  updateUIState: Dispatch<AppUIStateAction>
):
  [AppConfig, Dispatch<AppConfig>, OnLoadCallback] {
  const [config, setConfig] = useState(createAppConfig(undefined, updateUIState));

  const onConfigLoaded = useMemo(() => ({
    onLoad: (m: MyLinks): void => setConfig(createAppConfig(m, updateUIState)),
    onError: (error: unknown): void => updateUIState({ type: 'error', error }),
  }), [updateUIState]);

  return [config, setConfig, onConfigLoaded];
}
