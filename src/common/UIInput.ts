import { filterMyLinks, MyLinksHolder, openAllLinks, openLink } from '../model/MyLinks';
import { Link, MyLinks } from '../model/MyLinks-interface';

export class UIInput {
  private static mInstance: UIInput;
  private mouseX = 0;
  private mouseY = 0;
  private myLinksHolder?: MyLinksHolder;
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

  setup(myLinksHolder: MyLinksHolder): void {
    this.myLinksHolder = myLinksHolder;

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
    if (this.myLinksHolder) {
      this.buffer += e.key;
      const link = this.findLinkByShortcut(this.myLinksHolder.myLinks);
      if (link) {
        openLink(link);
      }
    }

    return true;
  }

  private findLinkByShortcut(myLinks: MyLinks): Link | null {
    const arr = filterMyLinks(myLinks, (w, l) =>
      l.shortcut?.startsWith(this.buffer) === true
    );

    if (arr.length === 0) {
      // not found
      this.buffer = '';
    } else if (arr.length === 1 && arr[0].shortcut === this.buffer) {
      this.buffer = '';
      return arr[0];
    }
    return null;
  }

  private openFromMousePosition(): void {
    if (!this.myLinksHolder) {
      return;
    }
    const widgetId = this.findWidgetId(
      document.elementFromPoint(this.mouseX, this.mouseY),
      'data-list-id');
    if (widgetId) {
      const widget = this.myLinksHolder.findWidgetById(widgetId);
      if (widget) {
        openAllLinks(widget);
      }
    }
  }

  isBufferEmpty(): boolean {
    return this.buffer.length === 0;
  }
}
