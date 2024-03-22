import { LinkManager } from '../model/LinkManager';
import { someMyLinks } from '../model/MyLinks';
import { ItemLocation, Link, MyLinks, Widget } from '../model/MyLinks-interface';
import { WidgetManager } from '../model/WidgetManager';
import { move } from './ArrayUtil';
import { LinkCache } from './LinkCache';

export class LinkManagerImpl implements LinkManager {
  constructor(
    private myLinks: MyLinks,
    private linkCache: LinkCache,
    private widgetManager: WidgetManager,
  ) {}

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

  hasLinks(): boolean {
    return someMyLinks(this.myLinks, (w, _l) => w.list.length > 0);
  }

  hasShortcuts(): boolean {
    return someMyLinks(this.myLinks, (_w, l) => l.hotKey !== undefined && l.hotKey.length > 0);
  }

  moveLink(source: ItemLocation, destination: ItemLocation): boolean {
    if (source.id === destination.id && source.index === destination.index) {
      return false;
    }

    if (source.id === destination.id) {
      const widget = this.widgetManager.findWidgetById(source.id);

      if (widget) {
        const links = widget.list;
        const fromIndex = source.index;
        const toIndex = destination.index;
        widget.list = move(links, fromIndex, toIndex);
        return true;
      }
    } else {
      const sourceWidget = this.widgetManager.findWidgetById(source.id);
      const destinationWidget = this.widgetManager.findWidgetById(destination.id);

      if (sourceWidget && destinationWidget) {
        const [link] = sourceWidget.list.splice(source.index, 1);
        destinationWidget.list.splice(destination.index, 0, link);
        return true;
      }
    }
    return false;
  }
}
