import { KeyCombination } from './KeyCombination';

export type Theme = {
  backgroundImage?: string;
  faviconColor: string;
  linkKeyBackground?: string;
  linkKeyColor?: string;
};

export type Link = {
  id: string;
  label: string;
  url: string;
  favicon?: string;
  shortcut?: KeyCombination[];
};

export type Widget = {
  id: string;
  title: string;
  list: Link[];
};

export const AppActionList = ['openAllLinks', 'findLinks', 'toggleShortcuts', 'editSettings'] as const;

export type AppAction = (typeof AppActionList)[number];

export type ShortcutAction = {
  action: AppAction;
  shortcut: KeyCombination[];
};

export type Config = {
  faviconService?: string;
  systemShortcuts?: ShortcutAction[];
};

export type MultiOpenCombination = {
  shortcut: KeyCombination[];
  linkIds: string[];
};

export type MultiOpen = {
  combinations: MultiOpenCombination[];
};

export type MyLinks = {
  theme?: Theme;
  columns: Widget[][];
  config?: Config;
  multiOpen?: MultiOpen;
};
