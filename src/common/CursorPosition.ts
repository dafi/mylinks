import { Point } from './DOMTypes';

export class CursorPosition {
  private static mInstance?: CursorPosition;
  private pos: Point = { x: 0, y: 0 };
  private installed = false;

  static instance(): CursorPosition {
    if (!this.mInstance) {
      this.mInstance = new this();
    }
    return this.mInstance;
  }

  private constructor() {
  }

  install(): boolean {
    if (!this.installed) {
      document.addEventListener('mousemove', (e) => this.storeMousePosition(e), false);
      document.addEventListener('mouseenter', (e) => this.storeMousePosition(e), false);
      this.installed = true;
    }
    return this.installed;
  }

  position(): Point {
    return { ...this.pos };
  }

  private storeMousePosition(e: MouseEvent): void {
    this.pos.x = e.clientX;
    this.pos.y = e.clientY;
  }
}
