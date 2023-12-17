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
  shortcut?: string;
};

export type Widget = {
  id: string;
  title: string;
  list: Link[];
};

export type AppAction = 'openAllLinks' | 'findLinks' | 'toggleShortcuts' | 'editSettings';

export type ShortcutAction = {
  action: AppAction;
  shortcut: string;
};

export type Config = {
  faviconService?: string;
  systemShortcuts?: ShortcutAction[];
};

export type MultiOpenCombination = {
  shortcut: string;
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
