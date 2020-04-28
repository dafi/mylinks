import Config from "./Config";
import { openAllLinks } from "../model/WidgetData";

export class UIInput {
  mouseX = 0
  mouseY = 0;
  config: Config;

  constructor(config: Config) {
    this.config = config;

    this.mouseX = 0;
    this.mouseY = 0;
    document.addEventListener('mousemove', (e) => this.storeMousePosition(e), false);
    document.addEventListener('mouseenter', (e) => this.storeMousePosition(e), false);

    document.addEventListener('keypress', (e) => this.keyPress(e), false);
  }  

  openFromMousePosition() {
    const el = this.findElement(document.elementFromPoint(this.mouseX, this.mouseY), 'ml-widget');
    if (el && el.dataset.listId) {
      const widget = this.config.findWidgetById(el.dataset.listId);
      console.log(widget)
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
    }
    this.openFromShortcut(e.key);

    return true;
  }

  openFromShortcut(key: string) {
    const shortcut = this.config.config.shortcuts.find((shortcut) => shortcut.key === key);
    if (!shortcut) {
      return;
    }
    const item = this.config.config.rows.flat().map(i => i.list).flat().find(item => item.id === shortcut.id);

    if (item) {
      window.open(item.url);      
    }
  }
}
