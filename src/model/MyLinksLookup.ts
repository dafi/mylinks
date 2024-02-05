import { Link, Widget } from './MyLinks-interface';
import { WidgetGrid } from './WidgetGrid';

export interface MyLinksLookup {
  findLinkById(linkId: string): Link | undefined;

  findWidgetById(widgetId: string): Widget | undefined;

  findWidgetByLinkId(linkId: string): Widget | undefined;

  hasShortcuts(): boolean;

  getWidgetGrid(): WidgetGrid;
}
