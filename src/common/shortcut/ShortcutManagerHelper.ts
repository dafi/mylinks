import { linkFinderDialogId } from '../../components/linkFinderDialog/LinkFinderDialogTypes';
import { getModal } from '../../components/modal/ModalHandler';
import { filterMyLinks, openLink, openLinks } from '../../model/MyLinks';
import { Link, LinkId, MyLinks } from '../../model/MyLinks-interface';
import { MyLinksLookup } from '../../model/MyLinksLookup';
import { UIInput } from '../UIInput';
import { Shortcut } from './Shortcut';
import { ShortcutManager } from './ShortcutManager';

export function reloadShortcuts(myLinks: MyLinks, myLinksLookup: MyLinksLookup): void {
  const shortcutManager = ShortcutManager.instance();
  shortcutManager.clear();
  shortcutManager.add({ shortcut: ' ', callback: () => getModal(linkFinderDialogId)?.open() });
  shortcutManager.add({ shortcut: 'a', callback: () => UIInput.instance().openFromMousePosition() });

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
  const multiOpen = myLinks.multiOpen;
  if (!multiOpen) {
    return;
  }

  Object
    .entries(multiOpen.shortcuts)
    .forEach(([key, idLinks]) => {
      const links = findLinks(idLinks, myLinksLookup);
      const shortcut: Shortcut = {
        shortcut: key,
        callback: () => openLinks(links),
      };
      ShortcutManager.instance().add(shortcut);
    });
}

function findLinks(idLinks: LinkId[], myLinksLookup: MyLinksLookup): Link[] {
  return idLinks.map(id => {
    const link = myLinksLookup.findLinkById(id);
    if (link) {
      return link;
    }
    throw new Error(`Unable to find link by id ${id}`);
  });
}
