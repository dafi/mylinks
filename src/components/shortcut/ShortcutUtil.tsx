import { ReactElement } from 'react';
import { KeyCombination } from '../../model/KeyCombination';

const symbols: Record<string, string | undefined> = {
  Backspace: '\u232B',
  Shift: '\u21EA',
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

export function combinationToHtml(keyCombination: KeyCombination, keyIndex: number): ReactElement {
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

  str += symbols[key] ?? key;

  return (
    <kbd className="shortcut" key={keyIndex}>{ str }</kbd>
  );
}

export function combinationToString(keyCombination: KeyCombination): string {
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
