import { filterMyLinks, someMyLinks } from '../model/MyLinks';
import { MyLinks, MyLinksLookup, Widget } from '../model/MyLinks-interface';
import { Shortcut } from './Shortcut.ts';
import { SystemShortcutManager } from './SystemShortcutManager.ts';

export class MyLinksHolder implements MyLinksLookup {
  private linkWidgetMap?: Record<string, Widget>;

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
      const map: Record<string, Widget> = {};
      this.myLinks.columns.flat().forEach(w => {
        w.list.forEach(l => {
          map[l.id] = w;
        });
      });
      this.linkWidgetMap = map;
    }
    return this.linkWidgetMap[linkId];
  }

  findWidgetById(id: string): Widget | undefined {
    return this.myLinks.columns.flat().find(w => w.id === id);
  }

  findShortcuts(shortcut: string): Shortcut[] {
    const systemShortcut = SystemShortcutManager.instance().find(shortcut);
    if (systemShortcut.length) {
      return systemShortcut;
    }
    return filterMyLinks(this.myLinks, (_w, l) =>
      l.shortcut?.startsWith(shortcut) === true
    ).map(link => ({
      shortcut: link.shortcut ?? shortcut,
      type: 'link',
      link
    }));
  }

  hasShortcuts(): boolean {
    return someMyLinks(this.myLinks, (_w, l) => !!l.shortcut);
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
