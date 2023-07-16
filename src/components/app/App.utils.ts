const STORAGE_PREF_HIDE_SHORTCUTS = 'hideShortcuts';

export function getHideShortcuts(): boolean {
  return (localStorage.getItem(STORAGE_PREF_HIDE_SHORTCUTS) === '1') || false;
}

export function setHideShortcuts(v: boolean): void {
  localStorage.setItem(STORAGE_PREF_HIDE_SHORTCUTS, v ? '1' : '0');
}

export function toggleHideShortcuts(): void {
  setHideShortcuts(!getHideShortcuts());
}
