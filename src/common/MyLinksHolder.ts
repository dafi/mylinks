import { filterMyLinks, someMyLinks } from '../model/MyLinks';
import { Link, MyLinks, MyLinksLookup, Widget } from '../model/MyLinks-interface';

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
}
