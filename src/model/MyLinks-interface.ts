import { Shortcut } from '../common/Shortcut.ts';

export type WidgetId = string;
export type LinkId = string;
export type KeyCombination = string;

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

export interface MyLinksLookup {
  findShortcuts(shortcut: KeyCombination): Shortcut[];
  findWidgetById(widgetId: WidgetId): Widget | undefined;
  findWidgetByLinkId(linkId: LinkId): Widget | undefined;
  hasShortcuts(): boolean;
}
