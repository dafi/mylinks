import { executeAction } from '../../action/Action';
import { ActionList } from '../../action/ActionType';
import { filterMyLinks, openLink } from '../../model/MyLinks';
import { MyLinks } from '../../model/MyLinks-interface';
import { MyLinksLookup } from '../../model/MyLinksLookup';
import { Shortcut } from './Shortcut';
import { addShortcut, clearShortcuts } from './ShortcutManager';

export function reloadShortcuts(myLinksLookup: MyLinksLookup): void {
  clearShortcuts();

  addSystemShortcuts(myLinksLookup);
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
): void {
  const systemShortcuts = myLinksLookup.myLinks.config?.systemShortcuts;

  if (!systemShortcuts) {
    return;
  }
  for (const { action, label, canAssignShortcut } of ActionList) {
    if (canAssignShortcut) {
      const shortcut = systemShortcuts.find(v => v.action === action);
      if (shortcut) {
        const { hotKey } = shortcut;
        addShortcut({ label, hotKey, callback: () => executeAction(action) });
      }
    }
  }
}
