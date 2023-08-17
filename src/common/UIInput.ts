import { openLink, openLinks, openWidgetLinks } from '../model/MyLinks';
import { MyLinksLookup } from '../model/MyLinksLookup.ts';
import { Shortcut } from '../model/Shortcut.ts';
import { isLinkArrayShortcut, isLinkShortcut, isSystemShortcut } from '../model/ShortcutTypes.ts';
import { isKeyboardEventConsumer } from './HtmlUtil.ts';

export class UIInput {
  private static mInstance?: UIInput;
  private mouseX = 0;
  private mouseY = 0;
  private myLinksLookup?: MyLinksLookup;
  private buffer = '';

  static instance(): UIInput {
    if (!this.mInstance) {
      this.mInstance = new this();
    }
    return this.mInstance;
  }

  private constructor() {
    document.addEventListener('mousemove', (e) => this.storeMousePosition(e), false);
    document.addEventListener('mouseenter', (e) => this.storeMousePosition(e), false);
  }

  setup(myLinksLookup: MyLinksLookup): void {
    this.myLinksLookup = myLinksLookup;

    this.mouseX = 0;
    this.mouseY = 0;
  }

  findWidgetId(el: Element | null, dataAttribute: string): string | null {
    while (el) {
      const widgetId = el.getAttribute(dataAttribute);
      if (widgetId) {
        return widgetId;
      }
      el = el.parentElement;
    }
    return null;
  }

  storeMousePosition(e: MouseEvent): void {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  keyDown(e: KeyboardEvent): boolean {
    const isThisTarget = e.currentTarget === e.target || !isKeyboardEventConsumer(e.target as HTMLElement);

    // ignore events bubbling from other listeners
    if (!isThisTarget) {
      return true;
    }
    if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
      return false;
    }
    if (this.myLinksLookup) {
      this.buffer += e.key;

      if (this.execShortcut(this.myLinksLookup.findShortcuts(this.buffer))) {
        e.stopPropagation();
        e.preventDefault();
        return true;
      }
    }

    return true;
  }

  private execShortcut(shortcuts: Shortcut[]): boolean {
    if (shortcuts.length === 0) {
      // not found
      this.buffer = '';
    } else if (shortcuts.length === 1 && shortcuts[0].shortcut === this.buffer) {
      this.buffer = '';
      const shortcut = shortcuts[0];

      if (isSystemShortcut(shortcut)) {
        shortcut.callback();
      } else if (isLinkShortcut(shortcut)) {
        openLink(shortcut.link);
      } else if (isLinkArrayShortcut(shortcut)) {
        openLinks(shortcut.links);
      } else {
        return false;
      }
      return true;
    }
    return false;
  }

  openFromMousePosition(): void {
    if (!this.myLinksLookup) {
      return;
    }
    const widgetId = this.findWidgetId(
      document.elementFromPoint(this.mouseX, this.mouseY),
      'data-list-id');
    if (widgetId) {
      const widget = this.myLinksLookup.findWidgetById(widgetId);
      if (widget) {
        openWidgetLinks(widget);
      }
    }
  }
}
