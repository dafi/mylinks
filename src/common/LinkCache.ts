import { Link, LinkId, Widget } from '../model/MyLinks-interface.ts';

export interface LinkCacheItem {
  readonly link: Link;
  readonly widget: Widget;
}

export class LinkCache {
  private map = new Map<LinkId, LinkCacheItem>();

  constructor(widgets: Widget[][]) {
    this.fillMap(widgets);
  }

  find(linkId: LinkId): LinkCacheItem | undefined {
    return this.map.get(linkId);
  }

  private fillMap(widgets: Widget[][]): void {
    this.map.clear();
    widgets.flat().forEach(widget => {
      widget.list.forEach(link => {
        this.map.set(link.id, { link, widget });
      });
    });
  }
}
