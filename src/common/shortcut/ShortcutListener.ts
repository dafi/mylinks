import { isKeyboardEventConsumer } from '../HtmlUtil';
import { Shortcut } from './Shortcut';
import { ShortcutManager } from './ShortcutManager';

let buffer = '';

export function shortcutListener(e: KeyboardEvent): boolean {
  const isThisTarget = e.currentTarget === e.target || !isKeyboardEventConsumer(e.target as HTMLElement);

  // ignore events bubbling from other listeners
  if (!isThisTarget) {
    return true;
  }
  if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
    return false;
  }
  buffer += e.key;

  if (execShortcut(ShortcutManager.instance().find(buffer))) {
    e.stopPropagation();
    e.preventDefault();
    return true;
  }

  return true;
}

function execShortcut(shortcuts: Shortcut[]): boolean {
  if (shortcuts.length === 0) {
    // not found
    buffer = '';
  } else if (shortcuts.length === 1 && shortcuts[0].shortcut === buffer) {
    buffer = '';
    shortcuts[0].callback();
    return true;
  }
  return false;
}
