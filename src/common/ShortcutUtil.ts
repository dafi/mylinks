export function splitShortcut(
  shortcut: string | undefined,
): string[] {
  if (!shortcut) {
    return [];
  }

  return shortcut.split('');
}
