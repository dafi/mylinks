import { KeyCombination } from '../../model/KeyCombination';
import { isKeyboardEventConsumer } from '../HtmlUtil';
import { Shortcut } from './Shortcut';
import { compareCombinationsArray, findShortcuts } from './ShortcutManager';

const buffer: KeyCombination[] = [];

export function shortcutListener(e: KeyboardEvent): boolean {
  const isThisTarget = e.currentTarget === e.target || !isKeyboardEventConsumer(e.target as HTMLElement);

  // ignore events bubbling from other listeners
  if (!isThisTarget) {
    return true;
  }
  if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
    return false;
  }
  buffer.push({
    ctrlKey: e.ctrlKey,
    shiftKey: e.shiftKey,
    altKey: e.altKey,
    metaKey: e.metaKey,
    key: e.key,
  });

  if (execShortcut(findShortcuts(buffer, { exactMatch: false, compareModifiers: false }))) {
    e.stopPropagation();
    e.preventDefault();
    return true;
  }

  return true;
}

function execShortcut(shortcuts: Shortcut[]): boolean {
  if (shortcuts.length === 0) {
    // not found
    buffer.splice(0, buffer.length);
  } else if (shortcuts.length === 1 && compareCombinationsArray(buffer, shortcuts[0].shortcut)) {
    buffer.splice(0, buffer.length);
    shortcuts[0].callback();
    return true;
  }
  return false;
}
