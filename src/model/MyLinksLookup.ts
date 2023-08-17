import { LinkId, Widget, WidgetId } from './MyLinks-interface.ts';
import { KeyCombination, Shortcut } from './Shortcut.ts';

export interface MyLinksLookup {
  findShortcuts(shortcut: KeyCombination): Shortcut[];

  findWidgetById(widgetId: WidgetId): Widget | undefined;

  findWidgetByLinkId(linkId: LinkId): Widget | undefined;

  hasShortcuts(): boolean;
}
