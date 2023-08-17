import { KeyCombination } from './Shortcut.ts';

export type WidgetId = string;
export type LinkId = string;

export interface Theme {
  backgroundImage?: string;
  faviconColor: string;
  linkKeyBackground?: string;
  linkKeyColor?: string;
}

export interface Link {
  id: LinkId;
  label: string;
  url: string;
  favicon?: string;
  shortcut?: KeyCombination;
}

export interface Widget {
  id: WidgetId;
  title: string;
  list: Link[];
}

export interface Config {
  faviconService?: string;
}

export interface MultiOpen {
  shortcuts: Record<KeyCombination, LinkId[]>;
}

export interface MyLinks {
  theme?: Theme;
  columns: Widget[][];
  config?: Config;
  multiOpen?: MultiOpen;
}
