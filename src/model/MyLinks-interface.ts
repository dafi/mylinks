import { ActionShortcut } from '../action/ActionType';
import { HotKey } from './KeyCombination';
import { Theme } from './Theme';

export type Link = {
  id: string;
  label: string;
  urls: string[];
  favicon?: string | undefined;
} & Partial<HotKey>;

export type Widget = {
  id: string;
  title: string;
  list: Link[];
  collapsed?: boolean;
  backgroundColor?: string;
  textColor?: string;
};

export type Config = {
  faviconService?: string | undefined;
  systemShortcuts?: ActionShortcut[] | undefined;
};

export type MyLinks = {
  theme?: Theme | undefined;
  columns: Widget[][];
  config?: Config | undefined;
};

export type ItemLocation = {
  id: string;
  index: number;
};
