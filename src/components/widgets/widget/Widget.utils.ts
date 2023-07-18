export interface WidgetExtraCssClass {
  widget: string;
}

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
