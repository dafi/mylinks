import { LinkId, Widget, WidgetId } from './MyLinks-interface';
import { KeyCombination, Shortcut } from './Shortcut';

export interface MyLinksLookup {
  findShortcuts(shortcut: KeyCombination): Shortcut[];

  findWidgetById(widgetId: WidgetId): Widget | undefined;

  findWidgetByLinkId(linkId: LinkId): Widget | undefined;

  hasShortcuts(): boolean;
}
