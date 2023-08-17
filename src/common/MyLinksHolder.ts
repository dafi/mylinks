import { filterMyLinks, someMyLinks } from '../model/MyLinks';
import { LinkId, MyLinks, Widget, WidgetId } from '../model/MyLinks-interface';
import { MyLinksLookup } from '../model/MyLinksLookup';
import { KeyCombination, Shortcut } from '../model/Shortcut';
import { LinkArrayShortcut, LinkShortcut } from '../model/ShortcutTypes';
import { LinkCache } from './LinkCache';
import { SystemShortcutManager } from './SystemShortcutManager';

export class MyLinksHolder implements MyLinksLookup {
  private mLinkCache?: LinkCache;

  constructor(public readonly myLinks: MyLinks) {
  }

  get linkCache(): LinkCache {
    if (!this.mLinkCache) {
      this.mLinkCache = new LinkCache(this.myLinks.columns);
    }
    return this.mLinkCache;
  }

  findWidgetByLinkId(linkId: LinkId): Widget | undefined {
    return this.linkCache.find(linkId)?.widget;
  }

  findWidgetById(id: WidgetId): Widget | undefined {
    return this.myLinks.columns.flat().find(w => w.id === id);
  }

  findShortcuts(shortcut: KeyCombination): Shortcut[] {
    const systemShortcut = SystemShortcutManager.instance().find(shortcut);
    if (systemShortcut.length) {
      return systemShortcut;
    }

    const multiLinks = this.findLinkArray(shortcut);
    if (multiLinks.length) {
      return multiLinks;
    }

    return filterMyLinks(this.myLinks, (_w, l) =>
      l.shortcut?.startsWith(shortcut) === true
    ).map(link => ({
      shortcut: link.shortcut ?? shortcut,
      type: 'link',
      link
    } as LinkShortcut));
  }

  hasShortcuts(): boolean {
    return someMyLinks(this.myLinks, (_w, l) => !!l.shortcut);
  }

  findLinkArray(shortcutPattern: KeyCombination): LinkArrayShortcut[] {
    if (!this.myLinks.multiOpen) {
      return [];
    }
    return Object
      .entries(this.myLinks.multiOpen.shortcuts)
      .filter(([shortcut, _]) => shortcut.startsWith(shortcutPattern))
      .map(([shortcut, idLinks]) => (
        {
          shortcut,
          type: 'linkArray',
          links: idLinks.map(id => this.linkCache.find(id)?.link)
        } as LinkArrayShortcut)
      );
  }
}
