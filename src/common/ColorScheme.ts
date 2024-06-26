export type ColorScheme = 'system' | 'light' | 'dark';

export type SchemeOptions = {
  colorScheme: ColorScheme;
  /** The element where the {@link SchemeOptions.cssClass} will be added/removed */
  element: HTMLElement;
  /** The CSS class to use when dark mode is set, be careful it's used **only** for dark mode */
  cssClass: 'theme-dark';
};

export function buildColorSchemeOptions(
  {
    colorScheme,
    element,
    cssClass,
  }: Partial<SchemeOptions>
): SchemeOptions {
  // merging using the spread operator is not possible because the argument
  // can contain the field defined but set to undefined (e.g. colorScheme: undefined)
  // if so the value would be undefined
  return {
    colorScheme: colorScheme ?? 'system',
    element: element ?? document.body,
    cssClass: cssClass ?? 'theme-dark',
  };
}

export function applyColorScheme({ colorScheme, element, cssClass }: SchemeOptions): void {
  if (colorScheme === 'system') {
    colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  switch (colorScheme) {
    case 'light':
      element.classList.remove(cssClass);
      break;
    case 'dark':
      element.classList.add(cssClass);
      break;
  }
}
