import { ReactElement } from 'react';

export const settingsDialogId = 'settingsDialog';

export interface SettingsPanel {
  title: string;
  content: ReactElement;
}
