import { Link, Widget, ItemLocation } from './MyLinks-interface';
import { WidgetGrid } from './WidgetGrid';

export interface MyLinksLookup {
  findLinkById(linkId: string): Link | undefined;

  findWidgetById(widgetId: string): Widget | undefined;

  findWidgetByLinkId(linkId: string): Widget | undefined;

  moveLink(source: ItemLocation, destination: ItemLocation): boolean;

  hasShortcuts(): boolean;

  hasLinks(): boolean;

  getWidgetGrid(): WidgetGrid;
}
