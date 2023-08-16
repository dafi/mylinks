import { createContext, useContext } from 'react';
import { AppConfig, defaultAppConfig } from './AppConfig.ts';

export const AppConfigContext = createContext<AppConfig>(defaultAppConfig);

export const useAppConfigContext = (): AppConfig => useContext(AppConfigContext);
