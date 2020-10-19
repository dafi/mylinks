export interface Theme {
  backgroundImage?: string;
  missingFavIconColor: string;
  linkKeyBackground?: string;
  linkKeyColor?: string;
}

export interface Link {
  id: string;
  label: string;
  url: string;
  favicon?: string;
  shortcut?: string;
  widget?: Widget;
}

export interface Widget {
  id: string;
  title: string;
  list: [Link];
}

export interface Config {
  faviconService?: string;
}

export interface MyLinks {
  theme: Theme;
  columns: [Widget[]];
  config?: Config;
}

export function openAllLinks(wd: Widget) {
  wd.list.reverse().forEach(openLink);
}

export function openLink(link: Link) {
  window.open(link.url);
}

export function faviconUrlByLink(link: Link, faviconUrlBuilder: string | null | undefined): string | null {
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

export function buildFaviconUrl(url: string, faviconUrlBuilder: string | null | undefined): string | null {
  if (faviconUrlBuilder) {
    try {
      const host = new URL(url).host;
      if (host) {
        return faviconUrlBuilder.replace('$1', host);
      }
    } catch {
    }
  }
  return null;
}

export function filterMyLinks(myLinks: MyLinks, callback: (widget: Widget, link: Link) => boolean): Link[] {
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

export function someMyLinks(myLinks: MyLinks, callback: (widget: Widget, link: Link) => boolean) {
  return myLinks.columns.some(row => {
    return row.some(widget => {
      return widget.list.some(link => {
        return callback(widget, link);
      });
    });
  });
}


export class MyLinksHolder {

  private static setColor(property: string, color?: string) {
    if (color) {
      document.documentElement.style.setProperty(property, color);
    } else {
      document.documentElement.style.removeProperty(property);
    }
  }

  constructor(public readonly myLinks: MyLinks) {
    this.attachWidgetTolinks();
  }

  private attachWidgetTolinks() {
    this.myLinks.columns.flat().forEach(w => {
      w.list.forEach(l => {
        l.widget = w;
      });
    });
  }

  findWidgetById(id: string) {
    return this.myLinks.columns.flat().find(w => w.id === id);
  }

  hasShortcuts(): boolean {
    return someMyLinks(this.myLinks, (w, l) => !!l.shortcut);
  }

  applyBackground() {
    const bkg = this.myLinks.theme?.backgroundImage;
    const body = document.body;
    if (bkg) {
      body.style.backgroundImage = `url(${bkg})`;
    } else {
      body.style.backgroundImage = '';
    }
  }

  applyTheme() {
    const theme = this.myLinks.theme;

    if (!theme) {
      return;
    }

    MyLinksHolder.setColor('--missing-favicon-color', theme.missingFavIconColor);
    MyLinksHolder.setColor('--link-key-background', theme.linkKeyBackground);
    MyLinksHolder.setColor('--link-key-color', theme.linkKeyColor);
  }

  createImage(image: any, width: number, height: number, color: string) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      canvas.width = width;
      canvas.height = height;
      context.fillStyle = color;
      context.fillRect(0, 0, width, height);
      context.fill();
      context.globalCompositeOperation = 'destination-atop';
      context.drawImage(image, 0, 0);
      return canvas.toDataURL();
    }
    return null;
  }

  applyColorToFavIcon(color?: string) {
    if (!color) {
      return;
    }
    // tslint:disable-next-line:quotemark
    const favicon: any = document.querySelector("link[rel~='icon']");
    if (!favicon) {
      return;
    }
    const image = new Image();
    image.src = favicon.href;
    image.onload = (): void => {
      const favImage = this.createImage(image, 16, 16, color);
      if (favImage) {
        favicon.type = 'image/x-icon';
        favicon.href = favImage;
      }
    };
  }
}
