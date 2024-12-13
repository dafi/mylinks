import { Widget } from '../../../model/MyLinks-interface';

export type CssVar = `--${string}`;

export type WidgetColor =
  'titleColor'
  | 'toolbarIconColor'
  | 'backgroundColor'
  | 'textColor';

export const WidgetCssVar: Readonly<Record<WidgetColor, CssVar>> = {
  titleColor: '--widget-title-color',
  toolbarIconColor: '--widget-toolbar-icon-color',
  backgroundColor: '--widget-background-color',
  textColor: '--link-label-color',
};

export type WidgetExtraCssClass = {
  widget: string;
};

export type WidgetColorScheme = {
  textColor?: string;
  backgroundColor?: string;
};

export function cssExtraClasses(startCollapsed: boolean, collapsed: boolean): WidgetExtraCssClass {
  const collapsedVisible = startCollapsed && !collapsed;
  const cls: WidgetExtraCssClass = {
    widget: '',
  };

  if (startCollapsed) {
    cls.widget += 'collapsed ';
  }
  if (collapsedVisible) {
    cls.widget += 'collapsed-visible ';
  }

  return cls;
}

export function getWidgetColorScheme(
  { id, textColor, backgroundColor }: Widget,
): WidgetColorScheme {
  const widgetEl = document.querySelector(`[data-list-id="${id}"]`);
  if (!widgetEl) {
    return { textColor, backgroundColor };
  }

  const style = getComputedStyle(widgetEl);
  return {
    textColor: textColor ?? convertHexToSixChar(style.getPropertyValue(WidgetCssVar.textColor)),
    backgroundColor: backgroundColor ?? convertHexToSixChar(style.getPropertyValue(WidgetCssVar.backgroundColor))
  };
}

export function convertHexToSixChar(hex: string): string {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return hex.length === 4 && hex.startsWith('#') ? '#' + hex[1].repeat(2) + hex[2].repeat(2) + hex[3].repeat(2) : hex;
}
