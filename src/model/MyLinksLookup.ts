import { LinkManager } from './LinkManager';
import { WidgetManager } from './WidgetManager';

export interface MyLinksLookup {
  readonly linkManager: LinkManager;
  readonly widgetManager: WidgetManager;
}
