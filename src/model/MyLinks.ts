import { Link, MyLinks, Widget } from './MyLinks-interface';

export function openWidgetLinks(wd: Widget): void {
  openLinks(wd.list.reverse());
}

export function openLinks(links: Link[]): void {
  links.forEach(l => openLink(l));
}

export function openLink(link: Link): void {
  window.open(link.url);
}

export function filterMyLinks(
  myLinks: MyLinks,
  callback: (widget: Widget, link: Link) => boolean
): Link[] {
  const result: Link[] = [];
  myLinks.columns.forEach(row => {
    row.forEach(widgets => {
      widgets.list
        .forEach(item => {
          if (callback(widgets, item)) {
            result.push(item);
          }
        });
    });
  });
  return result;
}

export function someMyLinks(
  myLinks: MyLinks,
  callback: (widget: Widget, link: Link) => boolean
): boolean {
  return myLinks.columns.some(row =>
    row.some(widget => widget.list.some(link => callback(widget, link)))
  );
}
