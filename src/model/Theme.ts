import { ColorScheme } from '../common/ColorScheme';

export type Background = {
  image?: string;
  color?: string;
};

export type Theme = {
  background?: Background;
  faviconColor?: string;
  colorScheme?: ColorScheme;
};
