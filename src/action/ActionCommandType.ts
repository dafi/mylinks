import { Dispatch } from 'react';
import { AppConfig } from '../contexts/AppConfigType';
import { AppUIStateAction } from '../contexts/useAppUIState';

export type ActionContext = {
  config: AppConfig;
  updateUIState: Dispatch<AppUIStateAction>;
};


export type ActionCommand = {
  execute(...args: unknown[]): void;
};
