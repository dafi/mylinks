
import { Background, Theme } from '../model/Theme';
import { applyColorToFavicon } from './Favicon';
import { isNotEmptyString } from './StringUtil';

export const defaultBackgroundColor = '#ffffff';

export function applyTheme({ background, faviconColor }: Theme): void {
  if (background) {
    applyBackground(background);
  }
  applyColorToFavicon(faviconColor);
}

export function applyBackground({ image, color }: Background): void {
  const style = document.body.style;

  style.backgroundImage = isNotEmptyString(image) ? `url(${image})` : '';
  style.backgroundRepeat = 'no-repeat';
  style.backgroundColor = isNotEmptyString(color) ? color : defaultBackgroundColor;
}
