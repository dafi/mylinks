import { KeyCombination, Shortcut } from './Shortcut';

export class ShortcutManager {
  private static mInstance?: ShortcutManager;
  private shortcuts: Shortcut[] = [];

  static instance(): ShortcutManager {
    if (!this.mInstance) {
      this.mInstance = new this();
    }
    return this.mInstance;
  }

  private constructor() {
  }

  find(shortcut: KeyCombination): Shortcut[] {
    return this.shortcuts.filter(s => s.shortcut.startsWith(shortcut));
  }

  add(shortcut: Shortcut): boolean {
    if (this.shortcuts.find(s => s.shortcut === shortcut.shortcut)) {
      console.error(`Shortcut '${shortcut.shortcut}' already present`);
      return false;
    }
    this.shortcuts.push(shortcut);
    return true;
  }

  clear(): void {
    this.shortcuts = [];
  }
}
