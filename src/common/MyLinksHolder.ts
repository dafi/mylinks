import { someMyLinks } from '../model/MyLinks';
import { Link, LinkId, MyLinks, Widget, WidgetId } from '../model/MyLinks-interface';
import { MyLinksLookup } from '../model/MyLinksLookup';
import { LinkCache } from './LinkCache';

export class MyLinksHolder implements MyLinksLookup {
  private mLinkCache?: LinkCache;

  constructor(public readonly myLinks: MyLinks) {
  }

  get linkCache(): LinkCache {
    if (!this.mLinkCache) {
      this.mLinkCache = new LinkCache(this.myLinks.columns);
    }
    return this.mLinkCache;
  }

  findLinkById(linkId: LinkId): Link | undefined {
    return this.linkCache.find(linkId)?.link;
  }
  findWidgetByLinkId(linkId: LinkId): Widget | undefined {
    return this.linkCache.find(linkId)?.widget;
  }

  findWidgetById(id: WidgetId): Widget | undefined {
    return this.myLinks.columns.flat().find(w => w.id === id);
  }

  hasShortcuts(): boolean {
    return someMyLinks(this.myLinks, (_w, l) => !!l.shortcut);
  }

}
