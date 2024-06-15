import { createContext, useContext } from 'react';
import { defaultAppConfig } from './AppConfig';
import { AppConfig } from './AppConfigType';

export const AppConfigContext = createContext(defaultAppConfig);

export const useAppConfigContext = (): AppConfig => useContext(AppConfigContext);
