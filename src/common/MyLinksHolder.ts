import { someMyLinks } from '../model/MyLinks';
import { ItemLocation, Link, MyLinks, Widget } from '../model/MyLinks-interface';
import { MyLinksLookup } from '../model/MyLinksLookup';
import { WidgetGrid } from '../model/WidgetGrid';
import { move } from './ArrayUtil';
import { LinkCache } from './LinkCache';

export class MyLinksHolder implements MyLinksLookup {
  private mLinkCache?: LinkCache;

  constructor(
    public readonly myLinks: MyLinks,
    private widgetGrid: WidgetGrid,
  ) {}

  get linkCache(): LinkCache {
    if (!this.mLinkCache) {
      this.mLinkCache = new LinkCache(this.myLinks.columns);
    }
    return this.mLinkCache;
  }

  findLinkById(linkId: string): Link | undefined {
    // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1193
    // eslint-disable-next-line unicorn/no-array-callback-reference
    return this.linkCache.find(linkId)?.link;
  }

  findWidgetByLinkId(linkId: string): Widget | undefined {
    // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1193
    // eslint-disable-next-line unicorn/no-array-callback-reference
    return this.linkCache.find(linkId)?.widget;
  }

  findWidgetById(id: string): Widget | undefined {
    return this.widgetGrid.findWidgetById(id);
  }

  hasShortcuts(): boolean {
    return someMyLinks(this.myLinks, (_w, l) => l.hotKey !== undefined && l.hotKey.length > 0);
  }

  moveLink(source: ItemLocation, destination: ItemLocation): boolean {
    if (source.id === destination.id) {
      const widget = this.findWidgetById(source.id);

      if (widget) {
        const links = widget.list;
        const fromIndex = source.index;
        const toIndex = destination.index;
        widget.list = move(links, fromIndex, toIndex);
        return true;
      }
    } else {
      const sourceWidget = this.findWidgetById(source.id);
      const destinationWidget = this.findWidgetById(destination.id);

      if (sourceWidget && destinationWidget) {
        const link = sourceWidget.list.splice(source.index, 1)[0];
        destinationWidget.list.splice(destination.index, 0, link);
        return true;
      }
    }
    return false;
  }

  getWidgetGrid(): WidgetGrid {
    return this.widgetGrid;
  }
}
