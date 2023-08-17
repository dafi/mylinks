import { Link } from './MyLinks-interface';
import { Shortcut } from './Shortcut';

export interface SystemShortcut extends Shortcut {
  readonly callback: () => void;
}

export interface LinkShortcut extends Shortcut {
  readonly link: Link;
}

export interface LinkArrayShortcut extends Shortcut {
  readonly links: Link[];
}

export function isSystemShortcut(shortcut: Shortcut): shortcut is SystemShortcut {
  return shortcut.type === 'system';
}

export function isLinkShortcut(shortcut: Shortcut): shortcut is LinkShortcut {
  return shortcut.type === 'link';
}

export function isLinkArrayShortcut(shortcut: Shortcut): shortcut is LinkArrayShortcut {
  return shortcut.type === 'linkArray';
}
