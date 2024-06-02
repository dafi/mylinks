import { ColorScheme } from '../common/ColorScheme';
import { AppAction } from './AppAction';
import { HotKey } from './KeyCombination';

export type Theme = {
  backgroundImage?: string;
  faviconColor?: string;
  linkKeyBackground?: string;
  linkKeyColor?: string;
  colorScheme?: ColorScheme;
};

export type Link = {
  id: string;
  label: string;
  urls: string[];
  favicon?: string;
} & Partial<HotKey>;

export type Widget = {
  id: string;
  title: string;
  list: Link[];
  collapsed?: boolean;
};

export type Config = {
  faviconService?: string;
  systemShortcuts?: AppAction[];
};

export type MyLinks = {
  theme?: Theme;
  columns: Widget[][];
  config?: Config;
};

export type ItemLocation = {
  id: string;
  index: number;
};
