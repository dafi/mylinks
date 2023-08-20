import { createContext, useContext } from 'react';
import { AppConfig, defaultAppConfig } from './AppConfig';

export const AppConfigContext = createContext(defaultAppConfig);

export const useAppConfigContext = (): AppConfig => useContext(AppConfigContext);
