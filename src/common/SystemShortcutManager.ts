import { SystemShortcut } from './Shortcut.ts';

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

  find(shortcut: string): SystemShortcut[] {
    return this.shortcuts.filter(s => s.shortcut.startsWith(shortcut));
  }

  add(shortcut: Omit<SystemShortcut, 'type'>): void {
    this.shortcuts.push({ ...shortcut, type: 'system' });
  }
}
