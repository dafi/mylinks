import { someMyLinks } from '../model/MyLinks';
import { Link, MyLinks, Widget } from '../model/MyLinks-interface';
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

  moveLink(fromId: string, toId: string): boolean {
    const fromWidget = this.findWidgetByLinkId(fromId);
    const toWidget = this.findWidgetByLinkId(toId);

    if (fromWidget && fromWidget === toWidget) {
      const links = fromWidget.list;
      const fromIndex = links.findIndex(l => l.id === fromId);
      const toIndex = links.findIndex(l => l.id === toId);

      if (fromIndex >= 0 && toIndex >= 0) {
        fromWidget.list = move(links, fromIndex, toIndex);
        return true;
      }
    }
    return false;
  }

  getWidgetGrid(): WidgetGrid {
    return this.widgetGrid;
  }
}
