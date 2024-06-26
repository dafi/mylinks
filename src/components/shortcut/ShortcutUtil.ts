import { Shortcut } from '../../common/shortcut/Shortcut';
import { KeyCombination } from '../../model/KeyCombination';

type SymbolType =
  'Escape' | 'Clear' | 'Backspace' |
  'Shift' | 'CapsLock' | 'Control' | 'Alt' | 'Meta' |
  'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' |
  'Delete' | 'Home' | 'End' | 'PageUp' | 'PageDown' |
  ' ';

const symbols: Record<SymbolType, string> = {
  Escape: '\u238B',
  Clear: '\u2327',
  Backspace: '\u232B',
  Shift: '\u21E7',
  CapsLock: '\u21EA',
  Control: '\u2303',
  Alt: '\u2325',
  Meta: '\u2318',
  ArrowLeft: '\u2190',
  ArrowRight: '\u2192',
  ArrowUp: '\u2191',
  ArrowDown: '\u2193',
  Delete: '\u2326',
  Home: '\u2196',
  End: '\u2198',
  PageUp: '\u21DE',
  PageDown: '\u21DF',
  ' ': 'Space',
} as const;

const modifiers = new Set(['Control', 'Alt', 'Shift', 'Meta', ]);

export function combinationToSymbols(keyCombination: KeyCombination): string {
  if (modifiers.has(keyCombination.key)) {
    return '';
  }

  let str = '';

  const { altKey, ctrlKey, metaKey, shiftKey, key } = keyCombination;

  if (ctrlKey === true) {
    str += symbols['Control'];
  }

  if (altKey === true) {
    str += symbols['Alt'];
  }

  if (shiftKey === true) {
    str += symbols['Shift'];
  }

  if (metaKey === true) {
    str += symbols['Meta'];
  }

  return str + (key in symbols ? symbols[key as SymbolType] : key);
}

export function formatCombination(keyCombination: KeyCombination): string {
  const arr = [];

  const { altKey, ctrlKey, metaKey, shiftKey, key } = keyCombination;

  if (ctrlKey === true) {
    arr.push('Control');
  }

  if (altKey === true) {
    arr.push('Alt');
  }

  if (shiftKey === true) {
    arr.push('Shift');
  }

  if (metaKey === true) {
    arr.push('Meta');
  }

  arr.push(key);

  return arr.join('-');
}

function formatShortcut(shortcut: Shortcut, appendHotKey: boolean): string {
  const { label, hotKey } = shortcut;
  return appendHotKey ? `${label} [${hotKey.map(k => formatCombination(k)).join(' ')}]` : label;
}

export function formatShortcuts(shortcuts: Shortcut[] | Shortcut): string {
  const isArray = Array.isArray(shortcuts);
  const hasMultipleKeys = (isArray ? shortcuts[0] : shortcuts).hotKey.length > 1;

  if (isArray) {
    return shortcuts
      .map(v => formatShortcut(v, hasMultipleKeys))
      .join(', ');
  }
  return formatShortcut(shortcuts, hasMultipleKeys);
}
