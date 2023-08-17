import { KeyCombination } from '../model/Shortcut.ts';
import { SystemShortcut } from '../model/ShortcutTypes.ts';

export class SystemShortcutManager {
  private static mInstance?: SystemShortcutManager;
  private shortcuts: SystemShortcut[] = [];

  static instance(): SystemShortcutManager {
    if (!this.mInstance) {
      this.mInstance = new this();
    }
    return this.mInstance;
  }

  private constructor() {
  }

  find(shortcut: KeyCombination): SystemShortcut[] {
    return this.shortcuts.filter(s => s.shortcut.startsWith(shortcut));
  }

  add(shortcut: Omit<SystemShortcut, 'type'>): boolean {
    if (this.shortcuts.find(s => s.shortcut === shortcut.shortcut)) {
      return false;
    }
    this.shortcuts.push({ ...shortcut, type: 'system' });
    return true;
  }
}
