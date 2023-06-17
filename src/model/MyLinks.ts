import { Link, MyLinks, Widget } from './MyLinks-interface';

export function openAllLinks(wd: Widget): void {
  wd.list.reverse().forEach(openLink);
}

export function openLink(link: Link): void {
  window.open(link.url);
}

export function faviconUrlByLink(
  link: Link,
  faviconUrlBuilder: string | null | undefined
): string | null {
  const faviconUrl = link.favicon;

  if (faviconUrl) {
    // url contains protocol
    if (/^.*:\/\//.test(faviconUrl)) {
      return faviconUrl;
    }
    return faviconUrlBuilder?.replace('$1', faviconUrl) || null;
  }
  if (faviconUrl?.length === 0) {
    return null;
  }
  return buildFaviconUrl(link.url, faviconUrlBuilder);
}

export function buildFaviconUrl(
  url: string,
  faviconUrlBuilder: string | null | undefined
): string | null {
  if (faviconUrlBuilder) {
    try {
      const host = new URL(url).host;
      if (host) {
        return faviconUrlBuilder.replace('$1', host);
      }
    } catch {
      // eslint-disable-next-line no-empty
    }
  }
  return null;
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
