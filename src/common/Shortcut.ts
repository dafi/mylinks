import { Link } from '../model/MyLinks-interface.ts';

export interface Shortcut {
  readonly shortcut: string;
  readonly type: 'system' | 'link';
}

export interface SystemShortcut extends Shortcut {
  readonly callback: () => void;
}

export interface LinkShortcut extends Shortcut {
  readonly link: Link;
}

export function isSystemShortcut(shortcut: Shortcut): shortcut is SystemShortcut {
  return Object.hasOwn(shortcut, 'callback');
}

export function isLinkShortcut(shortcut: Shortcut): shortcut is LinkShortcut {
  return Object.hasOwn(shortcut, 'link');
}
