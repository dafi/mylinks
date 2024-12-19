import { ReactNode } from 'react';

export const settingsDialogId = 'settingsDialog';

export interface SettingsPanel {
  title: string;
  content: ReactNode;
}
