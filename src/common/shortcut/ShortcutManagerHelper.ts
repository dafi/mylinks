import { Dispatch } from 'react';
import { linkFinderDialogId } from '../../components/linkFinderDialog/LinkFinderDialogTypes';
import { getModal } from '../../components/modal/ModalHandler';
import { settingsDialogId } from '../../components/settingsDialog/SettingsDialogTypes';
import { AppUIStateAction } from '../../contexts/useAppUIState';
import { AppActionDescription } from '../../model/AppActionDescription';
import { filterMyLinks, openLink } from '../../model/MyLinks';
import { MyLinks } from '../../model/MyLinks-interface';
import { openWidgetLinksFromPoint } from '../../model/MyLinksDOM';
import { MyLinksLookup } from '../../model/MyLinksLookup';
import { cursorPosition } from '../CursorPositionTracker';
import { Shortcut } from './Shortcut';
import { addShortcut, clearShortcuts } from './ShortcutManager';

export function reloadShortcuts(myLinksLookup: MyLinksLookup, updateUIState: Dispatch<AppUIStateAction>): void {
  clearShortcuts();

  addSystemShortcuts(myLinksLookup, updateUIState);
  addLinkShortcuts(myLinksLookup.myLinks);
}

function addLinkShortcuts(myLinks: MyLinks): void {
  filterMyLinks(myLinks, (_w, link) => {
    const { label, hotKey } = link;
    if (hotKey) {
      const shortcut: Shortcut = {
        label,
        hotKey,
        callback: () => openLink(link),
      };
      addShortcut(shortcut);
    }
    // we don't care about filtered elements, so ignore all
    return false;
  });
}

function addSystemShortcuts(
  myLinksLookup: MyLinksLookup,
  updateUIState: Dispatch<AppUIStateAction>
): void {
  myLinksLookup.myLinks.config?.systemShortcuts?.forEach(({ action, hotKey }) => {
    const label = AppActionDescription[action];
    switch (action) {
      case 'openAllLinks':
        addShortcut({ label, hotKey, callback: () => openWidgetLinksFromPoint(cursorPosition(), myLinksLookup) });
        break;
      case 'findLinks':
        addShortcut({ label, hotKey, callback: () => getModal(linkFinderDialogId)?.open() });
        break;
      case 'editSettings':
        addShortcut({ label, hotKey, callback: () => getModal(settingsDialogId)?.open() });
        break;
      case 'toggleShortcuts':
        addShortcut({ label, hotKey, callback: () => updateUIState({ type: 'hideShortcuts', value: 'toggle' }) });
        break;
    }
  });
}
