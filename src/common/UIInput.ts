import { openAllLinks, openLink } from '../model/MyLinks';
import { Link, MyLinksLookup } from '../model/MyLinks-interface';

export class UIInput {
  private static mInstance: UIInput;
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
    if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
      return false;
    }
    if (this.isBufferEmpty()) {
      if (e.key === 'a') {
        this.buffer = '';
        this.openFromMousePosition();
        return true;
      }
    }
    if (this.myLinksLookup) {
      this.buffer += e.key;
      const link = this.findLinkByShortcut();
      if (link) {
        openLink(link);
      }
    }

    return true;
  }

  private findLinkByShortcut(): Link | null {
    if (this.myLinksLookup) {
      const arr = this.myLinksLookup.findShortcutUsage(this.buffer).links;

      if (arr.length === 0) {
        // not found
        this.buffer = '';
      } else if (arr.length === 1 && arr[0].shortcut === this.buffer) {
        this.buffer = '';
        return arr[0];
      }
    }
    return null;
  }

  private openFromMousePosition(): void {
    if (!this.myLinksLookup) {
      return;
    }
    const widgetId = this.findWidgetId(
      document.elementFromPoint(this.mouseX, this.mouseY),
      'data-list-id');
    if (widgetId) {
      const widget = this.myLinksLookup.findWidgetById(widgetId);
      if (widget) {
        openAllLinks(widget);
      }
    }
  }

  isBufferEmpty(): boolean {
    return this.buffer.length === 0;
  }
}
