import { Link, LinkId, Widget, WidgetId } from './MyLinks-interface';

export interface MyLinksLookup {
  findLinkById(linkId: LinkId): Link | undefined;

  findWidgetById(widgetId: WidgetId): Widget | undefined;

  findWidgetByLinkId(linkId: LinkId): Widget | undefined;

  hasShortcuts(): boolean;
}
