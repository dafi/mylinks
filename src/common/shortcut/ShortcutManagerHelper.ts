import { linkFinderDialogId } from '../../components/linkFinderDialog/LinkFinderDialogTypes';
import { getModal } from '../../components/modal/ModalHandler';
import { filterMyLinks, openLink, openLinks } from '../../model/MyLinks';
import { Link, MyLinks } from '../../model/MyLinks-interface';
import { openWidgetLinksFromPoint } from '../../model/MyLinksDOM';
import { MyLinksLookup } from '../../model/MyLinksLookup';
import { cursorPosition } from '../CursorPositionTracker';
import { isNotEmptyString } from '../StringUtil';
import { Shortcut } from './Shortcut';
import { addShortcut, clearShortcuts } from './ShortcutManager';

export function reloadShortcuts(myLinks: MyLinks, myLinksLookup: MyLinksLookup): void {
  clearShortcuts();
  addShortcut({ shortcut: ' ', callback: () => getModal(linkFinderDialogId)?.open() });
  addShortcut({ shortcut: 'a', callback: () => openWidgetLinksFromPoint(cursorPosition(), myLinksLookup) });

  addLinkShortcuts(myLinks);
  addMultiOpenShortcuts(myLinks, myLinksLookup);
}

function addLinkShortcuts(myLinks: MyLinks): void {
  filterMyLinks(myLinks, (_w, l) => isNotEmptyString(l.shortcut))
    .forEach(link => {
      if (isNotEmptyString(link.shortcut)) {
        const shortcut: Shortcut = {
          shortcut: link.shortcut,
          callback: () => openLink(link),
        };
        addShortcut(shortcut);
      }
    });
}

function addMultiOpenShortcuts(myLinks: MyLinks, myLinksLookup: MyLinksLookup): void {
  myLinks.multiOpen?.combinations.forEach(({ shortcut, linkIds }) => {
    const links = findLinks(linkIds, myLinksLookup);
    const newShortcut: Shortcut = {
      shortcut,
      callback: () => openLinks(links),
    };
    addShortcut(newShortcut);
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
