import { Dispatch } from 'react';
import { linkFinderDialogId } from '../../components/linkFinderDialog/LinkFinderDialogTypes';
import { getModal } from '../../components/modal/ModalHandler';
import { settingsDialogId } from '../../components/settingsDialog/SettingsDialogTypes';
import { AppUIStateAction } from '../../contexts/useAppUIState';
import { filterMyLinks, openLink, openLinks } from '../../model/MyLinks';
import { Link, MyLinks } from '../../model/MyLinks-interface';
import { openWidgetLinksFromPoint } from '../../model/MyLinksDOM';
import { MyLinksLookup } from '../../model/MyLinksLookup';
import { cursorPosition } from '../CursorPositionTracker';
import { Shortcut } from './Shortcut';
import { addShortcut, clearShortcuts } from './ShortcutManager';

export function reloadShortcuts(myLinks: MyLinks, myLinksLookup: MyLinksLookup, updateUIState: Dispatch<AppUIStateAction>): void {
  clearShortcuts();

  addSystemShortcuts(myLinks, myLinksLookup, updateUIState);
  addLinkShortcuts(myLinks);
  addMultiOpenShortcuts(myLinks, myLinksLookup);
}

function addLinkShortcuts(myLinks: MyLinks): void {
  filterMyLinks(myLinks, (_w, link) => {
    if (link.shortcut) {
      const shortcut: Shortcut = {
        shortcut: link.shortcut,
        callback: () => openLink(link),
      };
      addShortcut(shortcut);
    }
    // we don't care about filtered elements, so ignore all
    return false;
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

function addSystemShortcuts(
  myLinks: MyLinks | undefined,
  myLinksLookup: MyLinksLookup,
  updateUIState: Dispatch<AppUIStateAction>
): void {
  myLinks?.config?.systemShortcuts?.forEach(({ action, shortcut }) => {
    switch (action) {
      case 'openAllLinks':
        addShortcut({ shortcut, callback: () => openWidgetLinksFromPoint(cursorPosition(), myLinksLookup) });
        break;
      case 'findLinks':
        addShortcut({ shortcut, callback: () => getModal(linkFinderDialogId)?.open() });
        break;
      case 'editSettings':
        addShortcut({ shortcut, callback: () => getModal(settingsDialogId)?.open() });
        break;
      case 'toggleShortcuts':
        addShortcut({ shortcut, callback: () => updateUIState({ type: 'hideShortcuts', value: 'toggle' }) });
        break;
    }
  });
}
