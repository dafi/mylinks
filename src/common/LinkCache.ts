import { Link, Widget } from '../model/MyLinks-interface';

export interface LinkCacheItem {
  readonly link: Link;
  readonly widget: Widget;
}

export class LinkCache {
  private itemByLinkId = new Map<string, LinkCacheItem>();

  constructor(widgets: Widget[][]) {
    this.fillMap(widgets);
  }

  find(linkId: string): LinkCacheItem | undefined {
    return this.itemByLinkId.get(linkId);
  }

  private fillMap(widgets: Widget[][]): void {
    this.itemByLinkId.clear();
    widgets.flat().forEach(widget => {
      widget.list.forEach(link => {
        this.itemByLinkId.set(link.id, { link, widget });
      });
    });
  }
}
