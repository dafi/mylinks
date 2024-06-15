import { HotKey } from '../model/KeyCombination';

export type Action =
  'openAllLinks' |
  'findLinks' |
  'toggleShortcuts' |
  'openSettings' |
  'exportConfig' |
  'addWidget';

export type ActionInfo = {
  action: Action;
  label: string;
  canAssignShortcut: boolean;
};

export type ActionShortcut = {
  action: Action;
} & HotKey;

export const ActionList: ActionInfo[] = [
  { action: 'openAllLinks', label: 'Open all widget links under cursor', canAssignShortcut: true },
  { action: 'findLinks', label: 'Find Links and Open', canAssignShortcut: true },
  { action: 'toggleShortcuts', label: 'Show/Hide the shortcuts assigned to links', canAssignShortcut: true },
  { action: 'openSettings', label: 'Open the Settings dialog', canAssignShortcut: true },
  { action: 'exportConfig', label: 'Export Settings', canAssignShortcut: true },
  { action: 'addWidget', label: 'Add Widget', canAssignShortcut: true },
] as const;
