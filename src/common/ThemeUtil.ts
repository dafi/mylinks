import { Theme } from '../model/MyLinks-interface.ts';
import { applyColorToFavicon } from './Favicon.ts';

export const defaultTheme: Readonly<Theme> = {
  faviconColor: 'blue',
};

export function applyTheme(theme: Theme): void {
  applyBackground(theme.backgroundImage);
  applyColors(theme);
  applyColorToFavicon(theme.faviconColor);
}

export function applyBackground(backgroundImage?: string): void {
  const body = document.body;
  if (backgroundImage) {
    body.style.backgroundImage = `url(${backgroundImage})`;
  } else {
    body.style.backgroundImage = '';
  }
}

export function applyColors(theme: Theme): void {
  setColor('--link-key-background', theme.linkKeyBackground);
  setColor('--link-key-color', theme.linkKeyColor);
}

export function setColor(property: string, color?: string): void {
  if (color) {
    document.documentElement.style.setProperty(property, color);
  } else {
    document.documentElement.style.removeProperty(property);
  }
}
