import { openAllLinks, MyLinksHolder, openLink, filterMyLinks, MyLinks, Link } from '../model/MyLinks';

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

  findElement(el: Element | null, className: string): Element | null {
    while (el) {
      const isWidget = Array.from(el.classList).some(i => i === className);
      if (isWidget) {
        return el;
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
    if (e.key === 'a') {
      this.buffer = '';
      this.openFromMousePosition();
    } else if (this.myLinksHolder) {
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

  private openFromMousePosition() {
    if (!this.myLinksHolder) {
      return;
    }
    const el = this.findElement(
      document.elementFromPoint(this.mouseX, this.mouseY), 'ml-widget') as HTMLElement;
    if (el && el.dataset.listId) {
      const widget = this.myLinksHolder.findWidgetById(el.dataset.listId);
      if (widget) {
        openAllLinks(widget);
      }
    }
  }
}
