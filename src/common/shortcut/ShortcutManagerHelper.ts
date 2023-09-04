import { linkFinderDialogId } from '../../components/linkFinderDialog/LinkFinderDialogTypes';
import { getModal } from '../../components/modal/ModalHandler';
import { filterMyLinks, openLink, openLinks } from '../../model/MyLinks';
import { Link, MyLinks } from '../../model/MyLinks-interface';
import { openWidgetLinksFromPoint } from '../../model/MyLinksDOM';
import { MyLinksLookup } from '../../model/MyLinksLookup';
import { CursorPosition } from '../CursorPosition';
import { Shortcut } from './Shortcut';
import { ShortcutManager } from './ShortcutManager';

export function reloadShortcuts(myLinks: MyLinks, myLinksLookup: MyLinksLookup): void {
  const shortcutManager = ShortcutManager.instance();
  shortcutManager.clear();
  shortcutManager.add({ shortcut: ' ', callback: () => getModal(linkFinderDialogId)?.open() });
  shortcutManager.add({ shortcut: 'a', callback: () => openWidgetLinksFromPoint(CursorPosition.instance().position(), myLinksLookup) });

  addLinkShortcuts(myLinks);
  addMultiOpenShortcuts(myLinks, myLinksLookup);
}

function addLinkShortcuts(myLinks: MyLinks): void {
  filterMyLinks(myLinks, (_w, l) => !!l.shortcut)
    .forEach(link => {
      if (!link.shortcut) {
        return;
      }
      const shortcut: Shortcut = {
        shortcut: link.shortcut,
        callback: () => openLink(link),
      };
      ShortcutManager.instance().add(shortcut);
    });
}

function addMultiOpenShortcuts(myLinks: MyLinks, myLinksLookup: MyLinksLookup): void {
  myLinks.multiOpen?.combinations.forEach(({ shortcut, linkIds }) => {
    const links = findLinks(linkIds, myLinksLookup);
    const newShortcut: Shortcut = {
      shortcut,
      callback: () => openLinks(links),
    };
    ShortcutManager.instance().add(newShortcut);
  });
}

function findLinks(linksId: string[], myLinksLookup: MyLinksLookup): Link[] {
  return linksId.map(id => {
    const link = myLinksLookup.findLinkById(id);
    if (link) {
      return link;
    }
    throw new Error(`Unable to find link by id ${id}`);
  });
}
