const PREF_COLOR_SCHEME = 'colorScheme';
export type ColorScheme = 'system' | 'light' | 'dark';

export type SchemeOptions = {
  scheme: ColorScheme;
  element: HTMLElement;
  cssClass: 'theme-dark';
};

export const getColorScheme = (): ColorScheme => localStorage.getItem(PREF_COLOR_SCHEME) as ColorScheme | null ?? 'system';
export const setColorScheme = (scheme: ColorScheme): void => localStorage.setItem(PREF_COLOR_SCHEME, scheme);

export function applyColorScheme({ scheme, element, cssClass }: SchemeOptions): void {
  if (scheme === 'system') {
    scheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  switch (scheme) {
    case 'light':
      element.classList.remove(cssClass);
      break;
    case 'dark':
      element.classList.add(cssClass);
      break;
  }
}
