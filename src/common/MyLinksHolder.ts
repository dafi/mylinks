import { filterMyLinks, someMyLinks } from '../model/MyLinks';
import { Link, MyLinks, MyLinksLookup, Widget } from '../model/MyLinks-interface';

const FaviconWidth = 16;
const FaviconHeight = 16;

export class MyLinksHolder implements MyLinksLookup {
  private linkWidgetMap!: Record<string, Widget>;

  private static setColor(property: string, color?: string): void {
    if (color) {
      document.documentElement.style.setProperty(property, color);
    } else {
      document.documentElement.style.removeProperty(property);
    }
  }

  constructor(public readonly myLinks: MyLinks) {
  }

  findWidgetByLinkId(linkId: string): Widget | undefined {
    if (!this.linkWidgetMap) {
      this.linkWidgetMap = {};
      this.myLinks.columns.flat().forEach(w => {
        w.list.forEach(l => {
          this.linkWidgetMap[l.id] = w;
        });
      });
    }
    return this.linkWidgetMap[linkId];
  }

  findWidgetById(id: string): Widget | undefined {
    return this.myLinks.columns.flat().find(w => w.id === id);
  }

  findLinksByShortcut(shortcut: string): Link[] {
    return filterMyLinks(this.myLinks, (w, l) =>
      l.shortcut?.startsWith(shortcut) === true
    );
  }

  hasShortcuts(): boolean {
    return someMyLinks(this.myLinks, (w, l) => !!l.shortcut);
  }

  applyBackground(): void {
    const bkg = this.myLinks.theme?.backgroundImage;
    const body = document.body;
    if (bkg) {
      body.style.backgroundImage = `url(${bkg})`;
    } else {
      body.style.backgroundImage = '';
    }
  }

  applyTheme(): void {
    const theme = this.myLinks.theme;

    if (!theme) {
      return;
    }

    MyLinksHolder.setColor('--link-key-background', theme.linkKeyBackground);
    MyLinksHolder.setColor('--link-key-color', theme.linkKeyColor);
  }

  createImage(
    image: HTMLOrSVGImageElement,
    width: number,
    height: number,
    color: string
  ): string | null {
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

  applyColorToFavicon(color?: string): void {
    if (!color) {
      return;
    }
    const favicon: HTMLLinkElement | null = document.querySelector('link[rel~="icon"]');
    if (!favicon) {
      return;
    }
    const image = new Image();
    image.src = favicon.href;
    image.onload = (): void => {
      const favImage = this.createImage(image, FaviconWidth, FaviconHeight, color);
      if (favImage) {
        favicon.type = 'image/x-icon';
        favicon.href = favImage;
      }
    };
  }
}
