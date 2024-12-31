import { ColorScheme } from '../common/ColorScheme';

export type Background = {
  image?: string | undefined;
  color?: string | undefined;
};

export type Theme = {
  background?: Background | undefined;
  faviconColor?: string | undefined;
  colorScheme?: ColorScheme | undefined;
};
