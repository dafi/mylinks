import { LinkManager } from '../model/LinkManager';
import { MyLinks } from '../model/MyLinks-interface';
import { MyLinksLookup } from '../model/MyLinksLookup';
import { WidgetManager } from '../model/WidgetManager';

export class MyLinksHolder implements MyLinksLookup {
  constructor(
    public readonly myLinks: MyLinks,
    public readonly linkManager: LinkManager,
    public readonly widgetManager: WidgetManager,
  ) {}
}
