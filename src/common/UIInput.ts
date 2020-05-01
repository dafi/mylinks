import { openAllLinks, MyLinksHolder } from "../model/MyLinks";

export class UIInput {
  private mouseX = 0
  private mouseY = 0;
  private static _instance: UIInput;
  private myLinksHolder?: MyLinksHolder;

  private constructor() {
    document.addEventListener('mousemove', (e) => this.storeMousePosition(e), false);
    document.addEventListener('mouseenter', (e) => this.storeMousePosition(e), false);

    document.addEventListener('keypress', (e) => this.keyPress(e), false);
  }

  static instance(): UIInput {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  setup(myLinksHolder: MyLinksHolder) {
    this.myLinksHolder = myLinksHolder;

    this.mouseX = 0;
    this.mouseY = 0;
  }  

  private openFromMousePosition() {
    if (!this.myLinksHolder) {
      return;
    }
    const el = this.findElement(document.elementFromPoint(this.mouseX, this.mouseY), 'ml-widget');
    if (el && el.dataset.listId) {
      const widget = this.myLinksHolder.findWidgetById(el.dataset.listId);
      if (widget) {
        openAllLinks(widget);
      }
    }
  }

  findElement(el: any, className: string) {
    while (el) {
      const isWidget = Array.from(el.classList).some(i => i === className);
      if (isWidget) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  storeMousePosition(e: any) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  keyPress(e: any) {
    if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
      return false;
    }
    if (e.key === 'a') {
      this.openFromMousePosition();
    } else {
      this.openFromShortcut(e.key);
    }

    return true;
  }

  private openFromShortcut(key: string) {
    const link = this.myLinksHolder?.findLinkByKey(key);

    if (link) {
      window.open(link.url);      
    }
  }
}
