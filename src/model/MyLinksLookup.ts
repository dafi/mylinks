import { LinkManager } from './LinkManager';
import { MyLinks } from './MyLinks-interface';
import { WidgetManager } from './WidgetManager';

export interface MyLinksLookup {
  readonly myLinks: Readonly<MyLinks>;
  readonly linkManager: LinkManager;
  readonly widgetManager: WidgetManager;
}
