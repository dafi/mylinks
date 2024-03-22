import { Link, Widget } from '../model/MyLinks-interface';

export interface LinkCacheItem {
  readonly link: Link;
  readonly widget: Widget;
}

export class LinkCache {
  private itemByLinkId: Map<string, LinkCacheItem> | undefined;

  constructor(
    private widgets: Widget[][],
  ) {}

  find(linkId: string): LinkCacheItem | undefined {
    if (this.itemByLinkId === undefined) {
      this.itemByLinkId = this.fillMap(this.widgets);
    }
    return this.itemByLinkId.get(linkId);
  }

  private fillMap(widgets: Widget[][]): Map<string, LinkCacheItem> {
    const map = new Map<string, LinkCacheItem>();
    widgets.flat().forEach(widget => {
      widget.list.forEach(link => {
        map.set(link.id, { link, widget });
      });
    });
    return map;
  }
}
