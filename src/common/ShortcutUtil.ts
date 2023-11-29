import { isNotEmptyString } from './StringUtil';

export function splitShortcut(
  shortcut: string | undefined,
): string[] {
  return isNotEmptyString(shortcut) ? shortcut.split('') : [];
}
