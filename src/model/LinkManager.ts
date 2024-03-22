import { ItemLocation, Link, Widget } from './MyLinks-interface';

export interface LinkManager {
  findLinkById(linkId: string): Link | undefined;

  findWidgetByLinkId(linkId: string): Widget | undefined;

  moveLink(source: ItemLocation, destination: ItemLocation): boolean;

  hasLinks(): boolean;

  hasShortcuts(): boolean;
}
